using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.AI.PropertyValidation.Data;

namespace Umbraco.Community.AI.PropertyValidation.Migrations;

public class AddVersioningAndGuardrails : MigrationBase
{
    public AddVersioningAndGuardrails(IMigrationContext context) : base(context)
    {
    }

    protected override void Migrate()
    {
        // Add new columns to existing table using raw SQL (compatible with SQLite)
        if (TableExists(PropertyValidationRuleSchema.TableName))
        {
            if (!ColumnExists(PropertyValidationRuleSchema.TableName, "Alias"))
                Database.Execute($"ALTER TABLE {PropertyValidationRuleSchema.TableName} ADD COLUMN [Alias] NVARCHAR(255) NOT NULL DEFAULT ''");

            if (!ColumnExists(PropertyValidationRuleSchema.TableName, "Guardrails"))
                Database.Execute($"ALTER TABLE {PropertyValidationRuleSchema.TableName} ADD COLUMN [Guardrails] NTEXT NULL");

            if (!ColumnExists(PropertyValidationRuleSchema.TableName, "Version"))
                Database.Execute($"ALTER TABLE {PropertyValidationRuleSchema.TableName} ADD COLUMN [Version] INTEGER NOT NULL DEFAULT 1");

            // Rename Prompt to Instructions (SQLite supports RENAME COLUMN since 3.25.0)
            if (ColumnExists(PropertyValidationRuleSchema.TableName, "Prompt") &&
                !ColumnExists(PropertyValidationRuleSchema.TableName, "Instructions"))
            {
                Database.Execute($"ALTER TABLE {PropertyValidationRuleSchema.TableName} RENAME COLUMN [Prompt] TO [Instructions]");
            }
        }

        // Create version history table
        if (!TableExists(PropertyValidationRuleVersionSchema.TableName))
        {
            Create.Table<PropertyValidationRuleVersionSchema>().Do();
        }
    }
}
