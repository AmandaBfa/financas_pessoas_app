import Link from "next/link";
import { Wallet, PieChart, FileDown, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: PieChart,
    title: "Visão clara dos seus gastos",
    description: "Dashboard com saldo, receitas, despesas e gráficos.",
  },
  {
    icon: FileDown,
    title: "Relatórios quando precisar",
    description: "Filtre por período e exporte tudo em CSV.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados protegidos",
    description: "Cada usuário só enxerga as próprias transações.",
  },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca (apenas desktop) */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <Wallet className="h-5 w-5" />
          </div>
          Finanças Pessoais
        </Link>

        <div className="space-y-8">
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Organize sua vida financeira em um só lugar
          </h2>
          <ul className="space-y-5">
            {benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-white/80">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} Finanças Pessoais App
        </p>
      </div>

      {/* Área do formulário */}
      <div className="flex items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 flex items-center justify-center gap-2 text-lg font-bold lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            Finanças Pessoais
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
