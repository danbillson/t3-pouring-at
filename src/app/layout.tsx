import { Header } from "~/components/ui/header";
import { Providers } from "./providers";
import { Footer } from "~/components/ui/footer";
import { type Metadata } from "next";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Pouring at",
  description: "Find your favourite and best beers near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
