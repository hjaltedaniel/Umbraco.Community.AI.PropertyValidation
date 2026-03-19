const e = [
  {
    name: "Umbraco Community AIProperty Validation Entrypoint",
    alias: "Umbraco.Community.AI.PropertyValidation.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BWi_IIiR.js")
  }
], n = "ucai:property-validation", o = "ucai:property-validation-root", a = "UmbracoCommunityAI.Workspace.PropertyValidation", t = "UmbracoCommunityAI.Workspace.PropertyValidationRoot", r = "UmbracoCommunityAI.MenuItem.PropertyValidation", m = "Uai.Menu.Addons", i = "icon-check", s = "/umbraco/umbracocommunityaipropertyvalidation/api/v1", c = [
  // ── Menu Item (appears under AI sidebar in Settings section) ──
  {
    type: "menuItem",
    alias: r,
    name: "Property Validation Menu Item",
    weight: 60,
    meta: {
      label: "Property Validation",
      icon: i,
      entityType: o,
      menus: [m]
    }
  },
  // ── Root Workspace (collection / list view) ──
  {
    type: "workspace",
    kind: "default",
    alias: t,
    name: "Property Validation Root Workspace",
    meta: {
      entityType: o,
      headline: "Property Validation"
    }
  },
  {
    type: "workspaceView",
    alias: "UmbracoCommunityAI.WorkspaceView.PropertyValidationRoot.Collection",
    name: "Property Validation Root Collection View",
    element: () => import("./validation-rule-collection.element-fnmFPFzT.js"),
    weight: 100,
    meta: {
      label: "Rules",
      pathname: "rules",
      icon: i
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: t
      }
    ]
  },
  // ── Detail Workspace (edit individual rule — routable) ──
  {
    type: "workspace",
    kind: "routable",
    alias: a,
    name: "Property Validation Rule Workspace",
    element: () => import("./validation-rule-workspace-editor.element-BjwuDjqA.js"),
    meta: {
      entityType: n
    }
  },
  // ── Workspace Views (tabs) ──
  {
    type: "workspaceView",
    alias: "UmbracoCommunityAI.Workspace.PropertyValidation.View.Settings",
    name: "Property Validation Settings View",
    element: () => import("./validation-rule-settings.element-BWTEUgq9.js"),
    weight: 300,
    meta: {
      label: "Settings",
      pathname: "settings",
      icon: "icon-settings"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: a
      }
    ]
  },
  {
    type: "workspaceView",
    alias: "UmbracoCommunityAI.Workspace.PropertyValidation.View.Governance",
    name: "Property Validation Governance View",
    element: () => import("./validation-rule-governance.element-CGgMjUt6.js"),
    weight: 200,
    meta: {
      label: "Governance",
      pathname: "governance",
      icon: "icon-shield"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: a
      }
    ]
  },
  {
    type: "workspaceView",
    alias: "UmbracoCommunityAI.Workspace.PropertyValidation.View.Info",
    name: "Property Validation Info View",
    element: () => import("./validation-rule-info.element-BaPmN3O5.js"),
    weight: 100,
    meta: {
      label: "Info",
      pathname: "info",
      icon: "icon-info"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: a
      }
    ]
  },
  // ── Workspace Action: Save ──
  {
    type: "workspaceAction",
    kind: "default",
    alias: "UmbracoCommunityAI.WorkspaceAction.PropertyValidation.Save",
    name: "Save Property Validation Rule",
    api: () => import("./save-validation-rule.action-DxG0eOVS.js"),
    meta: {
      label: "Save",
      look: "primary",
      color: "positive"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: a
      }
    ]
  },
  // ── Entity Actions ──
  {
    type: "entityAction",
    kind: "default",
    alias: "UmbracoCommunityAI.EntityAction.PropertyValidation.Create",
    name: "Create Validation Rule Entity Action",
    weight: 1200,
    api: () => import("./create-validation-rule.action-Dwwd3e7q.js"),
    forEntityTypes: [o],
    meta: {
      icon: "icon-add",
      label: "Create"
    }
  }
], p = [
  ...e,
  ...c
];
export {
  s as A,
  n as E,
  o as R,
  a as W,
  p as m
};
//# sourceMappingURL=bundle.manifests-lIuvScO3.js.map
