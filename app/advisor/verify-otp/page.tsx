// app/advisor/verify-otp/page.tsx
import VerifyOtpForm from './VerifyOtpForm'

export default async function AdvisorVerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const { email, error } = await searchParams
  if (!email) return <p>Missing email. Please register again.</p>
  return <VerifyOtpForm email={email} error={error} />
}