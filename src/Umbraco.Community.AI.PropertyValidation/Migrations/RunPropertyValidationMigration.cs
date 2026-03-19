using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;

namespace Umbraco.Community.AI.PropertyValidation.Migrations;

public class RunPropertyValidationMigration : INotificationHandler<UmbracoApplicationStartingNotification>
{
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public RunPropertyValidationMigration(
        IMigrationPlanExecutor migrationPlanExecutor,
        ICoreScopeProvider coreScopeProvider,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState)
    {
        _migrationPlanExecutor = migrationPlanExecutor;
        _coreScopeProvider = coreScopeProvider;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
    }

    public void Handle(UmbracoApplicationStartingNotification notification)
    {
        if (_runtimeState.Level < RuntimeLevel.Run)
            return;

        var plan = new MigrationPlan("Umbraco.Community.AI.PropertyValidation");
        plan.From(string.Empty)
            .To<AddPropertyValidationRuleTable>("propertyvalidation-001");

        var upgrader = new Upgrader(plan);
        upgrader.Execute(_migrationPlanExecutor, _coreScopeProvider, _keyValueService);
    }
}
