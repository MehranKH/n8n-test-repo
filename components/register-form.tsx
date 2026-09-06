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
 * نوع‌ها و منطق اعتبارسنجی (فقط سمت کلاینت)
 * ------------------------------------------------------------------ */

type RegisterValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {}

  const fullName = values.fullName.trim()
  if (!fullName) {
    errors.fullName = "نام و نام خانوادگی الزامی است."
  } else if (fullName.length < 3) {
    errors.fullName = "نام و نام خانوادگی باید حداقل ۳ نویسه باشد."
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = "ایمیل الزامی است."
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "یک ایمیل معتبر وارد کنید."
  }

  if (!values.password) {
    errors.password = "رمز عبور الزامی است."
  } else if (values.password.length < 8) {
    errors.password = "رمز عبور باید حداقل ۸ نویسه باشد."
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "تکرار رمز عبور الزامی است."
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "تکرار رمز عبور با رمز عبور یکسان نیست."
  }

  return errors
}

/** شبیه‌سازی درخواست ثبت‌نام؛ این نسخه صرفاً فرانت‌اند است. */
async function simulateRegister(_payload: RegisterValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900))
}

/* ------------------------------------------------------------------ *
 * کامپوننت فرم ثبت‌نام
 * ------------------------------------------------------------------ */

type SubmitStatus = "idle" | "submitting" | "success" | "error"

const INITIAL_VALUES: RegisterValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export function RegisterForm() {
  const [values, setValues] = React.useState<RegisterValues>(INITIAL_VALUES)
  const [errors, setErrors] = React.useState<RegisterErrors>({})
  const [status, setStatus] = React.useState<SubmitStatus>("idle")
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const isSuccess = status === "success"

  // بعد از موفقیت، ارسالِ دوباره ممکن نباشد و با unmount هم setState نزنیم.
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const updateField =
    (field: keyof RegisterValues) => (value: string) => {
      setValues((previous) => ({ ...previous, [field]: value }))
      // به‌محض ویرایش یک فیلد نامعتبر، خطای همان فیلد پاک می‌شود تا بازخورد
      // اعتبارسنجی زنده و روان بماند.
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
      await simulateRegister(values)
      if (mountedRef.current) setStatus("success")
    } catch {
      if (!mountedRef.current) return
      setStatus("error")
      setSubmitError("ثبت‌نام انجام نشد؛ لطفاً دوباره تلاش کنید.")
    }
  }

  // حالت موفقیت: فرم کامل می‌شود و فقط پیام موفقیت و لینک ورود می‌ماند.
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>حساب شما ساخته شد</CardTitle>
          <CardDescription>به جمع کاربران خوش آمدید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert color="success">
            <AlertIcon />
            <AlertTitle>ثبت‌نام با موفقیت انجام شد</AlertTitle>
            <AlertDescription>
              حساب شما آماده است؛ حالا می‌توانید وارد شوید.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login">وارد شوید</Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ساخت حساب کاربری</CardTitle>
        <CardDescription>برای شروع، اطلاعات خود را وارد کنید.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          {status === "error" && submitError && (
            <Alert color="destructive">
              <AlertIcon />
              <AlertTitle>خطا در ثبت‌نام</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <TextField
            label="نام و نام خانوادگی"
            name="fullName"
            autoComplete="name"
            required
            invalid={Boolean(errors.fullName)}
            errorMessage={errors.fullName}
            value={values.fullName}
            onValueChange={updateField("fullName")}
            placeholder="مثلاً علی رضایی"
          />

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
            autoComplete="new-password"
            required
            description="حداقل ۸ نویسه"
            invalid={Boolean(errors.password)}
            errorMessage={errors.password}
            value={values.password}
            onValueChange={updateField("password")}
          />

          <PasswordField
            label="تکرار رمز عبور"
            name="confirmPassword"
            autoComplete="new-password"
            required
            invalid={Boolean(errors.confirmPassword)}
            errorMessage={errors.confirmPassword}
            value={values.confirmPassword}
            onValueChange={updateField("confirmPassword")}
          />

          <Button
            type="submit"
            fullWidth
            loading={status === "submitting"}
            className="mt-2"
          >
            ثبت‌نام
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1">
        <span className="text-sm text-muted-foreground">
          قبلاً حساب کاربری ساخته‌اید؟
        </span>
        <Link href="/login" size="sm">
          وارد شوید
        </Link>
      </CardFooter>
    </Card>
  )
}
