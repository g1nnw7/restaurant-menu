import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [funcionario, setFuncionario] = useState(() => {
        const salvo = localStorage.getItem("ce_funcionario");
        return salvo ? JSON.parse(salvo) : null;
    });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("ce_funcionario_token");
        if (!token) {
            setCarregando(false);
            return;
        }
        api
            .get("/auth/me", { auth: true })
            .catch(() => {
                localStorage.removeItem("ce_funcionario_token");
                localStorage.removeItem("ce_funcionario");
                setFuncionario(null);
            })
            .finally(() => setCarregando(false));
    }, []);

    async function login(cpf, senha) {
        const data = await api.post("/auth/login", { cpf, senha });
        localStorage.setItem("ce_funcionario_token", data.token);
        localStorage.setItem("ce_funcionario", JSON.stringify(data.funcionario));
        setFuncionario(data.funcionario);
        return data.funcionario;
    }

    function logout() {
        localStorage.removeItem("ce_funcionario_token");
        localStorage.removeItem("ce_funcionario");
        setFuncionario(null);
    }

    return (
        <AuthContext.Provider value={{ funcionario, login, logout, carregando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
