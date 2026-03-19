const o = [
  {
    name: "Umbraco Community AIProperty Validation Entrypoint",
    alias: "Umbraco.Community.AI.PropertyValidation.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CmKcYKZ6.js")
  }
], e = "ai-property-validation-rule", t = "ai-property-validation-root", a = "UmbracoAIPropertyValidation.MenuItem", n = "UmbracoAIPropertyValidation.Workspace.Rule", i = "UmbracoAIPropertyValidation.Workspace.Root", r = "Uai.Menu.Addons", p = [
  // Menu item in AI section Addons sidebar
  {
    type: "menuItem",
    alias: a,
    name: "Property Validation Menu Item",
    element: () => import("./validation-rule-menu-item.element-CPi35TwY.js"),
    meta: {
      label: "Property Validation",
      icon: "icon-check",
      entityType: t,
      menus: [r]
    }
  },
  // Root workspace (list of rules)
  {
    type: "workspace",
    alias: i,
    name: "Property Validation Root Workspace",
    element: () => import("./validation-rule-root.element-DItkxmtz.js"),
    meta: {
      entityType: t
    }
  },
  // Rule workspace (edit a single rule)
  {
    type: "workspace",
    kind: "routable",
    alias: n,
    name: "Property Validation Rule Workspace",
    element: () => import("./validation-rule-workspace.element-DX5HGl4V.js"),
    meta: {
      entityType: e
    }
  }
], m = [
  ...o,
  ...p
];
export {
  e as E,
  t as R,
  m
};
//# sourceMappingURL=bundle.manifests-CvUPgazM.js.map
