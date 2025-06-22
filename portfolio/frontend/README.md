# Portfolio Frontend - Clean Architecture

## 🏗️ Architecture Overview

This frontend has been completely refactored using modern best practices:

### **Design Philosophy**
- **Golden Ratio Based**: All spacing, sizing, and proportions use φ (1.618) for mathematical harmony
- **Single Source of Truth**: All design decisions centralized in config files
- **Zero Magic Numbers**: Every value is semantic and configurable
- **Minimal Moving Parts**: Clean, maintainable codebase with maximum impact

### **Project Structure**
```
src/
├── config/              # All configuration in one place
│   ├── design-system.ts # Spacing, colors, animations (φ-based)
│   ├── site-config.ts   # Content, metadata, feature flags
│   └── animations.ts    # Framer Motion variants
├── components/
│   ├── ui/              # Reusable components
│   ├── sections/        # Page sections
│   └── layout/          # Layout components
├── hooks/               # Clean, focused hooks
├── types/               # All TypeScript definitions
└── app/                 # Next.js app router
```

## 🎨 Design System

### **Golden Ratio Spacing**
```typescript
// All spacing uses φ = 1.618
spacing: {
  xs: '0.382rem',   // φ⁻²
  sm: '0.618rem',   // φ⁻¹  
  md: '1rem',       // 1
  lg: '1.618rem',   // φ
  xl: '2.618rem',   // φ²
  xxl: '4.236rem'   // φ³
}
```

### **Component Sizing**
- Profile photos: Different sizes for mobile/desktop/header
- Cards: Consistent padding and border radius
- Typography: Harmonious scale based on golden ratio

### **Theme System**
Easily switch between design themes:
```typescript
// In design-system.ts
export const currentTheme = designSystem.themes.default; // or .minimal
```

## 🚀 Key Features

### **Performance Optimized**
- Static export compatible
- Minimal bundle size
- Efficient animations with Framer Motion
- Smart scroll detection

### **Accessibility First**
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Reduced motion support

### **Developer Experience**
- Type-safe throughout
- Easy to customize
- Clear component contracts
- Self-documenting code

## 📝 Content Management

All content is managed in `src/config/site-config.ts`:

```typescript
export const siteConfig = {
  profile: {
    name: "Your Name",
    title: "Your Title", 
    bio: "Your bio...",
    location: "Your Location",
    photo: "/profile.jpg",
  },
  projects: [
    // Add your projects here
  ],
  // ... rest of config
}
```

## 🎮 Interactions

### **Context Menu**
Right-click anywhere for quick actions:
- Copy email
- Copy website URL  
- Copy LinkedIn

### **Keyboard Shortcuts**
- `Cmd/Ctrl + S`: Copy email
- `Cmd/Ctrl + K`: Focus first link

### **Animations**
All animations use spring physics for natural feel:
- Header slides in smoothly when scrolling
- Cards hover with subtle lift
- Staggered content animations

## 🛠️ Customization

### **Changing Colors**
Edit `design-system.ts` themes:
```typescript
themes: {
  yourTheme: {
    background: 'bg-your-color',
    text: 'text-your-color',
    // ... etc
  }
}
```

### **Adjusting Spacing**
All spacing is based on golden ratio. To adjust the scale:
```typescript
// Change the base multiplier
const PHI = 1.618; // Make smaller/larger as needed
```

### **Adding Projects**
Edit `site-config.ts`:
```typescript
projects: [
  {
    name: "Project Name",
    description: "Description...", 
    techStack: ["Tech1", "Tech2"],
    demoUrl: "/demo",
    githubUrl: "https://github.com/..."
  }
]
```

## 🔧 Development

### **Install Dependencies**
```bash
npm install
```

### **Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Deploy**
Static files are output to `out/` directory for deployment to any static host.

## 📦 Dependencies

- **Next.js 15**: React framework with app router
- **Framer Motion**: Physics-based animations
- **Tailwind CSS 4**: Utility-first styling
- **Lucide React**: Icon library
- **TypeScript**: Type safety

## 🎯 Code Quality

### **Principles**
- No magic numbers
- Single responsibility components  
- Consistent naming conventions
- Minimal prop drilling
- Performance-first approach

### **File Organization**
- Components grouped by purpose
- Clear separation of concerns
- Logical import structure
- Self-contained modules

This architecture provides a solid foundation for a beautiful, performant, and maintainable portfolio site.