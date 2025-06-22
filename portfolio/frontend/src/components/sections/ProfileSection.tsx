'use client';

import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ContactLink } from '@/components/ui/ContactLink';
import type { ProfileSectionProps } from '@/types';

export function ProfileSection({ profile, status, links }: ProfileSectionProps) {
  return (
    <motion.section 
      className="relative"
      style={{
        paddingTop: designSystem.spacing.xxl,
        paddingBottom: designSystem.spacing.xl,
      }}
      variants={animations.staggerContainer}
      initial="hidden"
      animate="visible"
      data-analytics="profile"
    >
      <div className="mx-auto px-6 sm:px-8 lg:px-12" style={{ maxWidth: designSystem.layout.maxWidth }}>
        
        {/* Single responsive layout with equal column heights */}
        <div className="grid md:grid-cols-[auto_1fr] md:items-center gap-8 md:gap-12">
          
          {/* Photo and status column */}
          <motion.div 
            className="flex flex-col items-center md:items-start"
            variants={animations.slideUp}
          >
            <div className="flex flex-col items-center md:items-start">
              <ProfilePhoto
                src={profile.photo}
                alt={`${profile.name}'s profile photo`}
                size="lg"
              />
              
              <div 
                className="text-center md:text-left"
                style={{
                  marginTop: designSystem.spacing.lg,
                  gap: designSystem.spacing.md,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {status?.enabled && (
                  <StatusBadge text={status.text} color={status.color} />
                )}
                <div 
                  className={`flex items-center justify-center md:justify-start ${currentTheme.textMuted}`}
                  style={{ 
                    gap: designSystem.spacing.sm,
                    fontSize: designSystem.typography.sm
                  }}
                >
                  <MapPin size={designSystem.components.icons.sm} />
                  <span className="font-medium">{profile.location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content column */}
          <div 
            className="text-center md:text-left"
            style={{ gap: designSystem.spacing.lg, display: 'flex', flexDirection: 'column' }}
          >
            <motion.header 
              style={{ gap: designSystem.spacing.md, display: 'flex', flexDirection: 'column' }}
              variants={animations.slideUp}
            >
              <h1 
                className={`font-bold tracking-tight bg-gradient-to-r ${currentTheme.gradients.heading} bg-clip-text text-transparent`}
                style={{ fontSize: designSystem.typography['4xl'] }}
              >
                {profile.name}
              </h1>
              <p 
                className={`${currentTheme.textMuted} font-medium leading-relaxed`}
                style={{ fontSize: designSystem.typography.xl }}
              >
                {profile.title}
              </p>
            </motion.header>
            
            <motion.p 
              className={`${currentTheme.text} leading-normal max-w-2xl`}
              style={{ fontSize: designSystem.typography.base }}
              variants={animations.slideUp}
            >
              {profile.bio}
            </motion.p>
            
            <motion.nav 
              className="flex flex-wrap justify-center md:justify-start" 
              style={{
                gap: designSystem.spacing.lg,
                paddingTop: designSystem.spacing.sm
              }}
              variants={animations.staggerContainer}
            >
              {links.map((link) => (
                <motion.div key={link.name} variants={animations.slideUp}>
                  <ContactLink link={link} />
                </motion.div>
              ))}
            </motion.nav>
          </div>
          
        </div>
      </div>
    </motion.section>
  );
}