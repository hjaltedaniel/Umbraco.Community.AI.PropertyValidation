const c = "/umbraco/umbracocommunityaipropertyvalidation/api/v1";
let a;
function u(e) {
  a = e;
}
async function t(e, o) {
  const i = {
    "Content-Type": "application/json"
  };
  if (a) {
    const s = await a();
    s && (i.Authorization = `Bearer ${s}`);
  }
  const r = await fetch(`${c}${e}`, {
    ...o,
    headers: {
      ...i,
      ...o?.headers
    },
    credentials: "same-origin"
  });
  if (!r.ok)
    throw new Error(`API error: ${r.status} ${r.statusText}`);
  const n = await r.text();
  return n ? JSON.parse(n) : void 0;
}
const d = {
  getAll: () => t("/rule"),
  getByKey: (e) => t(`/rule/${e}`),
  create: (e) => t("/rule", {
    method: "POST",
    body: JSON.stringify(e)
  }),
  update: (e, o) => t(`/rule/${e}`, {
    method: "PUT",
    body: JSON.stringify(o)
  }),
  delete: (e) => t(`/rule/${e}`, {
    method: "DELETE"
  })
};
export {
  u as s,
  d as v
};
//# sourceMappingURL=api-lnISbUC5.js.map
