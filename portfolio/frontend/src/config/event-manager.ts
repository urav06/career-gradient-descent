import { useCallback, useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site-config';
import { useAnalytics } from '@/config/analytics';
import type { ContextAction } from '@/types';

// Consolidated event management - single source for all keyboard/mouse events
export interface EventManagerActions {
  copyEmail: () => void;
  copyUrl: () => void;
  copyLinkedIn: () => void;
  focusFirstLink: () => void;
  closeContextMenu?: () => void;
}

export function useEventManager(actions: EventManagerActions) {
  const { trackKeyboardShortcut, trackContextMenu } = useAnalytics();
  const actionsRef = useRef(actions);

  // Update actions ref when actions change
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  // Consolidated keyboard event handler
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (!siteConfig.features.keyboardShortcuts) return;

    const isModKey = e.metaKey || e.ctrlKey;
    const { current: currentActions } = actionsRef;

    // Handle shortcuts
    if (isModKey && e.key === 's') {
      e.preventDefault();
      currentActions.copyEmail();
      trackKeyboardShortcut('cmd+s', 'copy_email');
      return;
    }
    
    if (isModKey && e.key === 'k') {
      e.preventDefault(); 
      currentActions.focusFirstLink();
      trackKeyboardShortcut('cmd+k', 'focus_links');
      return;
    }

    // Handle escape key for modals/menus
    if (e.key === 'Escape') {
      currentActions.closeContextMenu?.();
      return;
    }
  }, [trackKeyboardShortcut]);

  // Set up global keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown, { passive: false });
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  // Context menu management
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!siteConfig.features.contextMenu) return;
    
    e.preventDefault();
    trackContextMenu();
    return { x: e.clientX, y: e.clientY };
  }, [trackContextMenu]);

  // Context menu action handler
  const handleContextAction = useCallback((action: ContextAction) => {
    const { current: currentActions } = actionsRef;
    
    const actionMap = {
      email: currentActions.copyEmail,
      url: currentActions.copyUrl,
      linkedin: currentActions.copyLinkedIn,
    };

    actionMap[action]();
    trackContextMenu(action);
    currentActions.closeContextMenu?.();
  }, [trackContextMenu]);

  return {
    handleContextMenu,
    handleContextAction,
  };
}

// Hook for managing document click events (context menu closing, etc.)
export function useDocumentClick(callback: () => void, enabled = true) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      // Only close if clicking outside of context menu
      const target = e.target as Element;
      if (!target.closest('[data-context-menu]')) {
        callbackRef.current();
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [enabled]);
}

// Hook for managing focus trap in modals/menus
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isActive, containerRef]);
}
