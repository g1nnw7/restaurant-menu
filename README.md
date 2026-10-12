# Camarão Express — site + pedidos + painel administrativo

Projeto completo do site do **Camarão Express** (food truck no Meu Jardim Food
Park, Estreito — Florianópolis/SC): apresentação do restaurante, cardápio com
pedidos pela mesa, visualizador de prato em "tamanho real" pela câmera, e um
painel para os funcionários administrarem tudo isso.

```
camarao-express/
├── backend/     API em Node/Express, padrão MVC, PostgreSQL
└── frontend/    React + Vite + Tailwind
```

## ⚠️ Leia antes de tudo — fotos e cardápio do Instagram

Eu **não consegui extrair fotos nem o cardápio real do Instagram**
`@camaraoexpresstruckestreito`: o Instagram bloqueia acesso automatizado a
perfis, e mesmo que fosse possível, eu não deveria copiar fotos que são
propriedade do restaurante para dentro do código. Também não achei o cardápio
dessa unidade indexado em sites como iFood ou Google.

Por isso:
- O cardápio vem com **campos prontos** (`imagem_url`, `largura_cm`,
  `profundidade_cm`) para vocês colarem as fotos e medidas reais pelo próprio
  painel administrativo (`/admin/cardapio`) — não precisa mexer no banco na mão.
- Enquanto isso, os pratos aparecem com um emoji de camarão no lugar da foto.
- O texto da página "A franquia" é um rascunho genérico — editem com a
  história real da unidade.

## Como rodar

### 1. Banco de dados (PostgreSQL / pgAdmin)

1. Crie um banco chamado `camarao_express` (pode ser pelo pgAdmin mesmo).
2. Abra o Query Tool nesse banco e rode o conteúdo de `backend/db/schema.sql`.
3. Crie o funcionário admin (senha já sai criptografada em bcrypt):
   ```bash
   cd backend
   cp .env.example .env    # ajuste usuário/senha do Postgres se precisar
   npm install
   node db/seed-admin.js "Seu Nome" 12345678900 suaSenhaForte
   ```

### 2. Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

O site já abre responsivo para celular (é o layout padrão) e se adapta para
telas maiores automaticamente.

## Como funciona cada funcionalidade pedida

- **Cardápio completo** (`/cardapio`): nome, descrição, preço, quantidade e
  filtro por categoria. Editável em `/admin/cardapio`.
- **Ver prato em tamanho real**: abre a câmera do celular e pede pra calibrar
  o zoom encostando um cartão de crédito/débito num quadro na tela (todo
  cartão tem 8,56 cm de largura, então isso vira a régua). Depois disso, o
  prato aparece sobreposto na câmera do tamanho real, e dá pra arrastar até a
  posição da mesa. **Importante**: isso é uma aproximação por calibração de
  referência, não uma medição de profundidade real (isso exigiria hardware
  tipo LiDAR, que a maioria dos celulares não tem) — mas funciona bem se o
  celular ficar na mesma distância da mesa depois de calibrado.
- **Painel do funcionário** (`/funcionario` → `/admin`): pedidos em tempo
  quase real (atualiza a cada 8s), edição de cardápio, horário de
  funcionamento e avisos.
- **Cadastro do cliente**: CPF, nome completo e mesa, pedido logo em seguida
  no `/checkout`. Ao confirmar, aparece bem grande o número do pedido.
- **Numeração sequencial dos pedidos**: cada pedido recebe um número que
  reseta **exatamente às 23:59** todo dia (não à meia-noite) — a lógica está
  em `backend/src/utils/dataReferencia.js` e é recalculada a cada pedido, então
  funciona mesmo se o servidor reiniciar no meio do dia.
- **Login de funcionário**: CPF + senha, token JWT, só quem tem conta de
  funcionário acessa `/admin` (clientes nem veem o link).
- **Extra que adicionei por conta própria**: cargos de funcionário
  (`ADMIN`/`ATENDENTE`/`COZINHA`) — só ADMIN pode gerenciar outros
  funcionários — e um botão de "destaque" nos produtos pra escolher o que
  aparece na home.

## Próximos passos sugeridos

- Trocar os textos de exemplo (home, "A franquia") pelo conteúdo real.
- Subir as fotos dos pratos (pode usar qualquer link de imagem por enquanto,
  inclusive um serviço como Cloudinary/Imgur, direto no campo "URL da foto").
- Se quiser pedidos aparecendo pro cliente em tempo real (sem precisar ficar
  atualizando a página), dá pra trocar o polling do painel por WebSockets
  (`socket.io`) depois — deixei a estrutura pronta pra isso.
