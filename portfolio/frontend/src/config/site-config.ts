import type { Metadata, Viewport } from "next";

// Site content and configuration - single source of truth
export const siteConfig = {
  // Personal profile information
  profile: {
    name: "Urav Maniar",
    title: "Data Scientist & Software Engineer", 
    bio: "I'm a systems thinker who loves building things that work. My path has taken me from designing cloud infrastructure to exploring machine learning research, always looking for that sweet spot where engineering meets innovation. I enjoy bringing people together around interesting problems and diving deep into research that genuinely excites me. Whether it's a production system or a new algorithm, I'm drawn to turning messy, complex challenges into something elegant and useful.",
    location: "Melbourne, Australia",
    photo: "/profile.jpg",
  },

  // Availability status
  status: {
    enabled: true,
    text: "Available Jan 2026",
    color: "green" as const,
  },

  // Contact links
  links: [
    {
      name: "Email",
      url: "mailto:urav06@gmail.com",
      icon: "Mail" as const,
    },
    {
      name: "LinkedIn", 
      url: "https://www.linkedin.com/in/urav/",
      icon: "Linkedin" as const,
    },
    {
      name: "GitHub",
      url: "https://github.com/urav06", 
      icon: "Github" as const,
    },
    {
      name: "Resume",
      url: "/resume.pdf",
      icon: "FileText" as const,
    },
  ],

  // Featured projects
  projects: [
    {
      name: "Chess Engine",
      description: "AI-powered chess engine with multiple difficulty levels and learning algorithms",
      techStack: ["Python", "NumPy", "Machine Learning"],
      demoUrl: "/chess",
      githubUrl: "https://github.com/urav06/chess",
    },
    {
      name: "Resume Generator", 
      description: "YAML to ATS-friendly PDF conversion tool with customizable templates",
      techStack: ["Python", "Flask", "LaTeX"],
      demoUrl: "/resume-generator",
      githubUrl: "https://github.com/urav06/career-gradient-descent/tree/master/resume-factory",
    },
  ],

  // SEO and metadata
  metadata: {
    title: "Urav Maniar - Data Scientist & Software Engineer",
    description: "Data scientist and software engineer specializing in machine learning, distributed systems, and cost optimization.",
    keywords: [
      "data science", 
      "machine learning", 
      "software engineering", 
      "Python", 
      "Monash University"
    ],
    siteUrl: "https://urav-maniar.com",
    ogImage: "/og-image.jpg",
  },

  // Analytics and tracking
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },

  // Feature toggles
  features: {
    contextMenu: true,
    keyboardShortcuts: true,
    analytics: true,
    darkMode: true,
  }
} as const;

// Next.js metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.metadata.siteUrl),
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  keywords: siteConfig.metadata.keywords as unknown as string[],
  authors: [{ name: siteConfig.profile.name }],
  creator: siteConfig.profile.name,
  publisher: siteConfig.profile.name,
  robots: "index, follow",
  openGraph: {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    type: "website",
    locale: "en_US",
    url: siteConfig.metadata.siteUrl,
    siteName: `${siteConfig.profile.name} Portfolio`,
    images: [
      {
        url: siteConfig.metadata.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.metadata.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    images: [siteConfig.metadata.ogImage],
  },
  alternates: {
    canonical: siteConfig.metadata.siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};