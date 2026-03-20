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
    /// Returns all document type aliases, excluding element types and
    /// pure composition types (types that are only used as compositions
    /// and never as standalone content types).
    /// </summary>
    [HttpGet("utils/document-types")]
    [ProducesResponseType<IEnumerable<string>>(StatusCodes.Status200OK)]
    public IActionResult GetDocumentTypes([FromQuery] string? query = null)
    {
        var allContentTypes = _contentTypeService.GetAll().ToList();

        // Collect all aliases that are used as compositions by other types
        var compositionAliases = allContentTypes
            .SelectMany(ct => ct.ContentTypeComposition)
            .Select(c => c.Alias)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var filteredTypes = allContentTypes
            .Where(ct => !ct.IsElement) // Exclude element types
            .Where(ct =>
            {
                // Include if it's allowed at root or allowed as a child somewhere
                // (i.e. it's a real document type, not just a composition)
                if (ct.AllowedAsRoot)
                    return true;

                // If any other type allows this as a child, it's a real doc type
                if (allContentTypes.Any(other =>
                    other.AllowedContentTypes?.Any(act =>
                        act.Alias?.Equals(ct.Alias, StringComparison.OrdinalIgnoreCase) == true) == true))
                    return true;

                // If it's not used as a composition by anything, it's likely a standalone type
                if (!compositionAliases.Contains(ct.Alias))
                    return true;

                return false;
            })
            .Select(ct => ct.Alias)
            .OrderBy(a => a);

        IEnumerable<string> result = filteredTypes;

        if (!string.IsNullOrWhiteSpace(query))
        {
            result = result.Where(a => a.Contains(query, StringComparison.OrdinalIgnoreCase));
        }

        return Ok(result);
    }

    /// <summary>
    /// Returns property aliases for a given document type (including properties
    /// inherited from compositions), or all property aliases if no type specified.
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

            // Use CompositionPropertyTypes to include properties from compositions
            aliases = contentType.CompositionPropertyTypes.Select(pt => pt.Alias);
        }
        else
        {
            // Return all property aliases across all document types (including composed)
            aliases = _contentTypeService.GetAll()
                .SelectMany(ct => ct.CompositionPropertyTypes)
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
