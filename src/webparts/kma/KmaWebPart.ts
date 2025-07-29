import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPPermission } from '@microsoft/sp-page-context';

import * as strings from 'KmaWebPartStrings';
import Kma from './components/Kma';
import { IKmaProps } from './components/IKmaProps';
import { PropertyPaneColorPicker } from './propertyPane/PropertyPaneColorPicker';
import { PropertyPaneFontFamily, PropertyPaneFontSize } from './propertyPane/PropertyPaneFontPickers';

export interface IKmaWebPartProps {
  description: string;

  // Display Properties - Colors
  bannerColorLight: string;
  bannerColorMedium: string;
  bannerColorDark: string;
  bannerHighlight: string;
  organizationColorPrimary: string;
  organizationColorSecondary: string;
  assessmentLevelColor: string;
  questionScoreColor: string;
  subheadingBackgroundColor: string;

  // Display Properties - Fonts
  primaryFontFamily: string;
  baseFontSize: number;
  titleFontSize: number;
  sectionHeaderFontSize: number;
}

export default class KmaWebPart extends BaseClientSideWebPart<IKmaWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _isFullscreen: boolean = true;
  private _isUserAdmin: boolean = false;

  public render(): void {
    // Make the web part fullscreen by default
    if (this._isFullscreen) {
      this._makeFullscreen();
    }

    const element: React.ReactElement<IKmaProps> = React.createElement(
      Kma,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        onToggleFullscreen: this._toggleFullscreen.bind(this),
        onToggleSettings: this._toggleSettings.bind(this),
        isFullscreen: this._isFullscreen,
        isUserAdmin: this._isUserAdmin,
        displayProperties: {
          bannerColorLight: this.properties.bannerColorLight,
          bannerColorMedium: this.properties.bannerColorMedium,
          bannerColorDark: this.properties.bannerColorDark,
          bannerHighlight: this.properties.bannerHighlight,
          organizationColorPrimary: this.properties.organizationColorPrimary,
          organizationColorSecondary: this.properties.organizationColorSecondary,
          assessmentLevelColor: this.properties.assessmentLevelColor,
          questionScoreColor: this.properties.questionScoreColor,
          subheadingBackgroundColor: this.properties.subheadingBackgroundColor,
          primaryFontFamily: this.properties.primaryFontFamily,
          baseFontSize: this.properties.baseFontSize,
          titleFontSize: this.properties.titleFontSize,
          sectionHeaderFontSize: this.properties.sectionHeaderFontSize
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _toggleFullscreen(): void {
    this._isFullscreen = !this._isFullscreen;

    if (this._isFullscreen) {
      // Enter fullscreen mode
      this._makeFullscreen();
    } else {
      // Exit fullscreen mode
      // Remove fullscreen class from body
      document.body.classList.remove('kma-fullscreen');

      // Restore SharePoint chrome
      this._restoreSharePointChrome();

      // Reset parent container styles
      if (this.domElement) {
        let parent = this.domElement.parentElement;
        while (parent && parent !== document.body) {
          parent.style.height = '';
          parent.style.width = '';
          parent.style.margin = '';
          parent.style.padding = '';
          parent.style.overflow = '';
          parent = parent.parentElement;
        }
      }
    }

    // Re-render the component
    this.render();
  }

  private _toggleSettings(): void {
    // Toggle the property pane
    if (this.context.propertyPane.isPropertyPaneOpen()) {
      this.context.propertyPane.close();
    } else {
      this.context.propertyPane.open();
    }
  }

  private _makeFullscreen(): void {
    // Add fullscreen class to body for CSS-based approach
    document.body.classList.add('kma-fullscreen');

    // Set the web part container to take full screen
    if (this.domElement) {
      // Remove any constraints from parent containers
      let parent = this.domElement.parentElement;
      while (parent && parent !== document.body) {
        parent.style.height = '100vh';
        parent.style.width = '100vw';
        parent.style.margin = '0';
        parent.style.padding = '0';
        parent.style.overflow = 'hidden';
        parent = parent.parentElement;
      }

      // Hide SharePoint chrome elements programmatically as backup
      this._hideSharePointChrome();
    }
  }

  private _hideSharePointChrome(): void {
    // Hide common SharePoint navigation elements
    const elementsToHide = [
      '#SuiteNavWrapper',
      '#spPageChrome',
      '.ms-compositeHeader',
      '.commandBarWrapper',
      '.sp-appBar',
      '.od-TopBar',
      '.ms-Nav',
      '[data-automation-id="pageHeader"]',
      '.spPageChrome',
      '.ms-Fabric .ms-Nav'
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
    });
  }

  protected onInit(): Promise<void> {
    // Set default values for display properties if not already set
    if (!this.properties.bannerColorLight) this.properties.bannerColorLight = '#4a90e2';
    if (!this.properties.bannerColorMedium) this.properties.bannerColorMedium = '#357abd';
    if (!this.properties.bannerColorDark) this.properties.bannerColorDark = '#1e5f99';
    if (!this.properties.bannerHighlight) this.properties.bannerHighlight = '#4EA72E';
    if (!this.properties.organizationColorPrimary) this.properties.organizationColorPrimary = '#4EA72E';
    if (!this.properties.organizationColorSecondary) this.properties.organizationColorSecondary = '#4a7c59';
    if (!this.properties.assessmentLevelColor) this.properties.assessmentLevelColor = '#4a7c59';
    if (!this.properties.questionScoreColor) this.properties.questionScoreColor = '#2c5aa0';
    if (!this.properties.subheadingBackgroundColor) this.properties.subheadingBackgroundColor = '#e6f3ff';
    if (!this.properties.primaryFontFamily) this.properties.primaryFontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    if (!this.properties.baseFontSize) this.properties.baseFontSize = 12.65;
    if (!this.properties.titleFontSize) this.properties.titleFontSize = 20.7;
    if (!this.properties.sectionHeaderFontSize) this.properties.sectionHeaderFontSize = 15.18;

    return Promise.all([
      this._getEnvironmentMessage(),
      this._checkUserPermissions()
    ]).then(([message]) => {
      this._environmentMessage = message;
    });
  }

  private async _checkUserPermissions(): Promise<void> {
    try {
      const currentUser = this.context.pageContext.user;
      const webPermissions = this.context.pageContext.web.permissions;

      // Check if user has design or manage permissions
      const hasManageWebPermission = webPermissions.hasPermission(SPPermission.manageWeb);
      const hasManagePermissionsPermission = webPermissions.hasPermission(SPPermission.managePermissions);
      const hasAddAndCustomizePagesPermission = webPermissions.hasPermission(SPPermission.addAndCustomizePages);
      const hasFullControlPermission = webPermissions.hasPermission(SPPermission.fullMask);

      // User is considered admin if they have any of these permissions
      this._isUserAdmin = hasManageWebPermission ||
                         hasManagePermissionsPermission ||
                         hasAddAndCustomizePagesPermission ||
                         hasFullControlPermission ||
                         currentUser.loginName.toLowerCase().indexOf('admin') !== -1;

      console.log('User admin status:', this._isUserAdmin, {
        manageWeb: hasManageWebPermission,
        managePermissions: hasManagePermissionsPermission,
        addAndCustomizePages: hasAddAndCustomizePagesPermission,
        fullControl: hasFullControlPermission,
        user: currentUser.loginName
      });

    } catch (error) {
      console.warn('Could not determine user permissions, defaulting to non-admin:', error);
      this._isUserAdmin = false;
    }
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    // Remove fullscreen class from body
    document.body.classList.remove('kma-fullscreen');

    // Restore SharePoint chrome when disposing
    this._restoreSharePointChrome();

    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private _restoreSharePointChrome(): void {
    // Restore common SharePoint navigation elements
    const elementsToRestore = [
      '#SuiteNavWrapper',
      '#spPageChrome',
      '.ms-compositeHeader',
      '.commandBarWrapper',
      '.sp-appBar',
      '.od-TopBar',
      '.ms-Nav',
      '[data-automation-id="pageHeader"]',
      '.spPageChrome',
      '.ms-Fabric .ms-Nav'
    ];

    elementsToRestore.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        (element as HTMLElement).style.display = '';
      });
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'baseFontSize' || propertyPath === 'titleFontSize' || propertyPath === 'sectionHeaderFontSize') {
      // Convert string to number for font size properties
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.properties as any)[propertyPath] = parseFloat(newValue as string) || oldValue;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.properties as any)[propertyPath] = newValue;
    }

    this.render();
  }



  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            },
            {
              groupName: 'Display',
              groupFields: [
                PropertyPaneColorPicker('bannerColorLight', {
                  label: 'Banner Color (Light)',
                  selectedColor: this.properties.bannerColorLight || '#4a90e2',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'bannerColorLight',
                  description: 'Light blue color for banner gradients'
                }),
                PropertyPaneColorPicker('bannerColorMedium', {
                  label: 'Banner Color (Medium)',
                  selectedColor: this.properties.bannerColorMedium || '#357abd',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'bannerColorMedium',
                  description: 'Medium blue color for banner gradients'
                }),
                PropertyPaneColorPicker('bannerColorDark', {
                  label: 'Banner Color (Dark)',
                  selectedColor: this.properties.bannerColorDark || '#1e5f99',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'bannerColorDark',
                  description: 'Dark blue color for banner gradients'
                }),
                PropertyPaneColorPicker('bannerHighlight', {
                  label: 'Banner Highlight Color',
                  selectedColor: this.properties.bannerHighlight || '#4EA72E',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'bannerHighlight',
                  description: 'Bright green color for banner highlights'
                }),
                PropertyPaneColorPicker('organizationColorPrimary', {
                  label: 'Organization Color (Primary)',
                  selectedColor: this.properties.organizationColorPrimary || '#4EA72E',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'organizationColorPrimary',
                  description: 'Primary green color for organization elements'
                }),
                PropertyPaneColorPicker('organizationColorSecondary', {
                  label: 'Organization Color (Secondary)',
                  selectedColor: this.properties.organizationColorSecondary || '#4a7c59',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'organizationColorSecondary',
                  description: 'Secondary green color for organization elements'
                }),
                PropertyPaneColorPicker('assessmentLevelColor', {
                  label: 'Assessment Level Color',
                  selectedColor: this.properties.assessmentLevelColor || '#4a7c59',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'assessmentLevelColor',
                  description: 'Green color for assessment level indicators'
                }),
                PropertyPaneColorPicker('questionScoreColor', {
                  label: 'Question Score Color',
                  selectedColor: this.properties.questionScoreColor || '#2c5aa0',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'questionScoreColor',
                  description: 'Blue color for question score displays'
                }),
                PropertyPaneColorPicker('subheadingBackgroundColor', {
                  label: 'Subheading Background Color',
                  selectedColor: this.properties.subheadingBackgroundColor || '#e6f3ff',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'subheadingBackgroundColor',
                  description: 'Light blue/grey background color for subheading rows'
                }),
                PropertyPaneFontFamily('primaryFontFamily', {
                  label: 'Primary Font Family',
                  selectedFont: this.properties.primaryFontFamily || 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'primaryFontFamily',
                  description: 'Select a font family or type your own CSS font stack'
                }),
                PropertyPaneFontSize('baseFontSize', {
                  label: 'Base Font Size',
                  selectedSize: this.properties.baseFontSize || 12.65,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'baseFontSize',
                  sizeType: 'base',
                  description: 'Font size for regular text and form elements'
                }),
                PropertyPaneFontSize('titleFontSize', {
                  label: 'Title Font Size',
                  selectedSize: this.properties.titleFontSize || 20.7,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'titleFontSize',
                  sizeType: 'title',
                  description: 'Font size for main titles and headings'
                }),
                PropertyPaneFontSize('sectionHeaderFontSize', {
                  label: 'Section Header Font Size',
                  selectedSize: this.properties.sectionHeaderFontSize || 15.18,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'sectionHeaderFontSize',
                  sizeType: 'header',
                  description: 'Font size for section headers and subheadings'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
