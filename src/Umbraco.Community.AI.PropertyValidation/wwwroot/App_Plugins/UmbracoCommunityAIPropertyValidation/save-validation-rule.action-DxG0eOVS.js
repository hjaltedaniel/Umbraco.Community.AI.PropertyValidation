import { UmbWorkspaceActionBase as t } from "@umbraco-cms/backoffice/workspace";
import { V as a } from "./validation-rule-workspace.context-token-CFAZYswS.js";
class c extends t {
  async execute() {
    await (await this.getContext(a)).submit();
  }
}
export {
  c as SaveValidationRuleAction,
  c as api
};
//# sourceMappingURL=save-validation-rule.action-DxG0eOVS.js.map
