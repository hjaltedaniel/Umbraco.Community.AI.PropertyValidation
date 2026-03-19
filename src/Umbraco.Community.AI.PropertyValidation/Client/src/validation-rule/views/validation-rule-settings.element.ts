import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import "@umbraco-cms/backoffice/markdown-editor";
import { VALIDATION_RULE_CONTEXT } from "../context/validation-rule-workspace.context-token.js";
import type { ValidationRuleDetailModel } from "../validation-rule-workspace-editor.element.js";
import { validationRuleApi } from "../../api.js";

const VALIDATE_ON_OPTIONS = [
  { name: "Save", value: "0" },
  { name: "Publish", value: "1" },
  { name: "Both", value: "2" },
];

const FAILURE_LEVEL_OPTIONS = [
  { name: "Warning (allow save, show message)", value: "0" },
  { name: "Error (block save/publish)", value: "1" },
];

/**
 * Settings workspace view for Property Validation rules.
 */
@customElement("ucai-validation-rule-settings")
export class ValidationRuleSettingsElement extends UmbLitElement {
  #workspaceContext?: any;

  @state()
  private _model?: ValidationRuleDetailModel;

  constructor() {
    super();
    this.consumeContext(VALIDATION_RULE_CONTEXT, (context: any) => {
      if (context) {
        this.#workspaceContext = context;
        this.observe(context.model, (model: any) => {
          this._model = model as ValidationRuleDetailModel | undefined;
        });
      }
    });
  }

  // ── Profile picker ──
  #onProfileChange(event: Event) {
    event.stopPropagation();
    const picker = event.target as any;
    this.#workspaceContext?.updateProperty("profileAlias", picker.value ?? "");
  }

  // ── Content Type (tags input with autocomplete) ──
  #contentTypeLookup = async (query: string) => {
    try {
      const aliases = await validationRuleApi.getDocumentTypes(query);
      return aliases.map((alias: string) => ({ id: alias, text: alias }));
    } catch {
      return [];
    }
  };

  #onContentTypeTagsChange(event: CustomEvent) {
    event.stopPropagation();
    const items = (event.target as any).items as string[];
    this.#workspaceContext?.updateProperty("contentTypeAlias", items?.[0] ?? "");
  }

  // ── Property Alias (tags input with autocomplete) ──
  #propertyAliasLookup = async (query: string) => {
    try {
      const contentTypeAlias = this._model?.contentTypeAlias;
      const aliases = await validationRuleApi.getPropertyAliases(contentTypeAlias, query);
      return aliases.map((alias: string) => ({ id: alias, text: alias }));
    } catch {
      return [];
    }
  };

  #onPropertyAliasTagsChange(event: CustomEvent) {
    event.stopPropagation();
    const items = (event.target as any).items as string[];
    this.#workspaceContext?.updateProperty("propertyAlias", items?.[0] ?? "");
  }

  // ── Instructions (markdown) ──
  #onInstructionsChange(event: Event) {
    event.stopPropagation();
    const value = (event.target as any).value;
    this.#workspaceContext?.updateProperty("instructions", value);
  }

  // ── Validate On ──
  #onValidateOnChange(event: Event) {
    event.stopPropagation();
    const target = event.target as any;
    // uui-select fires UUISelectEvent with value on the element
    const val = target.value;
    if (val !== undefined && val !== null) {
      this.#workspaceContext?.updateProperty("validateOn", parseInt(val));
    }
  }

  // ── Failure Level ──
  #onFailureLevelChange(event: Event) {
    event.stopPropagation();
    const target = event.target as any;
    const val = target.value;
    if (val !== undefined && val !== null) {
      this.#workspaceContext?.updateProperty("failureLevel", parseInt(val));
    }
  }

  override render() {
    if (!this._model) return html`<uui-loader></uui-loader>`;

    const contentTypeItems = this._model.contentTypeAlias ? [this._model.contentTypeAlias] : [];
    const propertyAliasItems = this._model.propertyAlias ? [this._model.propertyAlias] : [];

    // Build options with correct `selected` state
    const validateOnOptions = VALIDATE_ON_OPTIONS.map(o => ({
      ...o,
      selected: o.value === String(this._model!.validateOn),
    }));
    const failureLevelOptions = FAILURE_LEVEL_OPTIONS.map(o => ({
      ...o,
      selected: o.value === String(this._model!.failureLevel),
    }));

    return html`
      <uui-box headline="General">
        <umb-property-layout
          label="AI Profile"
          description="Select the AI profile to use for validation. This determines which provider and model will evaluate the content."
        >
          <uai-profile-picker
            slot="editor"
            .value=${this._model.profileAlias || undefined}
            @change=${this.#onProfileChange}
          ></uai-profile-picker>
        </umb-property-layout>

        <umb-property-layout
          label="Content Type"
          description="The document type to target. Use * for all content types."
        >
          <uai-tags-input
            slot="editor"
            .items=${contentTypeItems}
            .lookup=${this.#contentTypeLookup}
            placeholder="Search document types or enter * for all"
            @change=${this.#onContentTypeTagsChange}
          ></uai-tags-input>
        </umb-property-layout>

        <umb-property-layout
          label="Property Alias"
          description="The property alias to validate when content is saved or published."
        >
          <uai-tags-input
            slot="editor"
            .items=${propertyAliasItems}
            .lookup=${this.#propertyAliasLookup}
            placeholder="Search property aliases"
            @change=${this.#onPropertyAliasTagsChange}
          ></uai-tags-input>
        </umb-property-layout>

        <umb-property-layout
          label="Instructions"
          description="The validation instructions sent to AI. Describe what constitutes valid content for this property."
        >
          <umb-input-markdown
            slot="editor"
            .value=${this._model.instructions ?? ""}
            @change=${this.#onInstructionsChange}
          ></umb-input-markdown>
        </umb-property-layout>
      </uui-box>

      <uui-box headline="Behaviour">
        <umb-property-layout
          label="Validate On"
          description="When should this validation rule be triggered?"
        >
          <uui-select
            slot="editor"
            label="Validate On"
            .options=${validateOnOptions}
            @change=${this.#onValidateOnChange}
          ></uui-select>
        </umb-property-layout>

        <umb-property-layout
          label="Failure Level"
          description="Warning shows a message but allows the action. Error blocks the save/publish."
        >
          <uui-select
            slot="editor"
            label="Failure Level"
            .options=${failureLevelOptions}
            @change=${this.#onFailureLevelChange}
          ></uui-select>
        </umb-property-layout>
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

      uui-box {
        --uui-box-default-padding: 0 var(--uui-size-space-5);
      }
      uui-box:not(:first-child) {
        margin-top: var(--uui-size-layout-1);
      }

      uui-input,
      uui-textarea,
      uui-select {
        width: 100%;
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

export default ValidationRuleSettingsElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-settings": ValidationRuleSettingsElement;
  }
}
