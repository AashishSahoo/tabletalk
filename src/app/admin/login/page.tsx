"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/utils/validators";
import { loginAdmin } from "@/lib/api/auth";
import { handleError } from "@/lib/utils/errorHandler";
import { ADMIN_TOKEN_KEY } from "@/lib/utils/constants";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as "email" | "password"] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await loginAdmin(parsed.data);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
      router.replace("/admin/dashboard");
    } catch (error) {
      const appError = handleError("AdminLogin:submit", error);
      toast.error(appError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="ticket-card w-full max-w-sm p-6 pt-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-ivory">
            <Icon icon="mdi:qrcode-scan" width={22} height={22} />
          </span>
          <h1 className="font-display text-xl text-ink">Admin console</h1>
          <p className="text-sm text-ink-muted">Sign in to manage your restaurants</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@restaurant.com"
          />
          <div className="relative">
            <Input
              label="Password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              className="absolute right-3 top-9 rounded p-1 text-ink-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-saffron-500/60"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
            >
              <Icon icon={isPasswordVisible ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={20} height={20} />
            </button>
          </div>
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
}
