/**
 * Tests for OnboardingWalkthrough component (disabled)
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OnboardingWalkthrough } from '@object-ui/app-shell';

describe('OnboardingWalkthrough', () => {
  it('renders nothing (onboarding is disabled)', () => {
    const { container } = render(<OnboardingWalkthrough />);
    expect(container.firstChild).toBeNull();
  });
});
