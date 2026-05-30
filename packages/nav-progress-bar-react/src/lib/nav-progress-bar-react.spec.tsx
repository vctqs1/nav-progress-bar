import { render } from '@testing-library/react';

import NavProgressBar from './nav-progress-bar-react';

describe('NavProgressBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavProgressBar />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the vctqs1-nav-progress-bar custom element', () => {
    const { container } = render(<NavProgressBar />);
    const el = container.querySelector('vctqs1-nav-progress-bar');
    expect(el).not.toBeNull();
  });

  it('should set the default primary color attribute', () => {
    const { container } = render(<NavProgressBar />);
    const el = container.querySelector('vctqs1-nav-progress-bar');
    expect(el?.getAttribute('primary')).toBe('#006bde');
  });

  it('should set a custom primary color attribute', () => {
    const { container } = render(<NavProgressBar primary="#ff0000" />);
    const el = container.querySelector('vctqs1-nav-progress-bar');
    expect(el?.getAttribute('primary')).toBe('#ff0000');
  });

  it('should support CSS custom property as primary', () => {
    const { container } = render(<NavProgressBar primary="--brand-color" />);
    const el = container.querySelector('vctqs1-nav-progress-bar');
    expect(el?.getAttribute('primary')).toBe('--brand-color');
  });

  it('should update primary attribute when prop changes', () => {
    const { container, rerender } = render(<NavProgressBar primary="#ff0000" />);
    const el = container.querySelector('vctqs1-nav-progress-bar');
    expect(el?.getAttribute('primary')).toBe('#ff0000');

    rerender(<NavProgressBar primary="#00ff00" />);
    expect(el?.getAttribute('primary')).toBe('#00ff00');
  });

  it('should render only one custom element', () => {
    const { container } = render(<NavProgressBar />);
    const els = container.querySelectorAll('vctqs1-nav-progress-bar');
    expect(els).toHaveLength(1);
  });
});
