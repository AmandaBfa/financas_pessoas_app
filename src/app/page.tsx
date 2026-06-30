import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Filter,
  PiggyBank,
  ShieldCheck,
  Wallet,
  FileDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Controle de Transações",
    description:
      "Registre receitas e despesas com categoria, data e descrição. Edite ou exclua quando quiser.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Visual",
    description:
      "Veja receita total, despesa total e saldo do mês, com gráfico de pizza por categoria.",
  },
  {
    icon: Filter,
    title: "Busca e Filtros",
    description:
      "Filtre por mês, ano e categoria. Busque transações pela descrição em segundos.",
  },
  {
    icon: FileDown,
    title: "Exportar CSV",
    description:
      "Exporte suas transações filtradas em formato .csv para análise em planilhas.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro e Privado",
    description:
      "Autenticação via Supabase e Row Level Security: você só vê os seus próprios dados.",
  },
  {
    icon: PiggyBank,
    title: "Planejamento",
    description:
      "Acompanhe para onde vai o seu dinheiro e tome decisões financeiras melhores.",
  },
];

function DashboardPreview() {
  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl">
      {/* Card de saldo */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-5 text-white">
        <p className="flex items-center gap-2 text-xs font-medium text-white/80">
          <Wallet className="h-3.5 w-3.5" /> Saldo do mês
        </p>
        <p className="mt-1 text-3xl font-bold">R$ 1.670,00</p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] text-white/80">
            <span>63% da receita gasta</span>
            <span>R$ 2.830 de R$ 4.500</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-[63%] rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Mini cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border-l-4 border-l-emerald-500 bg-background p-3">
          <p className="text-[11px] text-muted-foreground">Receita</p>
          <p className="flex items-center gap-1 text-lg font-bold text-emerald-600">
            <TrendingUp className="h-4 w-4" /> R$ 4.500
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-l-red-500 bg-background p-3">
          <p className="text-[11px] text-muted-foreground">Despesa</p>
          <p className="flex items-center gap-1 text-lg font-bold text-red-600">
            <TrendingDown className="h-4 w-4" /> R$ 2.830
          </p>
        </div>
      </div>

      {/* Linha de transação */}
      <div className="mt-4 space-y-2">
        {[
          { name: "Salário", cat: "Salário", value: "+R$ 4.500", up: true },
          { name: "Supermercado", cat: "Alimentação", value: "-R$ 420", up: false },
        ].map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-lg border bg-background p-2.5"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  t.up
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {t.up ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.cat}</p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${
                t.up ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {t.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Finanças Pessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20" />
        <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start text-left">
            <div className="mb-4 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
              💰 Sua vida financeira organizada em um só lugar
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Controle suas finanças de forma{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                simples e visual
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Registre receitas e despesas, categorize seus gastos e acompanhe
              um dashboard completo com gráficos. Chega de planilhas dispersas e
              anotações avulsas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Começar agora <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Tudo que você precisa para organizar seu dinheiro
            </h2>
            <p className="mt-3 text-muted-foreground">
              Funcionalidades pensadas para dar clareza total sobre sua vida
              financeira.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-none shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <Card className="overflow-hidden border-none">
          <CardContent className="flex flex-col items-center gap-6 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 py-14 text-center text-white">
            <h2 className="max-w-2xl text-3xl font-bold">
              Comece a organizar suas finanças hoje mesmo
            </h2>
            <p className="max-w-xl text-white/80">
              É grátis e leva menos de um minuto para criar sua conta.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Criar conta grátis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Finanças Pessoais App</span>
          <span>Feito com Next.js, Supabase e shadcn/ui</span>
        </div>
      </footer>
    </div>
  );
}
