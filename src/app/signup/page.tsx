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

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Senha muito curta", {
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      toast.error("Não foi possível criar a conta", {
        description: msg.includes("rate limit")
          ? "Muitas tentativas de envio de e-mail. Aguarde alguns minutos e tente novamente."
          : msg.includes("already registered") || msg.includes("already been registered")
            ? "Este e-mail já está cadastrado. Tente entrar."
            : error.message,
      });
      setLoading(false);
      return;
    }

    // Se a confirmação de e-mail estiver ativada, não há sessão imediata
    if (data.session) {
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.success("Confira seu e-mail", {
        description: "Enviamos um link de confirmação para ativar sua conta.",
      });
      router.push("/login");
    }
  }

  return (
    <AuthLayout>
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>
            Comece a organizar suas finanças gratuitamente.
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
                  placeholder="Mínimo de 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
