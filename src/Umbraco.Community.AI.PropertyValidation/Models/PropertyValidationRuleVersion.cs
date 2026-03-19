namespace Umbraco.Community.AI.PropertyValidation.Models;

/// <summary>
/// Represents a historical version of a validation rule for audit/info tracking.
/// </summary>
public class PropertyValidationRuleVersion
{
    public int Id { get; set; }
    public Guid RuleKey { get; set; }
    public int Version { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Alias { get; set; } = string.Empty;
    public string ContentTypeAlias { get; set; } = string.Empty;
    public string PropertyAlias { get; set; } = string.Empty;
    public string ProfileAlias { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string? Guardrails { get; set; }
    public ValidateOn ValidateOn { get; set; }
    public FailureLevel FailureLevel { get; set; }
    public bool IsEnabled { get; set; }
    public string? ChangedBy { get; set; }
    public string? ChangeDescription { get; set; }
    public DateTime ChangeDate { get; set; }
}
