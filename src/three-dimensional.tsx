/* ============================================================
   3D / WEBGL - Using WebGL only where it adds real value
   ============================================================ */
import { cn } from '@/lib/utils';

// WebGL feature detection
export const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    );
  } catch (e) {
    return false;
  }
};

// WebGL uses (where it adds real value per the design brief)
export const webGLFeatures = {
  // Kano map - 3D terrain visualization
  kanoMap: {
    enabled: isWebGLSupported() && false, // Disabled by default for performance, can be enabled
    description: '3D Kano state terrain map',
    priority: 'medium',
    mobile: false, // Disable on mobile
  },
  
  // Subtle background particles
  particles: {
    enabled: isWebGLSupported(),
    description: 'Background decorative particles',
    priority: 'low',
    mobile: true, // Enable on mobile (performance-friendly)
  },
  
  // Geometric pattern visualization
  geometricPattern: {
    enabled: isWebGLSupported(),
    description: 'Interactive geometric patterns',
    priority: 'low',
    mobile: true,
  },
  
  // Development network visualization
  networkVisualization: {
    enabled: isWebGLSupported(),
    description: 'Kano development project network graph',
    priority: 'low',
    mobile: false,
  },
};

// Initialize WebGL scene (placeholder - actual implementation would go in dedicated component)
export function initWebGLScene(options: {
  container: string | HTMLElement;
  feature: keyof typeof webGLFeatures;
  data?: any;
}) {
  const { container, feature } = options;
  
  if (!isWebGLSupported()) {
    console.warn('WebGL not supported');
    return null;
  }
  
  const featureConfig = webGLFeatures[feature];
  if (!featureConfig.enabled) {
    console.warn(`${feature} WebGL feature is disabled`);
    return null;
  }
  
  // In a real implementation, this would create a Three.js scene
  // or PixiJS canvas based on the feature type
  console.log(`Initializing WebGL ${feature} scene`);
  
  return {
    container,
    feature,
    initialized: true,
    dispose: () => console.log('WebGL scene disposed'),
  };
}

// Check if WebGL should be used based on device and feature
export const shouldUseWebGL = (feature: keyof typeof webGLFeatures): boolean => {
  const config = webGLFeatures[feature];
  
  // Check mobile compatibility
  const isMobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
  const isSupported = isWebGLSupported();
  
  if (!isSupported) return false;
  
  if (config.mobile === false && isMobile) return false;
  if (config.mobile === true && !isMobile) return true;
  
  return config.mobile !== undefined ? config.mobile : isSupported;
};

// WebGL performance guidelines per the design brief:
// - Do not sacrifice mobile performance for visual effects
// - Use WebGL only where it adds real value
// - Kano map, subtle background particles, geometric pattern, development network visualization
// - Always respect prefers-reduced-motion