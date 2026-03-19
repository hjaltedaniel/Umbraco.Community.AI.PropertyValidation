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
        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName}");
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

    public async Task<PropertyValidationRule> SaveAsync(PropertyValidationRule rule)
    {
        using var scope = _scopeProvider.CreateScope();
        var now = DateTime.UtcNow;

        var sql = new Sql($"SELECT * FROM {PropertyValidationRuleSchema.TableName} WHERE [Key] = @0", rule.Key);
        var existing = await scope.Database.FirstOrDefaultAsync<PropertyValidationRuleSchema>(sql);

        if (existing is null)
        {
            if (rule.Key == Guid.Empty)
                rule.Key = Guid.NewGuid();

            var schema = MapToSchema(rule);
            schema.CreateDate = now;
            schema.UpdateDate = now;
            await scope.Database.InsertAsync(schema);
            rule.CreateDate = schema.CreateDate;
            rule.UpdateDate = schema.UpdateDate;
        }
        else
        {
            existing.Name = rule.Name;
            existing.ContentTypeAlias = rule.ContentTypeAlias;
            existing.PropertyAlias = rule.PropertyAlias;
            existing.ProfileAlias = rule.ProfileAlias;
            existing.Prompt = rule.Prompt;
            existing.ValidateOn = (int)rule.ValidateOn;
            existing.FailureLevel = (int)rule.FailureLevel;
            existing.IsEnabled = rule.IsEnabled;
            existing.UpdateDate = now;
            await scope.Database.UpdateAsync(existing);
            rule.CreateDate = existing.CreateDate;
            rule.UpdateDate = existing.UpdateDate;
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

        await scope.Database.DeleteAsync(existing);
        scope.Complete();
        return true;
    }

    private static PropertyValidationRule MapToModel(PropertyValidationRuleSchema schema) => new()
    {
        Key = schema.Key,
        Name = schema.Name,
        ContentTypeAlias = schema.ContentTypeAlias,
        PropertyAlias = schema.PropertyAlias,
        ProfileAlias = schema.ProfileAlias,
        Prompt = schema.Prompt,
        ValidateOn = (ValidateOn)schema.ValidateOn,
        FailureLevel = (FailureLevel)schema.FailureLevel,
        IsEnabled = schema.IsEnabled,
        CreateDate = schema.CreateDate,
        UpdateDate = schema.UpdateDate,
    };

    private static PropertyValidationRuleSchema MapToSchema(PropertyValidationRule rule) => new()
    {
        Key = rule.Key,
        Name = rule.Name,
        ContentTypeAlias = rule.ContentTypeAlias,
        PropertyAlias = rule.PropertyAlias,
        ProfileAlias = rule.ProfileAlias,
        Prompt = rule.Prompt,
        ValidateOn = (int)rule.ValidateOn,
        FailureLevel = (int)rule.FailureLevel,
        IsEnabled = rule.IsEnabled,
        CreateDate = rule.CreateDate,
        UpdateDate = rule.UpdateDate,
    };
}
