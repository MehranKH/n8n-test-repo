"use client"

import * as React from "react"

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { PasswordField } from "@/components/ui/password-field"
import { TextField } from "@/components/ui/text-field"

/* ------------------------------------------------------------------ *
 * نوع‌ها و منطق اعتبارسنجی سادهٔ ورود
 * ------------------------------------------------------------------ */

type LoginValues = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {}

  const email = values.email.trim()
  if (!email) {
    errors.email = "ایمیل الزامی است."
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "یک ایمیل معتبر وارد کنید."
  }

  if (!values.password) {
    errors.password = "رمز عبور الزامی است."
  }

  return errors
}

/** شبیه‌سازی درخواست ورود؛ این نسخه صرفاً فرانت‌اند است. */
async function simulateLogin(_payload: LoginValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
}

/* ------------------------------------------------------------------ *
 * کامپوننت فرم ورود (با لینک ثبت‌نام)
 * ------------------------------------------------------------------ */

type SubmitStatus = "idle" | "submitting" | "success" | "error"

const INITIAL_VALUES: LoginValues = {
  email: "",
  password: "",
}

export function LoginForm() {
  const [values, setValues] = React.useState<LoginValues>(INITIAL_VALUES)
  const [errors, setErrors] = React.useState<LoginErrors>({})
  const [status, setStatus] = React.useState<SubmitStatus>("idle")
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const isSuccess = status === "success"

  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const updateField = (field: keyof LoginValues) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => {
      if (!(field in previous)) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting" || isSuccess) return

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")
    setSubmitError(null)

    try {
      await simulateLogin(values)
      if (mountedRef.current) setStatus("success")
    } catch {
      if (!mountedRef.current) return
      setStatus("error")
      setSubmitError("ورود انجام نشد؛ لطفاً دوباره تلاش کنید.")
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>خوش آمدید</CardTitle>
          <CardDescription>با موفقیت وارد حساب خود شدید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert color="success">
            <AlertIcon />
            <AlertTitle>ورود موفق</AlertTitle>
            <AlertDescription>
              شما وارد حساب کاربری خود شده‌اید.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ورود به حساب کاربری</CardTitle>
        <CardDescription>ایمیل و رمز عبور خود را وارد کنید.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          {status === "error" && submitError && (
            <Alert color="destructive">
              <AlertIcon />
              <AlertTitle>خطا در ورود</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <TextField
            label="ایمیل"
            name="email"
            type="email"
            autoComplete="email"
            required
            invalid={Boolean(errors.email)}
            errorMessage={errors.email}
            value={values.email}
            onValueChange={updateField("email")}
            placeholder="you@example.com"
          />

          <PasswordField
            label="رمز عبور"
            name="password"
            autoComplete="current-password"
            required
            invalid={Boolean(errors.password)}
            errorMessage={errors.password}
            value={values.password}
            onValueChange={updateField("password")}
          />

          <Button
            type="submit"
            fullWidth
            loading={status === "submitting"}
            className="mt-2"
          >
            ورود
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1">
        <span className="text-sm text-muted-foreground">
          حساب کاربری ندارید؟
        </span>
        <Link href="/register" size="sm">
          ثبت‌نام کنید
        </Link>
      </CardFooter>
    </Card>
  )
}
