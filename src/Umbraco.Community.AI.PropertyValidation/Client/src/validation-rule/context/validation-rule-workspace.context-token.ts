import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

/**
 * Context token for the validation rule workspace.
 * The context value is the workspace editor element itself.
 */
export const VALIDATION_RULE_CONTEXT = new UmbContextToken<any>(
  "ValidationRuleWorkspaceContext"
);
