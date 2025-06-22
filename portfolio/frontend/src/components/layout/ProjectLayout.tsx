'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { Header } from '@/components/sections/Header';
import { siteConfig } from '@/config/site-config';
import { useScroll } from '@/hooks/useScroll';

interface ProjectLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function ProjectLayout({ children, title, description }: ProjectLayoutProps) {
  const { isScrolled } = useScroll();

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Reuse existing header */}
      <Header 
        profile={siteConfig.profile}
        links={siteConfig.links}
        isVisible={isScrolled}
      />
      
      {/* Main content */}
      <main 
        className="mx-auto px-6 sm:px-8 lg:px-12" 
        style={{ 
          maxWidth: designSystem.layout.maxWidth,
          paddingTop: `calc(${designSystem.layout.headerHeight} + ${designSystem.spacing.xl})`,
          paddingBottom: designSystem.spacing.xxl
        }}
      >
        <motion.div
          variants={animations.staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ gap: designSystem.spacing.xl, display: 'flex', flexDirection: 'column' }}
        >
          {/* Back to home link */}
          <motion.div variants={animations.slideUp}>
            <Link 
              href="/"
              className={`inline-flex items-center ${currentTheme.textMuted} ${currentTheme.hover.text} transition-colors duration-200`}
              style={{ gap: designSystem.spacing.sm }}
            >
              <ArrowLeft size={designSystem.components.icons.md} />
              <span className="font-medium">Back to portfolio</span>
            </Link>
          </motion.div>

          {/* Project header */}
          <motion.header 
            style={{ gap: designSystem.spacing.md, display: 'flex', flexDirection: 'column' }}
            variants={animations.slideUp}
          >
            <h1 
              className={`font-bold tracking-tight ${currentTheme.text}`}
              style={{ fontSize: designSystem.typography['4xl'] }}
            >
              {title}
            </h1>
            <p 
              className={`${currentTheme.textMuted} leading-normal max-w-2xl`}
              style={{ fontSize: designSystem.typography.lg }}
            >
              {description}
            </p>
          </motion.header>
          
          {/* Page content */}
          <motion.div variants={animations.slideUp}>
            {children}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}