import { LitElement as g, html as o, css as w, state as b, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as E } from "@umbraco-cms/backoffice/element-api";
import { v as p } from "./api-lnISbUC5.js";
import { E as h } from "./bundle.manifests-CvUPgazM.js";
var k = Object.defineProperty, C = Object.getOwnPropertyDescriptor, y = (e) => {
  throw TypeError(e);
}, d = (e, t, a, r) => {
  for (var l = r > 1 ? void 0 : r ? C(t, a) : t, c = e.length - 1, s; c >= 0; c--)
    (s = e[c]) && (l = (r ? s(t, a, l) : s(l)) || l);
  return r && l && k(t, a, l), l;
}, P = (e, t, a) => t.has(e) || y("Cannot " + a), A = (e, t, a) => t.has(e) ? y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), n = (e, t, a) => (P(e, t, "access private method"), a), i, f, v, _, m;
let u = class extends E(
  g
) {
  constructor() {
    super(...arguments), A(this, i), this._rules = [], this._loading = !0;
  }
  connectedCallback() {
    super.connectedCallback(), n(this, i, f).call(this);
  }
  render() {
    return o`
      <umb-body-layout header-transparent>
        <div id="header" slot="header">
          <h3>AI Property Validation Rules</h3>
          <uui-button
            color="default"
            look="primary"
            label="Create Rule"
            href=${`section/ai/workspace/${h}/create`}
          >
            Create Rule
          </uui-button>
        </div>

        ${this._loading ? o`<uui-loader-bar></uui-loader-bar>` : this._rules.length === 0 ? o`<uui-box>
                <p>
                  No validation rules configured yet. Click "Create Rule" to add
                  your first AI-powered validation rule.
                </p>
              </uui-box>` : o`
                <uui-table>
                  <uui-table-head>
                    <uui-table-head-cell>Name</uui-table-head-cell>
                    <uui-table-head-cell>Content Type</uui-table-head-cell>
                    <uui-table-head-cell>Property</uui-table-head-cell>
                    <uui-table-head-cell>Validate On</uui-table-head-cell>
                    <uui-table-head-cell>Failure Level</uui-table-head-cell>
                    <uui-table-head-cell>Enabled</uui-table-head-cell>
                    <uui-table-head-cell></uui-table-head-cell>
                  </uui-table-head>
                  ${this._rules.map(
      (e) => o`
                      <uui-table-row>
                        <uui-table-cell>
                          <a
                            href=${`section/ai/workspace/${h}/edit/${e.key}`}
                          >
                            ${e.name}
                          </a>
                        </uui-table-cell>
                        <uui-table-cell>${e.contentTypeAlias}</uui-table-cell>
                        <uui-table-cell>${e.propertyAlias}</uui-table-cell>
                        <uui-table-cell
                          >${n(this, i, _).call(this, e.validateOn)}</uui-table-cell
                        >
                        <uui-table-cell
                          >${n(this, i, m).call(this, e.failureLevel)}</uui-table-cell
                        >
                        <uui-table-cell>
                          <uui-tag
                            color=${e.isEnabled ? "positive" : "danger"}
                            look="secondary"
                          >
                            ${e.isEnabled ? "Yes" : "No"}
                          </uui-tag>
                        </uui-table-cell>
                        <uui-table-cell>
                          <uui-button
                            color="danger"
                            look="secondary"
                            label="Delete"
                            compact
                            @click=${() => n(this, i, v).call(this, e)}
                          >
                            <uui-icon name="icon-trash"></uui-icon>
                          </uui-button>
                        </uui-table-cell>
                      </uui-table-row>
                    `
    )}
                </uui-table>
              `}
      </umb-body-layout>
    `;
  }
};
i = /* @__PURE__ */ new WeakSet();
f = async function() {
  try {
    this._rules = await p.getAll();
  } catch (e) {
    console.error("Failed to load validation rules", e);
  } finally {
    this._loading = !1;
  }
};
v = async function(e) {
  if (confirm(`Delete rule "${e.name}"?`))
    try {
      await p.delete(e.key), this._rules = this._rules.filter((t) => t.key !== e.key);
    } catch (t) {
      console.error("Failed to delete rule", t);
    }
};
_ = function(e) {
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
m = function(e) {
  return e === 1 ? "Error" : "Warning";
};
u.styles = [
  w`
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

      h3 {
        margin: 0;
      }

      a {
        color: var(--uui-color-interactive);
        text-decoration: none;
        font-weight: bold;
      }

      a:hover {
        text-decoration: underline;
      }
    `
];
d([
  b()
], u.prototype, "_rules", 2);
d([
  b()
], u.prototype, "_loading", 2);
u = d([
  $("ai-property-validation-root")
], u);
const T = u;
export {
  u as AiPropertyValidationRootElement,
  T as default
};
//# sourceMappingURL=validation-rule-root.element-DItkxmtz.js.map
