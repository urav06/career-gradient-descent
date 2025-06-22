'use client';

import { motion } from 'framer-motion';
import { Cpu, Github } from 'lucide-react';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';

export function ChessPage() {
  return (
    <ProjectLayout 
      title="Chess Engine" 
      description="AI-powered chess engine with multiple difficulty levels and learning algorithms"
    >
      <div className={`${currentTheme.card} rounded-lg border ${currentTheme.border}`} 
           style={{ padding: designSystem.components.cards.padding }}>
        
        <motion.div 
          className="text-center"
          style={{ gap: designSystem.spacing.lg, display: 'flex', flexDirection: 'column' }}
          variants={animations.staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={animations.slideUp}>
            <Cpu size={48} className={`mx-auto ${currentTheme.textMuted}`} />
          </motion.div>
          
          <motion.div 
            style={{ gap: designSystem.spacing.md, display: 'flex', flexDirection: 'column' }}
            variants={animations.slideUp}
          >
            <h2 
              className={`font-semibold ${currentTheme.text}`}
              style={{ fontSize: designSystem.typography.xl }}
            >
              Coming Soon
            </h2>
            <p 
              className={`${currentTheme.textMuted} max-w-md mx-auto`}
              style={{ fontSize: designSystem.typography.base }}
            >
              I&apos;m working on bringing the chess engine to the web. Soon you&apos;ll be able to play against 
              different AI opponents right here in your browser.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            style={{ gap: designSystem.spacing.lg }}
            variants={animations.slideUp}
          >
            <a
              href="https://github.com/uravmaniar/chess-engine"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center ${currentTheme.accent} hover:underline`}
              style={{ gap: designSystem.spacing.sm }}
            >
              <Github size={designSystem.components.icons.md} />
              <span>View on GitHub</span>
            </a>
          </motion.div>
          
          <motion.div 
            className={`${currentTheme.backgroundMuted} rounded-md`}
            style={{ padding: designSystem.spacing.md }}
            variants={animations.slideUp}
          >
            <p 
              className={`${currentTheme.textSubtle} text-center`}
              style={{ fontSize: designSystem.typography.sm }}
            >
              <strong>Current features:</strong> MinMax algorithm, Neural network board evaluation, 
              Q-learning reinforcement learning agent (in progress)
            </p>
          </motion.div>
        </motion.div>
      </div>
    </ProjectLayout>
  );
}