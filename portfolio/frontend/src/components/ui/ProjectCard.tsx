'use client';

import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { useAnalytics } from '@/config/analytics';
import type { ProjectCardProps } from '@/types';

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const analyticsId = `project-${project.name.toLowerCase().replace(/\s+/g, '-')}`;
  const primaryUrl = project.demoUrl || project.githubUrl;
  const { trackProjectInteraction } = useAnalytics();
  
  const isInternalUrl = (url: string) => url.startsWith('/');
  
  const handleCardClick = () => {
    if (primaryUrl) {
      trackProjectInteraction(project.name, 'card_click', primaryUrl);
      
      if (isInternalUrl(primaryUrl)) {
        router.push(primaryUrl);
      } else {
        window.open(primaryUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleLinkClick = (url: string, type: 'demo' | 'github') => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      trackProjectInteraction(project.name, `${type}_click`, url);
      
      if (isInternalUrl(url)) {
        router.push(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };
  };

  return (
    <motion.article
      className={`
        group relative overflow-hidden cursor-pointer
        ${currentTheme.card}
        ${currentTheme.border}
        ${currentTheme.hover.border}
      `}
      style={{
        padding: designSystem.components.cards.padding,
        borderRadius: designSystem.components.cards.borderRadius,
      }}
      variants={animations.cardHover}
      initial="rest"
      whileHover="hover"
      onClick={handleCardClick}
      data-analytics={analyticsId}
    >
      {/* Subtle gradient overlay on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradients.card} pointer-events-none`}
        style={{ borderRadius: designSystem.components.cards.borderRadius }} 
      />
      
      <div className="relative z-10 space-y-4">
        <h3 
          className={`font-semibold ${currentTheme.text} group-hover:text-blue-600 dark:group-hover:text-blue-400`}
          style={{ fontSize: designSystem.typography.lg }}
        >
          {project.name}
        </h3>
        
        <p 
          className={`${currentTheme.textMuted} leading-relaxed`}
          style={{ fontSize: designSystem.typography.sm }}
        >
          {project.description}
        </p>
        
        {/* Tech stack */}
        <div className="flex flex-wrap" style={{ gap: designSystem.spacing.sm }}>
          {project.techStack.map((tech) => (
            <motion.span
              key={tech}
              className={`font-medium rounded-md ${currentTheme.tech.bg} ${currentTheme.tech.text} ${currentTheme.tech.hover}`}
              style={{
                paddingLeft: designSystem.spacing.sm,
                paddingRight: designSystem.spacing.sm,
                paddingTop: designSystem.spacing.xs,
                paddingBottom: designSystem.spacing.xs,
                fontSize: designSystem.typography.xs,
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Action links */}
        {(project.demoUrl || project.githubUrl) && (
          <div className="flex" style={{ gap: designSystem.spacing.lg }}>
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                className={`inline-flex items-center font-medium ${currentTheme.accent}`}
                style={{ 
                  gap: designSystem.spacing.xs2,
                  fontSize: designSystem.typography.xs
                }}
                target={isInternalUrl(project.demoUrl) ? undefined : "_blank"}
                rel={isInternalUrl(project.demoUrl) ? undefined : "noopener noreferrer"}
                onClick={handleLinkClick(project.demoUrl, 'demo')}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExternalLink size={designSystem.components.icons.xs} />
                </motion.div>
                <span>Demo</span>
              </motion.a>
            )}
            
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                className={`inline-flex items-center font-medium ${currentTheme.textMuted} ${currentTheme.hover.text}`}
                style={{ 
                  gap: designSystem.spacing.xs2,
                  fontSize: designSystem.typography.xs
                }}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick(project.githubUrl, 'github')}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Github size={designSystem.components.icons.xs} />
                </motion.div>
                <span>GitHub</span>
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}