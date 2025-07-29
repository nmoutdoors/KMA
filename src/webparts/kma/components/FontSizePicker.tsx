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

export interface IFontSizePickerProps {
  label: string;
  selectedSize: number;
  onSizeChange: (size: number) => void;
  description?: string;
  sizeType?: 'base' | 'title' | 'header';
}

const FontSizePicker: React.FC<IFontSizePickerProps> = ({
  label,
  selectedSize,
  onSizeChange,
  description,
  sizeType = 'base'
}) => {
  const [selectedKey, setSelectedKey] = useState<string | number | undefined>(selectedSize.toString());

  useEffect(() => {
    setSelectedKey(selectedSize.toString());
  }, [selectedSize]);

  // Font size options based on type
  const getFontSizeOptions = (): IComboBoxOption[] => {
    switch (sizeType) {
      case 'title':
        return [
          { key: '16', text: '16px - Small Title' },
          { key: '18', text: '18px - Medium Title' },
          { key: '20', text: '20px - Large Title' },
          { key: '20.7', text: '20.7px - Current Default' },
          { key: '22', text: '22px - Extra Large' },
          { key: '24', text: '24px - Huge Title' },
          { key: '26', text: '26px - Banner Title' },
          { key: '28', text: '28px - Hero Title' },
          { key: '32', text: '32px - Display Title' },
          { key: '36', text: '36px - Massive Title' }
        ];
      
      case 'header':
        return [
          { key: '12', text: '12px - Small Header' },
          { key: '13', text: '13px - Compact Header' },
          { key: '14', text: '14px - Standard Header' },
          { key: '15', text: '15px - Medium Header' },
          { key: '15.18', text: '15.18px - Current Default' },
          { key: '16', text: '16px - Large Header' },
          { key: '17', text: '17px - Prominent Header' },
          { key: '18', text: '18px - Bold Header' },
          { key: '20', text: '20px - Major Header' },
          { key: '22', text: '22px - Section Title' }
        ];
      
      default: // base
        return [
          { key: '10', text: '10px - Tiny Text' },
          { key: '11', text: '11px - Small Text' },
          { key: '12', text: '12px - Standard Text' },
          { key: '12.65', text: '12.65px - Current Default' },
          { key: '13', text: '13px - Medium Text' },
          { key: '14', text: '14px - Large Text' },
          { key: '15', text: '15px - Readable Text' },
          { key: '16', text: '16px - Comfortable Text' },
          { key: '17', text: '17px - Prominent Text' },
          { key: '18', text: '18px - Bold Text' }
        ];
    }
  };

  const stackTokens: IStackTokens = { childrenGap: 5 };

  const handleSizeChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
    let newSize: number;
    
    if (option) {
      // User selected from dropdown
      newSize = parseFloat(option.key as string);
    } else if (value) {
      // User typed custom value
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue <= 0) {
        return; // Invalid input, don't update
      }
      newSize = parsedValue;
    } else {
      return;
    }

    setSelectedKey(newSize.toString());
    onSizeChange(newSize);
  };

  const onRenderOption = (option: IComboBoxOption): JSX.Element => {
    const size = parseFloat(option.key as string);
    return (
      <div style={{ fontSize: Math.min(size, 18) + 'px' }}>
        <Text variant="medium">{option.text}</Text>
      </div>
    );
  };

  const validateInput = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return 'Please enter a valid font size (e.g., 12.5)';
    }
    if (num < 8) {
      return 'Font size should be at least 8px for readability';
    }
    if (num > 72) {
      return 'Font size should not exceed 72px';
    }
    return '';
  };

  return (
    <Stack tokens={stackTokens}>
      <ComboBox
        label={label}
        selectedKey={selectedKey}
        options={getFontSizeOptions()}
        onChange={handleSizeChange}
        allowFreeform={true}
        autoComplete="on"
        placeholder="Select or type font size"
        onRenderOption={onRenderOption}
        styles={{
          root: { maxWidth: 250 }
        }}
        errorMessage={typeof selectedKey === 'string' ? validateInput(selectedKey) : undefined}
      />
      {description && (
        <Text variant="small" styles={{ root: { color: '#666' } }}>
          {description}
        </Text>
      )}
    </Stack>
  );
};

export default FontSizePicker;
