import { Geist, Geist_Mono } from "next/font/google";
import { metadata, viewport, siteConfig } from "@/config/site-config";
import { analytics } from "@/config/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Theme detection script - runs immediately to prevent flash
const themeScript = `
  (function() {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    });
  })()
`;

// Google Analytics script
const GA_ID = siteConfig.analytics.googleAnalyticsId;
const analyticsScript = GA_ID ? `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}', {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
` : '';

// Analytics initialization script
const initScript = `
  window.addEventListener('load', function() {
    if (window.analytics && window.analytics.initialize) {
      window.analytics.initialize();
    }
  });
`;

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make analytics available globally for initialization script
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).analytics = analytics;
  }

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Theme detection */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        
        {/* Analytics (production only) */}
        {GA_ID && process.env.NODE_ENV === 'production' && siteConfig.features.analytics && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script dangerouslySetInnerHTML={{ __html: analyticsScript }} />
          </>
        )}
        
        {/* Analytics initialization */}
        {siteConfig.features.analytics && (
          <script dangerouslySetInnerHTML={{ __html: initScript }} />
        )}
        
        {/* Preload critical resources */}
        <link rel="preload" href={siteConfig.profile.photo} as="image" />
      </head>
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          bg-white dark:bg-black text-gray-900 dark:text-gray-100
          transition-colors duration-300
        `}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}