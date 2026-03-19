namespace Umbraco.Community.AI.PropertyValidation.Models;

public class PropertyValidationRule
{
    public Guid Key { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Alias { get; set; } = string.Empty;
    public string ContentTypeAlias { get; set; } = string.Empty;
    public string PropertyAlias { get; set; } = string.Empty;
    public string ProfileAlias { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string? Guardrails { get; set; }
    public ValidateOn ValidateOn { get; set; }
    public FailureLevel FailureLevel { get; set; }
    public bool IsEnabled { get; set; } = true;
    public int Version { get; set; } = 1;
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}
