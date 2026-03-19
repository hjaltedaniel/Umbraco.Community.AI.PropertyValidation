using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.AI.PropertyValidation.Data;

[TableName(TableName)]
[PrimaryKey("Id", AutoIncrement = true)]
[ExplicitColumns]
public class PropertyValidationRuleVersionSchema
{
    public const string TableName = "umbracoAIPropertyValidationRuleVersion";

    [Column("Id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("RuleKey")]
    public Guid RuleKey { get; set; }

    [Column("Version")]
    public int Version { get; set; }

    [Column("Name")]
    public string Name { get; set; } = string.Empty;

    [Column("Alias")]
    public string Alias { get; set; } = string.Empty;

    [Column("ContentTypeAlias")]
    public string ContentTypeAlias { get; set; } = string.Empty;

    [Column("PropertyAlias")]
    public string PropertyAlias { get; set; } = string.Empty;

    [Column("ProfileAlias")]
    public string ProfileAlias { get; set; } = string.Empty;

    [Column("Instructions")]
    [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
    public string Instructions { get; set; } = string.Empty;

    [Column("Guardrails")]
    [NullSetting(NullSetting = NullSettings.Null)]
    [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
    public string? Guardrails { get; set; }

    [Column("ValidateOn")]
    public int ValidateOn { get; set; }

    [Column("FailureLevel")]
    public int FailureLevel { get; set; }

    [Column("IsEnabled")]
    public bool IsEnabled { get; set; }

    [Column("ChangedBy")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? ChangedBy { get; set; }

    [Column("ChangeDescription")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? ChangeDescription { get; set; }

    [Column("ChangeDate")]
    public DateTime ChangeDate { get; set; }
}
