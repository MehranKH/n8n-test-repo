"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { PasswordField } from "@/components/ui/password-field"
import { TextField } from "@/components/ui/text-field"

/**
 * فرم ورود به حساب کاربری — ساخته‌شده با کامپوننت‌های Digdesign.
 *
 * - فیلد شماره موبایل با ارقام فارسی (خودِ Input مقدار لاتین تحویل می‌دهد)
 * - فیلد رمز عبور با دکمهٔ نمایش/پنهان‌کردن داخلی PasswordField
 * - گزینهٔ «مرا به خاطر بسپار» و لینک «فراموشی رمز عبور»
 * - دکمهٔ ورود با حالت بارگذاری (loading)
 *
 * فقط برای دمو است: در handleSubmit به‌جای تایمر، درخواست واقعی ورود به
 * سرور (مثلاً با fetch یا react-query) ارسال می‌شود.
 */
export function LoginForm() {
  const [mobile, setMobile] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    // در پروژهٔ واقعی اینجا درخواست ورود به سرور ارسال می‌شود.
    setSubmitting(true)
    window.setTimeout(() => setSubmitting(false), 1200)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
        <CardDescription>
          برای ادامه، شماره موبایل و رمز عبور خود را وارد کنید.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            label="شماره موبایل"
            type="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            autoComplete="tel"
            name="mobile"
            value={mobile}
            onValueChange={setMobile}
            required
          />

          <PasswordField
            label="رمز عبور"
            placeholder="رمز عبور خود را وارد کنید"
            autoComplete="current-password"
            name="password"
            value={password}
            onValueChange={setPassword}
            required
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
              />
              <Label htmlFor="remember" className="font-normal text-muted-foreground">
                مرا به خاطر بسپار
              </Label>
            </div>
            <Link href="#" size="sm" underline="hover">
              فراموشی رمز عبور؟
            </Link>
          </div>

          <Button type="submit" size="lg" fullWidth loading={submitting}>
            ورود به حساب
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link href="#" size="sm">
            ثبت‌نام کنید
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
