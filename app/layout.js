import "./globals.css";
import Providers from "../components/SessionProvider";

export const metadata = {
  title: "Local Labour Connect",
  description:
    "Local Labour Connect is a platform for connecting daily wage labourers with local contractors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
