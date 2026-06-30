"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Inbox,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { categoryColor } from "@/lib/categories";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-background py-20 text-center text-muted-foreground">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-7 w-7 opacity-50" />
        </div>
        <div>
          <p className="font-medium text-foreground">
            Nenhuma transação encontrada
          </p>
          <p className="text-sm">
            Ajuste os filtros ou adicione uma nova transação.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="h-11">Descrição</TableHead>
            <TableHead className="h-11">Categoria</TableHead>
            <TableHead className="h-11">Data</TableHead>
            <TableHead className="h-11 text-right">Valor</TableHead>
            <TableHead className="h-11 w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const isIncome = t.type === "income";
            return (
              <TableRow key={t.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        isIncome
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
                          : "bg-red-100 text-red-600 dark:bg-red-900/40"
                      )}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {isIncome ? "Receita" : "Despesa"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="gap-1.5 font-normal text-muted-foreground"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: categoryColor(t.category) }}
                    />
                    {t.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right text-base font-bold tabular-nums",
                    isIncome ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(Number(t.amount))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-60 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(t)}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(t)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
