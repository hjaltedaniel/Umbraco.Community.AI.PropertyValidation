using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.AI.PropertyValidation.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = Constants.ApiName)]
public class PropertyValidationUtilsApiController : UmbracoCommunityAIPropertyValidationApiControllerBase
{
    private readonly IContentTypeService _contentTypeService;

    public PropertyValidationUtilsApiController(IContentTypeService contentTypeService)
    {
        _contentTypeService = contentTypeService;
    }

    /// <summary>
    /// Returns all document type aliases (excludes element types and compositions).
    /// </summary>
    [HttpGet("utils/document-types")]
    [ProducesResponseType<IEnumerable<string>>(StatusCodes.Status200OK)]
    public IActionResult GetDocumentTypes([FromQuery] string? query = null)
    {
        var allTypes = _contentTypeService.GetAll()
            .Where(ct => !ct.IsElement) // Exclude element types
            .Select(ct => ct.Alias)
            .OrderBy(a => a);

        if (!string.IsNullOrWhiteSpace(query))
        {
            allTypes = allTypes.Where(a => a.Contains(query, StringComparison.OrdinalIgnoreCase)).OrderBy(a => a);
        }

        return Ok(allTypes);
    }

    /// <summary>
    /// Returns property aliases for a given document type, or all property aliases if no type specified.
    /// </summary>
    [HttpGet("utils/property-aliases")]
    [ProducesResponseType<IEnumerable<string>>(StatusCodes.Status200OK)]
    public IActionResult GetPropertyAliases([FromQuery] string? contentTypeAlias = null, [FromQuery] string? query = null)
    {
        IEnumerable<string> aliases;

        if (!string.IsNullOrWhiteSpace(contentTypeAlias) && contentTypeAlias != "*")
        {
            var contentType = _contentTypeService.Get(contentTypeAlias);
            if (contentType is null)
                return Ok(Array.Empty<string>());

            aliases = contentType.PropertyTypes.Select(pt => pt.Alias);
        }
        else
        {
            // Return all property aliases across all document types
            aliases = _contentTypeService.GetAll()
                .SelectMany(ct => ct.PropertyTypes)
                .Select(pt => pt.Alias)
                .Distinct();
        }

        if (!string.IsNullOrWhiteSpace(query))
        {
            aliases = aliases.Where(a => a.Contains(query, StringComparison.OrdinalIgnoreCase));
        }

        return Ok(aliases.OrderBy(a => a));
    }
}
