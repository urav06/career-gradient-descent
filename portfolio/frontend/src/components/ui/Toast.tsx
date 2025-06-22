'use client';

import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import type { ToastProps } from '@/types';

export function Toast({ toast, onRemove }: ToastProps) {
  return (
    <motion.div
      className={`${currentTheme.toast.bg} backdrop-blur-sm ${currentTheme.toast.text} font-medium shadow-xl cursor-pointer ${currentTheme.toast.border} border`}
      style={{
        paddingLeft: designSystem.spacing.md,
        paddingRight: designSystem.spacing.md,
        paddingTop: designSystem.spacing.sm,
        paddingBottom: designSystem.spacing.sm,
        borderRadius: designSystem.components.cards.borderRadius,
        fontSize: designSystem.typography.sm,
      }}
      variants={animations.toast}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onRemove(toast.id)}
    >
      {toast.message}
    </motion.div>
  );
}