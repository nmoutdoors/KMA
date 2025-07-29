export interface IDisplayProperties {
  bannerColorLight: string;
  bannerColorMedium: string;
  bannerColorDark: string;
  bannerHighlight: string;
  organizationColorPrimary: string;
  organizationColorSecondary: string;
  assessmentLevelColor: string;
  questionScoreColor: string;
  subheadingBackgroundColor: string;
  primaryFontFamily: string;
  baseFontSize: number;
  titleFontSize: number;
  sectionHeaderFontSize: number;
}

export interface IKmaProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  onToggleFullscreen?: () => void;
  onToggleSettings?: () => void;
  isFullscreen?: boolean;
  isUserAdmin?: boolean;
  displayProperties?: IDisplayProperties;
}
