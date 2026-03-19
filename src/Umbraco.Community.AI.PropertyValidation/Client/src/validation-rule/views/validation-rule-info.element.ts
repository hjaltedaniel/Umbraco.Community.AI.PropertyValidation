import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { VALIDATION_RULE_CONTEXT } from "../context/validation-rule-workspace.context-token.js";
import type { ValidationRuleDetailModel } from "../validation-rule-workspace-editor.element.js";
import { validationRuleApi, type ValidationRuleVersionModel } from "../../api.js";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

/**
 * Info workspace view for Property Validation rules.
 * Shows version history and rule metadata (ID, dates).
 */
@customElement("ucai-validation-rule-info")
export class ValidationRuleInfoElement extends UmbLitElement {
  @state()
  private _model?: ValidationRuleDetailModel;

  @state()
  private _versions: ValidationRuleVersionModel[] = [];

  @state()
  private _loadingVersions = false;

  constructor() {
    super();
    this.consumeContext(VALIDATION_RULE_CONTEXT, (context: any) => {
      if (context) {
        this.observe(context.model, (model: any) => {
          this._model = model as ValidationRuleDetailModel | undefined;
          if (model && model.unique !== EMPTY_GUID) {
            this.#loadVersions(model.unique);
          }
        });
      }
    });
  }

  async #loadVersions(key: string) {
    this._loadingVersions = true;
    try {
      this._versions = await validationRuleApi.getVersions(key);
    } catch (e) {
      console.error("Failed to load version history", e);
      this._versions = [];
    } finally {
      this._loadingVersions = false;
    }
  }

  #formatDateTime(dateStr: string | null): string {
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
    if (!this._model) return html`<uui-loader></uui-loader>`;

    return html`
      <div class="layout">
        <div class="main">
          ${this.#renderVersionHistory()}
        </div>
        <div class="aside">
          ${this.#renderInfoPanel()}
        </div>
      </div>
    `;
  }

  #renderVersionHistory() {
    return html`
      <uui-box headline="Version History">
        ${this._loadingVersions
          ? html`<uui-loader-bar></uui-loader-bar>`
          : this._versions.length === 0
            ? html`<div class="empty-versions">
                <p>No version history available yet. Save the rule to start tracking changes.</p>
              </div>`
            : html`
                <uui-table>
                  <uui-table-head>
                    <uui-table-head-cell style="width: 60px;">Version</uui-table-head-cell>
                    <uui-table-head-cell>Action</uui-table-head-cell>
                    <uui-table-head-cell>Changed By</uui-table-head-cell>
                    <uui-table-head-cell>Date</uui-table-head-cell>
                  </uui-table-head>
                  ${this._versions.map(
                    (v) => html`
                      <uui-table-row>
                        <uui-table-cell>
                          <uui-tag look="secondary">v${v.version}</uui-tag>
                        </uui-table-cell>
                        <uui-table-cell>${v.changeDescription ?? "-"}</uui-table-cell>
                        <uui-table-cell>${v.changedBy ?? "System"}</uui-table-cell>
                        <uui-table-cell>${this.#formatDateTime(v.changeDate)}</uui-table-cell>
                      </uui-table-row>
                    `
                  )}
                </uui-table>
              `}
      </uui-box>
    `;
  }

  #renderInfoPanel() {
    if (!this._model) return null;
    const isUnsaved = this._model.unique === EMPTY_GUID;

    return html`
      <uui-box headline="Info">
        <umb-property-layout label="Id" orientation="vertical">
          <div slot="editor" class="info-value">
            ${isUnsaved
              ? html`<uui-tag color="default" look="placeholder">Unsaved</uui-tag>`
              : html`<span class="guid-value">${this._model.unique}</span>`}
          </div>
        </umb-property-layout>

        <umb-property-layout label="Version" orientation="vertical">
          <div slot="editor">
            ${this._model.version > 0
              ? html`<uui-tag look="secondary">v${this._model.version}</uui-tag>`
              : html`<uui-tag color="default" look="placeholder">New</uui-tag>`}
          </div>
        </umb-property-layout>

        ${this._model.dateCreated
          ? html`
              <umb-property-layout label="Date Created" orientation="vertical">
                <div slot="editor">${this.#formatDateTime(this._model.dateCreated)}</div>
              </umb-property-layout>
            `
          : ""}
        ${this._model.dateModified
          ? html`
              <umb-property-layout label="Date Modified" orientation="vertical">
                <div slot="editor">${this.#formatDateTime(this._model.dateModified)}</div>
              </umb-property-layout>
            `
          : ""}
      </uui-box>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      .layout {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: var(--uui-size-layout-1);
      }

      @media (max-width: 1024px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }

      uui-box {
        --uui-box-default-padding: 0 var(--uui-size-space-5);
      }

      .empty-versions {
        padding: var(--uui-size-space-4) 0;
        text-align: center;
        opacity: 0.7;
      }

      .guid-value {
        font-family: monospace;
        font-size: 0.85em;
        word-break: break-all;
        user-select: all;
      }

      umb-property-layout[orientation="vertical"]:not(:last-child) {
        padding-bottom: 0;
      }

      uui-loader {
        display: block;
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ];
}

export default ValidationRuleInfoElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-info": ValidationRuleInfoElement;
  }
}
