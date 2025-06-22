'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { useFocusTrap } from '@/config/event-manager';
import type { ContextMenuProps } from '@/types';

const contextActions = [
  { key: 'email' as const, label: 'Copy Email' },
  { key: 'url' as const, label: 'Copy Website URL' },
  { key: 'linkedin' as const, label: 'Copy LinkedIn' },
];

export function ContextMenu({ position, onAction, onClose }: ContextMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Use focus trap for accessibility
  useFocusTrap(true, containerRef);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className={`fixed z-50 ${currentTheme.overlay} backdrop-blur-xl ${currentTheme.border} border shadow-2xl`}
        style={{
          left: position.x,
          top: position.y,
          minWidth: designSystem.components.contextMenu.minWidth,
          borderRadius: designSystem.components.contextMenu.borderRadius,
          padding: designSystem.spacing.sm,
        }}
        variants={animations.contextMenu}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        data-context-menu
      >
        {contextActions.map((action) => (
          <motion.button
            key={action.key}
            onClick={() => onAction(action.key)}
            className={`
              w-full text-left rounded-lg focus:outline-none
              ${currentTheme.text}
              ${hoveredButton === action.key ? currentTheme.cardHover : ''}
            `}
            style={{
              paddingLeft: designSystem.spacing.md,
              paddingRight: designSystem.spacing.md,
              paddingTop: '10px',
              paddingBottom: '10px',
              fontSize: designSystem.typography.sm,
            }}
            onMouseEnter={() => setHoveredButton(action.key)}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {action.label}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}