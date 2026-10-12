export default function Loading({ texto = "Carregando..." }) {
    return (
        <div className="flex items-center justify-center py-16 text-areia-200/70 text-sm gap-2">
            <span className="inline-block w-4 h-4 border-2 border-brasa-400 border-t-transparent rounded-full animate-spin" />
            {texto}
        </div>
    );
}
