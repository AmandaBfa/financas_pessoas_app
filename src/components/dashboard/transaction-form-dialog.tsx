"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewTransaction, Transaction, TransactionType } from "@/lib/types";
import { categoriesForType, categoryColor } from "@/lib/categories";
import { todayValue } from "@/lib/utils";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (input: NewTransaction) => Promise<void>;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction);

  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayValue());
  const [submitting, setSubmitting] = useState(false);

  // Sincroniza o formulário sempre que abrir ou trocar a transação editada
  useEffect(() => {
    if (open) {
      if (transaction) {
        setType(transaction.type);
        setDescription(transaction.description);
        setAmount(String(transaction.amount));
        setCategory(transaction.category);
        setDate(transaction.date);
      } else {
        setType("expense");
        setDescription("");
        setAmount("");
        setCategory("");
        setDate(todayValue());
      }
    }
  }, [open, transaction]);

  // Ao trocar o tipo, limpa categoria incompatível
  function handleTypeChange(value: string) {
    const newType = value as TransactionType;
    setType(newType);
    const valid = categoriesForType(newType).some((c) => c.name === category);
    if (!valid) setCategory("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedAmount = Number(amount.replace(",", "."));
    if (!description.trim()) {
      toast.error("Informe uma descrição.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }
    if (!category) {
      toast.error("Selecione uma categoria.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
      });
      toast.success(
        isEditing ? "Transação atualizada!" : "Transação adicionada!"
      );
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro ao salvar", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const categoryOptions = categoriesForType(type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da {type === "income" ? "receita" : "despesa"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                onClick={() => handleTypeChange("expense")}
                className={
                  type === "expense"
                    ? "bg-red-600 hover:bg-red-700"
                    : "text-muted-foreground"
                }
              >
                <ArrowDownRight className="h-4 w-4" />
                Despesa
              </Button>
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                onClick={() => handleTypeChange("income")}
                className={
                  type === "income"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "text-muted-foreground"
                }
              >
                <ArrowUpRight className="h-4 w-4" />
                Receita
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="pl-9 font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: categoryColor(c.name) }}
                      />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
