-- ==========================================================
-- Camarão Express — Schema PostgreSQL
-- Rode este arquivo no pgAdmin (Query Tool) dentro do banco
-- que você criar para o projeto, ex: camarao_express
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- para gen_random_uuid(), se quiser usar depois

-- ---------- FUNCIONÁRIOS (login administrativo) ----------
CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,          -- somente números
    senha_hash TEXT NOT NULL,                  -- bcrypt
    cargo VARCHAR(30) NOT NULL DEFAULT 'ATENDENTE', -- ADMIN | ATENDENTE | COZINHA
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- CATEGORIAS DO CARDÁPIO ----------
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0
);

-- ---------- PRODUTOS (itens do cardápio) ----------
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    imagem_url TEXT,                     -- foto do prato (substituir pelas fotos reais do Instagram)
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    largura_cm NUMERIC(6,2),             -- usados no visualizador "tamanho real" (AR)
    profundidade_cm NUMERIC(6,2),
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- CLIENTES (cadastro rápido antes de pedir) ----------
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL,
    nome_completo VARCHAR(150) NOT NULL,
    mesa VARCHAR(10) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);

-- ---------- CONTADOR DIÁRIO DE PEDIDOS (reseta às 23:59) ----------
-- Guarda, por dia (data_referencia), qual foi o último número usado.
-- A "virada do dia" é às 23:59, então usamos uma data de referência
-- própria em vez de CURRENT_DATE puro (ver src/jobs/resetPedidos.js).
CREATE TABLE IF NOT EXISTS contadores_pedido (
    data_referencia DATE PRIMARY KEY,
    ultimo_numero INTEGER NOT NULL DEFAULT 0
);

-- ---------- PEDIDOS ----------
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    numero_diario INTEGER NOT NULL,       -- número sequencial exibido (reseta a cada dia às 23:59)
    data_referencia DATE NOT NULL,        -- dia "operacional" ao qual o número pertence
    cliente_id INTEGER REFERENCES clientes(id),
    mesa VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RECEBIDO', -- RECEBIDO | EM_PREPARO | PRONTO | ENTREGUE | CANCELADO
    observacao TEXT,
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pedidos_data_status ON pedidos(data_referencia, status);

-- ---------- ITENS DO PEDIDO ----------
CREATE TABLE IF NOT EXISTS pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL, -- "foto" do preço no momento do pedido
    observacao VARCHAR(255)
);

-- ---------- HORÁRIO DE FUNCIONAMENTO ----------
CREATE TABLE IF NOT EXISTS horario_funcionamento (
    dia_semana SMALLINT PRIMARY KEY, -- 0=domingo ... 6=sábado
    aberto BOOLEAN NOT NULL DEFAULT TRUE,
    abre_as TIME,
    fecha_as TIME
);

-- ---------- AVISOS (mural para funcionários / clientes) ----------
CREATE TABLE IF NOT EXISTS avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    mensagem TEXT NOT NULL,
    publico BOOLEAN NOT NULL DEFAULT FALSE, -- true = aparece no site para os clientes também
    criado_por INTEGER REFERENCES funcionarios(id),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------- DADOS INICIAIS ----------
INSERT INTO categorias (nome, ordem) VALUES
    ('Camarões', 1),
    ('Porções', 2),
    ('Combos', 3),
    ('Bebidas', 4)
ON CONFLICT DO NOTHING;

INSERT INTO horario_funcionamento (dia_semana, aberto, abre_as, fecha_as) VALUES
    (0, TRUE, '18:00', '23:00'),
    (1, FALSE, NULL, NULL),
    (2, TRUE, '18:00', '23:00'),
    (3, TRUE, '18:00', '23:00'),
    (4, TRUE, '18:00', '23:30'),
    (5, TRUE, '18:00', '23:59'),
    (6, TRUE, '18:00', '23:59')
ON CONFLICT (dia_semana) DO NOTHING;

-- Funcionário admin inicial: CPF 00000000000 / senha "camarao123"
-- (o hash abaixo é só um placeholder de exemplo — gere o hash real com bcrypt
--  usando o script backend/db/gerar-hash.js antes de inserir em produção)
