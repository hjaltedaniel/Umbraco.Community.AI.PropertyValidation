import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import { VALIDATION_RULE_CONTEXT } from "../context/validation-rule-workspace.context-token.js";

export class SaveValidationRuleAction extends UmbWorkspaceActionBase {
  override async execute() {
    // The context IS the workspace editor element, which has a submit() method
    const context: any = await this.getContext(VALIDATION_RULE_CONTEXT);
    await context.submit();
  }
}

export { SaveValidationRuleAction as api };
