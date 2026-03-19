import { UmbEntityActionBase as e } from "@umbraco-cms/backoffice/entity-action";
import { E as a } from "./bundle.manifests-lIuvScO3.js";
class n extends e {
  async execute() {
    const t = `section/ai/workspace/${a}/create`;
    history.pushState(null, "", t), window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
export {
  n as CreateValidationRuleAction,
  n as api
};
//# sourceMappingURL=create-validation-rule.action-Dwwd3e7q.js.map
