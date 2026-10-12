import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function AvisoBanner() {
    const [avisos, setAvisos] = useState([]);

    useEffect(() => {
        api
            .get("/avisos", { params: { somentePublicos: "true" } })
            .then(setAvisos)
            .catch(() => setAvisos([]));
    }, []);

    if (avisos.length === 0) return null;

    return (
        <div className="bg-brasa-500 text-mare-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-col gap-1 text-sm font-medium">
                {avisos.map((a) => (
                    <p key={a.id}>
                        📣 {a.titulo}: {a.mensagem}
                    </p>
                ))}
            </div>
        </div>
    );
}
