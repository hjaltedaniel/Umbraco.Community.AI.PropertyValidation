import {
  ENTITY_TYPE,
  ROOT_ENTITY_TYPE,
  MENU_ITEM_ALIAS,
  WORKSPACE_ALIAS,
  ROOT_WORKSPACE_ALIAS,
  ADDONS_MENU_ALIAS,
} from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  // Menu item in AI section Addons sidebar
  {
    type: "menuItem",
    alias: MENU_ITEM_ALIAS,
    name: "Property Validation Menu Item",
    element: () => import("./validation-rule-menu-item.element.js"),
    meta: {
      label: "Property Validation",
      icon: "icon-check",
      entityType: ROOT_ENTITY_TYPE,
      menus: [ADDONS_MENU_ALIAS],
    },
  },
  // Root workspace (list of rules)
  {
    type: "workspace",
    alias: ROOT_WORKSPACE_ALIAS,
    name: "Property Validation Root Workspace",
    element: () => import("./validation-rule-root.element.js"),
    meta: {
      entityType: ROOT_ENTITY_TYPE,
    },
  },
  // Rule workspace (edit a single rule)
  {
    type: "workspace",
    kind: "routable",
    alias: WORKSPACE_ALIAS,
    name: "Property Validation Rule Workspace",
    element: () => import("./validation-rule-workspace.element.js"),
    meta: {
      entityType: ENTITY_TYPE,
    },
  },
];
