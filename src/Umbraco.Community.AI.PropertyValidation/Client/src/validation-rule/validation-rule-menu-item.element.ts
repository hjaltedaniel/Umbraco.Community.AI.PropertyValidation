import {
  LitElement,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { validationRuleApi, type ValidationRuleModel } from "../api.js";
import { ENTITY_TYPE, ROOT_ENTITY_TYPE } from "../constants.js";

@customElement("ai-property-validation-menu-item")
export class AiPropertyValidationMenuItemElement extends UmbElementMixin(
  LitElement
) {
  @state()
  private _rules: ValidationRuleModel[] = [];

  @state()
  private _loading = true;

  connectedCallback() {
    super.connectedCallback();
    this.#loadRules();
  }

  async #loadRules() {
    try {
      this._rules = await validationRuleApi.getAll();
    } catch (e) {
      console.error("Failed to load validation rules", e);
      this._rules = [];
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <uui-menu-item
        label="Property Validation"
        href=${`section/ai/workspace/${ROOT_ENTITY_TYPE}`}
        ?has-children=${this._rules.length > 0}
      >
        <uui-icon slot="icon" name="icon-check"></uui-icon>
        ${this._loading
          ? html`<uui-loader slot="actions"></uui-loader>`
          : this._rules.map(
              (rule) => html`
                <uui-menu-item
                  label=${rule.name}
                  href=${`section/ai/workspace/${ENTITY_TYPE}/edit/${rule.key}`}
                >
                  <uui-icon slot="icon" name="icon-check"></uui-icon>
                </uui-menu-item>
              `
            )}
      </uui-menu-item>
    `;
  }
}

export default AiPropertyValidationMenuItemElement;

declare global {
  interface HTMLElementTagNameMap {
    "ai-property-validation-menu-item": AiPropertyValidationMenuItemElement;
  }
}
