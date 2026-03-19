import { LitElement as $, html as f, nothing as L, css as V, state as g, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as x } from "@umbraco-cms/backoffice/element-api";
import { UmbObjectState as N, UmbBasicState as S } from "@umbraco-cms/backoffice/observable-api";
import { E as w, W as R, R as I } from "./bundle.manifests-lIuvScO3.js";
import { v as m } from "./api-CtQh0b2h.js";
import { V as W } from "./validation-rule-workspace.context-token-CFAZYswS.js";
var M = Object.defineProperty, q = Object.getOwnPropertyDescriptor, A = (e) => {
  throw TypeError(e);
}, d = (e, t, a, s) => {
  for (var r = s > 1 ? void 0 : s ? q(t, a) : t, p = e.length - 1, h; p >= 0; p--)
    (h = e[p]) && (r = (s ? h(t, a, r) : h(r)) || r);
  return s && r && M(t, a, r), r;
}, b = (e, t, a) => t.has(e) || A("Cannot " + a), i = (e, t, a) => (b(e, t, "read from private field"), a ? a.call(e) : t.get(e)), v = (e, t, a) => t.has(e) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), u = (e, t, a) => (b(e, t, "access private method"), a), o, l, n, k, T, P, O, y;
const D = "00000000-0000-0000-0000-000000000000";
function U() {
  return {
    unique: D,
    entityType: w,
    name: "",
    alias: "",
    contentTypeAlias: "",
    propertyAlias: "",
    profileAlias: "",
    instructions: "",
    guardrails: null,
    validateOn: 2,
    failureLevel: 1,
    isEnabled: !0,
    version: 0,
    dateCreated: null,
    dateModified: null
  };
}
function _(e) {
  return {
    unique: e.key,
    entityType: w,
    name: e.name,
    alias: e.alias,
    contentTypeAlias: e.contentTypeAlias,
    propertyAlias: e.propertyAlias,
    profileAlias: e.profileAlias,
    instructions: e.instructions,
    guardrails: e.guardrails,
    validateOn: e.validateOn,
    failureLevel: e.failureLevel,
    isEnabled: e.isEnabled,
    version: e.version,
    dateCreated: e.createDate,
    dateModified: e.updateDate
  };
}
function E(e) {
  return {
    name: e.name,
    alias: e.alias,
    contentTypeAlias: e.contentTypeAlias,
    propertyAlias: e.propertyAlias,
    profileAlias: e.profileAlias,
    instructions: e.instructions,
    guardrails: e.guardrails,
    validateOn: e.validateOn,
    failureLevel: e.failureLevel,
    isEnabled: e.isEnabled
  };
}
let c = class extends x(
  $
) {
  constructor() {
    super(), v(this, n), v(this, o, new N(void 0)), this.model = i(this, o).asObservable(), v(this, l, new S(!0)), this.isNew = i(this, l).asObservable(), this._isNew = !0, this._aliasLocked = !0, this.provideContext(W, this);
  }
  connectedCallback() {
    super.connectedCallback(), this.observe(this.model, (s) => {
      this._model = s;
    }), this.observe(this.isNew, (s) => {
      this._isNew = s, s && requestAnimationFrame(() => {
        this.shadowRoot?.querySelector("#name")?.focus();
      });
    });
    const e = window.location.pathname.split("/"), t = e.indexOf("create"), a = e.indexOf("edit");
    t !== -1 ? this.scaffold() : a !== -1 && e[a + 1] && this.load(e[a + 1]);
  }
  // ── Context API methods (called by child views and actions) ──
  scaffold() {
    const e = U();
    i(this, o).setValue(e), i(this, l).setValue(!0);
  }
  async load(e) {
    try {
      const t = await m.getByKey(e), a = _(t);
      i(this, o).setValue(a), i(this, l).setValue(!1);
    } catch (t) {
      console.error("Failed to load validation rule", t);
    }
  }
  updateProperty(e, t) {
    const a = i(this, o).getValue();
    a && i(this, o).setValue({ ...a, [e]: t });
  }
  async submit() {
    const e = i(this, o).getValue();
    if (e)
      if (i(this, l).getValue()) {
        const t = await m.create(E(e)), a = _(t);
        i(this, o).setValue(a), i(this, l).setValue(!1);
        const s = `section/ai/workspace/${w}/edit/${a.unique}`;
        history.replaceState(null, "", s);
      } else {
        const t = await m.update(e.unique, E(e));
        i(this, o).setValue(_(t));
      }
  }
  render() {
    return this._model ? f`
      <umb-workspace-editor alias="${R}">
        <div id="header" slot="header">
          <uui-button
            href=${u(this, n, y).call(this)}
            label="Back to validation rules"
            compact
          >
            <uui-icon name="icon-arrow-left"></uui-icon>
          </uui-button>
          <uui-input
            id="name"
            .value=${this._model.name}
            @input=${u(this, n, T)}
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
              @input=${u(this, n, P)}
              @lock-change=${u(this, n, O)}
            ></uui-input-lock>
          </uui-input>

          <uui-tag
            color=${this._model.isEnabled ? "positive" : "danger"}
            look="secondary"
            style="cursor: pointer;"
            @click=${() => this.updateProperty("isEnabled", !this._model.isEnabled)}
          >
            ${this._model.isEnabled ? "Active" : "Inactive"}
          </uui-tag>
        </div>

        ${this._isNew ? L : f`<umb-workspace-entity-action-menu slot="action-menu"></umb-workspace-entity-action-menu>`}

        <div slot="footer-info" id="footer">
          <a href=${u(this, n, y).call(this)}>Property Validation</a>
          / ${this._model.name || "Untitled"}
        </div>
      </umb-workspace-editor>
    ` : f`<uui-loader></uui-loader>`;
  }
};
o = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakMap();
n = /* @__PURE__ */ new WeakSet();
k = function(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};
T = function(e) {
  e.stopPropagation();
  const a = e.composedPath()[0].value.toString();
  this.updateProperty("name", a), this._aliasLocked && this._isNew && this.updateProperty("alias", u(this, n, k).call(this, a));
};
P = function(e) {
  e.stopPropagation();
  const t = e.composedPath()[0];
  this.updateProperty("alias", t.value.toString());
};
O = function() {
  this._aliasLocked = !this._aliasLocked;
};
y = function() {
  return `section/ai/workspace/${I}`;
};
c.styles = [
  V`
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
    `
];
d([
  g()
], c.prototype, "_model", 2);
d([
  g()
], c.prototype, "_isNew", 2);
d([
  g()
], c.prototype, "_aliasLocked", 2);
c = d([
  C("ucai-validation-rule-workspace-editor")
], c);
const X = c;
export {
  c as ValidationRuleWorkspaceEditorElement,
  X as default
};
//# sourceMappingURL=validation-rule-workspace-editor.element-BjwuDjqA.js.map
