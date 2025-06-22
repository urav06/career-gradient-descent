'use client';

import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { ContactLink } from '@/components/ui/ContactLink';
import type { HeaderProps } from '@/types';

export function Header({ profile, links, isVisible }: HeaderProps) {
  const headerLinks = links.filter(link => 
    ['Email', 'LinkedIn', 'GitHub', 'Resume'].includes(link.name)
  );

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 ${currentTheme.overlay} backdrop-blur-xl ${currentTheme.borderMuted} border-b`}
      style={{ height: designSystem.layout.headerHeight }}
      variants={animations.header}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      aria-hidden={!isVisible}
    >
      <div 
        className="mx-auto px-6 sm:px-8 lg:px-12 h-full" 
        style={{ maxWidth: designSystem.layout.maxWidth }}
      >
        <div className="flex items-center justify-between h-full">
          
          {/* Profile info */}
          <motion.div 
            className="flex items-center" 
            style={{ gap: designSystem.spacing.md }}
            variants={animations.slideUp}
          >
            <ProfilePhoto
              src={profile.photo}
              alt="Profile"
              size="sm"
            />
            <div>
              <h1 
                className={`font-semibold ${currentTheme.text}`}
                style={{ fontSize: designSystem.typography.sm }}
              >
                {profile.name}
              </h1>
              <p 
                className={currentTheme.textMuted}
                style={{ fontSize: designSystem.typography.xs }}
              >
                {profile.title}
              </p>
            </div>
          </motion.div>

          {/* Contact links - icon only */}
          <motion.nav 
            className="hidden min-[500px]:flex items-center"
            style={{ gap: designSystem.spacing.lg }}
            variants={animations.staggerContainer}
            aria-label="Contact links"
          >
            {headerLinks.map((link) => (
              <motion.div key={link.name} variants={animations.slideUp}>
                <ContactLink link={link} iconOnly />
              </motion.div>
            ))}
          </motion.nav>
          
        </div>
      </div>
    </motion.header>
  );
}