# 💰 Finanças Pessoais App

Web app de gestão financeira pessoal: registre receitas e despesas, categorize seus gastos e acompanhe um dashboard visual com gráficos. Construído com **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Recharts** e **Supabase**.

## ✨ Funcionalidades

- **Login e Autenticação** — Supabase Auth (e-mail/senha) com proteção de rotas.
- **Dashboard** — Cards de Receita Total, Despesa Total e Saldo + gráfico de pizza por categoria.
- **CRUD de Transações** — Criar, editar e excluir receitas/despesas (descrição, valor, data, tipo, categoria).
- **Categorias** — Pré-definidas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário, Freelance, Outros.
- **Busca e Filtros** — Por mês/ano, por categoria e busca por descrição.
- **Exportar CSV** — Exporta as transações filtradas em `.csv` (compatível com Excel).
- **Responsivo** — Layout adaptável para desktop e mobile.
- **Landing Page** — Página inicial de apresentação.
- **Segurança** — Row Level Security: cada usuário só acessa as próprias transações.

## 🧱 Stack

| Camada        | Tecnologia                                  |
| ------------- | ------------------------------------------- |
| Frontend      | Next.js 14, React 18, TypeScript            |
| UI            | Tailwind CSS, shadcn/ui, lucide-react       |
| Gráficos      | Recharts                                    |
| Backend/BaaS  | Supabase (PostgreSQL + Auth + RLS)          |
| Notificações  | sonner (toasts)                             |
| Deploy        | Vercel                                      |

## 🚀 Como rodar localmente

### 1. Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Uma conta gratuita no [Supabase](https://supabase.com)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o Supabase

1. Crie um novo projeto no painel do Supabase.
2. Vá em **SQL Editor** e execute o conteúdo do arquivo [`supabase-schema.sql`](./supabase-schema.sql). Isso cria a tabela `transactions`, os índices e as políticas de Row Level Security.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.

### 4. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 5. (Opcional) Confirmação de e-mail

Por padrão, o Supabase exige confirmação de e-mail no cadastro. Para testar mais rápido em desenvolvimento, desative em **Authentication → Sign In / Providers → Email → "Confirm email"**. Se mantiver ativado, o usuário receberá um link de confirmação antes de conseguir entrar.

### 6. Rodar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 📦 Scripts

| Comando         | Descrição                          |
| --------------- | ---------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção                  |
| `npm run start` | Inicia o servidor de produção      |
| `npm run lint`  | Verifica o código com ESLint       |

## ☁️ Deploy na Vercel

1. Suba o código para um repositório no GitHub.
2. Importe o projeto na [Vercel](https://vercel.com).
3. Em **Settings → Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. No painel do Supabase, em **Authentication → URL Configuration**, adicione a URL da Vercel em **Site URL** e **Redirect URLs** (ex.: `https://seu-app.vercel.app/auth/callback`).
5. Deploy! 🚀

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Login
│   ├── signup/                   # Cadastro
│   ├── auth/callback/route.ts    # Callback de confirmação de e-mail
│   └── dashboard/
│       ├── layout.tsx            # Shell autenticado (nav + sair)
│       ├── page.tsx              # Dashboard (cards + gráfico)
│       └── transactions/page.tsx # CRUD, filtros, busca, CSV
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   └── dashboard/                # Cards, gráfico, tabela, formulário
├── hooks/
│   └── use-transactions.ts       # Busca e CRUD de transações
├── lib/
│   ├── supabase/                 # Clients (browser, server, middleware)
│   ├── categories.ts             # Categorias pré-definidas
│   ├── csv.ts                    # Exportação CSV
│   ├── types.ts                  # Tipos + tipagem do banco
│   └── utils.ts                  # Formatação (moeda, data)
└── middleware.ts                 # Proteção de rotas / sessão
```

## 🔒 Segurança

Todas as operações de dados passam pelo Supabase com **Row Level Security** ativado. As políticas garantem que cada usuário só pode ler, inserir, atualizar e excluir transações onde `user_id = auth.uid()`. A chave usada no frontend é a `anon key` (pública), segura para exposição no cliente.
