using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.AI.Extensions;
using Umbraco.Community.AI.PropertyValidation.Data;
using Umbraco.Community.AI.PropertyValidation.Migrations;
using Umbraco.Community.AI.PropertyValidation.Notifications;
using Umbraco.Community.AI.PropertyValidation.Services;

namespace Umbraco.Community.AI.PropertyValidation.Composers;

public class UmbracoCommunityAIPropertyValidationApiComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        // Ensure Umbraco.AI test feature collections are initialized.
        // This works around a bug in Umbraco.AI where services depend on these
        // collections but they're only created when an addon (Prompt/Agent) calls
        // builder.AITestFeatures(). Without this, the app crashes on startup if
        // no other AI addon is installed.
        builder.AITestFeatures();
        builder.AITestGraders();

        // Database migration
        builder.AddNotificationHandler<UmbracoApplicationStartingNotification, RunPropertyValidationMigration>();

        // Services
        builder.Services.AddScoped<IPropertyValidationRuleRepository, PropertyValidationRuleRepository>();
        builder.Services.AddScoped<IPropertyValidationService, PropertyValidationService>();

        // Notification handlers for content validation
        builder.AddNotificationAsyncHandler<ContentSavingNotification, ContentSavingValidationHandler>();
        builder.AddNotificationAsyncHandler<ContentPublishingNotification, ContentPublishingValidationHandler>();

        // Swagger / OpenAPI configuration
        builder.Services.AddSingleton<IOperationIdHandler, CustomOperationHandler>();

        builder.Services.Configure<SwaggerGenOptions>(opt =>
        {
            opt.SwaggerDoc(Constants.ApiName, new OpenApiInfo
            {
                Title = "AI Property Validation Backoffice API",
                Version = "1.0",
            });

            opt.OperationFilter<PropertyValidationOperationSecurityFilter>();
        });
    }

    public class PropertyValidationOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
    {
        protected override string ApiName => Constants.ApiName;
    }

    public class CustomOperationHandler : OperationIdHandler
    {
        public CustomOperationHandler(IOptions<ApiVersioningOptions> apiVersioningOptions)
            : base(apiVersioningOptions)
        {
        }

        protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
        {
            return controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith(
                "Umbraco.Community.AI.PropertyValidation.Controllers",
                StringComparison.InvariantCultureIgnoreCase) is true;
        }

        public override string Handle(ApiDescription apiDescription)
            => $"{apiDescription.ActionDescriptor.RouteValues["action"]}";
    }
}
