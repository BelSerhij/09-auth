
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Providers from "../components/TanStackProvider/TanStackProvider";
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import AuthProvider from "../components/AuthProvider/AuthProvider";

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Notes application built with Next.js',
   openGraph: {
      title: `NoteHub`,
      description: 'Notes application built with Next.js',
      url: 'https://08-zustand-wine-nine.vercel.app',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub`,
        },
      ],
      type: 'website',
    },
};
export const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['100', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <Providers>
          <AuthProvider>
            <Header />
              <main>{children}</main>
              {modal}
            <Footer />
        </AuthProvider>
      </Providers>
      </body>
    </html>
  );
}