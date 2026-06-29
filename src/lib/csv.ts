import { Transaction } from "./types";

function escapeCsv(value: string): string {
  // Envolve em aspas e escapa aspas internas se houver caractere especial
  if (/[";\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.category,
    t.type === "income" ? "Receita" : "Despesa",
    Number(t.amount).toFixed(2).replace(".", ","),
  ]);

  const lines = [header, ...rows].map((cols) =>
    cols.map((c) => escapeCsv(String(c))).join(";")
  );

  // BOM para acentuação correta no Excel
  return "﻿" + lines.join("\r\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
