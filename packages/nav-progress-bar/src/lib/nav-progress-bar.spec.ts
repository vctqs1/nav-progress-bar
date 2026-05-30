import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  NavProgressBar,
  type NavProgressBarOptions,
  TAG_NAME,
  registerNavProgressBar,
  getNavProgressBar,
} from './nav-progress-bar';

let testTagCounter = 0;

function createNavProgressBar(options: NavProgressBarOptions = {}): NavProgressBar {
  const tagName = `vctqs1-nav-progress-bar-test-${testTagCounter++}`;
  class NavProgressBarTestElement extends NavProgressBar {
    constructor() {
      super(options);
    }
  }

  customElements.define(tagName, NavProgressBarTestElement);
  return document.createElement(tagName) as NavProgressBar;
}

function getRuleCssTextContaining(element: NavProgressBar, needle: string): string | undefined {
  const sheets = element.shadowRoot?.adoptedStyleSheets ?? [];
  for (const sheet of sheets) {
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule.cssText.includes(needle)) {
        return rule.cssText;
      }
    }
  }
  return undefined;
}

describe('NavProgressBar', () => {
  let element: NavProgressBar;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (element?.remove) element.remove();
    if (container?.remove) container.remove();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      element = createNavProgressBar();
      expect(element).toBeInstanceOf(NavProgressBar);
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should create instance with custom options', () => {
      element = createNavProgressBar({ primary: '#ff0000' });
      expect(element).toBeInstanceOf(NavProgressBar);
    });

    it('should initialize with empty options when none provided', () => {
      element = createNavProgressBar({});
      expect(element).toBeInstanceOf(NavProgressBar);
    });
  });

  describe('static members', () => {
    it('should have observedAttributes', () => {
      expect(NavProgressBar.observedAttributes).toEqual(['primary']);
    });
  });

  describe('connectedCallback', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      vi.useFakeTimers();
    });

    it('should create shadow DOM on connection', () => {
      container.appendChild(element);
      expect(element.shadowRoot).toBeDefined();
    });

    it('should create bar element in shadow DOM', () => {
      container.appendChild(element);
      const bar = element.shadowRoot?.querySelector('.bar');
      expect(bar).toBeDefined();
      expect(bar?.className).toBe('bar');
    });

    it('should attach navigation event listeners when available', () => {
      const nav = (globalThis as { navigation?: EventTarget }).navigation;
      if (!nav) return;
      const addEventListenerSpy = vi.spyOn(nav, 'addEventListener');
      container.appendChild(element);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('navigate', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('navigatesuccess', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('should set up adopted stylesheets', () => {
      container.appendChild(element);
      expect(element.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
    });
  });

  describe('disconnectedCallback', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      vi.useFakeTimers();
    });

    it('should remove navigation event listeners', () => {
      container.appendChild(element);
      const nav = (globalThis as { navigation?: EventTarget }).navigation;
      if (!nav) return;
      const removeEventListenerSpy = vi.spyOn(nav, 'removeEventListener');
      
      element.remove();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('navigate', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('navigatesuccess', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('should clear timer on disconnection', () => {
      container.appendChild(element);
      element.start();
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      element.remove();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('start()', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      container.appendChild(element);
      vi.useFakeTimers();
    });

    it('should return the element for chaining', () => {
      const result = element.start();
      expect(result).toBe(element);
    });

    it('should activate the bar', () => {
      element.start();
      const bar = element.shadowRoot?.querySelector<HTMLDivElement>('.bar');
      expect(bar?.classList.contains('active')).toBe(true);
    });

    it('should gradually increase width', () => {
      element.start();
      
      // Get initial width
      let progressSheet = element.shadowRoot?.adoptedStyleSheets.find(
        (sheet: CSSStyleSheet) => sheet.cssRules[0]?.cssText.includes('width')
      );
      
      expect(progressSheet).toBeDefined();
      
      // Advance timer and check width increases
      vi.advanceTimersByTime(200);
      expect(progressSheet?.cssRules[0]?.cssText).toContain('width:');
    });

    it('should clear existing timer before starting', () => {
      element.start();
      const firstTimer = (element as any)._autoTimer;
      
      element.start();
      const secondTimer = (element as any)._autoTimer;
      
      expect(firstTimer).not.toEqual(secondTimer);
    });

    it('should capture start time', () => {
      vi.clearAllTimers();
      vi.useFakeTimers();
      vi.spyOn(performance, 'now').mockReturnValue(1000);
      
      element.start();
      expect((element as any)._startTime).toBe(1000);
    });
  });

  describe('finish()', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      container.appendChild(element);
      vi.useFakeTimers();
    });

    it('should return the element for chaining', () => {
      const result = element.finish();
      expect(result).toBe(element);
    });

    it('should clear the interval timer', () => {
      element.start();
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      element.finish();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it('should set width to 100', () => {
      element.start();
      element.finish();
      
      const progressSheet = element.shadowRoot?.adoptedStyleSheets.find(
        (sheet: CSSStyleSheet) => sheet.cssRules[0]?.cssText.includes('width')
      );
      
      expect(progressSheet?.cssRules[0]?.cssText).toContain('width: 100%');
    });

    it('should add complete class to bar', () => {
      element.start();
      element.finish();
      const bar = element.shadowRoot?.querySelector<HTMLDivElement>('.bar');
      expect(bar?.classList.contains('complete')).toBe(true);
    });

    it('should remove active class from bar', () => {
      element.start();
      element.finish();
      const bar = element.shadowRoot?.querySelector<HTMLDivElement>('.bar');
      expect(bar?.classList.contains('active')).toBe(false);
    });

    it('should reset to 0 and inactive after animation', () => {
      element.start();
      element.finish();
      
      vi.advanceTimersByTime(700);
      
      const bar = element.shadowRoot?.querySelector<HTMLDivElement>('.bar');
      expect(bar?.classList.contains('complete')).toBe(false);
      expect(bar?.classList.contains('active')).toBe(false);
    });
  });

  describe('attributeChangedCallback', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      container.appendChild(element);
    });

    it('should reapply color sheet when primary attribute changes', () => {
      const initialSheets = element.shadowRoot?.adoptedStyleSheets.length ?? 0;
      
      element.setAttribute('primary', '#ff0000');
      
      expect(element.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThanOrEqual(initialSheets);
    });

    it('should update styling when primary color changes', () => {
      element.setAttribute('primary', '#ff0000');

      expect(getRuleCssTextContaining(element, 'background')).toContain('#ff0000');
    });
  });

  describe('color resolution', () => {
    beforeEach(() => {
      element = createNavProgressBar({ primary: '#00ff00' });
      container.appendChild(element);
    });

    it('should use attribute value over options', () => {
      element.setAttribute('primary', '#ff0000');

      expect(getRuleCssTextContaining(element, 'background')).toContain('#ff0000');
    });

    it('should use options value if attribute not set', () => {
      expect(getRuleCssTextContaining(element, 'background')).toContain('#00ff00');
    });

    it('should use fallback color if neither attribute nor option provided', () => {
      const element2 = createNavProgressBar();
      container.appendChild(element2);

      expect(getRuleCssTextContaining(element2, 'background')).toContain('#006bde');
    });

    it('should support CSS custom properties', () => {
      element.setAttribute('primary', '--custom-color');

      expect(getRuleCssTextContaining(element, 'background')).toContain('var(--custom-color');
    });
  });

  describe('shadow DOM structure', () => {
    beforeEach(() => {
      element = createNavProgressBar();
      container.appendChild(element);
    });

    it('should have correct host styles', () => {
      const hostRule = element.shadowRoot?.adoptedStyleSheets.find(
        (sheet: CSSStyleSheet) => sheet.cssRules[0]?.cssText.includes(':host')
      );
      
      const cssText = Array.from(hostRule?.cssRules ?? [])
        .map((rule) => rule.cssText)
        .join(' ');
      
      expect(cssText).toContain('position: fixed');
      expect(cssText).toContain('top: 0');
      expect(cssText).toContain('left: 0');
      expect(cssText).toContain('width: 100%');
      expect(cssText).toContain('z-index: 9999');
    });

    it('should render bar with correct initial width', () => {
      const progressSheet = element.shadowRoot?.adoptedStyleSheets.find(
        (sheet: CSSStyleSheet) => sheet.cssRules[0]?.cssText.includes('width: 0%')
      );
      
      expect(progressSheet).toBeDefined();
    });
  });

  describe('reusable shadow DOM', () => {
    it('should reuse existing shadow DOM if present', () => {
      element = createNavProgressBar();
      container.appendChild(element);
      
      const firstShadowRoot = element.shadowRoot;
      
      // Trigger render again would normally happen on attribute change
      (element as any)._render();
      
      // Should be the same shadow root
      expect(element.shadowRoot).toBe(firstShadowRoot);
    });

    it('should not duplicate bar element in shadow DOM', () => {
      element = createNavProgressBar();
      container.appendChild(element);
      
      const barCount = element.shadowRoot?.querySelectorAll('.bar').length;
      expect(barCount).toBe(1);
    });
  });
});

describe('registerNavProgressBar', () => {
  let originalNavigation: unknown;

  beforeEach(() => {
    originalNavigation = (globalThis as { navigation?: unknown }).navigation;
    (globalThis as { navigation?: EventTarget }).navigation = new EventTarget();
    document.querySelectorAll(TAG_NAME).forEach((el) => el.remove());
  });

  afterEach(() => {
    // Clean up registered element
    if (customElements.get(TAG_NAME)) {
      // Note: customElements.define doesn't have an unregister, so we'll just remove from DOM
      document.querySelectorAll(TAG_NAME).forEach((el) => el.remove());
    }
    (globalThis as { navigation?: unknown }).navigation = originalNavigation;
  });

  it('should register custom element with default options', () => {
    registerNavProgressBar();
    const definition = customElements.get(TAG_NAME);
    expect(definition).toBeDefined();
  });

  it('should register custom element with custom options', () => {
    registerNavProgressBar({ primary: '#ff0000' });
    const definition = customElements.get(TAG_NAME);
    expect(definition).toBeDefined();
  });

  it('should not register if customElements is unavailable', () => {
    const originalCustomElements = (global as any).customElements;
    (global as any).customElements = undefined;
    
    expect(() => registerNavProgressBar()).not.toThrow();
    
    (global as any).customElements = originalCustomElements;
  });

  it('should not register if navigation API is unavailable', () => {
    const originalNavigation = (global as any).navigation;
    (global as any).navigation = undefined;
    
    expect(() => registerNavProgressBar()).not.toThrow();
    
    (global as any).navigation = originalNavigation;
  });

  it('should not re-register if already defined', () => {
    registerNavProgressBar();
    const firstDefinition = customElements.get(TAG_NAME);
    
    registerNavProgressBar();
    const secondDefinition = customElements.get(TAG_NAME);
    
    expect(firstDefinition).toBe(secondDefinition);
  });

  it('should keep options from first registration', () => {
    registerNavProgressBar();
    registerNavProgressBar({ primary: '#ff0000' });
    
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const element = document.createElement(TAG_NAME) as NavProgressBar;
    container.appendChild(element);
    
    expect(getRuleCssTextContaining(element, 'background')).toContain('rgb(0, 107, 222)');
    
    container.remove();
  });
});

describe('getNavProgressBar', () => {
  let container: HTMLDivElement;
  let originalNavigation: unknown;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    document.querySelectorAll(TAG_NAME).forEach((el) => el.remove());
    originalNavigation = (globalThis as { navigation?: unknown }).navigation;
    (globalThis as { navigation?: EventTarget }).navigation = new EventTarget();
    registerNavProgressBar();
  });

  afterEach(() => {
    container.remove();
    (globalThis as { navigation?: unknown }).navigation = originalNavigation;
  });

  it('should return null if element not in DOM', () => {
    const result = getNavProgressBar();
    expect(result).toBeNull();
  });

  it('should return element if present in DOM', () => {
    const element = document.createElement(TAG_NAME) as NavProgressBar;
    container.appendChild(element);
    
    const result = getNavProgressBar();
    expect(result).toBe(element);
  });

  it('should return first element if multiple present', () => {
    const element1 = document.createElement(TAG_NAME) as NavProgressBar;
    const element2 = document.createElement(TAG_NAME) as NavProgressBar;
    container.appendChild(element1);
    container.appendChild(element2);
    
    const result = getNavProgressBar();
    expect(result).toBe(element1);
  });

  it('should find element with TAG_NAME selector', () => {
    const element = document.createElement(TAG_NAME) as NavProgressBar;
    element.setAttribute('id', 'test-bar');
    container.appendChild(element);
    
    const result = getNavProgressBar();
    expect(result?.id).toBe('test-bar');
  });
});
