const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, { method = "GET", body, auth = false, params } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = localStorage.getItem("ce_funcionario_token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let url = `${BASE_URL}${path}`;
    if (params) {
        const query = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
        ).toString();
        if (query) url += `?${query}`;
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) return null;

    let data = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const mensagem = (data && data.error) || (typeof data === "string" && data) || "Erro inesperado";
        throw new Error(mensagem);
    }

    return data;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
