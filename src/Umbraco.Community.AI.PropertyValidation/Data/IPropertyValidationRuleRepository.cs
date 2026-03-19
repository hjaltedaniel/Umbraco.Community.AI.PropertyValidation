using Umbraco.Community.AI.PropertyValidation.Models;

namespace Umbraco.Community.AI.PropertyValidation.Data;

public interface IPropertyValidationRuleRepository
{
    Task<IEnumerable<PropertyValidationRule>> GetAllAsync();
    Task<PropertyValidationRule?> GetByKeyAsync(Guid key);
    Task<IEnumerable<PropertyValidationRule>> GetMatchingRulesAsync(string contentTypeAlias, ValidateOn trigger);
    Task<PropertyValidationRule> SaveAsync(PropertyValidationRule rule, string? changedBy = null);
    Task<bool> DeleteAsync(Guid key);
    Task<IEnumerable<PropertyValidationRuleVersion>> GetVersionsAsync(Guid ruleKey);
}
