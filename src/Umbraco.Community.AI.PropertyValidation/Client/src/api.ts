const API_PATH = "/umbraco/umbracocommunityaipropertyvalidation/api/v1";

export interface ValidationRuleModel {
  key: string;
  name: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  prompt: string;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
  createDate: string;
  updateDate: string;
}

export interface CreateUpdateRuleModel {
  name: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  prompt: string;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
}

// Auth token provider - set by the entrypoint once UMB_AUTH_CONTEXT is available
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

  const response = await fetch(`${API_PATH}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string>),
    },
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}

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
};
