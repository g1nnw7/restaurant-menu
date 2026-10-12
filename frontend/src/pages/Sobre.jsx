export default function Sobre() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            <p className="uppercase tracking-widest text-brasa-400 text-xs mb-3">A franquia</p>
            <h1 className="font-display text-3xl sm:text-4xl text-areia-50 mb-6">
                Do carrinho de rua ao food park: a história do Camarão Express
            </h1>

            <div className="prose prose-invert prose-p:text-areia-200/80 max-w-none space-y-4 text-areia-200/80 leading-relaxed">
                <p>
                    O Camarão Express nasceu da vontade simples de servir camarão bem feito, na medida certa e
                    sem enrolação — do jeito que se come na beira do cais, mas com a praticidade de um food truck.
                    Cada unidade da rede funciona dentro de food parks, ocupando aquele espaço de encontro entre
                    amigos, mesas compartilhadas e cardápios variados.
                </p>
                <p>
                    Aqui no Meu Jardim Food Park, no Estreito, a proposta é a mesma: camarão fresco, porções para
                    dividir e um atendimento rápido para quem quer aproveitar a noite sem perder tempo esperando.
                    Do pedido feito na mesa até a chegada do prato, cada etapa foi pensada para ser simples — inclusive
                    a forma de pedir, direto pelo celular.
                </p>
                <p>
                    Este texto é um ponto de partida: a equipe pode editá-lo a qualquer momento no painel
                    administrativo para contar a história real da unidade, com fotos e detalhes do
                    <a
                        href="https://www.instagram.com/camaraoexpresstruckestreito/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-brasa-400 hover:underline"
                    >
                        {" "}Instagram @camaraoexpresstruckestreito
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
