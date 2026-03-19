import {
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { validationRuleApi, type ValidationRuleModel } from "../api.js";
import { ENTITY_TYPE, ROOT_ENTITY_TYPE, ICON } from "../constants.js";

@customElement("ucai-validation-rule-menu-item")
export class ValidationRuleMenuItemElement extends UmbLitElement {
  @state()
  private _rules: ValidationRuleModel[] = [];

  @state()
  private _loading = true;

  override connectedCallback() {
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

  #getRootPath(): string {
    return `section/ai/workspace/${ROOT_ENTITY_TYPE}`;
  }

  #getEditPath(key: string): string {
    return `section/ai/workspace/${ENTITY_TYPE}/edit/${key}`;
  }

  override render() {
    return html`
      <uui-menu-item
        label="Property Validation"
        href=${this.#getRootPath()}
        ?has-children=${this._rules.length > 0}
      >
        <uui-icon slot="icon" name=${ICON}></uui-icon>
        ${this._loading
          ? html`<uui-loader slot="actions"></uui-loader>`
          : this._rules.map(
              (rule) => html`
                <uui-menu-item
                  label=${rule.name}
                  href=${this.#getEditPath(rule.key)}
                >
                  <uui-icon slot="icon" name=${ICON}></uui-icon>
                </uui-menu-item>
              `
            )}
      </uui-menu-item>
    `;
  }
}

export default ValidationRuleMenuItemElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-menu-item": ValidationRuleMenuItemElement;
  }
}
