export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date (YYYY-MM-DD)
  created_at: string;
};

export type NewTransaction = {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

export interface CategorySummary {
  category: string;
  total: number;
}

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
