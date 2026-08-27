/* ============================================================
   ACCESSIBILITY - WCAG 2.2 AA compliance features
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function AccessibilitySection() {
  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto px-6">
        <GlassCard premium={true} shadow="soft">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-[var(--white)] mb-6">
              ACCESSIBILITY
            </h2>

            {/* WCAG compliance checklist */}
            <div className="space-y-4 text-sm">
              {/* High Contrast */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  High Contrast Ratio
                </p>
                <p className="text-[var(--muted-text)]">
                  All text and image contrast meets WCAG 2.2 AA standards (minimum 4.5:1 for normal text, 3:1 for large text). Glassmorphism never compromises readability - glass opacity and border colors are specifically calculated for contrast.
                </p>
              </div>

              {/* Keyboard Navigation */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  Keyboard Navigation
                </p>
                <p className="text-[var(--muted-text)]">
                  All interactive elements (buttons, links, form controls) are reachable via Tab key. Focus states are clearly visible with contrasting outlines. Skip navigation links available.
                </p>
              </div>

              {/* Screen Reader Labels */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  Screen Reader Labels
                </p>
                <p className="text-[var(--muted-text)]">
                  Semantic HTML structure with proper aria-labels and roles. All images have descriptive alt text. Form fields have associated labels. Landmark regions (header, nav, main, section, footer) for easy navigation.
                </p>
              </div>

              {/* Focus States */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  Focus States
                </p>
                <p className="text-[var(--muted-text)]">
                  Visible focus indicators on all interactive elements. Focus ring uses primary green color with sufficient contrast. No keyboard traps - users can navigate away from any element.
                </p>
              </div>

              {/* Reduced Motion */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  Reduced Motion Support
                </p>
                <p className="text-[var(--muted-text)]">
                  Respects the user's prefers-reduced-motion media query. All animations can be disabled. Glass blur effects degrade gracefully. No automatic carousels or sliders that move without user control.
                </p>
              </div>

              {/* Accessible Forms */}
              <div>
                <p className="font-medium text-[var(--white)] mb-2">
                  Accessible Forms
                </p>
                <p className="text-[var(--muted-text)]">
                  Form fields with proper labeling, error identification, and suggestions. Clear error messages describing how to fix issues. Fieldset and legend for related groups. Checkbox and radio button inputs are keyboard accessible.
                </p>
              </div>

              {/* Reduced Motion Prefers-Media */}

            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t border-[var(--glass-border)] text-center">
            <p className="text-xs text-[var(--muted-text)]">
              Glassmorphism design has been tested for WCAG 2.2 AA compliance. All motion
              respects user preferences. Readability is prioritized over visual effects.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}