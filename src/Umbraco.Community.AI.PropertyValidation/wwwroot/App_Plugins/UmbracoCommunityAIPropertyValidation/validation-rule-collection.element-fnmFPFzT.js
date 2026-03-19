import { html as n, css as _, state as p, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as $ } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as w } from "@umbraco-cms/backoffice/style";
import { v as x } from "./api-CtQh0b2h.js";
import { E as b } from "./bundle.manifests-lIuvScO3.js";
var E = Object.defineProperty, k = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, h = (e, t, a, r) => {
  for (var i = r > 1 ? void 0 : r ? k(t, a) : t, c = e.length - 1, s; c >= 0; c--)
    (s = e[c]) && (i = (r ? s(t, a, i) : s(i)) || i);
  return r && i && E(t, a, i), i;
}, A = (e, t, a) => t.has(e) || m("Cannot " + a), P = (e, t, a) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), u = (e, t, a) => (A(e, t, "access private method"), a), l, v, f, d, y, g;
let o = class extends $ {
  constructor() {
    super(...arguments), P(this, l), this._rules = [], this._loading = !0;
  }
  connectedCallback() {
    super.connectedCallback(), u(this, l, v).call(this);
  }
  render() {
    return n`
      <div id="toolbar">
        <uui-button
          label="Create Validation Rule"
          look="outline"
          href=${u(this, l, d).call(this)}
        >
          <uui-icon name="icon-add"></uui-icon>
          Create
        </uui-button>
      </div>

      ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : this._rules.length === 0 ? n`
              <div class="empty-state">
                <uui-icon name="icon-check" style="font-size: 48px; opacity: 0.3;"></uui-icon>
                <h3>No validation rules yet</h3>
                <p>Create your first AI-powered property validation rule to get started.</p>
                <uui-button
                  label="Create Validation Rule"
                  look="primary"
                  color="positive"
                  href=${u(this, l, d).call(this)}
                >
                  Create Rule
                </uui-button>
              </div>
            ` : n`
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
      (e) => n`
                    <uui-table-row>
                      <uui-table-cell>
                        <a href=${u(this, l, f).call(this, e.key)}>
                          <strong>${e.name}</strong>
                        </a>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag color="primary" look="secondary">${e.alias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag look="secondary">${e.contentTypeAlias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        <uui-tag look="secondary">${e.propertyAlias}</uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>${u(this, l, y).call(this, e.validateOn)}</uui-table-cell>
                      <uui-table-cell>
                        <uui-tag color=${e.isEnabled ? "positive" : "danger"}>
                          ${e.isEnabled ? "Active" : "Inactive"}
                        </uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>${u(this, l, g).call(this, e.updateDate)}</uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>
            `}
    `;
  }
};
l = /* @__PURE__ */ new WeakSet();
v = async function() {
  try {
    this._rules = await x.getAll();
  } catch (e) {
    console.error("Failed to load validation rules", e), this._rules = [];
  } finally {
    this._loading = !1;
  }
};
f = function(e) {
  return `section/ai/workspace/${b}/edit/${e}`;
};
d = function() {
  return `section/ai/workspace/${b}/create`;
};
y = function(e) {
  switch (e) {
    case 0:
      return "Save";
    case 1:
      return "Publish";
    case 2:
      return "Both";
    default:
      return "Unknown";
  }
};
g = function(e) {
  return e ? new Date(e).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "-";
};
o.styles = [
  w,
  _`
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
    `
];
h([
  p()
], o.prototype, "_rules", 2);
h([
  p()
], o.prototype, "_loading", 2);
o = h([
  C("ucai-validation-rule-collection")
], o);
const D = o;
export {
  o as ValidationRuleCollectionElement,
  D as default
};
//# sourceMappingURL=validation-rule-collection.element-fnmFPFzT.js.map
