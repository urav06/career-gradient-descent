'use client';

import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import type { StatusBadgeProps } from '@/types';

export function StatusBadge({ text, color }: StatusBadgeProps) {
  const statusColors = currentTheme.status[color];

  return (
    <motion.div
      className={`inline-flex items-center rounded-full font-medium ring-1 ${statusColors.bg} ${statusColors.text} ${statusColors.ring}`}
      style={{
        paddingLeft: designSystem.spacing.md,
        paddingRight: designSystem.spacing.md,
        paddingTop: designSystem.spacing.xs2,
        paddingBottom: designSystem.spacing.xs2,
        fontSize: designSystem.typography.xs,
      }}
      variants={animations.statusBadge}
      initial="rest"
      whileHover="hover"
      role="status"
      aria-label={`Status: ${text}`}
    >
      <motion.div 
        className={`w-2 h-2 ${statusColors.dot} rounded-full`}
        style={{ marginRight: designSystem.spacing.sm }}
        variants={animations.statusDot}
        animate="pulse"
        aria-hidden="true"
      />
      <span>{text}</span>
    </motion.div>
  );
}