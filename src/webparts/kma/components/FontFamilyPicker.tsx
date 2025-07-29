import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ComboBox,
  IComboBox,
  IComboBoxOption,
  Stack,
  Text,
  IStackTokens
} from '@fluentui/react';

export interface IFontFamilyPickerProps {
  label: string;
  selectedFont: string;
  onFontChange: (font: string) => void;
  description?: string;
}

const FontFamilyPicker: React.FC<IFontFamilyPickerProps> = ({
  label,
  selectedFont,
  onFontChange,
  description
}) => {
  const [selectedKey, setSelectedKey] = useState<string | number | undefined>(selectedFont);

  useEffect(() => {
    setSelectedKey(selectedFont);
  }, [selectedFont]);

  // Common web-safe font families
  const fontOptions: IComboBoxOption[] = [
    {
      key: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      text: 'Segoe UI (Default)',
      data: { preview: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }
    },
    {
      key: 'Arial, Helvetica, sans-serif',
      text: 'Arial',
      data: { preview: 'Arial, Helvetica, sans-serif' }
    },
    {
      key: 'Helvetica, Arial, sans-serif',
      text: 'Helvetica',
      data: { preview: 'Helvetica, Arial, sans-serif' }
    },
    {
      key: 'Times New Roman, Times, serif',
      text: 'Times New Roman',
      data: { preview: 'Times New Roman, Times, serif' }
    },
    {
      key: 'Georgia, Times, serif',
      text: 'Georgia',
      data: { preview: 'Georgia, Times, serif' }
    },
    {
      key: 'Courier New, Courier, monospace',
      text: 'Courier New',
      data: { preview: 'Courier New, Courier, monospace' }
    },
    {
      key: 'Verdana, Geneva, sans-serif',
      text: 'Verdana',
      data: { preview: 'Verdana, Geneva, sans-serif' }
    },
    {
      key: 'Trebuchet MS, Helvetica, sans-serif',
      text: 'Trebuchet MS',
      data: { preview: 'Trebuchet MS, Helvetica, sans-serif' }
    },
    {
      key: 'Impact, Charcoal, sans-serif',
      text: 'Impact',
      data: { preview: 'Impact, Charcoal, sans-serif' }
    },
    {
      key: 'Palatino, Palatino Linotype, serif',
      text: 'Palatino',
      data: { preview: 'Palatino, Palatino Linotype, serif' }
    }
  ];

  const stackTokens: IStackTokens = { childrenGap: 5 };

  const handleFontChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
    let newFont: string;
    
    if (option) {
      // User selected from dropdown
      newFont = option.key as string;
    } else if (value) {
      // User typed custom value
      newFont = value;
    } else {
      return;
    }

    setSelectedKey(newFont);
    onFontChange(newFont);
  };

  const onRenderOption = (option: IComboBoxOption): JSX.Element => {
    return (
      <div style={{ fontFamily: option.data?.preview || option.key as string }}>
        <Text variant="medium">{option.text}</Text>
        <Text variant="small" styles={{ root: { color: '#666', marginLeft: 8 } }}>
          Sample Text
        </Text>
      </div>
    );
  };

  return (
    <Stack tokens={stackTokens}>
      <ComboBox
        label={label}
        selectedKey={selectedKey}
        options={fontOptions}
        onChange={handleFontChange}
        allowFreeform={true}
        autoComplete="on"
        placeholder="Select or type a font family"
        onRenderOption={onRenderOption}
        styles={{
          root: { maxWidth: 300 },
          input: { fontFamily: selectedFont }
        }}
      />
      {description && (
        <Text variant="small" styles={{ root: { color: '#666' } }}>
          {description}
        </Text>
      )}
    </Stack>
  );
};

export default FontFamilyPicker;
