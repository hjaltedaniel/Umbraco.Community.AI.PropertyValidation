import { A as c } from "./bundle.manifests-lIuvScO3.js";
let a;
function l(e) {
  a = e;
}
async function r(e, o) {
  const s = {
    "Content-Type": "application/json"
  };
  if (a) {
    const n = await a();
    n && (s.Authorization = `Bearer ${n}`);
  }
  const t = await fetch(`${c}${e}`, {
    ...o,
    headers: {
      ...s,
      ...o?.headers
    },
    credentials: "same-origin"
  });
  if (!t.ok) {
    const n = await t.text();
    throw console.error(`API error ${t.status}:`, n), new Error(`API error: ${t.status} ${t.statusText} - ${n}`);
  }
  const i = await t.text();
  return i ? JSON.parse(i) : void 0;
}
const d = {
  getAll: () => r("/rule"),
  getByKey: (e) => r(`/rule/${e}`),
  create: (e) => r("/rule", {
    method: "POST",
    body: JSON.stringify(e)
  }),
  update: (e, o) => r(`/rule/${e}`, {
    method: "PUT",
    body: JSON.stringify(o)
  }),
  delete: (e) => r(`/rule/${e}`, {
    method: "DELETE"
  }),
  getVersions: (e) => r(`/rule/${e}/versions`),
  getDocumentTypes: (e) => r(`/utils/document-types${e ? `?query=${encodeURIComponent(e)}` : ""}`),
  getPropertyAliases: (e, o) => {
    const s = new URLSearchParams();
    e && s.set("contentTypeAlias", e), o && s.set("query", o);
    const t = s.toString();
    return r(`/utils/property-aliases${t ? `?${t}` : ""}`);
  }
};
export {
  l as s,
  d as v
};
//# sourceMappingURL=api-CtQh0b2h.js.map
