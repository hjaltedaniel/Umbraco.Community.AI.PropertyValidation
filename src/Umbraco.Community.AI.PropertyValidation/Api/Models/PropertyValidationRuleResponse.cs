namespace Umbraco.Community.AI.PropertyValidation.Api.Models;

public class PropertyValidationRuleResponse
{
    public Guid Key { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentTypeAlias { get; set; } = string.Empty;
    public string PropertyAlias { get; set; } = string.Empty;
    public string ProfileAlias { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public int ValidateOn { get; set; }
    public int FailureLevel { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}
