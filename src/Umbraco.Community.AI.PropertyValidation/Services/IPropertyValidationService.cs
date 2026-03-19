using Umbraco.Cms.Core.Models;
using Umbraco.Community.AI.PropertyValidation.Models;

namespace Umbraco.Community.AI.PropertyValidation.Services;

public interface IPropertyValidationService
{
    Task<IEnumerable<PropertyValidationResult>> ValidateAsync(
        IContent content, ValidateOn trigger, CancellationToken cancellationToken);
}
