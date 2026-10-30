import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gautattvaorganics.com'),
  title: 'GauTattva™ Organics | Pure A2 Gir Cow Vedic Bilona Ghee',
  description:
    'Authentic A2 Gir Cow Vedic Bilona Ghee prepared traditionally in terracotta earthen pots from grass-fed indigenous Indian Gir cows. Certified by Jagdamba Laboratories: 0% Casein, 0% Sugars, 100% Ahimsa Purity. Express shipping across India with WhatsApp AI Reorder Engine.',
  keywords: [
    'A2 Gir Cow Ghee',
    'Vedic Bilona Ghee',
    'GauTattva Organics',
    'Bilona Churned Ghee',
    'Grass fed Cow Ghee',
    'Organic Ghee Jaipur',
    'Ahimsa Ghee',
    'Zero Lactose Ghee',
  ],
  openGraph: {
    title: 'GauTattva™ Organics | Pure A2 Gir Cow Vedic Bilona Ghee',
    description:
      'Rooted in tradition, inspired by purity. Certified 100% A2 Gir Cow Vedic Bilona Ghee with 1-tap WhatsApp replenishment.',
    url: 'https://gautattvaorganics.com',
    siteName: 'GauTattva Organics',
    images: [
      {
        url: '/gautattva-logo.jpg',
        width: 800,
        height: 800,
        alt: 'GauTattva Organics Pure Vedic Bilona Ghee',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] text-[#1C1917] antialiased">
        {children}
      </body>
    </html>
  );
}
