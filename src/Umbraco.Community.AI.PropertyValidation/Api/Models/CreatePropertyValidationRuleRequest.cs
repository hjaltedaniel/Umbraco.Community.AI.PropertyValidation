using System.ComponentModel.DataAnnotations;

namespace Umbraco.Community.AI.PropertyValidation.Api.Models;

public class CreatePropertyValidationRuleRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string ContentTypeAlias { get; set; } = string.Empty;

    [Required]
    public string PropertyAlias { get; set; } = string.Empty;

    [Required]
    public string ProfileAlias { get; set; } = string.Empty;

    [Required]
    public string Prompt { get; set; } = string.Empty;

    public int ValidateOn { get; set; }
    public int FailureLevel { get; set; }
    public bool IsEnabled { get; set; } = true;
}
