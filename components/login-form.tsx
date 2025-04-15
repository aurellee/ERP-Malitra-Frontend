"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/AuthContext"
import { useState } from "react"
import { ErrorState } from "@/types/types"
import authApi from "@/api/authApi"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const emptyForm = {
    email: "",
    password: ""
  }

  const emptyError: ErrorState = {
    email: null,
    password: null
  }

  const { login, logout } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<ErrorState>(emptyError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loginApi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      login(form);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-white dark:bg-[#000] text-theme", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginApi}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
