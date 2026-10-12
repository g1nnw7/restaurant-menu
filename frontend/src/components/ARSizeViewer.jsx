import { useEffect, useRef, useState } from "react";
import ImagemPrato from "./ImagemPrato.jsx";

const LARGURA_CARTAO_CM = 8.56; // largura padrão de um cartão de crédito/débito

// medida usada quando o prato ainda não tem largura/profundidade cadastradas no painel
const LARGURA_PADRAO_CM = 22;

export default function ARSizeViewer({ produto, onClose }) {
    const videoRef = useRef(null);
    const [streamAtivo, setStreamAtivo] = useState(false);
    const [erroCamera, setErroCamera] = useState("");
    const [etapa, setEtapa] = useState("calibrar"); // calibrar | visualizar
    const [larguraCartaoPx, setLarguraCartaoPx] = useState(160);
    const [pxPorCm, setPxPorCm] = useState(null);
    const [posicao, setPosicao] = useState({ x: 40, y: 40 });
    const arrastando = useRef(false);

    useEffect(() => {
        let stream;

        async function iniciarCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStreamAtivo(true);
                }
            } catch (e) {
                setErroCamera(
                    "Não foi possível acessar a câmera. Verifique se você deu permissão ao navegador."
                );
            }
        }

        iniciarCamera();

        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const larguraCm = Number(produto.largura_cm) || LARGURA_PADRAO_CM;
    const profundidadeCm = Number(produto.profundidade_cm) || larguraCm;

    function confirmarCalibracao() {
        setPxPorCm(larguraCartaoPx / LARGURA_CARTAO_CM);
        setEtapa("visualizar");
    }

    function handlePointerDown(e) {
        arrastando.current = { startX: e.clientX, startY: e.clientY, origem: { ...posicao } };
    }
    function handlePointerMove(e) {
        if (!arrastando.current) return;
        const dx = e.clientX - arrastando.current.startX;
        const dy = e.clientY - arrastando.current.startY;
        setPosicao({ x: arrastando.current.origem.x + dx, y: arrastando.current.origem.y + dy });
    }
    function handlePointerUp() {
        arrastando.current = null;
    }

    const larguraOverlayPx = pxPorCm ? larguraCm * pxPorCm : 0;
    const alturaOverlayPx = pxPorCm ? profundidadeCm * pxPorCm : 0;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-mare-950/90 text-areia-50">
                <div>
                    <p className="font-display">{produto.nome} · tamanho real</p>
                    <p className="text-xs text-areia-200/70">
                        {etapa === "calibrar"
                            ? "Passo 1 de 2 — calibre com um cartão"
                            : "Passo 2 de 2 — arraste o prato até a mesa"}
                    </p>
                </div>
                <button onClick={onClose} className="foco-visivel text-2xl leading-none px-2">
                    ×
                </button>
            </div>

            <div
                className="relative flex-1 overflow-hidden bg-black"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {erroCamera && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-areia-100 bg-mare-950/90">
                        {erroCamera}
                    </div>
                )}

                {streamAtivo && etapa === "calibrar" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="border-4 border-brasa-400 rounded-lg flex items-center justify-center text-xs text-areia-50 bg-brasa-400/10"
                            style={{ width: `${larguraCartaoPx}px`, height: `${larguraCartaoPx * 0.63}px` }}
                        >
                            encoste um cartão aqui
                        </div>
                    </div>
                )}

                {streamAtivo && etapa === "visualizar" && pxPorCm && (
                    <img
                        src={produto.imagem_url || undefined}
                        alt={produto.nome}
                        onPointerDown={handlePointerDown}
                        className="absolute rounded-full shadow-2xl touch-none select-none"
                        style={{
                            left: `${posicao.x}px`,
                            top: `${posicao.y}px`,
                            width: `${larguraOverlayPx}px`,
                            height: `${alturaOverlayPx}px`,
                            objectFit: "cover",
                            background: produto.imagem_url ? "transparent" : "rgba(245,115,74,0.35)",
                            cursor: "grab",
                        }}
                    >
                        {!produto.imagem_url}
                    </img>
                )}

                {streamAtivo && etapa === "visualizar" && !produto.imagem_url && (
                    <div
                        className="absolute rounded-full border-2 border-dashed border-brasa-400 flex items-center justify-center text-3xl touch-none select-none"
                        onPointerDown={handlePointerDown}
                        style={{
                            left: `${posicao.x}px`,
                            top: `${posicao.y}px`,
                            width: `${larguraOverlayPx}px`,
                            height: `${alturaOverlayPx}px`,
                            cursor: "grab",
                        }}
                    >
                        🦐
                    </div>
                )}
            </div>

            <div className="bg-mare-950/95 p-4">
                {etapa === "calibrar" ? (
                    <div className="max-w-md mx-auto flex flex-col gap-3">
                        <label className="text-xs text-areia-200/80">
                            Ajuste o quadro até ele ficar do tamanho de um cartão (crédito/débito) na tela
                        </label>
                        <input
                            type="range"
                            min="90"
                            max="320"
                            value={larguraCartaoPx}
                            onChange={(e) => setLarguraCartaoPx(Number(e.target.value))}
                            className="w-full"
                        />
                        <button
                            onClick={confirmarCalibracao}
                            disabled={!streamAtivo}
                            className="foco-visivel bg-brasa-500 hover:bg-brasa-600 disabled:opacity-40 text-mare-950 font-semibold rounded-full py-3"
                        >
                            Usar esta calibração
                        </button>
                        <p className="text-[11px] text-areia-200/50 text-center">
                            Aproximação por calibração de referência — não é uma medição de profundidade real.
                            Mantenha o celular na mesma distância da mesa depois de calibrar.
                        </p>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto flex flex-col gap-2 items-center">
                        <p className="text-xs text-areia-200/70 text-center">
                            Arraste o círculo até a posição da mesa. Medida usada: {larguraCm}cm × {profundidadeCm}cm
                            {!produto.largura_cm && " (medida padrão — o funcionário pode cadastrar a real no painel)"}
                        </p>
                        <button onClick={() => setEtapa("calibrar")} className="foco-visivel text-sm underline text-areia-200/80">
                            Recalibrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
