import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as validationRuleManifests } from "./validation-rule/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  ...validationRuleManifests,
];
