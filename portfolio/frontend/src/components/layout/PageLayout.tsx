'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { currentTheme, designSystem } from '@/config/design-system';
import { siteConfig } from '@/config/site-config';
import { useScroll } from '@/hooks/useScroll';
import { useEventManager, useDocumentClick } from '@/config/event-manager';
import { useAnalytics } from '@/config/analytics';
import { Header } from '@/components/sections/Header';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { Toast } from '@/components/ui/Toast';
import type { ContextMenu as ContextMenuType, Toast as ToastType } from '@/types';

export function PageLayout() {
  const { isScrolled } = useScroll();
  const { trackCopyAction } = useAnalytics();
  
  // State management
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuType | null>(null);

  // Toast management
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast = { id, message };
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  // Clipboard operations
  const copyToClipboard = useCallback(async (text: string, message = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
      trackCopyAction(message.split(' ')[0].toLowerCase(), true, text);
    } catch {
      showToast('Failed to copy');
      trackCopyAction('clipboard', false);
    }
  }, [showToast, trackCopyAction]);

  // Action handlers for event manager
  const copyEmail = useCallback(() => {
    const emailLink = siteConfig.links.find(l => l.name === 'Email');
    if (emailLink) {
      const email = emailLink.url.replace('mailto:', '');
      copyToClipboard(email, 'Email copied!');
    }
  }, [copyToClipboard]);

  const copyUrl = useCallback(() => {
    copyToClipboard(window.location.href, 'URL copied!');
  }, [copyToClipboard]);

  const copyLinkedIn = useCallback(() => {
    const linkedinLink = siteConfig.links.find(l => l.name === 'LinkedIn');
    if (linkedinLink) {
      copyToClipboard(linkedinLink.url, 'LinkedIn copied!');
    }
  }, [copyToClipboard]);

  const focusFirstLink = useCallback(() => {
    const firstLink = document.querySelector<HTMLElement>('[data-link]');
    firstLink?.focus();
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Event management
  const { handleContextMenu, handleContextAction } = useEventManager({
    copyEmail,
    copyUrl,
    copyLinkedIn,
    focusFirstLink,
    closeContextMenu,
  });

  // Document click handler for context menu
  useDocumentClick(closeContextMenu, contextMenu !== null);

  // Context menu show handler
  const showContextMenu = useCallback((e: React.MouseEvent) => {
    const position = handleContextMenu(e);
    if (position) {
      setContextMenu(position);
    }
  }, [handleContextMenu]);

  return (
    <div 
      className={`min-h-screen ${currentTheme.background}`}
      onContextMenu={siteConfig.features.contextMenu ? showContextMenu : undefined}
    >
      {/* Floating header */}
      <Header 
        profile={siteConfig.profile}
        links={siteConfig.links}
        isVisible={isScrolled}
      />

      {/* Main profile section */}
      <ProfileSection 
        profile={siteConfig.profile}
        status={siteConfig.status}
        links={siteConfig.links}
      />

      {/* Content sections */}
      <main 
        className="mx-auto px-6 sm:px-8 lg:px-12" 
        style={{ 
          maxWidth: designSystem.layout.maxWidth,
          paddingBottom: designSystem.spacing.xxl 
        }}
      >
        {/* Elegant separator */}
        <div 
          className={`w-full h-px bg-gradient-to-r ${currentTheme.gradients.separator}`}
          style={{ marginBottom: designSystem.spacing.xl }}
        />
        
        {/* Projects section */}
        <ProjectsSection projects={siteConfig.projects} />
      </main>

      {/* Context menu */}
      {contextMenu && siteConfig.features.contextMenu && (
        <ContextMenu
          position={contextMenu}
          onAction={handleContextAction}
          onClose={closeContextMenu}
        />
      )}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div 
          className="fixed bottom-4 right-4 z-50 pointer-events-none"
          style={{ gap: designSystem.spacing.sm }}
        >
          <AnimatePresence>
            {toasts.map(toast => (
              <div key={toast.id} className="pointer-events-auto" style={{ marginBottom: designSystem.spacing.sm }}>
                <Toast toast={toast} onRemove={removeToast} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}