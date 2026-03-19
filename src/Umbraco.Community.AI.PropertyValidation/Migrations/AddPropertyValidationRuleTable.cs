using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.AI.PropertyValidation.Data;

namespace Umbraco.Community.AI.PropertyValidation.Migrations;

public class AddPropertyValidationRuleTable : MigrationBase
{
    public AddPropertyValidationRuleTable(IMigrationContext context) : base(context)
    {
    }

    protected override void Migrate()
    {
        if (!TableExists(PropertyValidationRuleSchema.TableName))
        {
            Create.Table<PropertyValidationRuleSchema>().Do();
        }

        if (!TableExists(PropertyValidationRuleVersionSchema.TableName))
        {
            Create.Table<PropertyValidationRuleVersionSchema>().Do();
        }
    }
}
