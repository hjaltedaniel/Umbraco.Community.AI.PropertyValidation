import { UMB_AUTH_CONTEXT as i } from "@umbraco-cms/backoffice/auth";
import { s } from "./api-CtQh0b2h.js";
const f = (o, e) => {
  o.consumeContext(i, async (n) => {
    if (!n) return;
    const t = n.getOpenApiConfiguration();
    t?.token && s(t.token);
  });
}, g = (o, e) => {
};
export {
  f as onInit,
  g as onUnload
};
//# sourceMappingURL=entrypoint-BWi_IIiR.js.map
