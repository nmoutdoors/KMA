import * as React from 'react';
import styles from './Kma.module.scss';
import type { IKmaProps } from './IKmaProps';
import { Toolbar } from './Toolbar';
import AssessmentForm from './AssessmentForm';

interface IKmaState {
  activeView: string;
}

export default class Kma extends React.Component<IKmaProps, IKmaState> {
  constructor(props: IKmaProps) {
    super(props);
    this.state = {
      activeView: 'take-assessment'
    };
  }

  private handleViewChange = (view: string): void => {
    this.setState({ activeView: view });
  }

  private handleToggleFullscreen = (): void => {
    if (this.props.onToggleFullscreen) {
      this.props.onToggleFullscreen();
    }
  }

  private handleToggleSettings = (): void => {
    if (this.props.onToggleSettings) {
      this.props.onToggleSettings();
    }
  }

  private renderContent(): React.ReactElement {
    const { activeView } = this.state;

    switch (activeView) {
      case 'home':
        return (
          <div className={styles.viewContent}>
            <h1>Home</h1>
            <p>Welcome to the Knowledge Management Assessment tool.</p>
          </div>
        );
      case 'comparison':
        return (
          <div className={styles.viewContent}>
            <h1>Comparison View</h1>
            <p>Compare assessment results and analytics.</p>
          </div>
        );
      case 'take-assessment':
        return (
          <div className={styles.takeAssessment}>
            <AssessmentForm
              onDataChange={(data) => {
                console.log('Assessment data changed:', data);
              }}
              displayProperties={this.props.displayProperties}
              isFullscreen={this.props.isFullscreen}
            />
          </div>
        );
      case 'admin':
        return (
          <div className={styles.viewContent}>
            <h1>Admin View</h1>
            <p>Administrative tools and settings for the Knowledge Management Assessment.</p>
          </div>
        );
      default:
        return (
          <div className={styles.viewContent}>
            <h1>Take Assessment</h1>
            <p>Knowledge Management Assessment tool.</p>
          </div>
        );
    }
  }

  public render(): React.ReactElement<IKmaProps> {
    const {
      hasTeamsContext,
      isFullscreen,
      isUserAdmin
    } = this.props;
    const { activeView } = this.state;

    return (
      <div className={`${styles.kma} ${hasTeamsContext ? styles.teams : ''}`}>
        <Toolbar
          activeView={activeView}
          onViewChange={this.handleViewChange}
          onToggleFullscreen={this.handleToggleFullscreen}
          onToggleSettings={this.handleToggleSettings}
          isFullscreen={isFullscreen}
          isUserAdmin={isUserAdmin}
        />
        <main className={styles.mainContent}>
          {this.renderContent()}
        </main>
      </div>
    );
  }
}
