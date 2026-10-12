import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-mare-800 bg-mare-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm text-areia-200/80">
                <div>
                    <p className="font-display text-lg text-areia-50 mb-2">Camarão Express</p>
                    <p>Meu Jardim Food Park — Estreito, Florianópolis/SC</p>
                </div>
                <div>
                    <p className="text-areia-50 mb-2">Encontre a gente</p>
                    <a
                        href="https://www.instagram.com/camaraoexpresstruckestreito/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-brasa-400"
                    >
                         @camaraoexpresstruckestreito
                    </a>
                </div>
                <div>
                    <p className="text-areia-50 mb-2">Equipe</p>
                    <Link to="/funcionario" className="hover:text-brasa-400">
                        Acesso do funcionário
                    </Link>
                </div>
            </div>
            <p className="text-center text-xs text-areia-200/50 pb-6">
                © {new Date().getFullYear()} Camarão Express. Feito com 🦐 no Estreito.
            </p>
        </footer>
    );
}
