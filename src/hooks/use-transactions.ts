"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NewTransaction, Transaction } from "@/lib/types";

// Retorna o primeiro e o último dia de um mês "YYYY-MM"
function monthRange(month: string): { start: string; end: string } {
  const [year, m] = month.split("-").map(Number);
  const start = `${month}-01`;
  const lastDay = new Date(year, m, 0).getDate(); // dia 0 do mês seguinte
  const end = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

export function useTransactions(month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { start, end } = monthRange(month);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setTransactions([]);
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (input: NewTransaction) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");

    const { error } = await supabase
      .from("transactions")
      .insert({ ...input, user_id: user.id });
    if (error) throw new Error(error.message);
    await fetchTransactions();
  }, [fetchTransactions]);

  const updateTransaction = useCallback(
    async (id: string, input: NewTransaction) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("transactions")
        .update(input)
        .eq("id", id);
      if (error) throw new Error(error.message);
      await fetchTransactions();
    },
    [fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      await fetchTransactions();
    },
    [fetchTransactions]
  );

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
