"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileDown,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useTransactions } from "@/hooks/use-transactions";
import { currentMonthValue, formatCurrency, monthLabel } from "@/lib/utils";
import { NewTransaction, Transaction } from "@/lib/types";
import { CATEGORY_NAMES } from "@/lib/categories";
import { transactionsToCsv, downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { TransactionFormDialog } from "@/components/dashboard/transaction-form-dialog";

const ALL_CATEGORIES = "all";

export default function TransactionsPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(month);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesCategory =
        categoryFilter === ALL_CATEGORIES || t.category === categoryFilter;
      const matchesSearch =
        !query || t.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [transactions, search, categoryFilter]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    }
    return { income, expense, balance: income - expense };
  }, [filtered]);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction);
    setFormOpen(true);
  }

  async function handleSubmit(input: NewTransaction) {
    if (editing) {
      await updateTransaction(editing.id, input);
    } else {
      await addTransaction(input);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await deleteTransaction(deleting.id);
      toast.success("Transação excluída.");
      setDeleting(null);
    } catch (err) {
      toast.error("Erro ao excluir", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setDeletingLoading(false);
    }
  }

  function handleExport() {
    if (filtered.length === 0) {
      toast.error("Nada para exportar", {
        description: "Não há transações com os filtros atuais.",
      });
      return;
    }
    const csv = transactionsToCsv(filtered);
    downloadCsv(`transacoes-${month}.csv`, csv);
    toast.success("CSV exportado!");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas de {monthLabel(month)}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="search" className="text-xs">
                Buscar
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="month-filter" className="text-xs">
                Período
              </Label>
              <Input
                id="month-filter"
                type="month"
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value || currentMonthValue())
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>
                    Todas as categorias
                  </SelectItem>
                  {CATEGORY_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="w-full rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Saldo do filtro: </span>
                <span
                  className={
                    totals.balance >= 0
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {formatCurrency(totals.balance)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <p className="text-sm text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "transação encontrada"
              : "transações encontradas"}
          </p>
          <TransactionsTable
            transactions={filtered}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        </>
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editing}
        onSubmit={handleSubmit}
      />

      {/* Confirmação de exclusão */}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir transação?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. A transação{" "}
              <span className="font-medium text-foreground">
                {deleting?.description}
              </span>{" "}
              será removida permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingLoading}
            >
              {deletingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
