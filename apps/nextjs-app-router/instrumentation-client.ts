import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart() {
  getNavProgressBar()?.start();
}