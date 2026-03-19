using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.AI.PropertyValidation.Data;

[TableName(TableName)]
[PrimaryKey("Id", AutoIncrement = true)]
[ExplicitColumns]
public class PropertyValidationRuleSchema
{
    public const string TableName = "umbracoAIPropertyValidationRule";

    [Column("Id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("Key")]
    public Guid Key { get; set; }

    [Column("Name")]
    public string Name { get; set; } = string.Empty;

    [Column("ContentTypeAlias")]
    public string ContentTypeAlias { get; set; } = string.Empty;

    [Column("PropertyAlias")]
    public string PropertyAlias { get; set; } = string.Empty;

    [Column("ProfileAlias")]
    public string ProfileAlias { get; set; } = string.Empty;

    [Column("Prompt")]
    [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
    public string Prompt { get; set; } = string.Empty;

    [Column("ValidateOn")]
    public int ValidateOn { get; set; }

    [Column("FailureLevel")]
    public int FailureLevel { get; set; }

    [Column("IsEnabled")]
    public bool IsEnabled { get; set; } = true;

    [Column("CreateDate")]
    public DateTime CreateDate { get; set; }

    [Column("UpdateDate")]
    public DateTime UpdateDate { get; set; }
}
