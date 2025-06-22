import { Variants } from 'framer-motion';
import { designSystem } from './design-system';

// Pure Framer Motion animation system - no CSS transitions
export const animations: Record<string, Variants> = {
  // Header slide animation - smooth and natural
  header: {
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.98
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        ...designSystem.animations.spring,
        duration: designSystem.animations.medium / 1000,
      }
    }
  },

  // Staggered container for coordinated animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: designSystem.animations.fast / 1000,
        delayChildren: designSystem.animations.fast / 2000,
      }
    }
  },

  // Individual item slide-up animation
  slideUp: {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: designSystem.animations.spring
    }
  },

  // Fade in animation for simple elements
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Context menu spring animation
  contextMenu: {
    hidden: { 
      scale: 0.95, 
      opacity: 0,
      y: -8
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: designSystem.animations.fast / 1000
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: -8,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: "easeInOut" as const
      }
    }
  },

  // Card hover animations - Pure Framer Motion (no CSS transitions)
  cardHover: {
    rest: { 
      y: 0,
      scale: 1,
      transition: {
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: { 
      y: -8,
      scale: 1.02,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Profile photo subtle animation
  profilePhoto: {
    rest: { 
      scale: 1,
      transition: {
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Toast notification animation
  toast: {
    hidden: {
      x: 100,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: designSystem.animations.spring
    },
    exit: {
      x: 100,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: "easeInOut" as const
      }
    }
  },

  // Contact link hover animation - Pure Framer Motion
  contactLink: {
    rest: {
      scale: 1,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: designSystem.animations.fast / 2000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Icon scale animation for links
  iconScale: {
    rest: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: {
      scale: 1.1,
      rotate: 0,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Status badge pulse animation
  statusBadge: {
    rest: {
      scale: 1,
      transition: {
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: designSystem.animations.medium / 1000,
        ease: designSystem.animations.easing
      }
    }
  },

  // Status dot pulse animation (Pure Framer Motion)
  statusDot: {
    pulse: {
      opacity: [1, 0.5, 1],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  },

  // Button/Interactive element animations
  button: {
    rest: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    },
    hover: {
      scale: 1.02,
      opacity: 0.9,
      transition: {
        duration: designSystem.animations.fast / 1000,
        ease: designSystem.animations.easing
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: designSystem.animations.fast / 2000,
        ease: designSystem.animations.easing
      }
    }
  }
};

// Transition presets for common use cases - Pure Framer Motion
export const transitions = {
  smooth: {
    duration: designSystem.animations.medium / 1000,
    ease: designSystem.animations.easing
  },
  
  spring: designSystem.animations.spring,
  
  fast: {
    duration: designSystem.animations.fast / 1000,
    ease: "easeOut" as const
  },
  
  slow: {
    duration: designSystem.animations.slow / 1000,
    ease: designSystem.animations.easing
  },

  // Micro-interaction transitions
  micro: {
    duration: designSystem.animations.fast / 2000,
    ease: "easeOut" as const
  },

  // Page transition
  page: {
    duration: designSystem.animations.slow / 1000,
    ease: designSystem.animations.easing
  }
};
