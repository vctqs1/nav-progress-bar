import {
  registerNavProgressBar,
  getNavProgressBar,
} from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  console.log(`Navigation started: ${navigationType} to ${url}`);
  getNavProgressBar()?.start();
}
