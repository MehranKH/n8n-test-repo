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
import { Link } from "@/components/ui/link"
import { PasswordField } from "@/components/ui/password-field"
import { TextField } from "@/components/ui/text-field"

export type RegisterFormValues = {
  fullName: string
  mobile: string
  password: string
}

type RegisterFormProps = {
  /** وقتی همهٔ فیلدها معتبر بودند با مقدارهای نهایی صدا زده می‌شود. */
  onSubmit?: (values: RegisterFormValues) => void
  /** نشانی صفحهٔ قوانین و مقررات. */
  termsHref?: string
  /** نشانی صفحهٔ ورود. */
  loginHref?: string
}

/** شمارهٔ موبایل ایران: ۰۹ + ۹ رقم. */
const MOBILE_PATTERN = /^09\d{9}$/

/**
 * فرم «ساخت حساب کاربری»: نام، شماره موبایل، رمز عبور (با قدرت و شرط‌ها)،
 * تکرار رمز و پذیرش قوانین. فیلد موبایل با faDigits ارقام فارسی را می‌پذیرد و
 * مقدار لاتین (۰۹۱۲...) بیرون می‌دهد.
 */
export function RegisterForm({
  onSubmit,
  termsHref = "#",
  loginHref = "#",
}: RegisterFormProps) {
  const [fullName, setFullName] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [passwordConfirm, setPasswordConfirm] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const trimmedName = fullName.trim()
  const nameError = !trimmedName
    ? "نام و نام خانوادگی را وارد کنید."
    : trimmedName.length < 3
      ? "نام باید دست‌کم ۳ نویسه باشد."
      : undefined

  const normalizedMobile = mobile.trim()
  const mobileError = !normalizedMobile
    ? "شماره موبایل را وارد کنید."
    : !MOBILE_PATTERN.test(normalizedMobile)
      ? "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد."
      : undefined

  const passwordError = !password ? "رمز عبور را وارد کنید." : undefined

  const confirmTouched = submitted || passwordConfirm.length > 0
  const confirmError = !passwordConfirm
    ? submitted
      ? "تکرار رمز عبور را وارد کنید."
      : undefined
    : passwordConfirm !== password
      ? "تکرار رمز عبور با رمز عبور یکسان نیست."
      : undefined

  const termsError = !acceptedTerms
    ? "پذیرش قوانین برای ثبت‌نام الزامی است."
    : undefined

  const hasError = Boolean(
    nameError || mobileError || passwordError || confirmError || termsError,
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (hasError) return
    onSubmit?.({
      fullName: trimmedName,
      mobile: normalizedMobile,
      password,
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ساخت حساب کاربری</CardTitle>
        <CardDescription>برای شروع، اطلاعات زیر را وارد کنید.</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-5">
          <TextField
            label="نام و نام خانوادگی"
            required
            placeholder="مثلاً امیر محمدی"
            value={fullName}
            onValueChange={setFullName}
            autoComplete="name"
            invalid={submitted && Boolean(nameError)}
            errorMessage={submitted ? nameError : undefined}
          />

          <TextField
            label="شماره موبایل"
            required
            type="tel"
            faDigits
            maxLength={11}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            value={mobile}
            onValueChange={setMobile}
            autoComplete="tel"
            invalid={submitted && Boolean(mobileError)}
            errorMessage={submitted ? mobileError : undefined}
          />

          <PasswordField
            label="رمز عبور"
            required
            revealToggle
            strength
            requirements
            placeholder="یک رمز عبور قوی بسازید"
            autoComplete="new-password"
            value={password}
            onValueChange={setPassword}
            invalid={submitted && Boolean(passwordError)}
            errorMessage={submitted ? passwordError : undefined}
          />

          <PasswordField
            label="تکرار رمز عبور"
            required
            revealToggle
            placeholder="دوباره رمز عبور را بنویسید"
            autoComplete="new-password"
            value={passwordConfirm}
            onValueChange={setPasswordConfirm}
            invalid={Boolean(confirmError) && confirmTouched}
            errorMessage={confirmTouched ? confirmError : undefined}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="accept-terms"
                className="mt-0.5"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                invalid={submitted && Boolean(termsError)}
              />
              <label
                htmlFor="accept-terms"
                className="text-sm leading-6 text-muted-foreground"
              >
                <Link href={termsHref} underline="hover">
                  قوانین و مقررات
                </Link>
                {" "}را می‌پذیرم
              </label>
            </div>
            {submitted && termsError ? (
              <p role="alert" className="text-xs text-destructive">
                {termsError}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" size="lg" fullWidth>
            ثبت‌نام
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            قبلاً حساب دارید؟{" "}
            <Link href={loginHref} underline="hover">
              ورود
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterForm
