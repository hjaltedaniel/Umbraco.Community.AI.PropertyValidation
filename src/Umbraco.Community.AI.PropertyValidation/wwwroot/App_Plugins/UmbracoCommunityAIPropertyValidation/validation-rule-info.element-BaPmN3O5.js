import { html as i, css as _, state as p, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as $ } from "@umbraco-cms/backoffice/style";
import { V as x } from "./validation-rule-workspace.context-token-CFAZYswS.js";
import { v as w } from "./api-CtQh0b2h.js";
var D = Object.defineProperty, C = Object.getOwnPropertyDescriptor, v = (e) => {
  throw TypeError(e);
}, d = (e, t, a, u) => {
  for (var l = u > 1 ? void 0 : u ? C(t, a) : t, c = e.length - 1, h; c >= 0; c--)
    (h = e[c]) && (l = (u ? h(t, a, l) : h(l)) || l);
  return u && l && D(t, a, l), l;
}, E = (e, t, a) => t.has(e) || v("Cannot " + a), I = (e, t, a) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), s = (e, t, a) => (E(e, t, "access private method"), a), o, m, n, y, b;
const f = "00000000-0000-0000-0000-000000000000";
let r = class extends V {
  constructor() {
    super(), I(this, o), this._versions = [], this._loadingVersions = !1, this.consumeContext(x, (e) => {
      e && this.observe(e.model, (t) => {
        this._model = t, t && t.unique !== f && s(this, o, m).call(this, t.unique);
      });
    });
  }
  render() {
    return this._model ? i`
      <div class="layout">
        <div class="main">
          ${s(this, o, y).call(this)}
        </div>
        <div class="aside">
          ${s(this, o, b).call(this)}
        </div>
      </div>
    ` : i`<uui-loader></uui-loader>`;
  }
};
o = /* @__PURE__ */ new WeakSet();
m = async function(e) {
  this._loadingVersions = !0;
  try {
    this._versions = await w.getVersions(e);
  } catch (t) {
    console.error("Failed to load version history", t), this._versions = [];
  } finally {
    this._loadingVersions = !1;
  }
};
n = function(e) {
  return e ? new Date(e).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "-";
};
y = function() {
  return i`
      <uui-box headline="Version History">
        ${this._loadingVersions ? i`<uui-loader-bar></uui-loader-bar>` : this._versions.length === 0 ? i`<div class="empty-versions">
                <p>No version history available yet. Save the rule to start tracking changes.</p>
              </div>` : i`
                <uui-table>
                  <uui-table-head>
                    <uui-table-head-cell style="width: 60px;">Version</uui-table-head-cell>
                    <uui-table-head-cell>Action</uui-table-head-cell>
                    <uui-table-head-cell>Changed By</uui-table-head-cell>
                    <uui-table-head-cell>Date</uui-table-head-cell>
                  </uui-table-head>
                  ${this._versions.map(
    (e) => i`
                      <uui-table-row>
                        <uui-table-cell>
                          <uui-tag look="secondary">v${e.version}</uui-tag>
                        </uui-table-cell>
                        <uui-table-cell>${e.changeDescription ?? "-"}</uui-table-cell>
                        <uui-table-cell>${e.changedBy ?? "System"}</uui-table-cell>
                        <uui-table-cell>${s(this, o, n).call(this, e.changeDate)}</uui-table-cell>
                      </uui-table-row>
                    `
  )}
                </uui-table>
              `}
      </uui-box>
    `;
};
b = function() {
  if (!this._model) return null;
  const e = this._model.unique === f;
  return i`
      <uui-box headline="Info">
        <umb-property-layout label="Id" orientation="vertical">
          <div slot="editor" class="info-value">
            ${e ? i`<uui-tag color="default" look="placeholder">Unsaved</uui-tag>` : i`<span class="guid-value">${this._model.unique}</span>`}
          </div>
        </umb-property-layout>

        <umb-property-layout label="Version" orientation="vertical">
          <div slot="editor">
            ${this._model.version > 0 ? i`<uui-tag look="secondary">v${this._model.version}</uui-tag>` : i`<uui-tag color="default" look="placeholder">New</uui-tag>`}
          </div>
        </umb-property-layout>

        ${this._model.dateCreated ? i`
              <umb-property-layout label="Date Created" orientation="vertical">
                <div slot="editor">${s(this, o, n).call(this, this._model.dateCreated)}</div>
              </umb-property-layout>
            ` : ""}
        ${this._model.dateModified ? i`
              <umb-property-layout label="Date Modified" orientation="vertical">
                <div slot="editor">${s(this, o, n).call(this, this._model.dateModified)}</div>
              </umb-property-layout>
            ` : ""}
      </uui-box>
    `;
};
r.styles = [
  $,
  _`
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
    `
];
d([
  p()
], r.prototype, "_model", 2);
d([
  p()
], r.prototype, "_versions", 2);
d([
  p()
], r.prototype, "_loadingVersions", 2);
r = d([
  g("ucai-validation-rule-info")
], r);
const z = r;
export {
  r as ValidationRuleInfoElement,
  z as default
};
//# sourceMappingURL=validation-rule-info.element-BaPmN3O5.js.map
