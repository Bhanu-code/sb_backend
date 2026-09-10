// app/(web)/layout.tsx
import { getWebSessionUser, clearWebSession } from "@/lib/webSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CompleteProfileBanner from "@/components/CompleteProfileBanner";

async function logoutAction() {
  "use server";
  await clearWebSession();
  redirect("/login");
}

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getWebSessionUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff0f3",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {user && (
        <nav style={styles.nav}>
          <Link href="/matches" style={styles.brand}>
            <Image src="/logo.jpeg" alt="Subhobibaho" width={100} height={40} />
          </Link>

          <div style={styles.linksGroup}>
            <Link href="/search" style={styles.link}>
              Search
            </Link>

            <Link href="/matches" style={styles.link}>
              Matches
            </Link>
            <Link href="/interests" style={styles.link}>
              Interests
            </Link>
            <Link href="/profile" style={styles.link}>
              Profile
            </Link>
            <Link href="/chat" style={styles.link}>
              Chat
            </Link>
            <Link href="/settings" style={styles.link}>
              Settings
            </Link>
            
            
          </div>

          <div style={styles.rightGroup}>
            {user.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt="" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {(user.fullName ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <form action={logoutAction}>
              <button type="submit" style={styles.logoutButton}>
                Log Out
              </button>
            </form>
          </div>
        </nav>
      )}

      {user && <CompleteProfileBanner />}

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
    fontSize: 18,
    textDecoration: "none",
    letterSpacing: 0.3,
  },
  linksGroup: { display: "flex", gap: 28 },
  link: {
    color: "#5c2a3a",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
  rightGroup: { display: "flex", alignItems: "center", gap: 14 },
  avatar: { width: 32, height: 32, borderRadius: 16, objectFit: "cover" },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fce8ee",
    color: "#d6336c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
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
