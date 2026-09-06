import { Button } from "@/components/ui/button"

/**
 * دکمهٔ تایید بدون آیکون
 *
 * بر پایهٔ کامپوننت Button دیزاین‌سیستم دیگ ساخته شده:
 * - واریانت default + رنگ primary: پس‌زمینهٔ توپُر با کنتراست درست
 * - type="submit": به‌عنوان دکمهٔ تایید/ثبت داخل فرم
 * - بدون آیکون: طبق درخواست کاربر هیچ SVG/آیکونی داخل دکمه نیست
 *
 * استفاده:
 * <ConfirmButton />
 */
export function ConfirmButton() {
  return (
    <Button type="submit" variant="default" color="primary" radius="md">
      تایید
    </Button>
  )
}
