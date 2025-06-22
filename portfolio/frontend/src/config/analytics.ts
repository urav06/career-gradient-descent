import { siteConfig } from './site-config';
import type { AnalyticsEvent } from '@/types';

// Unified analytics service - single source of truth for all tracking
class AnalyticsService {
  private isEnabled: boolean;
  private isProduction: boolean;
  private gaId: string | undefined;

  constructor() {
    this.isEnabled = siteConfig.features.analytics;
    this.isProduction = process.env.NODE_ENV === 'production';
    this.gaId = siteConfig.analytics.googleAnalyticsId;
  }

  // Main tracking method - replaces all three previous patterns
  track(event: AnalyticsEvent, data?: Record<string, unknown>): void {
    // Only track in production with valid config
    if (!this.isEnabled || !this.isProduction || !this.gaId) {
      return;
    }

    // Ensure gtag is available
    if (typeof window === 'undefined' || !('gtag' in window)) {
      return;
    }

    try {
      window.gtag('event', event, {
        event_category: 'interaction',
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...data,
      });
    } catch (error) {
      // Silently fail in analytics - don't break user experience
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Convenience methods for common events
  trackPageView(page?: string): void {
    this.track('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page || window.location.pathname,
    });
  }

  trackLinkClick(linkName: string, url: string, external = false): void {
    this.track('link_click', {
      link_name: linkName.toLowerCase(),
      link_url: url,
      external,
    });
  }

  trackProjectInteraction(projectName: string, action: string, url?: string): void {
    this.track('project_click', {
      project_name: projectName.toLowerCase().replace(/\s+/g, '-'),
      action,
      project_url: url,
    });
  }

  trackCopyAction(type: string, success = true, content?: string): void {
    this.track('copy_action', {
      copy_type: type.toLowerCase(),
      success,
      content_length: content?.length,
    });
  }

  trackKeyboardShortcut(shortcut: string, action: string): void {
    this.track('keyboard_shortcut', {
      shortcut: shortcut.toLowerCase(),
      action: action.toLowerCase(),
    });
  }

  trackContextMenu(action?: string): void {
    if (action) {
      this.track('context_menu_action', { action: action.toLowerCase() });
    } else {
      this.track('context_menu_open');
    }
  }

  trackProfileInteraction(type: string): void {
    this.track('profile_interaction', {
      interaction_type: type.toLowerCase(),
    });
  }

  // Development helper - tracks events with detailed info in dev mode
  trackDev(event: AnalyticsEvent, data?: Record<string, unknown>): void {
    if (!this.isProduction) {
      console.log(`[Analytics] ${event}`, data);
    }
    this.track(event, data);
  }

  // Initialize analytics (called once in layout)
  initialize(): void {
    if (!this.isEnabled || !this.isProduction || !this.gaId) {
      return;
    }

    // Track initial page view
    this.trackPageView();

    // Set up performance tracking
    if ('navigation' in window && 'timing' in window.performance) {
      window.addEventListener('load', () => {
        // Track page load performance after a delay to ensure metrics are available
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.track('page_load_performance', {
              load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
              dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
              first_contentful_paint: this.getFirstContentfulPaint(),
            });
          }
        }, 1000);
      });
    }
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export convenience hook for React components
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackLinkClick: analytics.trackLinkClick.bind(analytics),
    trackProjectInteraction: analytics.trackProjectInteraction.bind(analytics),
    trackCopyAction: analytics.trackCopyAction.bind(analytics),
    trackKeyboardShortcut: analytics.trackKeyboardShortcut.bind(analytics),
    trackContextMenu: analytics.trackContextMenu.bind(analytics),
    trackProfileInteraction: analytics.trackProfileInteraction.bind(analytics),
  };
};
