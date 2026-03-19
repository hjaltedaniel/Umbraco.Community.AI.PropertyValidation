namespace Umbraco.Community.AI.PropertyValidation.Models;

public class PropertyValidationRule
{
    public Guid Key { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentTypeAlias { get; set; } = string.Empty;
    public string PropertyAlias { get; set; } = string.Empty;
    public string ProfileAlias { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public ValidateOn ValidateOn { get; set; }
    public FailureLevel FailureLevel { get; set; }
    public bool IsEnabled { get; set; } = true;
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}
