// app/advisor/layout.tsx
import { getWebSessionUser, clearWebSession } from "@/lib/webSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


async function logoutAction() {
  "use server";
  await clearWebSession();
  redirect("/advisor/login");
}

export default async function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getWebSessionUser();
  const isAdvisor =
    user && (user.role === "advisor" || user.role === "master_agent");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff0f3",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {isAdvisor && (
        <nav style={styles.nav}>
          {/* <Link href="/advisor/dashboard" style={styles.brand}>Subhobibaho Partners</Link> */}
          <div className="flex items-center justify-center mb-4">
            <Link href="/advisor/dashboard" style={styles.brand}>
              <Image
                src="/logo.jpeg"
                alt="Subhobibaho"
                width={100}
                height={40}
              />
            </Link>
          </div>
          <div style={styles.linksGroup}>
            <Link href="/advisor/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link href="/advisor/earnings" style={styles.link}>
              Earnings
            </Link>
            <Link href="/advisor/network" style={styles.link}>
              My Network
            </Link>
            <Link href="/advisor/profile" style={styles.link}>
              Profile
            </Link>
          </div>
          <form action={logoutAction}>
            <button type="submit" style={styles.logoutButton}>
              Log Out
            </button>
          </form>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #f6c6d4",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: {
    color: "#d6336c",
    fontWeight: 800,
    fontSize: 17,
    textDecoration: "none",
  },
  linksGroup: { display: "flex", gap: 26 },
  link: {
    color: "#5c2a3a",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
  logoutButton: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #f6c6d4",
    backgroundColor: "#ffffff",
    color: "#e03131",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
};
