using Microsoft.Extensions.Logging;
using NPoco;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.AI.PropertyValidation.Models;

namespace Umbraco.Community.AI.PropertyValidation.Data;

public class PropertyValidationRuleRepository : IPropertyValidationRuleRepository
{
    private readonly IScopeProvider _scopeProvider;
    private readonly ILogger<PropertyValidationRuleRepository> _logger;

    public PropertyValidationRuleRepository(IScopeProvider scopeProvider, ILogger<PropertyValidationRuleRepository> logger)
    {
        _scopeProvider = scopeProvider;
        _logger = logger;
    }

    public async Task<IEnumerable<PropertyValidationRule>> GetAllAsync()
    {
        using var scope = _scopeProvider.CreateScope();
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} ORDER BY Name");
        var rows = await scope.Database.FetchAsync<PropertyValidationRuleSchema>(sql);
        scope.Complete();
        return rows.Select(MapToModel);
    }

    public async Task<PropertyValidationRule?> GetByKeyAsync(Guid key)
    {
        using var scope = _scopeProvider.CreateScope();
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} WHERE [Key] = @0", key);
        var row = await scope.Database.FirstOrDefaultAsync<PropertyValidationRuleSchema>(sql);
        scope.Complete();
        return row is null ? null : MapToModel(row);
    }

    public async Task<IEnumerable<PropertyValidationRule>> GetMatchingRulesAsync(string contentTypeAlias, ValidateOn trigger)
    {
        using var scope = _scopeProvider.CreateScope();
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} WHERE IsEnabled = 1 AND (ContentTypeAlias = @0 OR ContentTypeAlias = '*')", contentTypeAlias);
        var rows = await scope.Database.FetchAsync<PropertyValidationRuleSchema>(sql);
        scope.Complete();

        return rows
            .Where(r =>
            {
                var validateOn = (ValidateOn)r.ValidateOn;
                return validateOn == ValidateOn.Both || validateOn == trigger;
            })
            .Select(MapToModel);
    }

    public async Task<PropertyValidationRule> SaveAsync(PropertyValidationRule rule, string? changedBy = null)
    {
        using var scope = _scopeProvider.CreateScope();
        var now = DateTime.UtcNow;

        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} WHERE [Key] = @0", rule.Key);
        var existing = await scope.Database.FirstOrDefaultAsync<PropertyValidationRuleSchema>(sql);

        if (existing is null)
        {
            // New rule
            if (rule.Key == Guid.Empty)
                rule.Key = Guid.NewGuid();

            rule.Version = 1;
            var schema = MapToSchema(rule);
            schema.CreateDate = now;
            schema.UpdateDate = now;
            await scope.Database.InsertAsync(schema);
            rule.CreateDate = schema.CreateDate;
            rule.UpdateDate = schema.UpdateDate;

            // Create initial version record
            await CreateVersionRecordAsync(scope, rule, changedBy, "Created");
        }
        else
        {
            // Update existing - increment version
            rule.Version = existing.Version + 1;

            existing.Name = rule.Name;
            existing.Alias = rule.Alias;
            existing.ContentTypeAlias = rule.ContentTypeAlias;
            existing.PropertyAlias = rule.PropertyAlias;
            existing.ProfileAlias = rule.ProfileAlias;
            existing.Instructions = rule.Instructions;
            existing.Guardrails = rule.Guardrails;
            existing.ValidateOn = (int)rule.ValidateOn;
            existing.FailureLevel = (int)rule.FailureLevel;
            existing.IsEnabled = rule.IsEnabled;
            existing.Version = rule.Version;
            existing.UpdateDate = now;
            await scope.Database.UpdateAsync(existing);
            rule.CreateDate = existing.CreateDate;
            rule.UpdateDate = existing.UpdateDate;

            // Create version record
            await CreateVersionRecordAsync(scope, rule, changedBy, "Updated");
        }

        scope.Complete();
        return rule;
    }

    public async Task<bool> DeleteAsync(Guid key)
    {
        using var scope = _scopeProvider.CreateScope();
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} WHERE [Key] = @0", key);
        var existing = await scope.Database.FirstOrDefaultAsync<PropertyValidationRuleSchema>(sql);

        if (existing is null)
        {
            scope.Complete();
            return false;
        }

        // Delete version history
        var deleteVersionsSql = new Sql($"DELETE FROM {PropertyValidationRuleVersionSchema.TableName} WHERE RuleKey = @0", key);
        await scope.Database.ExecuteAsync(deleteVersionsSql);

        await scope.Database.DeleteAsync(existing);
        scope.Complete();
        return true;
    }

    public async Task<IEnumerable<PropertyValidationRuleVersion>> GetVersionsAsync(Guid ruleKey)
    {
        using var scope = _scopeProvider.CreateScope();
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleVersionSchema.TableName} WHERE RuleKey = @0 ORDER BY Version DESC", ruleKey);
        var rows = await scope.Database.FetchAsync<PropertyValidationRuleVersionSchema>(sql);
        scope.Complete();
        return rows.Select(MapVersionToModel);
    }

    private async Task CreateVersionRecordAsync(IScope scope, PropertyValidationRule rule, string? changedBy, string changeDescription)
    {
        var versionSchema = new PropertyValidationRuleVersionSchema
        {
            RuleKey = rule.Key,
            Version = rule.Version,
            Name = rule.Name,
            Alias = rule.Alias,
            ContentTypeAlias = rule.ContentTypeAlias,
            PropertyAlias = rule.PropertyAlias,
            ProfileAlias = rule.ProfileAlias,
            Instructions = rule.Instructions,
            Guardrails = rule.Guardrails,
            ValidateOn = (int)rule.ValidateOn,
            FailureLevel = (int)rule.FailureLevel,
            IsEnabled = rule.IsEnabled,
            ChangedBy = changedBy,
            ChangeDescription = changeDescription,
            ChangeDate = DateTime.UtcNow,
        };
        await scope.Database.InsertAsync(versionSchema);
    }

    private static PropertyValidationRule MapToModel(PropertyValidationRuleSchema schema) => new()
    {
        Key = schema.Key,
        Name = schema.Name,
        Alias = schema.Alias,
        ContentTypeAlias = schema.ContentTypeAlias,
        PropertyAlias = schema.PropertyAlias,
        ProfileAlias = schema.ProfileAlias,
        Instructions = schema.Instructions,
        Guardrails = schema.Guardrails,
        ValidateOn = (ValidateOn)schema.ValidateOn,
        FailureLevel = (FailureLevel)schema.FailureLevel,
        IsEnabled = schema.IsEnabled,
        Version = schema.Version,
        CreateDate = schema.CreateDate,
        UpdateDate = schema.UpdateDate,
    };

    private static PropertyValidationRuleSchema MapToSchema(PropertyValidationRule rule) => new()
    {
        Key = rule.Key,
        Name = rule.Name,
        Alias = rule.Alias,
        ContentTypeAlias = rule.ContentTypeAlias,
        PropertyAlias = rule.PropertyAlias,
        ProfileAlias = rule.ProfileAlias,
        Instructions = rule.Instructions,
        Guardrails = rule.Guardrails,
        ValidateOn = (int)rule.ValidateOn,
        FailureLevel = (int)rule.FailureLevel,
        IsEnabled = rule.IsEnabled,
        Version = rule.Version,
        CreateDate = rule.CreateDate,
        UpdateDate = rule.UpdateDate,
    };

    private static PropertyValidationRuleVersion MapVersionToModel(PropertyValidationRuleVersionSchema schema) => new()
    {
        Id = schema.Id,
        RuleKey = schema.RuleKey,
        Version = schema.Version,
        Name = schema.Name,
        Alias = schema.Alias,
        ContentTypeAlias = schema.ContentTypeAlias,
        PropertyAlias = schema.PropertyAlias,
        ProfileAlias = schema.ProfileAlias,
        Instructions = schema.Instructions,
        Guardrails = schema.Guardrails,
        ValidateOn = (ValidateOn)schema.ValidateOn,
        FailureLevel = (FailureLevel)schema.FailureLevel,
        IsEnabled = schema.IsEnabled,
        ChangedBy = schema.ChangedBy,
        ChangeDescription = schema.ChangeDescription,
        ChangeDate = schema.ChangeDate,
    };
}
