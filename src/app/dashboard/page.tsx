"use client";

import { useMemo, useState } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";

import { useTransactions } from "@/hooks/use-transactions";
import { currentMonthValue, monthLabel } from "@/lib/utils";
import { NewTransaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { TransactionFormDialog } from "@/components/dashboard/transaction-form-dialog";

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [formOpen, setFormOpen] = useState(false);
  const { transactions, loading, error, addTransaction } =
    useTransactions(month);

  const { income, expense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    }
    return { income, expense };
  }, [transactions]);

  async function handleAdd(input: NewTransaction) {
    await addTransaction(input);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumo de {monthLabel(month)}.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="month" className="text-xs text-muted-foreground">
              Período
            </Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value || currentMonthValue())}
              className="w-[170px]"
            />
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Erro ao carregar transações: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <SummaryCards income={income} expense={expense} />
          <CategoryPieChart transactions={transactions} />
        </>
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleAdd}
      />
    </div>
  );
}
