"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { categoryColor } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // Agrupa despesas por categoria
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + Number(t.amount));
  }

  const data = Array.from(totals.entries())
    .map(([category, total]) => ({
      name: category,
      value: total,
      color: categoryColor(category),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-primary" />
          Despesas por Categoria
        </CardTitle>
        <CardDescription>
          Distribuição dos seus gastos no período selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <PieIcon className="mb-2 h-10 w-10 opacity-30" />
            Nenhuma despesa registrada neste período.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            {/* Donut com total no centro */}
            <div className="relative h-[260px] w-full max-w-[260px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                      fontSize: "0.875rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Rótulo central */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  Total gasto
                </span>
                <span className="text-xl font-bold">
                  {formatCurrency(total)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.length}{" "}
                  {data.length === 1 ? "categoria" : "categorias"}
                </span>
              </div>
            </div>

            {/* Legenda com barras de proporção */}
            <div className="w-full flex-1 space-y-3">
              {data.map((entry) => {
                const pct = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <div key={entry.name} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {formatCurrency(entry.value)}
                        </span>
                        <span className="w-10 text-right text-xs text-muted-foreground">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: entry.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
