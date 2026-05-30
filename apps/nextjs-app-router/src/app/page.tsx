import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there  👋, </span>
              Welcome @vctqs1/nextjs-app-router
            </h1>
          </div>

          <div id="introduction" className={`${styles.introduction} rounded shadow`}>
            <video
              className={styles.demoVideo}
              autoPlay
              loop
              muted
              playsInline
              controls
              preload="metadata"
              src="/nav-progress-bar-demo.mov"
            >
              Your browser does not support the video tag.
            </video>
            <p className={styles.caption}>
              Demo: instant route feedback with the navigation top progress bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
