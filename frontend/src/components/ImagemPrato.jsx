export default function ImagemPrato({ produto, className = "" }) {
    if (produto?.imagem_url) {
        return (
            <img
                src={produto.imagem_url}
                alt={produto.nome}
                className={`object-cover ${className}`}
                loading="lazy"
            />
        );
    }

    // placeholder até a foto real (do Instagram do restaurante) ser cadastrada no painel
    return (
        <div
            className={`flex items-center justify-center bg-gradient-to-br from-mare-800 to-mare-700 text-4xl ${className}`}
            title="Foto do prato ainda não cadastrada"
        >
            🦐
        </div>
    );
}
