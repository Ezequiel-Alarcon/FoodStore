const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    // Se captura el mensaje de error que manda el backend
    const errorData = await res.json().catch(() => null);
    const mensaje = errorData?.mensaje || errorData?.detail || `Error HTTP: ${res.status}`;
    throw new Error(mensaje);
  }
  return res.json();
};

export const get = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse<T>(res);
};

export const post = async <TBody, TResponse>(endpoint: string, body: TBody): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(res);
};

export const put = async <TBody, TResponse>(endpoint: string, body: TBody): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(res);
};

export const remove = async <TResponse>(endpoint: string): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
  return handleResponse<TResponse>(res);
};
