// src/components/common/LoadingSpinner.tsx
import PropTypes from 'prop-types'
import styles from '@/styles/LoadingSpinner.module.css'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      {/* Keyframes are defined in the CSS module */}

      {/* Multi-colored spinner */}
      <div className={styles.spinnerContainer}>
        <div className={`${styles.spinnerLayer} ${styles.spinnerSlow}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerMedium}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerFast}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerSlower}`}></div>

        {/* Center dot */}
        <div className={styles.centerDotContainer}>
          <div className={styles.centerDot}></div>
        </div>
      </div>

      {/* Animated text */}
      <p className={styles.animatedText}>{message}</p>

      {/* Bouncing dots */}
      <div className={styles.dotsContainer}>
        <div className={`${styles.bounceDot} ${styles.bounce1}`}></div>
        <div className={`${styles.bounceDot} ${styles.bounce2}`}></div>
        <div className={`${styles.bounceDot} ${styles.bounce3}`}></div>
      </div>
    </div>
  )
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
}

export default LoadingSpinner
