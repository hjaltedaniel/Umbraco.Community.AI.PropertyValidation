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

/**
 * Governance workspace view for Property Validation rules.
 * Uses uai-guardrail-picker from @umbraco-ai/core to pick guardrails.
 */
@customElement("ucai-validation-rule-governance")
export class ValidationRuleGovernanceElement extends UmbLitElement {
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

  #onGuardrailsChange(event: Event) {
    event.stopPropagation();
    const picker = event.target as any;
    // guardrail picker returns string[] of guardrail IDs — store as JSON
    const ids: string[] = picker.value ?? [];
    this.#workspaceContext?.updateProperty("guardrails", ids.length > 0 ? JSON.stringify(ids) : null);
  }

  #getGuardrailIds(): string[] {
    if (!this._model?.guardrails) return [];
    try {
      return JSON.parse(this._model.guardrails);
    } catch {
      return [];
    }
  }

  override render() {
    if (!this._model) return html`<uui-loader></uui-loader>`;

    return html`
      <uui-box headline="Guardrails">
        <umb-property-layout
          label="Guardrails"
          description="Select guardrails to evaluate inputs and responses during validation. Guardrails constrain AI behaviour and enforce compliance policies."
        >
          <uai-guardrail-picker
            slot="editor"
            multiple
            .value=${this.#getGuardrailIds()}
            @change=${this.#onGuardrailsChange}
          ></uai-guardrail-picker>
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

export default ValidationRuleGovernanceElement;

declare global {
  interface HTMLElementTagNameMap {
    "ucai-validation-rule-governance": ValidationRuleGovernanceElement;
  }
}
