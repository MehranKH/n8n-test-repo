"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { PasswordField } from "@/components/ui/password-field"
import { TextField } from "@/components/ui/text-field"
import { UserIcon } from "@/components/icons"

/**
 * فرم ورود فارسی با کامپوننت‌های دیگ.
 *
 * - آیکون user داخل startContent فیلدِ شناسه نشسته (ادغام‌شده با خودِ
 *   TextField، نه جدا کنار آن).
 * - PasswordField خودش دکمهٔ نمایش/پنهان رمز (eye-show/eye-off) را دارد؛
 *   برای همین آیکون قفل اضافه‌ای به‌صورت دستی ساخته نشده است.
 * - Checkbox با آیکون داخلی check و Label برای «مرا به خاطر بسپار».
 */
export function LoginForm() {
  const [account, setAccount] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    // اعتبارسنجی سادهٔ سمت کلاینت
    if (!account.trim() || !password) {
      setError("شماره موبایل یا ایمیل و رمز عبور را وارد کنید.")
      return
    }

    setSubmitting(true)
    try {
      // اینجا سرویس ورود پروژه‌ات را صدا بزن، مثلاً:
      // await signIn({ account: account.trim(), password, remember })
      await new Promise((resolve) => setTimeout(resolve, 1200))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
          <CardDescription>
            برای ادامه، شماره موبایل یا ایمیل و رمز عبور خود را وارد کنید.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="flex flex-col gap-5">
            {error && (
              <p
                role="alert"
                className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <TextField
              label="شماره موبایل یا ایمیل"
              placeholder="۰۹۱۲××××××× یا example@mail.com"
              value={account}
              onValueChange={setAccount}
              startContent={<UserIcon className="text-muted-foreground" />}
              autoComplete="username"
              required
            />

            <PasswordField
              label="رمز عبور"
              placeholder="••••••••"
              value={password}
              onValueChange={setPassword}
              revealToggle
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">
                  مرا به خاطر بسپار
                </Label>
              </div>
              <Link href="/auth/forgot-password" size="sm" underline="hover">
                فراموشی رمز عبور؟
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              fullWidth
              loading={submitting}
              className="mt-1"
            >
              ورود به حساب
            </Button>
          </CardContent>
        </form>

        <CardContent className="flex items-center justify-center gap-1 border-t pt-6 text-sm text-muted-foreground">
          حساب کاربری ندارید؟
          <Link href="/auth/register" underline="hover">
            ساخت حساب جدید
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
