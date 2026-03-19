using System.Text.Json;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using Umbraco.AI.Core.Chat;
using Umbraco.AI.Core.Models;
using Umbraco.AI.Core.Profiles;
using Umbraco.Cms.Core.Models;
using Umbraco.Community.AI.PropertyValidation.Data;
using Umbraco.Community.AI.PropertyValidation.Models;

namespace Umbraco.Community.AI.PropertyValidation.Services;

public class PropertyValidationService : IPropertyValidationService
{
    private readonly IAIChatService _chatService;
    private readonly IAIProfileService _profileService;
    private readonly IPropertyValidationRuleRepository _repository;
    private readonly ILogger<PropertyValidationService> _logger;

    private const string SystemPrompt =
        """
        You are a content validation assistant for a CMS. You will receive a validation rule and a property value.
        Evaluate the value against the rule.
        Respond ONLY with valid JSON in this exact format:
        {"valid": true} if the value passes validation.
        {"valid": false, "reason": "A concise explanation of why it failed and how to fix it"} if it fails.
        Do not include any text outside the JSON object.
        """;

    public PropertyValidationService(
        IAIChatService chatService,
        IAIProfileService profileService,
        IPropertyValidationRuleRepository repository,
        ILogger<PropertyValidationService> logger)
    {
        _chatService = chatService;
        _profileService = profileService;
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<PropertyValidationResult>> ValidateAsync(
        IContent content, ValidateOn trigger, CancellationToken cancellationToken)
    {
        var contentTypeAlias = content.ContentType.Alias;
        var rules = await _repository.GetMatchingRulesAsync(contentTypeAlias, trigger);
        var ruleList = rules.ToList();

        if (ruleList.Count == 0)
            return [];

        var tasks = ruleList.Select(rule => ValidateRuleAsync(content, rule, cancellationToken));
        var results = await Task.WhenAll(tasks);
        return results.Where(r => r is not null).Cast<PropertyValidationResult>();
    }

    private async Task<PropertyValidationResult?> ValidateRuleAsync(
        IContent content, PropertyValidationRule rule, CancellationToken cancellationToken)
    {
        try
        {
            var propertyValue = content.GetValue<string>(rule.PropertyAlias);
            if (string.IsNullOrWhiteSpace(propertyValue))
                return null;

            var profile = await _profileService.GetProfileByAliasAsync(rule.ProfileAlias, cancellationToken);
            if (profile is null)
            {
                _logger.LogWarning("AI profile '{ProfileAlias}' not found for validation rule '{RuleName}'", rule.ProfileAlias, rule.Name);
                return null;
            }

            var userPrompt = $"""
                Validation rule: {rule.Prompt}

                Property value to validate:
                ---
                {propertyValue}
                ---
                """;

            var messages = new List<ChatMessage>
            {
                new(ChatRole.System, SystemPrompt),
                new(ChatRole.User, userPrompt),
            };

            using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            timeoutCts.CancelAfter(TimeSpan.FromSeconds(15));

            #pragma warning disable CS0618 // Using profile-based overload for compatibility with Umbraco.AI 1.x
            var response = await _chatService.GetChatResponseAsync(
                profile.Id,
                messages,
                cancellationToken: timeoutCts.Token);
            #pragma warning restore CS0618

            var resultText = response.Messages.LastOrDefault()?.Text ?? string.Empty;
            return ParseAiResponse(resultText, rule);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogWarning("AI validation timed out for rule '{RuleName}' on property '{PropertyAlias}'", rule.Name, rule.PropertyAlias);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "AI validation failed for rule '{RuleName}' on property '{PropertyAlias}'", rule.Name, rule.PropertyAlias);
            return null;
        }
    }

    private PropertyValidationResult? ParseAiResponse(string responseText, PropertyValidationRule rule)
    {
        try
        {
            var json = JsonDocument.Parse(responseText.Trim());
            var root = json.RootElement;

            var isValid = root.GetProperty("valid").GetBoolean();
            if (isValid)
                return null;

            var reason = root.TryGetProperty("reason", out var reasonElement)
                ? reasonElement.GetString() ?? "Validation failed"
                : "Validation failed";

            return new PropertyValidationResult
            {
                RuleName = rule.Name,
                PropertyAlias = rule.PropertyAlias,
                IsValid = false,
                Message = reason,
                FailureLevel = rule.FailureLevel,
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI validation response for rule '{RuleName}': {Response}", rule.Name, responseText);
            return null;
        }
    }
}
