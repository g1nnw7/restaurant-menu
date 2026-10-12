import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function formatarCpf(valor) {
    return valor.replace(/\D/g, "").slice(0, 11);
}

export default function FuncionarioLogin() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setEnviando(true);
        try {
            await login(cpf, senha);
            navigate("/admin");
        } catch (e) {
            setErro(e.message || "CPF ou senha inválidos.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto px-4 py-20">
            <h1 className="font-display text-2xl text-areia-50 mb-1">Acesso do funcionário</h1>
            <p className="text-sm text-areia-200/70 mb-8">
                Área restrita à equipe do Camarão Express.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm mb-1 text-areia-100" htmlFor="cpf">
                        CPF
                    </label>
                    <input
                        id="cpf"
                        inputMode="numeric"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                        className="foco-visivel w-full rounded-lg bg-mare-900 border border-mare-700 px-4 py-3 text-areia-50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-areia-100" htmlFor="senha">
                        Senha
                    </label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="foco-visivel w-full rounded-lg bg-mare-900 border border-mare-700 px-4 py-3 text-areia-50"
                        required
                    />
                </div>

                {erro && <p className="text-sm text-brasa-400">{erro}</p>}

                <button
                    type="submit"
                    disabled={enviando}
                    className="foco-visivel bg-brasa-500 hover:bg-brasa-600 disabled:opacity-50 text-mare-950 font-semibold rounded-full py-3 mt-2"
                >
                    {enviando ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
