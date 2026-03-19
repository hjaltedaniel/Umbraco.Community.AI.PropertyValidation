import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { validationRuleApi, type ValidationRuleModel } from "../../api.js";
import { ENTITY_TYPE } from "../../constants.js";

@customElement("ucai-validation-rule-collection")
export class ValidationRuleCollectionElement extends UmbLitElement {
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

  #getEditPath(key: string): string {
    return `section/ai/workspace/${ENTITY_TYPE}/edit/${key}`;
  }

  #getCreatePath(): string {
    return `section/ai/workspace/${ENTITY_TYPE}/create`;
  }

  #getValidateOnLabel(value: number): string {
    switch (value) {
      case 0: return "Save";
      case 1: return "Publish";
      case 2: return "Both";
      default: return "Unknown";
    }
  }

  #formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  override render() {
    return html`
      <div id="toolbar">
        <uui-button
          label="Create Validation Rule"
          look="outline"
          href=${this.#getCreatePath()}
        >
          <uui-icon name="icon-add"></uui-icon>
          Create
        </uui-button>
      </div>

      ${this._loading
        ? html`<uui-loader-bar></uui-loader-bar>`
        : this._rules.length === 0
          ? html`
              <div class="empty-state">
                <uui-icon name="icon-check" style="font-size: 48px; opacity: 0.3;"></uui-icon>
                <h3>No validation rules yet</h3>
                <p>Create your first AI-powered property validation rule to get started.</p>
                <uui-button
                  label="Create Validation Rule"
                  look="primary"
                  color="positive"
                  href=${this.#getCreatePath()}
                >
                  Create Rule
                </uui-button>
              </div>
            `
          : html`
              <uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Name</uui-table-head-cell>
                  <uui-table-head-cell>Alias</uui-table-head-cell>
                  <uui-table-head-cell>Content Type</uui-table-head-cell>
                  <uui-table-head-cell>Property</uui-table-head-cell>
                  <uui-table-head-cell>Validate On</uui-table-head-cell>
                  <uui-table-head-cell>Active</uui-table-head-cell>
                  <uui-table-head-cell>Modified</uui-table-head-cell>
                </uui-table-head>
                ${this._rules.map(
                  (rule) => html`
                    <uui-table-row>
                      <uui-table-cell>
                        <a href=${this.#getEditPath(rule.key)}>
                          <strong>${rule.name}</strong>
                        </a>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag color="primary" look="secondary">${rule.alias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag look="secondary">${rule.contentTypeAlias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag look="secondary">${rule.propertyAlias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>${this.#getValidateOnLabel(rule.validateOn)}</uui-table-cell>
                      <uui-table-cell>
                        <uui-tag color=${rule.isEnabled ? "positive" : "danger"}>
                          ${rule.isEnabled ? "Active" : "Inactive"}
                        </uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>${this.#formatDate(rule.updateDate)}</uui-table-cell>
                    </uui-table-row>
                  `
                )}
              </uui-table>
            `}
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      #toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: var(--uui-size-layout-1);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--uui-size-space-3);
        padding: var(--uui-size-layout-3);
        text-align: center;
        opacity: 0.8;
      }

      .empty-state h3 {
        margin: 0;
      }

      .empty-state p {
        margin: 0 0 var(--uui-size-space-3);
        max-width: 400px;
      }

      a {
        color: var(--uui-color-interactive);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ];
}

export default ValidationRuleCollectionElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-collection": ValidationRuleCollectionElement;
  }
}
