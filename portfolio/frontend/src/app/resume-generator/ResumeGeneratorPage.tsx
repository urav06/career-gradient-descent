'use client';

import { motion } from 'framer-motion';
import { FileText, Github, Download } from 'lucide-react';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import { currentTheme, designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';

export function ResumeGeneratorPage() {
  return (
    <ProjectLayout 
      title="Resume Generator" 
      description="YAML to ATS-friendly PDF conversion tool with customizable templates"
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
            <FileText size={48} className={`mx-auto ${currentTheme.textMuted}`} />
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
              I&apos;m building a web interface for the resume generator. Soon you&apos;ll be able to create 
              beautiful, ATS-friendly resumes from YAML directly in your browser.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center"
            style={{ gap: designSystem.spacing.lg }}
            variants={animations.slideUp}
          >
            <a
              href="https://github.com/uravmaniar/resume-generator"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center ${currentTheme.accent} hover:underline`}
              style={{ gap: designSystem.spacing.sm }}
            >
              <Github size={designSystem.components.icons.md} />
              <span>View on GitHub</span>
            </a>
            
            <a
              href="/resume.pdf"
              className={`inline-flex items-center ${currentTheme.textMuted} ${currentTheme.hover.text} hover:underline`}
              style={{ gap: designSystem.spacing.sm }}
            >
              <Download size={designSystem.components.icons.md} />
              <span>Download my resume</span>
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
              <strong>Current features:</strong> YAML to PDF conversion, LaTeX templating system, 
              ATS optimization, version control for resumes
            </p>
          </motion.div>
        </motion.div>
      </div>
    </ProjectLayout>
  );
}