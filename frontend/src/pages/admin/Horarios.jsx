import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Loading from "../../components/Loading.jsx";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function Horarios() {
    const [horarios, setHorarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvandoDia, setSalvandoDia] = useState(null);

    async function carregar() {
        const dados = await api.get("/horarios");
        setHorarios(dados.sort((a, b) => a.dia_semana - b.dia_semana));
        setCarregando(false);
    }

    useEffect(() => {
        carregar();
    }, []);

    function atualizarLocal(diaSemana, campo, valor) {
        setHorarios((atual) =>
            atual.map((h) => (h.dia_semana === diaSemana ? { ...h, [campo]: valor } : h))
        );
    }

    async function salvar(dia) {
        setSalvandoDia(dia.dia_semana);
        try {
            await api.put(
                `/horarios/${dia.dia_semana}`,
                { aberto: dia.aberto, abre_as: dia.abre_as, fecha_as: dia.fecha_as },
                { auth: true }
            );
        } finally {
            setSalvandoDia(null);
        }
    }

    if (carregando) return <Loading texto="Carregando horários..." />;

    return (
        <div>
            <h1 className="font-display text-2xl text-areia-50 mb-6">Horário de funcionamento</h1>

            <div className="flex flex-col gap-3 max-w-2xl">
                {horarios.map((dia) => (
                    <div
                        key={dia.dia_semana}
                        className="grid grid-cols-2 sm:grid-cols-[120px,1fr,1fr,1fr,auto] items-center gap-3 bg-mare-900 border border-mare-800 rounded-xl p-3"
                    >
                        <span className="text-areia-50 text-sm">{DIAS[dia.dia_semana]}</span>

                        <label className="flex items-center gap-2 text-sm text-areia-100">
                            <input
                                type="checkbox"
                                checked={dia.aberto}
                                onChange={(e) => atualizarLocal(dia.dia_semana, "aberto", e.target.checked)}
                            />
                            Aberto
                        </label>

                        <input
                            type="time"
                            disabled={!dia.aberto}
                            value={dia.abre_as?.slice(0, 5) || ""}
                            onChange={(e) => atualizarLocal(dia.dia_semana, "abre_as", e.target.value)}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-2 py-1 text-areia-50 text-sm disabled:opacity-40"
                        />
                        <input
                            type="time"
                            disabled={!dia.aberto}
                            value={dia.fecha_as?.slice(0, 5) || ""}
                            onChange={(e) => atualizarLocal(dia.dia_semana, "fecha_as", e.target.value)}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-2 py-1 text-areia-50 text-sm disabled:opacity-40"
                        />

                        <button
                            onClick={() => salvar(dia)}
                            disabled={salvandoDia === dia.dia_semana}
                            className="foco-visivel text-xs bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-3 py-1.5 disabled:opacity-50"
                        >
                            {salvandoDia === dia.dia_semana ? "..." : "Salvar"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
