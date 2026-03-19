import type {
  UmbEntryPointOnInit,
  UmbEntryPointOnUnload,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { setTokenProvider } from "../api.js";

export const onInit: UmbEntryPointOnInit = (_host, _extensionRegistry) => {
  _host.consumeContext(UMB_AUTH_CONTEXT, async (authContext) => {
    if (!authContext) return;

    const config = authContext.getOpenApiConfiguration();
    if (config?.token) {
      setTokenProvider(config.token);
    }
  });
};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {
  // Cleanup if needed
};
