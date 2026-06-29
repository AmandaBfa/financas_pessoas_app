import { TransactionType } from "./types";

export interface CategoryDef {
  name: string;
  type: TransactionType | "both";
  color: string;
}

// Categorias pré-definidas do app
export const CATEGORIES: CategoryDef[] = [
  { name: "Alimentação", type: "expense", color: "#ef4444" },
  { name: "Transporte", type: "expense", color: "#f97316" },
  { name: "Moradia", type: "expense", color: "#eab308" },
  { name: "Lazer", type: "expense", color: "#a855f7" },
  { name: "Saúde", type: "expense", color: "#ec4899" },
  { name: "Educação", type: "expense", color: "#06b6d4" },
  { name: "Salário", type: "income", color: "#22c55e" },
  { name: "Freelance", type: "income", color: "#10b981" },
  { name: "Outros", type: "both", color: "#64748b" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function categoriesForType(type: TransactionType): CategoryDef[] {
  return CATEGORIES.filter((c) => c.type === type || c.type === "both");
}

export function categoryColor(name: string): string {
  return CATEGORIES.find((c) => c.name === name)?.color ?? "#64748b";
}
