"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Traduz os erros de login do Supabase para mensagens claras
function loginErrorMessage(error: { message: string; code?: string }): {
  title: string;
  description: string;
} {
  const msg = error.message?.toLowerCase() ?? "";
  if (error.code === "email_not_confirmed" || msg.includes("not confirmed")) {
    return {
      title: "E-mail ainda não confirmado",
      description:
        "Confirme seu e-mail pelo link enviado na sua caixa de entrada antes de entrar.",
    };
  }
  if (error.code === "invalid_credentials" || msg.includes("invalid login")) {
    return {
      title: "E-mail ou senha incorretos",
      description: "Verifique os dados e tente novamente.",
    };
  }
  if (msg.includes("rate limit")) {
    return {
      title: "Muitas tentativas",
      description: "Aguarde alguns instantes antes de tentar novamente.",
    };
  }
  return {
    title: "Não foi possível entrar",
    description: error.message,
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const { title, description } = loginErrorMessage(error);
      toast.error(title, { description });
      setLoading(false);
      return;
    }

    toast.success("Bem-vindo de volta!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout>
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Acesse sua conta para gerenciar suas finanças.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
