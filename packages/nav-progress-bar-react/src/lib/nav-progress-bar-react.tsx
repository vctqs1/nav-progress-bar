import type { NavProgressBarOptions } from "@vctqs1/nav-progress-bar"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "vctqs1-nav-progress-bar": import("react").HTMLAttributes<HTMLElement> & NavProgressBarOptions;
    }
  }
}

function NavProgressBar({
  primary = "#006bde"
}: NavProgressBarOptions) {
  return <vctqs1-nav-progress-bar primary={primary} />;
}

export default NavProgressBar;
