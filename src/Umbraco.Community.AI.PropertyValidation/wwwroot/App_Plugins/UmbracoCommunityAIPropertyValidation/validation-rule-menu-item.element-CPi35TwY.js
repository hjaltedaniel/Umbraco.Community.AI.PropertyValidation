import { LitElement as d, html as l, state as m, customElement as h } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as v } from "@umbraco-cms/backoffice/element-api";
import { v as f } from "./api-lnISbUC5.js";
import { R as y, E } from "./bundle.manifests-CvUPgazM.js";
var P = Object.defineProperty, T = Object.getOwnPropertyDescriptor, p = (e) => {
  throw TypeError(e);
}, c = (e, t, i, n) => {
  for (var a = n > 1 ? void 0 : n ? T(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (a = (n ? s(t, i, a) : s(a)) || a);
  return n && a && P(t, i, a), a;
}, $ = (e, t, i) => t.has(e) || p("Cannot " + i), g = (e, t, i) => t.has(e) ? p("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), w = (e, t, i) => ($(e, t, "access private method"), i), u, _;
let r = class extends v(
  d
) {
  constructor() {
    super(...arguments), g(this, u), this._rules = [], this._loading = !0;
  }
  connectedCallback() {
    super.connectedCallback(), w(this, u, _).call(this);
  }
  render() {
    return l`
      <uui-menu-item
        label="Property Validation"
        href=${`section/ai/workspace/${y}`}
        ?has-children=${this._rules.length > 0}
      >
        <uui-icon slot="icon" name="icon-check"></uui-icon>
        ${this._loading ? l`<uui-loader slot="actions"></uui-loader>` : this._rules.map(
      (e) => l`
                <uui-menu-item
                  label=${e.name}
                  href=${`section/ai/workspace/${E}/edit/${e.key}`}
                >
                  <uui-icon slot="icon" name="icon-check"></uui-icon>
                </uui-menu-item>
              `
    )}
      </uui-menu-item>
    `;
  }
};
u = /* @__PURE__ */ new WeakSet();
_ = async function() {
  try {
    this._rules = await f.getAll();
  } catch (e) {
    console.error("Failed to load validation rules", e), this._rules = [];
  } finally {
    this._loading = !1;
  }
};
c([
  m()
], r.prototype, "_rules", 2);
c([
  m()
], r.prototype, "_loading", 2);
r = c([
  h("ai-property-validation-menu-item")
], r);
const I = r;
export {
  r as AiPropertyValidationMenuItemElement,
  I as default
};
//# sourceMappingURL=validation-rule-menu-item.element-CPi35TwY.js.map
