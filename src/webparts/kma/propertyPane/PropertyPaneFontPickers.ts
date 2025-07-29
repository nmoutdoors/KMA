import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-property-pane';
import FontFamilyPicker from '../components/FontFamilyPicker';
import FontSizePicker from '../components/FontSizePicker';

// Font Family Property Pane Control
export interface IPropertyPaneFontFamilyProps {
  label: string;
  selectedFont: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  key: string;
  description?: string;
}

export interface IPropertyPaneFontFamilyInternalProps extends IPropertyPaneFontFamilyProps {
  targetProperty: string;
  onRender: (elem: HTMLElement) => void;
  onDispose: (elem: HTMLElement) => void;
}

class PropertyPaneFontFamilyBuilder implements IPropertyPaneField<IPropertyPaneFontFamilyInternalProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneFontFamilyInternalProps;

  constructor(targetProperty: string, properties: IPropertyPaneFontFamilyProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      ...properties,
      targetProperty,
      onRender: this.onRender.bind(this),
      onDispose: this.onDispose.bind(this)
    };
  }

  public render(): void {
    if (!this.elem) {
      return;
    }
    this.onRender(this.elem);
  }

  private elem: HTMLElement;

  private onDispose(element: HTMLElement): void {
    ReactDom.unmountComponentAtNode(element);
  }

  private onRender(elem: HTMLElement): void {
    if (!this.elem) {
      this.elem = elem;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fontFamilyPicker: React.ReactElement<any> = React.createElement(FontFamilyPicker, {
      label: this.properties.label,
      selectedFont: this.properties.selectedFont,
      description: this.properties.description,
      onFontChange: (font: string) => {
        this.properties.onPropertyChange(this.targetProperty, this.properties.selectedFont, font);
      }
    });

    ReactDom.render(fontFamilyPicker, elem);
  }
}

// Font Size Property Pane Control
export interface IPropertyPaneFontSizeProps {
  label: string;
  selectedSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  key: string;
  description?: string;
  sizeType?: 'base' | 'title' | 'header';
}

export interface IPropertyPaneFontSizeInternalProps extends IPropertyPaneFontSizeProps {
  targetProperty: string;
  onRender: (elem: HTMLElement) => void;
  onDispose: (elem: HTMLElement) => void;
}

class PropertyPaneFontSizeBuilder implements IPropertyPaneField<IPropertyPaneFontSizeInternalProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneFontSizeInternalProps;

  constructor(targetProperty: string, properties: IPropertyPaneFontSizeProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      ...properties,
      targetProperty,
      onRender: this.onRender.bind(this),
      onDispose: this.onDispose.bind(this)
    };
  }

  public render(): void {
    if (!this.elem) {
      return;
    }
    this.onRender(this.elem);
  }

  private elem: HTMLElement;

  private onDispose(element: HTMLElement): void {
    ReactDom.unmountComponentAtNode(element);
  }

  private onRender(elem: HTMLElement): void {
    if (!this.elem) {
      this.elem = elem;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fontSizePicker: React.ReactElement<any> = React.createElement(FontSizePicker, {
      label: this.properties.label,
      selectedSize: this.properties.selectedSize,
      description: this.properties.description,
      sizeType: this.properties.sizeType,
      onSizeChange: (size: number) => {
        this.properties.onPropertyChange(this.targetProperty, this.properties.selectedSize, size);
      }
    });

    ReactDom.render(fontSizePicker, elem);
  }
}

// Export functions
export function PropertyPaneFontFamily(targetProperty: string, properties: IPropertyPaneFontFamilyProps): IPropertyPaneField<IPropertyPaneFontFamilyInternalProps> {
  return new PropertyPaneFontFamilyBuilder(targetProperty, properties);
}

export function PropertyPaneFontSize(targetProperty: string, properties: IPropertyPaneFontSizeProps): IPropertyPaneField<IPropertyPaneFontSizeInternalProps> {
  return new PropertyPaneFontSizeBuilder(targetProperty, properties);
}
