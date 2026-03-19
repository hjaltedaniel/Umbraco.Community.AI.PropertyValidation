import { html as p, css as g, state as y, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as G } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as b } from "@umbraco-cms/backoffice/style";
import { V as C } from "./validation-rule-workspace.context-token-CFAZYswS.js";
var O = Object.defineProperty, w = Object.getOwnPropertyDescriptor, _ = (e) => {
  throw TypeError(e);
}, h = (e, t, a, i) => {
  for (var r = i > 1 ? void 0 : i ? w(t, a) : t, n = e.length - 1, u; n >= 0; n--)
    (u = e[n]) && (r = (i ? u(t, a, r) : u(r)) || r);
  return i && r && O(t, a, r), r;
}, d = (e, t, a) => t.has(e) || _("Cannot " + a), x = (e, t, a) => (d(e, t, "read from private field"), t.get(e)), c = (e, t, a) => t.has(e) ? _("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), S = (e, t, a, i) => (d(e, t, "write to private field"), t.set(e, a), a), v = (e, t, a) => (d(e, t, "access private method"), a), l, s, f, m;
let o = class extends G {
  constructor() {
    super(), c(this, s), c(this, l), this.consumeContext(C, (e) => {
      e && (S(this, l, e), this.observe(e.model, (t) => {
        this._model = t;
      }));
    });
  }
  render() {
    return this._model ? p`
      <uui-box headline="Guardrails">
        <umb-property-layout
          label="Guardrails"
          description="Select guardrails to evaluate inputs and responses during validation. Guardrails constrain AI behaviour and enforce compliance policies."
        >
          <uai-guardrail-picker
            slot="editor"
            multiple
            .value=${v(this, s, m).call(this)}
            @change=${v(this, s, f)}
          ></uai-guardrail-picker>
        </umb-property-layout>
      </uui-box>
    ` : p`<uui-loader></uui-loader>`;
  }
};
l = /* @__PURE__ */ new WeakMap();
s = /* @__PURE__ */ new WeakSet();
f = function(e) {
  e.stopPropagation();
  const a = e.target.value ?? [];
  x(this, l)?.updateProperty("guardrails", a.length > 0 ? JSON.stringify(a) : null);
};
m = function() {
  if (!this._model?.guardrails) return [];
  try {
    return JSON.parse(this._model.guardrails);
  } catch {
    return [];
  }
};
o.styles = [
  b,
  g`
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
    `
];
h([
  y()
], o.prototype, "_model", 2);
o = h([
  E("ucai-validation-rule-governance")
], o);
const A = o;
export {
  o as ValidationRuleGovernanceElement,
  A as default
};
//# sourceMappingURL=validation-rule-governance.element-CGgMjUt6.js.map
