"use client";

import { Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expense: number;
  incomeCount: number;
  expenseCount: number;
}

function plural(n: number) {
  return n === 1 ? "lançamento" : "lançamentos";
}

export function SummaryCards({
  income,
  expense,
  incomeCount,
  expenseCount,
}: SummaryCardsProps) {
  const balance = income - expense;
  const positive = balance >= 0;

  // Percentual da receita que já foi gasto
  const spentPct =
    income > 0
      ? Math.min(100, (expense / income) * 100)
      : expense > 0
        ? 100
        : 0;

  return (
    <div className="space-y-4">
      {/* Card de Saldo em destaque (gradiente) */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Wallet className="h-4 w-4" />
                Saldo do mês
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {formatCurrency(balance)}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Receita menos despesa no período
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold backdrop-blur",
                positive ? "bg-white/20" : "bg-red-900/40"
              )}
            >
              {positive ? "No azul" : "No vermelho"}
            </span>
          </div>

          {/* Barra de proporção: quanto da receita já foi gasto */}
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/80">
              <span>{spentPct.toFixed(0)}% da receita gasta</span>
              <span>{formatCurrency(expense)} de {formatCurrency(income)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${spentPct}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Receita e Despesa */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Receita Total
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {formatCurrency(income)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {incomeCount} {plural(incomeCount)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Despesa Total
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {formatCurrency(expense)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {expenseCount} {plural(expenseCount)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40">
              <ArrowDownRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
