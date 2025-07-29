import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  TextField,
  Panel,
  PanelType,
  DefaultButton,
  PrimaryButton,
  Stack,
  Text,
  IStackTokens
} from '@fluentui/react';

export interface IColorPickerProps {
  label: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  description?: string;
}

const ColorPicker: React.FC<IColorPickerProps> = ({
  label,
  selectedColor,
  onColorChange,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(selectedColor);
  const [colorInput, setColorInput] = useState(selectedColor);

  useEffect(() => {
    setTempColor(selectedColor);
    setColorInput(selectedColor);
  }, [selectedColor]);

  // Predefined color palette
  const colorPalette = [
    // Blues (Banner colors)
    '#4a90e2', '#357abd', '#1e5f99', '#2c5aa0',
    // Greens (Organization colors)
    '#4EA72E', '#4a7c59', '#5CB83A', '#3d6b47',
    // Common colors
    '#ff4444', '#ff8800', '#ffcc00', '#88cc00',
    '#00cc88', '#0088cc', '#4400cc', '#cc0088',
    '#666666', '#999999', '#cccccc', '#ffffff',
    '#333333', '#000000', '#8B4513', '#800080'
  ];

  const stackTokens: IStackTokens = { childrenGap: 10 };

  const handleColorSelect = (color: string): void => {
    setTempColor(color);
    setColorInput(color);
  };

  const handleApply = (): void => {
    onColorChange(tempColor);
    setIsOpen(false);
  };

  const handleCancel = (): void => {
    setTempColor(selectedColor);
    setColorInput(selectedColor);
    setIsOpen(false);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    if (newValue !== undefined) {
      setColorInput(newValue);
      // Validate hex color format
      if (/^#[0-9A-F]{6}$/i.test(newValue)) {
        setTempColor(newValue);
      }
    }
  };

  const isValidHex = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  return (
    <>
      <Stack tokens={stackTokens}>
        <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
          {label}
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
          <div
            style={{
              width: 40,
              height: 30,
              backgroundColor: selectedColor,
              border: '2px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer'
            }}
            onClick={() => setIsOpen(true)}
            title={`Current color: ${selectedColor}`}
          />
          <TextField
            value={selectedColor}
            readOnly
            styles={{ root: { width: 100 } }}
            onClick={() => setIsOpen(true)}
          />
          <DefaultButton
            text="Change"
            onClick={() => setIsOpen(true)}
          />
        </Stack>
        {description && (
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            {description}
          </Text>
        )}
      </Stack>

      <Panel
        headerText={`Select ${label}`}
        isOpen={isOpen}
        onDismiss={handleCancel}
        type={PanelType.medium}
        closeButtonAriaLabel="Close"
      >
        <Stack tokens={stackTokens}>
          {/* Color Preview */}
          <Stack horizontal tokens={{ childrenGap: 15 }} verticalAlign="center">
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: tempColor,
                border: '2px solid #ccc',
                borderRadius: 8
              }}
            />
            <Stack>
              <Text variant="mediumPlus">Preview</Text>
              <Text variant="small">{tempColor}</Text>
            </Stack>
          </Stack>

          {/* Hex Input */}
          <TextField
            label="Hex Color Code"
            value={colorInput}
            onChange={handleInputChange}
            placeholder="#000000"
            description="Enter a 6-digit hex color code"
            errorMessage={!isValidHex(colorInput) ? 'Please enter a valid hex color (e.g., #FF5733)' : undefined}
          />

          {/* Color Palette */}
          <Text variant="medium" styles={{ root: { fontWeight: 600, marginTop: 20 } }}>
            Color Palette
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 8,
              marginTop: 10
            }}
          >
            {colorPalette.map((color, index) => (
              <div
                key={index}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  border: tempColor === color ? '3px solid #0078d4' : '1px solid #ccc',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'border 0.2s ease'
                }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <Stack horizontal tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: 30 } }}>
            <PrimaryButton
              text="Apply"
              onClick={handleApply}
              disabled={!isValidHex(tempColor)}
            />
            <DefaultButton
              text="Cancel"
              onClick={handleCancel}
            />
          </Stack>
        </Stack>
      </Panel>
    </>
  );
};

export default ColorPicker;
