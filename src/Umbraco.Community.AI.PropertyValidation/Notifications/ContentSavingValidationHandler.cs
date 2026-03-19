using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.AI.PropertyValidation.Models;
using Umbraco.Community.AI.PropertyValidation.Services;

namespace Umbraco.Community.AI.PropertyValidation.Notifications;

public class ContentSavingValidationHandler : INotificationAsyncHandler<ContentSavingNotification>
{
    private readonly IPropertyValidationService _validationService;
    private readonly ILogger<ContentSavingValidationHandler> _logger;

    public ContentSavingValidationHandler(
        IPropertyValidationService validationService,
        ILogger<ContentSavingValidationHandler> logger)
    {
        _validationService = validationService;
        _logger = logger;
    }

    public async Task HandleAsync(ContentSavingNotification notification, CancellationToken cancellationToken)
    {
        foreach (var entity in notification.SavedEntities)
        {
            try
            {
                var results = await _validationService.ValidateAsync(entity, ValidateOn.Save, cancellationToken);

                foreach (var result in results)
                {
                    if (result.FailureLevel == FailureLevel.Error)
                    {
                        notification.CancelOperation(
                            new EventMessage("AI Validation",
                                $"'{result.PropertyAlias}': {result.Message}",
                                EventMessageType.Error));
                        return;
                    }

                    notification.Messages.Add(
                        new EventMessage("AI Validation",
                            $"'{result.PropertyAlias}': {result.Message}",
                            EventMessageType.Warning));
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "AI validation could not be completed for content '{ContentName}'", entity.Name);
                notification.Messages.Add(
                    new EventMessage("AI Validation",
                        "AI validation could not be completed. Content was saved without validation.",
                        EventMessageType.Warning));
            }
        }
    }
}
