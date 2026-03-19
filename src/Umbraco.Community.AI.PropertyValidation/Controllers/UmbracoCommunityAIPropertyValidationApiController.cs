using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.AI.PropertyValidation.Api.Models;
using Umbraco.Community.AI.PropertyValidation.Data;
using Umbraco.Community.AI.PropertyValidation.Models;

namespace Umbraco.Community.AI.PropertyValidation.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = Constants.ApiName)]
public class PropertyValidationRuleApiController : UmbracoCommunityAIPropertyValidationApiControllerBase
{
    private readonly IPropertyValidationRuleRepository _repository;

    public PropertyValidationRuleApiController(IPropertyValidationRuleRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("rule")]
    [ProducesResponseType<IEnumerable<PropertyValidationRuleResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var rules = await _repository.GetAllAsync();
        return Ok(rules.Select(MapToResponse));
    }

    [HttpGet("rule/{key:guid}")]
    [ProducesResponseType<PropertyValidationRuleResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByKey(Guid key)
    {
        var rule = await _repository.GetByKeyAsync(key);
        if (rule is null)
            return NotFound();

        return Ok(MapToResponse(rule));
    }

    [HttpPost("rule")]
    [ProducesResponseType<PropertyValidationRuleResponse>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreatePropertyValidationRuleRequest request)
    {
        var rule = new PropertyValidationRule
        {
            Key = Guid.NewGuid(),
            Name = request.Name,
            ContentTypeAlias = request.ContentTypeAlias,
            PropertyAlias = request.PropertyAlias,
            ProfileAlias = request.ProfileAlias,
            Prompt = request.Prompt,
            ValidateOn = (ValidateOn)request.ValidateOn,
            FailureLevel = (FailureLevel)request.FailureLevel,
            IsEnabled = request.IsEnabled,
        };

        var saved = await _repository.SaveAsync(rule);
        return CreatedAtAction(nameof(GetByKey), new { key = saved.Key }, MapToResponse(saved));
    }

    [HttpPut("rule/{key:guid}")]
    [ProducesResponseType<PropertyValidationRuleResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid key, [FromBody] UpdatePropertyValidationRuleRequest request)
    {
        var existing = await _repository.GetByKeyAsync(key);
        if (existing is null)
            return NotFound();

        existing.Name = request.Name;
        existing.ContentTypeAlias = request.ContentTypeAlias;
        existing.PropertyAlias = request.PropertyAlias;
        existing.ProfileAlias = request.ProfileAlias;
        existing.Prompt = request.Prompt;
        existing.ValidateOn = (ValidateOn)request.ValidateOn;
        existing.FailureLevel = (FailureLevel)request.FailureLevel;
        existing.IsEnabled = request.IsEnabled;

        var saved = await _repository.SaveAsync(existing);
        return Ok(MapToResponse(saved));
    }

    [HttpDelete("rule/{key:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid key)
    {
        var deleted = await _repository.DeleteAsync(key);
        return deleted ? Ok() : NotFound();
    }

    private static PropertyValidationRuleResponse MapToResponse(PropertyValidationRule rule) => new()
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
