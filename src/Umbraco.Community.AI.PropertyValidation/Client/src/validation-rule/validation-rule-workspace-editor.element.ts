import {
  LitElement,
  css,
  html,
  customElement,
  state,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UUIInputElement, UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { UmbObjectState, UmbBasicState } from "@umbraco-cms/backoffice/observable-api";
import { WORKSPACE_ALIAS, ROOT_ENTITY_TYPE, ENTITY_TYPE } from "../constants.js";
import {
  validationRuleApi,
  type ValidationRuleModel,
  type CreateUpdateRuleModel,
} from "../api.js";
import { VALIDATION_RULE_CONTEXT } from "./context/validation-rule-workspace.context-token.js";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export interface ValidationRuleDetailModel {
  unique: string;
  entityType: string;
  name: string;
  alias: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  instructions: string;
  guardrails: string | null;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
  version: number;
  dateCreated: string | null;
  dateModified: string | null;
}

function createScaffold(): ValidationRuleDetailModel {
  return {
    unique: EMPTY_GUID,
    entityType: ENTITY_TYPE,
    name: "",
    alias: "",
    contentTypeAlias: "",
    propertyAlias: "",
    profileAlias: "",
    instructions: "",
    guardrails: null,
    validateOn: 2,
    failureLevel: 1,
    isEnabled: true,
    version: 0,
    dateCreated: null,
    dateModified: null,
  };
}

function mapFromApi(rule: ValidationRuleModel): ValidationRuleDetailModel {
  return {
    unique: rule.key,
    entityType: ENTITY_TYPE,
    name: rule.name,
    alias: rule.alias,
    contentTypeAlias: rule.contentTypeAlias,
    propertyAlias: rule.propertyAlias,
    profileAlias: rule.profileAlias,
    instructions: rule.instructions,
    guardrails: rule.guardrails,
    validateOn: rule.validateOn,
    failureLevel: rule.failureLevel,
    isEnabled: rule.isEnabled,
    version: rule.version,
    dateCreated: rule.createDate,
    dateModified: rule.updateDate,
  };
}

function mapToApi(model: ValidationRuleDetailModel): CreateUpdateRuleModel {
  return {
    name: model.name,
    alias: model.alias,
    contentTypeAlias: model.contentTypeAlias,
    propertyAlias: model.propertyAlias,
    profileAlias: model.profileAlias,
    instructions: model.instructions,
    guardrails: model.guardrails,
    validateOn: model.validateOn,
    failureLevel: model.failureLevel,
    isEnabled: model.isEnabled,
  };
}

/**
 * Workspace editor element that also serves as the workspace context.
 * Child workspace views consume this element via VALIDATION_RULE_CONTEXT.
 */
@customElement("ucai-validation-rule-workspace-editor")
export class ValidationRuleWorkspaceEditorElement extends UmbElementMixin(
  LitElement
) {
  // ── Observable state (consumed by child views) ──

  #modelState = new UmbObjectState<ValidationRuleDetailModel | undefined>(undefined);
  readonly model = this.#modelState.asObservable();

  #isNewState = new UmbBasicState<boolean>(true);
  readonly isNew = this.#isNewState.asObservable();

  // ── Local reactive state for rendering ──

  @state()
  private _model?: ValidationRuleDetailModel;

  @state()
  private _isNew = true;

  @state()
  private _aliasLocked = true;

  constructor() {
    super();
    // Provide THIS element as the context — it has getHostElement() from UmbElementMixin
    this.provideContext(VALIDATION_RULE_CONTEXT, this);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.observe(this.model, (model) => {
      this._model = model;
    });
    this.observe(this.isNew, (isNew) => {
      this._isNew = isNew;
      if (isNew) {
        requestAnimationFrame(() => {
          (this.shadowRoot?.querySelector("#name") as HTMLElement)?.focus();
        });
      }
    });

    // Parse route from URL
    const pathParts = window.location.pathname.split("/");
    const createIndex = pathParts.indexOf("create");
    const editIndex = pathParts.indexOf("edit");

    if (createIndex !== -1) {
      this.scaffold();
    } else if (editIndex !== -1 && pathParts[editIndex + 1]) {
      this.load(pathParts[editIndex + 1]);
    }
  }

  // ── Context API methods (called by child views and actions) ──

  scaffold() {
    const model = createScaffold();
    this.#modelState.setValue(model);
    this.#isNewState.setValue(true);
  }

  async load(id: string) {
    try {
      const rule = await validationRuleApi.getByKey(id);
      const model = mapFromApi(rule);
      this.#modelState.setValue(model);
      this.#isNewState.setValue(false);
    } catch (e) {
      console.error("Failed to load validation rule", e);
    }
  }

  updateProperty<K extends keyof ValidationRuleDetailModel>(
    key: K,
    value: ValidationRuleDetailModel[K]
  ) {
    const current = this.#modelState.getValue();
    if (current) {
      this.#modelState.setValue({ ...current, [key]: value });
    }
  }

  async submit() {
    const model = this.#modelState.getValue();
    if (!model) return;

    if (this.#isNewState.getValue()) {
      const created = await validationRuleApi.create(mapToApi(model));
      const newModel = mapFromApi(created);
      this.#modelState.setValue(newModel);
      this.#isNewState.setValue(false);

      const path = `section/ai/workspace/${ENTITY_TYPE}/edit/${newModel.unique}`;
      history.replaceState(null, "", path);
    } else {
      const updated = await validationRuleApi.update(model.unique, mapToApi(model));
      this.#modelState.setValue(mapFromApi(updated));
    }
  }

  // ── Private helpers ──

  #generateAlias(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  #onNameChange(event: UUIInputEvent) {
    event.stopPropagation();
    const target = event.composedPath()[0] as UUIInputElement;
    const name = target.value.toString();
    this.updateProperty("name", name);

    if (this._aliasLocked && this._isNew) {
      this.updateProperty("alias", this.#generateAlias(name));
    }
  }

  #onAliasChange(event: UUIInputEvent) {
    event.stopPropagation();
    const target = event.composedPath()[0] as UUIInputElement;
    this.updateProperty("alias", target.value.toString());
  }

  #onToggleAliasLock() {
    this._aliasLocked = !this._aliasLocked;
  }

  #getRootPath(): string {
    return `section/ai/workspace/${ROOT_ENTITY_TYPE}`;
  }

  override render() {
    if (!this._model) return html`<uui-loader></uui-loader>`;

    return html`
      <umb-workspace-editor alias="${WORKSPACE_ALIAS}">
        <div id="header" slot="header">
          <uui-button
            href=${this.#getRootPath()}
            label="Back to validation rules"
            compact
          >
            <uui-icon name="icon-arrow-left"></uui-icon>
          </uui-button>
          <uui-input
            id="name"
            .value=${this._model.name}
            @input=${this.#onNameChange}
            label="Name"
            placeholder="Enter rule name"
          >
            <uui-input-lock
              slot="append"
              id="alias"
              name="alias"
              label="Alias"
              placeholder="Enter alias"
              .value=${this._model.alias}
              ?auto-width=${!!this._model.name}
              ?locked=${this._aliasLocked}
              @input=${this.#onAliasChange}
              @lock-change=${this.#onToggleAliasLock}
            ></uui-input-lock>
          </uui-input>

          <uui-tag
            color=${this._model.isEnabled ? "positive" : "danger"}
            look="secondary"
            style="cursor: pointer;"
            @click=${() =>
              this.updateProperty("isEnabled", !this._model!.isEnabled)}
          >
            ${this._model.isEnabled ? "Active" : "Inactive"}
          </uui-tag>
        </div>

        ${!this._isNew
          ? html`<umb-workspace-entity-action-menu slot="action-menu"></umb-workspace-entity-action-menu>`
          : nothing}

        <div slot="footer-info" id="footer">
          <a href=${this.#getRootPath()}>Property Validation</a>
          / ${this._model.name || "Untitled"}
        </div>
      </umb-workspace-editor>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      #header {
        display: flex;
        flex: 1 1 auto;
        gap: var(--uui-size-space-3);
        align-items: center;
      }

      #name {
        width: 100%;
        flex: 1 1 auto;
        align-items: center;
      }

      #footer {
        padding: 0 var(--uui-size-layout-1);
      }

      #footer a {
        color: var(--uui-color-interactive);
        text-decoration: none;
      }
      #footer a:hover {
        text-decoration: underline;
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

export default ValidationRuleWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-workspace-editor": ValidationRuleWorkspaceEditorElement;
  }
}
