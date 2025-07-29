import * as React from 'react';
import styles from './Toolbar.module.scss';

export interface IToolbarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  onToggleFullscreen?: () => void;
  onToggleSettings?: () => void;
  isFullscreen?: boolean;
  isUserAdmin?: boolean;
}

export const Toolbar: React.FC<IToolbarProps> = ({
  activeView = 'take-assessment',
  onViewChange,
  onToggleFullscreen,
  onToggleSettings,
  isFullscreen = true,
  isUserAdmin = false
}) => {
  const handleViewClick = (view: string): void => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.navItems}>
        <button 
          className={`${styles.navItem} ${activeView === 'home' ? styles.active : ''}`}
          onClick={() => handleViewClick('home')}
        >
          Home
        </button>
        <span className={styles.separator}>|</span>
        <button 
          className={`${styles.navItem} ${activeView === 'comparison' ? styles.active : ''}`}
          onClick={() => handleViewClick('comparison')}
        >
          Comparison View
        </button>
        <span className={styles.separator}>|</span>
        <button 
          className={`${styles.navItem} ${activeView === 'take-assessment' ? styles.active : ''}`}
          onClick={() => handleViewClick('take-assessment')}
        >
          Take Assessment
        </button>
        <span className={styles.separator}>|</span>
        <button 
          className={`${styles.navItem} ${activeView === 'admin' ? styles.active : ''}`}
          onClick={() => handleViewClick('admin')}
        >
          Admin View
        </button>
      </div>
      <div className={styles.rightSection}>
        {isUserAdmin && (
          <>
            {!isFullscreen && (
              <button
                className={styles.settingsButton}
                onClick={onToggleSettings}
                title="WebPart Settings"
              >
                <span className={styles.cogwheel}>⚙️</span>
              </button>
            )}
            <button
              className={styles.fullscreenButton}
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              <span className={styles.doubleArrow}>
                {isFullscreen ? '⤢' : '⤡'}
              </span>
            </button>
          </>
        )}
        <div className={styles.logo}>
          <span className={styles.logoText}>KMA</span>
        </div>
      </div>
    </div>
  );
};
