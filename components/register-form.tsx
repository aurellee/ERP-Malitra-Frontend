"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorRegisterState } from "@/types/types";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<ErrorRegisterState>({
    username: null,
    email: null,
    password: null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || isAuthenticated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register(form);
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setErrorMessage("Registration failed. Please check your inputs.");
      } else if (err?.response?.status === 409) {
        setErrorMessage("User already exists.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter a username, email, and password to register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
