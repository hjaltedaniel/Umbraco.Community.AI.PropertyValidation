using System.ComponentModel.DataAnnotations;

namespace Umbraco.Community.AI.PropertyValidation.Api.Models;

public class UpdatePropertyValidationRuleRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string Alias { get; set; } = string.Empty;

    public string ContentTypeAlias { get; set; } = string.Empty;

    public string PropertyAlias { get; set; } = string.Empty;

    public string ProfileAlias { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public string? Guardrails { get; set; }

    public int ValidateOn { get; set; }
    public int FailureLevel { get; set; }
    public bool IsEnabled { get; set; } = true;
}
