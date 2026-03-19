import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { ENTITY_TYPE } from "../../constants.js";

export class CreateValidationRuleAction extends UmbEntityActionBase<never> {
  override async execute() {
    const path = `section/ai/workspace/${ENTITY_TYPE}/create`;
    history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}

export { CreateValidationRuleAction as api };
