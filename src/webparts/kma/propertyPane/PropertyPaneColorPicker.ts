import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-property-pane';
import ColorPicker from '../components/ColorPicker';

export interface IPropertyPaneColorPickerProps {
  label: string;
  selectedColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  key: string;
  description?: string;
}

export interface IPropertyPaneColorPickerInternalProps extends IPropertyPaneColorPickerProps {
  targetProperty: string;
  onRender: (elem: HTMLElement) => void;
  onDispose: (elem: HTMLElement) => void;
}

class PropertyPaneColorPickerBuilder implements IPropertyPaneField<IPropertyPaneColorPickerInternalProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneColorPickerInternalProps;

  constructor(targetProperty: string, properties: IPropertyPaneColorPickerProps) {
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
    const colorPicker: React.ReactElement<any> = React.createElement(ColorPicker, {
      label: this.properties.label,
      selectedColor: this.properties.selectedColor,
      description: this.properties.description,
      onColorChange: (color: string) => {
        this.properties.onPropertyChange(this.targetProperty, this.properties.selectedColor, color);
      }
    });

    ReactDom.render(colorPicker, elem);
  }
}

export function PropertyPaneColorPicker(targetProperty: string, properties: IPropertyPaneColorPickerProps): IPropertyPaneField<IPropertyPaneColorPickerInternalProps> {
  return new PropertyPaneColorPickerBuilder(targetProperty, properties);
}
