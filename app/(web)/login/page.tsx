// app/(web)/login/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { createWebSession } from "@/lib/webSession";
import Link from "next/link";
import Image from "next/image";

async function loginAction(formData: FormData) {
  "use server";

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent("Please enter your email and password")}`,
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  const validPassword = await comparePassword(password, user!.passwordHash!);
  if (!validPassword) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  await createWebSession(user!.id);

  if (!user!.profileComplete) {
    // Account exists (verified, password set) but onboarding was never finished
    redirect("/onboarding");
  }

  redirect("/matches");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <div style={styles.container}>
      {reset === "1" && (
        <p
          style={{
            color: "#1a7a3d",
            fontSize: 13,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Password reset successfully. Please log in.
        </p>
      )}
      <div style={styles.card}>
        <div className="flex items-center justify-center mb-4">
          <Link href="/" style={styles.brand}>
            <Image src="/logo.jpeg" alt="Subhobibaho" width={160} height={50} />
          </Link>
        </div>
        <p style={styles.tagline}>Find your perfect match</p>

        <form action={loginAction} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" required style={styles.input} />

          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            required
            style={styles.input}
          />

          <div style={styles.forgotRow}>
            <a href="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </a>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>
            Sign up
          </a>
        </p>

        <p style={styles.footerText}>
          <Link
            href={'/advisor/login'}
            style={styles.link}
          >
            Login as a Partner
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff0f3",
    fontFamily: "system-ui, sans-serif",
    backgroundImage: "url('/redbg.jpg')",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    width: 380,
    boxShadow: "0 8px 24px rgba(214,51,108,0.1)",
  },
  logo: {
    color: "#d6336c",
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    margin: 0,
  },
  tagline: {
    color: "#a56478",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#a5486a",
    marginTop: 10,
  },
  label: { fontSize: 13, fontWeight: 600, color: "#a5486a", marginTop: 12 },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    fontSize: 14,
    marginTop: 4,
  },
  forgotRow: { textAlign: "right", marginTop: 8 },
  forgotLink: {
    color: "#d6336c",
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
  },
  error: { color: "#e03131", fontSize: 13, marginTop: 12, textAlign: "center" },
  button: {
    marginTop: 20,
    padding: 13,
    borderRadius: 12,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#8a5464",
    marginTop: 14,
  },
  link: { color: "#d6336c", fontWeight: 700, textDecoration: "none" },
};
