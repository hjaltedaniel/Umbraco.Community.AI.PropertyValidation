import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { validationRuleApi, type ValidationRuleModel } from "../api.js";
import { ENTITY_TYPE } from "../constants.js";

@customElement("ai-property-validation-root")
export class AiPropertyValidationRootElement extends UmbElementMixin(
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
    } finally {
      this._loading = false;
    }
  }

  async #onDelete(rule: ValidationRuleModel) {
    if (!confirm(`Delete rule "${rule.name}"?`)) return;
    try {
      await validationRuleApi.delete(rule.key);
      this._rules = this._rules.filter((r) => r.key !== rule.key);
    } catch (e) {
      console.error("Failed to delete rule", e);
    }
  }

  #getValidateOnLabel(value: number): string {
    switch (value) {
      case 0:
        return "Save";
      case 1:
        return "Publish";
      case 2:
        return "Both";
      default:
        return "Unknown";
    }
  }

  #getFailureLevelLabel(value: number): string {
    return value === 1 ? "Error" : "Warning";
  }

  render() {
    return html`
      <umb-body-layout header-transparent>
        <div id="header" slot="header">
          <h3>AI Property Validation Rules</h3>
          <uui-button
            color="default"
            look="primary"
            label="Create Rule"
            href=${`section/ai/workspace/${ENTITY_TYPE}/create`}
          >
            Create Rule
          </uui-button>
        </div>

        ${this._loading
          ? html`<uui-loader-bar></uui-loader-bar>`
          : this._rules.length === 0
            ? html`<uui-box>
                <p>
                  No validation rules configured yet. Click "Create Rule" to add
                  your first AI-powered validation rule.
                </p>
              </uui-box>`
            : html`
                <uui-table>
                  <uui-table-head>
                    <uui-table-head-cell>Name</uui-table-head-cell>
                    <uui-table-head-cell>Content Type</uui-table-head-cell>
                    <uui-table-head-cell>Property</uui-table-head-cell>
                    <uui-table-head-cell>Validate On</uui-table-head-cell>
                    <uui-table-head-cell>Failure Level</uui-table-head-cell>
                    <uui-table-head-cell>Enabled</uui-table-head-cell>
                    <uui-table-head-cell></uui-table-head-cell>
                  </uui-table-head>
                  ${this._rules.map(
                    (rule) => html`
                      <uui-table-row>
                        <uui-table-cell>
                          <a
                            href=${`section/ai/workspace/${ENTITY_TYPE}/edit/${rule.key}`}
                          >
                            ${rule.name}
                          </a>
                        </uui-table-cell>
                        <uui-table-cell>${rule.contentTypeAlias}</uui-table-cell>
                        <uui-table-cell>${rule.propertyAlias}</uui-table-cell>
                        <uui-table-cell
                          >${this.#getValidateOnLabel(
                            rule.validateOn
                          )}</uui-table-cell
                        >
                        <uui-table-cell
                          >${this.#getFailureLevelLabel(
                            rule.failureLevel
                          )}</uui-table-cell
                        >
                        <uui-table-cell>
                          <uui-tag
                            color=${rule.isEnabled ? "positive" : "danger"}
                            look="secondary"
                          >
                            ${rule.isEnabled ? "Yes" : "No"}
                          </uui-tag>
                        </uui-table-cell>
                        <uui-table-cell>
                          <uui-button
                            color="danger"
                            look="secondary"
                            label="Delete"
                            compact
                            @click=${() => this.#onDelete(rule)}
                          >
                            <uui-icon name="icon-trash"></uui-icon>
                          </uui-button>
                        </uui-table-cell>
                      </uui-table-row>
                    `
                  )}
                </uui-table>
              `}
      </umb-body-layout>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      #header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      h3 {
        margin: 0;
      }

      a {
        color: var(--uui-color-interactive);
        text-decoration: none;
        font-weight: bold;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ];
}

export default AiPropertyValidationRootElement;

declare global {
  interface HTMLElementTagNameMap {
    "ai-property-validation-root": AiPropertyValidationRootElement;
  }
}
