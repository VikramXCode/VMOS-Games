const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/$/, "")
  : "/api";

type ApiRecord = Record<string, unknown>;
type ApiEntity = ApiRecord & { _id?: string; id?: string };

// Helper to get admin token from localStorage
const getToken = (): string | null => localStorage.getItem("vmos-admin-token");

const headers = (withAuth = false, asJson = true): HeadersInit => {
  const h: HeadersInit = {};
  if (asJson) h["Content-Type"] = "application/json";
  if (withAuth) {
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function requestForm<T>(url: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: headers(true, false),
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Products ─────────────────────────────────
export const api = {
  products: {
    list: () => request<ApiEntity[]>("/products"),
    get: (id: string) => request<ApiEntity>(`/products/${id}`),
    uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return requestForm<{ url: string; publicId: string }>("/products/upload-image", formData);
    },
    create: (data: ApiRecord) =>
      request<ApiEntity>("/products", { method: "POST", headers: headers(true), body: JSON.stringify(data) }),
    update: (id: string, data: ApiRecord) =>
      request<ApiEntity>(`/products/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/products/${id}`, { method: "DELETE", headers: headers(true) }),
  },

  // ─── Bookings ──────────────────────────────
  bookings: {
    list: (params?: { date?: string; consoleId?: string }) => {
      const safeParams = Object.fromEntries(
        Object.entries(params ?? {}).filter(([, value]) => typeof value === "string" && value.length > 0),
      ) as Record<string, string>;
      const qs = new URLSearchParams(safeParams).toString();
      return request<ApiEntity[]>(`/bookings${qs ? `?${qs}` : ""}`, { headers: headers(true) });
    },
    availability: (date: string, consoleId: string) =>
      request<{ bookedSlots: string[] }>(`/bookings/availability?date=${date}&consoleId=${consoleId}`),
    create: (data: ApiRecord) =>
      request<ApiEntity>("/bookings", { method: "POST", headers: headers(), body: JSON.stringify(data) }),
    update: (id: string, data: ApiRecord) =>
      request<ApiEntity>(`/bookings/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/bookings/${id}`, { method: "DELETE", headers: headers(true) }),
  },

  // ─── Tournaments ───────────────────────────
  tournaments: {
    list: () => request<ApiEntity[]>("/tournaments"),
    create: (data: ApiRecord) =>
      request<ApiEntity>("/tournaments", { method: "POST", headers: headers(true), body: JSON.stringify(data) }),
    update: (id: string, data: ApiRecord) =>
      request<ApiEntity>(`/tournaments/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/tournaments/${id}`, { method: "DELETE", headers: headers(true) }),
  },

  // ─── Leaderboard ───────────────────────────
  leaderboard: {
    list: () => request<ApiEntity[]>("/leaderboard"),
    create: (data: ApiRecord) =>
      request<ApiEntity>("/leaderboard", { method: "POST", headers: headers(true), body: JSON.stringify(data) }),
    update: (id: string, data: ApiRecord) =>
      request<ApiEntity>(`/leaderboard/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/leaderboard/${id}`, { method: "DELETE", headers: headers(true) }),
  },

  // ─── Admin Auth ────────────────────────────
  admin: {
    login: (username: string, password: string) =>
      request<{ token: string; admin: ApiEntity }>("/admin/login", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ username, password }),
      }),
    me: () => request<ApiEntity>("/admin/me", { headers: headers(true) }),
    register: (username: string, password: string) =>
      request<{ token: string; admin: ApiEntity }>("/admin/register", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ username, password }),
      }),
  },

  // ─── Slots ─────────────────────────────────
  slots: {
    overrides: (date: string, consoleId?: string) => {
      let url = `/slots/overrides?date=${date}`;
      if (consoleId) url += `&consoleId=${consoleId}`;
      return request<ApiEntity[]>(url);
    },
    createOverride: (data: ApiRecord) =>
      request<ApiEntity>("/slots/overrides", { method: "POST", headers: headers(true), body: JSON.stringify(data) }),
    deleteOverride: (id: string) =>
      request<void>(`/slots/overrides/${id}`, { method: "DELETE", headers: headers(true) }),
  },

  // ─── Consoles ──────────────────────────────
  consoles: {
    list: () => request<ApiEntity[]>("/consoles"),
  },

  // ─── Public Content ────────────────────────
  content: {
    get: () => request<ApiRecord>("/content/public"),
  },

  // ─── Health ────────────────────────────────
  health: () => request<{ status: string }>("/health"),
};
