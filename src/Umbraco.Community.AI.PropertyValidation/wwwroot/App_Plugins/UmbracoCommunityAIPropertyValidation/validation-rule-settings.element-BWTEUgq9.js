import { html as v, css as k, state as C, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as I } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as L } from "@umbraco-cms/backoffice/style";
import "@umbraco-cms/backoffice/markdown-editor";
import { V as S } from "./validation-rule-workspace.context-token-CFAZYswS.js";
import { v as g } from "./api-CtQh0b2h.js";
var $ = Object.defineProperty, x = Object.getOwnPropertyDescriptor, f = (t) => {
  throw TypeError(t);
}, _ = (t, e, a, i) => {
  for (var o = i > 1 ? void 0 : i ? x(e, a) : e, c = t.length - 1, d; c >= 0; c--)
    (d = t[c]) && (o = (i ? d(e, a, o) : d(o)) || o);
  return i && o && $(e, a, o), o;
}, y = (t, e, a) => e.has(t) || f("Cannot " + a), n = (t, e, a) => (y(t, e, "read from private field"), a ? a.call(t) : e.get(t)), p = (t, e, a) => e.has(t) ? f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), V = (t, e, a, i) => (y(t, e, "write to private field"), e.set(t, a), a), l = (t, e, a) => (y(t, e, "access private method"), a), r, s, b, h, A, m, P, T, w, O;
const W = [
  { name: "Save", value: "0" },
  { name: "Publish", value: "1" },
  { name: "Both", value: "2" }
], D = [
  { name: "Warning (allow save, show message)", value: "0" },
  { name: "Error (block save/publish)", value: "1" }
];
let u = class extends I {
  constructor() {
    super(), p(this, s), p(this, r), p(this, h, async (t) => {
      try {
        return (await g.getDocumentTypes(t)).map((a) => ({ id: a, text: a }));
      } catch {
        return [];
      }
    }), p(this, m, async (t) => {
      try {
        const e = this._model?.contentTypeAlias;
        return (await g.getPropertyAliases(e, t)).map((i) => ({ id: i, text: i }));
      } catch {
        return [];
      }
    }), this.consumeContext(S, (t) => {
      t && (V(this, r, t), this.observe(t.model, (e) => {
        this._model = e;
      }));
    });
  }
  render() {
    if (!this._model) return v`<uui-loader></uui-loader>`;
    const t = this._model.contentTypeAlias ? [this._model.contentTypeAlias] : [], e = this._model.propertyAlias ? [this._model.propertyAlias] : [], a = W.map((o) => ({
      ...o,
      selected: o.value === String(this._model.validateOn)
    })), i = D.map((o) => ({
      ...o,
      selected: o.value === String(this._model.failureLevel)
    }));
    return v`
      <uui-box headline="General">
        <umb-property-layout
          label="AI Profile"
          description="Select the AI profile to use for validation. This determines which provider and model will evaluate the content."
        >
          <uai-profile-picker
            slot="editor"
            .value=${this._model.profileAlias || void 0}
            @change=${l(this, s, b)}
          ></uai-profile-picker>
        </umb-property-layout>

        <umb-property-layout
          label="Content Type"
          description="The document type to target. Use * for all content types."
        >
          <uai-tags-input
            slot="editor"
            .items=${t}
            .lookup=${n(this, h)}
            placeholder="Search document types or enter * for all"
            @change=${l(this, s, A)}
          ></uai-tags-input>
        </umb-property-layout>

        <umb-property-layout
          label="Property Alias"
          description="The property alias to validate when content is saved or published."
        >
          <uai-tags-input
            slot="editor"
            .items=${e}
            .lookup=${n(this, m)}
            placeholder="Search property aliases"
            @change=${l(this, s, P)}
          ></uai-tags-input>
        </umb-property-layout>

        <umb-property-layout
          label="Instructions"
          description="The validation instructions sent to AI. Describe what constitutes valid content for this property."
        >
          <umb-input-markdown
            slot="editor"
            .value=${this._model.instructions ?? ""}
            @change=${l(this, s, T)}
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
            .options=${a}
            @change=${l(this, s, w)}
          ></uui-select>
        </umb-property-layout>

        <umb-property-layout
          label="Failure Level"
          description="Warning shows a message but allows the action. Error blocks the save/publish."
        >
          <uui-select
            slot="editor"
            label="Failure Level"
            .options=${i}
            @change=${l(this, s, O)}
          ></uui-select>
        </umb-property-layout>
      </uui-box>
    `;
  }
};
r = /* @__PURE__ */ new WeakMap();
s = /* @__PURE__ */ new WeakSet();
b = function(t) {
  t.stopPropagation();
  const e = t.target;
  n(this, r)?.updateProperty("profileAlias", e.value ?? "");
};
h = /* @__PURE__ */ new WeakMap();
A = function(t) {
  t.stopPropagation();
  const e = t.target.items;
  n(this, r)?.updateProperty("contentTypeAlias", e?.[0] ?? "");
};
m = /* @__PURE__ */ new WeakMap();
P = function(t) {
  t.stopPropagation();
  const e = t.target.items;
  n(this, r)?.updateProperty("propertyAlias", e?.[0] ?? "");
};
T = function(t) {
  t.stopPropagation();
  const e = t.target.value;
  n(this, r)?.updateProperty("instructions", e);
};
w = function(t) {
  t.stopPropagation();
  const a = t.target.value;
  a != null && n(this, r)?.updateProperty("validateOn", parseInt(a));
};
O = function(t) {
  t.stopPropagation();
  const a = t.target.value;
  a != null && n(this, r)?.updateProperty("failureLevel", parseInt(a));
};
u.styles = [
  L,
  k`
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
    `
];
_([
  C()
], u.prototype, "_model", 2);
u = _([
  E("ucai-validation-rule-settings")
], u);
const B = u;
export {
  u as ValidationRuleSettingsElement,
  B as default
};
//# sourceMappingURL=validation-rule-settings.element-BWTEUgq9.js.map
