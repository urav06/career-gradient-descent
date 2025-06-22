'use client';

import { Mail, Linkedin, Github, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { useAnalytics } from '@/config/analytics';
import type { ContactLinkProps, IconName } from '@/types';

const iconMap: Record<IconName, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail,
  Linkedin,
  Github,
  FileText,
  ExternalLink,
};

export function ContactLink({ link, compact = false, iconOnly = false }: ContactLinkProps) {
  const Icon = iconMap[link.icon];
  const isExternal = link.url.startsWith('http');
  const iconSize = compact || iconOnly ? designSystem.components.icons.md : designSystem.components.icons.lg;
  const { trackLinkClick } = useAnalytics();

  const handleClick = () => {
    trackLinkClick(link.name, link.url, isExternal);
  };

  return (
    <motion.a
      href={link.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`group flex items-center ${currentTheme.textMuted} ${currentTheme.hover.text} focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md`}
      style={{
        gap: designSystem.spacing.sm,
        padding: designSystem.spacing.xs,
        margin: `-${designSystem.spacing.xs}`,
      }}
      variants={animations.contactLink}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      data-link
      data-analytics={`link-${link.name.toLowerCase()}`}
      aria-label={`${link.name}${isExternal ? ' (opens in new tab)' : ''}`}
    >
      {Icon && (
        <motion.div
          variants={animations.iconScale}
          initial="rest"
          whileHover="hover"
        >
          <Icon size={iconSize} />
        </motion.div>
      )}
      
      {!iconOnly && (
        <span 
          className="font-medium"
          style={{
            fontSize: compact ? designSystem.typography.xs : designSystem.typography.sm
          }}
        >
          {link.name}
        </span>
      )}
    </motion.a>
  );
}