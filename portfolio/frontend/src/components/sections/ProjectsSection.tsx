'use client';

import { motion } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { ProjectCard } from '@/components/ui/ProjectCard';
import type { ProjectsSectionProps } from '@/types';

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <motion.section 
      className="space-y-8"
      variants={animations.staggerContainer}
      initial="hidden"
      animate="visible"
      data-analytics="projects"
    >
      <motion.header variants={animations.slideUp}>
        <h2 
          className={`font-semibold bg-gradient-to-r ${currentTheme.gradients.heading} bg-clip-text text-transparent`}
          style={{ fontSize: designSystem.typography['2xl'] }}
        >
          Featured Work
        </h2>
        <p 
          className={currentTheme.textMuted}
          style={{ 
            marginTop: designSystem.spacing.sm,
            fontSize: designSystem.typography.base
          }}
        >
          Open source projects and experiments
        </p>
      </motion.header>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 auto-rows-fr"
        style={{ gap: designSystem.spacing.lg }}
        variants={animations.staggerContainer}
      >
        {projects.map((project) => (
          <motion.div key={project.name} variants={animations.slideUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}