namespace Umbraco.Community.AI.PropertyValidation.Models;

public class PropertyValidationResult
{
    public string RuleName { get; set; } = string.Empty;
    public string PropertyAlias { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public FailureLevel FailureLevel { get; set; }
}
