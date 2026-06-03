/**
 * Options for configuring the NavProgressBar component.
 */
export interface NavProgressBarOptions {
  /** Primary color of the progress bar (hex, rgb, or CSS custom property) */
  primary?: string;
  /** Bar height (for example `3px` or `0.25rem`) */
  height?: string;
}

type NavigationEventTarget = {
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
};

const HTMLElementBase: typeof HTMLElement =
  (globalThis as { HTMLElement?: typeof HTMLElement }).HTMLElement ??
  (class {} as unknown as typeof HTMLElement);

function getNavigationApi(): NavigationEventTarget | undefined {
  const nav = (globalThis as { navigation?: unknown }).navigation;
  if (!nav || typeof nav !== "object") return undefined;
  if (
    !("addEventListener" in nav) ||
    !("removeEventListener" in nav)
  ) {
    return undefined;
  }
  return nav as NavigationEventTarget;
}

/**
 * A web component that displays a progress bar during navigation.
 * Integrates with the Navigation API to automatically start/finish the progress bar.
 * 
 * @example
 * ```ts
 * import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
 * registerNavProgressBar({ primary: '#006bde' });
 * ```
 * 
 * Then use in HTML:
 * ```html
 * <nav-progress-bar primary="#006bde"></nav-progress-bar>
 * ```
 */
/**
 * A web component that displays a progress bar during navigation.
 * Integrates with the Navigation API to automatically start/finish the progress bar.
 * 
 * @example
 * ```ts
 * import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
 * registerNavProgressBar({ primary: '#006bde' });
 * ```
 * 
 * Then use in HTML:
 * ```html
 * <nav-progress-bar primary="#006bde"></nav-progress-bar>
 * ```
 */
export class NavProgressBar extends HTMLElementBase {
  private _layoutSheet: CSSStyleSheet | undefined = undefined;
  private _sheet: CSSStyleSheet | undefined = undefined;
  private _progressSheet: CSSStyleSheet | undefined = undefined;
  private _autoTimer: ReturnType<typeof setInterval> | undefined = undefined;
  private _startTime: number | undefined = undefined;
  private _options: NavProgressBarOptions;

  static get observedAttributes() {
    return ["primary", "height"];
  }

  /**
   * Creates a new NavProgressBar instance.
   * @param options Configuration options for the progress bar
   */
  /**
   * Creates a new NavProgressBar instance.
   * @param options Configuration options for the progress bar
   */
  constructor(options: NavProgressBarOptions = {}) {
    super();
    this._options = options;
  }

  private _onNavigateSuccess = () => this.finish();
  private _onNavigate = () => this.start();

  connectedCallback() {
    this._render();

    // navigation API is the only reliable signal for App Router route settlement.
    // onRouterTransitionStart fires on departure; navigatesuccess
    // fires when the new page has fully committed (RSC payload applied).
    const navigationApi = getNavigationApi();
    if (navigationApi) {
      navigationApi.addEventListener("navigate", this._onNavigate);
      navigationApi.addEventListener("navigatesuccess", this._onNavigateSuccess);
    }
  }

  disconnectedCallback() {
    const navigationApi = getNavigationApi();
    if (navigationApi) {
      navigationApi.removeEventListener("navigate", this._onNavigate);
      navigationApi.removeEventListener(
        "navigatesuccess",
        this._onNavigateSuccess,
      );
    }
    this._clearTimer();
  }

  attributeChangedCallback() {
    // Re-render the static stylesheet when attributes change so colors update
    // without touching inline styles.
    if (this._sheet) this._applyColorSheet();
  }

  private _resolveStyleValue(
    attributeValue: string | null,
    optionValue: string | undefined,
    fallback: string,
  ): string {
    const value = attributeValue ?? optionValue;
    if (!value) return fallback;
    return value.startsWith("--") ? `var(${value}, ${fallback})` : value;
  }

  private _buildColorSheet(): CSSStyleSheet {
    const primary = this._resolveStyleValue(
      this.getAttribute("primary"),
      this._options.primary,
      "#006bde",
    );
    const height = this._resolveStyleValue(
      this.getAttribute("height"),
      this._options.height,
      "3px",
    );

    const sheet = new CSSStyleSheet();
    sheet.insertRule(`
      .bar {
        height: ${height};
        background: ${primary};
        opacity: 0;
        transition: width 0.3s ease, opacity 0.4s ease;
        box-shadow: 0 0 8px color-mix(in srgb, ${primary} 53%, transparent);
      }
    `);
    sheet.insertRule(`.bar.active { opacity: 1; }`);
    sheet.insertRule(`
      .bar.complete {
        opacity: 0;
        transition: width 0.2s ease, opacity 0.5s ease 0.2s;
      }
    `);
    return sheet;
  }

  private _applyColorSheet() {
    if (!this.shadowRoot || !this._layoutSheet || !this._progressSheet) return;
    this._sheet = this._buildColorSheet();
    this.shadowRoot.adoptedStyleSheets = [
      this._layoutSheet,
      this._sheet,
      this._progressSheet,
    ];
  }

  private _render() {
    // Next.js SSR may have already attached a Declarative Shadow DOM — reuse it
    // rather than calling attachShadow again (which would throw or no-op).
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    // Static layout rules — never change after mount.
    const layoutSheet = new CSSStyleSheet();
    layoutSheet.insertRule(`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
        pointer-events: none;
      }
    `);
    this._layoutSheet = layoutSheet;

    // Mutable progress sheet — updated via replaceSync, never inline styles.
    const progressSheet = new CSSStyleSheet();
    progressSheet.insertRule(`.bar { width: 0%; }`);
    this._progressSheet = progressSheet;

    // Build color sheet after upgrade so getAttribute reads the real attributes.
    this._sheet = this._buildColorSheet();
    shadow.adoptedStyleSheets = [
      this._layoutSheet,
      this._sheet,
      this._progressSheet,
    ];

    // Only append the bar div if SSR didn't already render it.
    if (!shadow.querySelector(".bar")) {
      const bar = document.createElement("div");
      bar.className = "bar";
      shadow.append(bar);
    }
  }

  private _setWidth(pct: number) {
    if (!this._progressSheet) return;
    // replaceSync rewrites the whole sheet — no inline styles, CSP-safe.
    this._progressSheet.replaceSync(`.bar { width: ${pct}%; }`);
  }

  /**
   * Starts the progress animation.
   * If already running, restarts from 0.
   * @returns The element instance for chaining
   */
  /**
   * Starts the progress animation.
   * If already running, restarts from 0.
   * @returns The element instance for chaining
   */
  start(): this {
    // If start is called while a load is already in progress, reset to 0 and
    // start again rather than queuing.
    this._clearTimer();
    this._setWidth(0);
    this._applyActive(true);

    let p = 0;
    this._autoTimer = setInterval(() => {
      p += (85 - p) * 0.08;
      this._setWidth(Math.min(p, 85));
    }, 200);

    return this;
  }

  /**
   * Completes the progress animation and fades out.
   * @returns The element instance for chaining
   */
  /**
   * Completes the progress animation and fades out.
   * @returns The element instance for chaining
   */
  finish(): this {
    this._clearTimer();

    const bar = this.shadowRoot?.querySelector<HTMLDivElement>(".bar");
    if (!bar) return this;

    bar.classList.remove("active");
    bar.classList.add("complete");
    this._setWidth(100);

    setTimeout(() => {
      bar.classList.remove("complete");
      this._setWidth(0);
      this._applyActive(false);
    }, 700);

    return this;
  }

  private _applyActive(active: boolean) {
    const bar = this.shadowRoot?.querySelector<HTMLDivElement>(".bar");
    if (!bar) return;
    bar.classList.toggle("active", active);

    if (
      active &&
      // Only capture start time on the first call — onRouterTransitionStart fires
      // after the navigate event, so we preserve the earlier timestamp.
      this._startTime === undefined
    ) {
      this._startTime = performance.now();
    }

    if (!active && this._startTime !== undefined) {
      const duration = performance.now() - this._startTime;
      console.log(`[top-loading-bar] navigation took ${duration.toFixed(0)}ms`);
      this._startTime = undefined;
    }
  }

  private _clearTimer() {
    if (this._autoTimer !== undefined) {
      clearInterval(this._autoTimer);
      this._autoTimer = undefined;
    }
  }
}

/** The HTML tag name for the NavProgressBar custom element */
export const TAG_NAME = "vctqs1-nav-progress-bar" as const;

/**
 * Registers the NavProgressBar custom element.
 * Requires Navigation API support; does nothing if unavailable.
 * 
 * @param options Configuration options for all instances
 * 
 * @example
 * ```ts
 * registerNavProgressBar({ primary: '#0066cc' });
 * ```
 */
export function registerNavProgressBar(options?: NavProgressBarOptions) {
  if (typeof customElements === "undefined") return;
  // Without Navigation API support, navigatesuccess never fires and the bar
  // would never complete — skip registration entirely.
  if (!getNavigationApi()) return;

  if (!customElements.get(TAG_NAME)) {
    // Subclass with options baked into the constructor — customElements.define
    // requires a class, not a factory function.
    class NavProgressBarWithOptions extends NavProgressBar {
      constructor() {
        super(options);
      }
    }
    customElements.define(TAG_NAME, NavProgressBarWithOptions);
  }
}

/**
 * Gets the first NavProgressBar instance in the DOM.
 * @returns The NavProgressBar element or null if not found
 * 
 * @example
 * ```ts
 * const bar = getNavProgressBar();
 * if (bar) {
 *   bar.start();
 * }
 * ```
 */
export function getNavProgressBar(): NavProgressBar | null {
  return document.querySelector<NavProgressBar>(TAG_NAME);
}


