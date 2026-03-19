import { API_BASE } from "./constants.js";

// ---- Types ----

export interface ValidationRuleModel {
  key: string;
  name: string;
  alias: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  instructions: string;
  guardrails: string | null;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
  version: number;
  createDate: string;
  updateDate: string;
}

export interface CreateUpdateRuleModel {
  name: string;
  alias: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  instructions: string;
  guardrails: string | null;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
}

export interface ValidationRuleVersionModel {
  id: number;
  ruleKey: string;
  version: number;
  name: string;
  changedBy: string | null;
  changeDescription: string | null;
  changeDate: string;
}

// ---- Auth token provider ----

let _getToken: (() => Promise<string | undefined>) | undefined;

export function setTokenProvider(fn: () => Promise<string | undefined>) {
  _getToken = fn;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (_getToken) {
    const token = await _getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string>),
    },
    credentials: "same-origin",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API error ${response.status}:`, errorBody);
    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}

// ---- API client ----

export const validationRuleApi = {
  getAll: () => apiFetch<ValidationRuleModel[]>("/rule"),

  getByKey: (key: string) => apiFetch<ValidationRuleModel>(`/rule/${key}`),

  create: (model: CreateUpdateRuleModel) =>
    apiFetch<ValidationRuleModel>("/rule", {
      method: "POST",
      body: JSON.stringify(model),
    }),

  update: (key: string, model: CreateUpdateRuleModel) =>
    apiFetch<ValidationRuleModel>(`/rule/${key}`, {
      method: "PUT",
      body: JSON.stringify(model),
    }),

  delete: (key: string) =>
    apiFetch<void>(`/rule/${key}`, {
      method: "DELETE",
    }),

  getVersions: (key: string) =>
    apiFetch<ValidationRuleVersionModel[]>(`/rule/${key}/versions`),

  getDocumentTypes: (query?: string) =>
    apiFetch<string[]>(`/utils/document-types${query ? `?query=${encodeURIComponent(query)}` : ""}`),

  getPropertyAliases: (contentTypeAlias?: string, query?: string) => {
    const params = new URLSearchParams();
    if (contentTypeAlias) params.set("contentTypeAlias", contentTypeAlias);
    if (query) params.set("query", query);
    const qs = params.toString();
    return apiFetch<string[]>(`/utils/property-aliases${qs ? `?${qs}` : ""}`);
  },
};
