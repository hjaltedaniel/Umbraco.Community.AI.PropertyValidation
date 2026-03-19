import { LitElement as w, html as v, nothing as k, css as $, state as s, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as T } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as P } from "@umbraco-cms/backoffice/notification";
import { v as h } from "./api-lnISbUC5.js";
import { E as x, R as O } from "./bundle.manifests-CvUPgazM.js";
var S = Object.defineProperty, C = Object.getOwnPropertyDescriptor, y = (e) => {
  throw TypeError(e);
}, l = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? C(t, i) : t, d = e.length - 1, c; d >= 0; d--)
    (c = e[d]) && (o = (n ? c(t, i, o) : c(o)) || o);
  return n && o && S(t, i, o), o;
}, m = (e, t, i) => t.has(e) || y("Cannot " + i), p = (e, t, i) => (m(e, t, "read from private field"), t.get(e)), f = (e, t, i) => t.has(e) ? y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), N = (e, t, i, n) => (m(e, t, "write to private field"), t.set(e, i), i), _ = (e, t, i) => (m(e, t, "access private method"), i), r, u, g, b, A;
let a = class extends T(
  w
) {
  constructor() {
    super(), f(this, u), this._isNew = !0, this._key = "", this._name = "", this._contentTypeAlias = "", this._propertyAlias = "", this._profileAlias = "", this._prompt = "", this._validateOn = 0, this._failureLevel = 0, this._isEnabled = !0, this._loading = !1, this._saving = !1, f(this, r), this.consumeContext(P, (e) => {
      N(this, r, e);
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = window.location.pathname.split("/"), t = e.indexOf("edit");
    t !== -1 && e[t + 1] && (this._key = e[t + 1], this._isNew = !1, _(this, u, g).call(this));
  }
  render() {
    return this._loading ? v`<uui-loader-bar></uui-loader-bar>` : v`
      <umb-body-layout header-transparent>
        <div id="header" slot="header">
          <h3>${this._isNew ? "Create Validation Rule" : this._name}</h3>
          <div id="actions">
            ${this._isNew ? k : v`<uui-button
                  color="danger"
                  look="secondary"
                  label="Delete"
                  @click=${_(this, u, A)}
                >
                  Delete
                </uui-button>`}
            <uui-button
              color="positive"
              look="primary"
              label="Save"
              .state=${this._saving ? "waiting" : void 0}
              @click=${_(this, u, b)}
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
              @change=${(e) => this._name = e.target.value}
            ></uui-input>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Content Type Alias *</label>
              <uui-input
                label="Content Type Alias"
                placeholder="blogPost or * for all types"
                .value=${this._contentTypeAlias}
                @change=${(e) => this._contentTypeAlias = e.target.value}
              ></uui-input>
            </div>

            <div class="form-group">
              <label>Property Alias *</label>
              <uui-input
                label="Property Alias"
                placeholder="e.g. pageTitle"
                .value=${this._propertyAlias}
                @change=${(e) => this._propertyAlias = e.target.value}
              ></uui-input>
            </div>
          </div>

          <div class="form-group">
            <label>AI Profile Alias *</label>
            <uui-input
              label="Profile Alias"
              placeholder="Alias of the Umbraco.AI profile to use"
              .value=${this._profileAlias}
              @change=${(e) => this._profileAlias = e.target.value}
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
              @change=${(e) => this._prompt = e.target.value}
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
      { name: "Both", value: "2" }
    ]}
                @change=${(e) => this._validateOn = parseInt(
      e.target.value
    )}
              ></uui-select>
            </div>

            <div class="form-group">
              <label>Failure Level</label>
              <uui-select
                label="Failure Level"
                .value=${String(this._failureLevel)}
                .options=${[
      { name: "Warning (allow save, show message)", value: "0" },
      { name: "Error (block save)", value: "1" }
    ]}
                @change=${(e) => this._failureLevel = parseInt(
      e.target.value
    )}
              ></uui-select>
            </div>
          </div>

          <div class="form-group">
            <label>
              <uui-toggle
                label="Enabled"
                .checked=${this._isEnabled}
                @change=${(e) => this._isEnabled = e.target.checked}
              ></uui-toggle>
              Enabled
            </label>
          </div>
        </uui-box>
      </umb-body-layout>
    `;
  }
};
r = /* @__PURE__ */ new WeakMap();
u = /* @__PURE__ */ new WeakSet();
g = async function() {
  this._loading = !0;
  try {
    const e = await h.getByKey(this._key);
    this._name = e.name, this._contentTypeAlias = e.contentTypeAlias, this._propertyAlias = e.propertyAlias, this._profileAlias = e.profileAlias, this._prompt = e.prompt, this._validateOn = e.validateOn, this._failureLevel = e.failureLevel, this._isEnabled = e.isEnabled;
  } catch (e) {
    console.error("Failed to load rule", e);
  } finally {
    this._loading = !1;
  }
};
b = async function() {
  if (!this._name || !this._contentTypeAlias || !this._propertyAlias || !this._profileAlias || !this._prompt) {
    p(this, r)?.peek("danger", {
      data: {
        headline: "Validation",
        message: "Please fill in all required fields."
      }
    });
    return;
  }
  this._saving = !0;
  const e = {
    name: this._name,
    contentTypeAlias: this._contentTypeAlias,
    propertyAlias: this._propertyAlias,
    profileAlias: this._profileAlias,
    prompt: this._prompt,
    validateOn: this._validateOn,
    failureLevel: this._failureLevel,
    isEnabled: this._isEnabled
  };
  try {
    if (this._isNew) {
      const t = await h.create(e);
      this._key = t.key, this._isNew = !1, p(this, r)?.peek("positive", {
        data: {
          headline: "Success",
          message: `Rule "${this._name}" created.`
        }
      }), history.replaceState(
        null,
        "",
        `section/ai/workspace/${x}/edit/${t.key}`
      );
    } else
      await h.update(this._key, e), p(this, r)?.peek("positive", {
        data: {
          headline: "Success",
          message: `Rule "${this._name}" saved.`
        }
      });
  } catch (t) {
    console.error("Failed to save rule", t), p(this, r)?.peek("danger", {
      data: {
        headline: "Error",
        message: "Failed to save rule. Please try again."
      }
    });
  } finally {
    this._saving = !1;
  }
};
A = async function() {
  if (confirm(`Delete rule "${this._name}"?`))
    try {
      await h.delete(this._key), p(this, r)?.peek("positive", {
        data: {
          headline: "Deleted",
          message: `Rule "${this._name}" has been deleted.`
        }
      }), history.pushState(
        null,
        "",
        `section/ai/workspace/${O}`
      ), window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (e) {
      console.error("Failed to delete rule", e);
    }
};
a.styles = [
  $`
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
    `
];
l([
  s()
], a.prototype, "_isNew", 2);
l([
  s()
], a.prototype, "_key", 2);
l([
  s()
], a.prototype, "_name", 2);
l([
  s()
], a.prototype, "_contentTypeAlias", 2);
l([
  s()
], a.prototype, "_propertyAlias", 2);
l([
  s()
], a.prototype, "_profileAlias", 2);
l([
  s()
], a.prototype, "_prompt", 2);
l([
  s()
], a.prototype, "_validateOn", 2);
l([
  s()
], a.prototype, "_failureLevel", 2);
l([
  s()
], a.prototype, "_isEnabled", 2);
l([
  s()
], a.prototype, "_loading", 2);
l([
  s()
], a.prototype, "_saving", 2);
a = l([
  E("ai-property-validation-workspace")
], a);
const F = a;
export {
  a as AiPropertyValidationWorkspaceElement,
  F as default
};
//# sourceMappingURL=validation-rule-workspace.element-DX5HGl4V.js.map
