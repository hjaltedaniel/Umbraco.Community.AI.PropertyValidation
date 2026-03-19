import {
  LitElement,
  css,
  html,
  customElement,
  state,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  validationRuleApi,
  type CreateUpdateRuleModel,
} from "../api.js";
import { ENTITY_TYPE, ROOT_ENTITY_TYPE } from "../constants.js";

@customElement("ai-property-validation-workspace")
export class AiPropertyValidationWorkspaceElement extends UmbElementMixin(
  LitElement
) {
  @state()
  private _isNew = true;

  @state()
  private _key = "";

  @state()
  private _name = "";

  @state()
  private _contentTypeAlias = "";

  @state()
  private _propertyAlias = "";

  @state()
  private _profileAlias = "";

  @state()
  private _prompt = "";

  @state()
  private _validateOn = 0;

  @state()
  private _failureLevel = 0;

  @state()
  private _isEnabled = true;

  @state()
  private _loading = false;

  @state()
  private _saving = false;

  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  constructor() {
    super();
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
      this.#notificationContext = ctx;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Parse key from URL path
    const pathParts = window.location.pathname.split("/");
    const editIndex = pathParts.indexOf("edit");
    if (editIndex !== -1 && pathParts[editIndex + 1]) {
      this._key = pathParts[editIndex + 1];
      this._isNew = false;
      this.#loadRule();
    }
  }

  async #loadRule() {
    this._loading = true;
    try {
      const rule = await validationRuleApi.getByKey(this._key);
      this._name = rule.name;
      this._contentTypeAlias = rule.contentTypeAlias;
      this._propertyAlias = rule.propertyAlias;
      this._profileAlias = rule.profileAlias;
      this._prompt = rule.prompt;
      this._validateOn = rule.validateOn;
      this._failureLevel = rule.failureLevel;
      this._isEnabled = rule.isEnabled;
    } catch (e) {
      console.error("Failed to load rule", e);
    } finally {
      this._loading = false;
    }
  }

  async #onSave() {
    if (!this._name || !this._contentTypeAlias || !this._propertyAlias || !this._profileAlias || !this._prompt) {
      this.#notificationContext?.peek("danger", {
        data: {
          headline: "Validation",
          message: "Please fill in all required fields.",
        },
      });
      return;
    }

    this._saving = true;
    const model: CreateUpdateRuleModel = {
      name: this._name,
      contentTypeAlias: this._contentTypeAlias,
      propertyAlias: this._propertyAlias,
      profileAlias: this._profileAlias,
      prompt: this._prompt,
      validateOn: this._validateOn,
      failureLevel: this._failureLevel,
      isEnabled: this._isEnabled,
    };

    try {
      if (this._isNew) {
        const created = await validationRuleApi.create(model);
        this._key = created.key;
        this._isNew = false;
        this.#notificationContext?.peek("positive", {
          data: {
            headline: "Success",
            message: `Rule "${this._name}" created.`,
          },
        });
        // Navigate to edit URL
        history.replaceState(
          null,
          "",
          `section/ai/workspace/${ENTITY_TYPE}/edit/${created.key}`
        );
      } else {
        await validationRuleApi.update(this._key, model);
        this.#notificationContext?.peek("positive", {
          data: {
            headline: "Success",
            message: `Rule "${this._name}" saved.`,
          },
        });
      }
    } catch (e) {
      console.error("Failed to save rule", e);
      this.#notificationContext?.peek("danger", {
        data: {
          headline: "Error",
          message: "Failed to save rule. Please try again.",
        },
      });
    } finally {
      this._saving = false;
    }
  }

  async #onDelete() {
    if (!confirm(`Delete rule "${this._name}"?`)) return;
    try {
      await validationRuleApi.delete(this._key);
      this.#notificationContext?.peek("positive", {
        data: {
          headline: "Deleted",
          message: `Rule "${this._name}" has been deleted.`,
        },
      });
      // Navigate back to root
      history.pushState(
        null,
        "",
        `section/ai/workspace/${ROOT_ENTITY_TYPE}`
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (e) {
      console.error("Failed to delete rule", e);
    }
  }

  render() {
    if (this._loading) {
      return html`<uui-loader-bar></uui-loader-bar>`;
    }

    return html`
      <umb-body-layout header-transparent>
        <div id="header" slot="header">
          <h3>${this._isNew ? "Create Validation Rule" : this._name}</h3>
          <div id="actions">
            ${!this._isNew
              ? html`<uui-button
                  color="danger"
                  look="secondary"
                  label="Delete"
                  @click=${this.#onDelete}
                >
                  Delete
                </uui-button>`
              : nothing}
            <uui-button
              color="positive"
              look="primary"
              label="Save"
              .state=${this._saving ? "waiting" : undefined}
              @click=${this.#onSave}
            >
              Save
            </uui-button>
          </div>
        </div>

        <uui-box headline="General">
          <div class="form-group">
            <label>Name *</label>
            <uui-input
              label="Name"
              .value=${this._name}
              @change=${(e: Event) =>
                (this._name = (e.target as HTMLInputElement).value)}
            ></uui-input>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Content Type Alias *</label>
              <uui-input
                label="Content Type Alias"
                placeholder="blogPost or * for all types"
                .value=${this._contentTypeAlias}
                @change=${(e: Event) =>
                  (this._contentTypeAlias = (
                    e.target as HTMLInputElement
                  ).value)}
              ></uui-input>
            </div>

            <div class="form-group">
              <label>Property Alias *</label>
              <uui-input
                label="Property Alias"
                placeholder="e.g. pageTitle"
                .value=${this._propertyAlias}
                @change=${(e: Event) =>
                  (this._propertyAlias = (e.target as HTMLInputElement).value)}
              ></uui-input>
            </div>
          </div>

          <div class="form-group">
            <label>AI Profile Alias *</label>
            <uui-input
              label="Profile Alias"
              placeholder="Alias of the Umbraco.AI profile to use"
              .value=${this._profileAlias}
              @change=${(e: Event) =>
                (this._profileAlias = (e.target as HTMLInputElement).value)}
            ></uui-input>
          </div>
        </uui-box>

        <uui-box headline="Validation Prompt">
          <div class="form-group">
            <label>Prompt *</label>
            <uui-textarea
              label="Prompt"
              placeholder="Describe the validation rule, e.g. 'Check that this title is SEO-friendly, between 30-60 characters, and contains no clickbait language'"
              .value=${this._prompt}
              @change=${(e: Event) =>
                (this._prompt = (e.target as HTMLTextAreaElement).value)}
            ></uui-textarea>
          </div>
        </uui-box>

        <uui-box headline="Settings">
          <div class="form-row">
            <div class="form-group">
              <label>Validate On</label>
              <uui-select
                label="Validate On"
                .value=${String(this._validateOn)}
                .options=${[
                  { name: "Save", value: "0" },
                  { name: "Publish", value: "1" },
                  { name: "Both", value: "2" },
                ]}
                @change=${(e: Event) =>
                  (this._validateOn = parseInt(
                    (e.target as HTMLSelectElement).value
                  ))}
              ></uui-select>
            </div>

            <div class="form-group">
              <label>Failure Level</label>
              <uui-select
                label="Failure Level"
                .value=${String(this._failureLevel)}
                .options=${[
                  { name: "Warning (allow save, show message)", value: "0" },
                  { name: "Error (block save)", value: "1" },
                ]}
                @change=${(e: Event) =>
                  (this._failureLevel = parseInt(
                    (e.target as HTMLSelectElement).value
                  ))}
              ></uui-select>
            </div>
          </div>

          <div class="form-group">
            <label>
              <uui-toggle
                label="Enabled"
                .checked=${this._isEnabled}
                @change=${(e: Event) =>
                  (this._isEnabled = (e.target as HTMLInputElement).checked)}
              ></uui-toggle>
              Enabled
            </label>
          </div>
        </uui-box>
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

      #actions {
        display: flex;
        gap: var(--uui-size-space-2);
      }

      h3 {
        margin: 0;
      }

      uui-box {
        margin-bottom: var(--uui-size-layout-1);
      }

      .form-group {
        margin-bottom: var(--uui-size-space-5);
      }

      .form-group label {
        display: block;
        margin-bottom: var(--uui-size-space-2);
        font-weight: bold;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--uui-size-layout-1);
      }

      uui-input,
      uui-textarea,
      uui-select {
        width: 100%;
      }

      uui-textarea {
        min-height: 120px;
      }
    `,
  ];
}

export default AiPropertyValidationWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    "ai-property-validation-workspace": AiPropertyValidationWorkspaceElement;
  }
}
