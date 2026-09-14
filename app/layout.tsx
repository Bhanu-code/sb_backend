import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Subhobibaho — Find Your Perfect Life Partner",
  description:
    "Join thousands of families who trust Subhobibaho to find meaningful, lasting matches through verified profiles and thoughtful matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div className="flex items-center justify-center mb-4">
            <Link href="/" style={styles.brand}>
              <Image
                src="/logo.jpeg"
                alt="Subhobibaho"
                width={160}
                height={50}
              />
            </Link>
          </div>
          <div style={styles.footerBrandCol}>
            <span style={styles.footerBrand}>Subhobibaho Pvt. Ltd.</span>
            <p style={styles.footerTagline}>
              Helping families find meaningful matches since day one.
            </p>
            <div style={styles.socialRow}>
              {/* <a href="#" aria-label="Facebook" style={styles.socialIcon}><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" style={styles.socialIcon}><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" style={styles.socialIcon}><Twitter size={18} /></a>
              <a href="#" aria-label="YouTube" style={styles.socialIcon}><Youtube size={18} /></a> */}
            </div>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Company</p>
            <a href="/about" style={styles.footerLink}>
              About Us
            </a>
            <a href="/contact" style={styles.footerLink}>
              Contact
            </a>
            <a href="/careers" style={styles.footerLink}>
              Careers
            </a>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Account</p>
            <a href="/login" style={styles.footerLink}>
              Log In
            </a>
            <a href="/register" style={styles.footerLink}>
              Sign Up
            </a>
            <a href="/forgot-password" style={styles.footerLink}>
              Forgot Password
            </a>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Legal</p>
            <a href="/privacy" style={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="/terms-of-service" style={styles.footerLink}>
              Terms of Service
            </a>
            <a href="/user-policy" style={styles.footerLink}>
              User Policy
            </a>
            <a href="/refund-policy" style={styles.footerLink}>
              Refund & Cancellation Policy
            </a>
            <a href="/disclaimer" style={styles.footerLink}>
              Disclaimer
            </a>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
            © {new Date().getFullYear()} Subhobibaho. All rights reserved.
          </p>
        </div>
      </footer>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #f6c6d4",
    padding: "48px 40px 24px",
  },
  footerTop: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, 1.5fr) repeat(4, 1fr)",
    gap: 32,
    maxWidth: 1100,
    margin: "0 auto",
    paddingBottom: 32,
  },
  footerBrandCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  footerBrand: { color: "#d6336c", fontWeight: 800, fontSize: 18 },
  footerTagline: {
    fontSize: 13,
    color: "#8a5464",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: 240,
  },
  socialRow: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  socialIcon: {
    color: "#8a5464",
    transition: "color 0.2s",
    textDecoration: "none",
  },
  footerCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  footerColTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "#d6336c",
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 13,
    color: "#8a5464",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  footerBottom: {
    borderTop: "1px solid #f6c6d4",
    paddingTop: 16,
    textAlign: "center" as const,
  },
  footerCopyright: {
    fontSize: 12,
    color: "#8a5464",
    margin: 0,
  },
};
