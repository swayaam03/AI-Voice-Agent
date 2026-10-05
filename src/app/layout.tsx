import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura Skincare | AI Voice Customer Support',
  description: 'Browser-based real-time voice customer support agent for Aura Skincare.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fbfaf8] text-[#222521] antialiased">
        {children}
      </body>
    </html>
  );
}
