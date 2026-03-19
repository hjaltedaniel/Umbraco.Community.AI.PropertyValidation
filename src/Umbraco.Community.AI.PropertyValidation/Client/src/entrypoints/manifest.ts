export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Umbraco Community AIProperty Validation Entrypoint",
    alias: "Umbraco.Community.AI.PropertyValidation.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
