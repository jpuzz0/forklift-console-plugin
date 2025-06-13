import { type FC, type FormEvent, useEffect } from 'react';

import {
  Button,
  MenuToggle,
  type MenuToggleElement,
  type MenuToggleProps,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

import type { TypeaheadSelectOption } from './types';

type TypeaheadMenuToggleProps = {
  /** Toggle reference */
  toggleRef: React.Ref<MenuToggleElement>;
  /** Input reference */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Placeholder text */
  placeholder: string;
  /** Whether component is disabled */
  isDisabled: boolean;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Toggle width */
  toggleWidth?: string;
  /** Allow clearing selection */
  allowClear: boolean;
  /** Selected option for determining clear button visibility */
  selectedOption?: TypeaheadSelectOption;
  /** Current filtering state */
  isFiltering: boolean;
  /** Current input value */
  inputValue: string;
  /** Callback when input value changes */
  onInputChange?: (value: string) => void;
  /** Callback when selection should be cleared */
  onSelectionClear: () => void;
  /** Callback when toggle is clicked */
  onToggleClick: () => void;
  /** Callback when input value changes (includes filtering state) */
  onInputValueChange: (value: string, isFiltering: boolean) => void;
  /** Additional toggle props */
  toggleProps?: Omit<MenuToggleProps, 'ref' | 'onClick' | 'isExpanded'>;
};

const TypeaheadMenuToggle: FC<TypeaheadMenuToggleProps> = ({
  allowClear,
  inputRef,
  inputValue,
  isDisabled,
  isFiltering,
  isOpen,
  onInputChange,
  onInputValueChange,
  onSelectionClear,
  onToggleClick,
  placeholder,
  selectedOption,
  toggleProps,
  toggleRef,
  toggleWidth,
}) => {
  // Update input value when selected option changes (only when not filtering)
  useEffect(() => {
    if (!isFiltering) {
      const newValue = selectedOption?.content?.toString() ?? '';
      if (newValue !== inputValue) {
        onInputValueChange(newValue, false);
      }
    }
  }, [selectedOption, isFiltering, inputValue, onInputValueChange]);

  const handleToggleClick = (): void => {
    if (isDisabled) return;
    onToggleClick();

    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleInputChange = (event: FormEvent<HTMLInputElement>, newValue: string): void => {
    onInputValueChange(newValue, true);
    onInputChange?.(newValue);

    // If user manually clears the input, clear the selection
    if (newValue === '' && selectedOption) {
      onSelectionClear();
    }

    // Open dropdown when user starts typing (if not already open)
    if (!isOpen && newValue.length > 0) {
      onToggleClick();
    }
  };

  const handleClear = (): void => {
    onSelectionClear();
    onInputValueChange('', false);
    inputRef.current?.focus();
  };

  const handleInputClick = (): void => {
    if (!isOpen && !isDisabled) {
      onToggleClick();
    }
  };

  const showClearButton = allowClear && (selectedOption ?? (isFiltering && inputValue));

  return (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={handleToggleClick}
      isExpanded={isOpen}
      isDisabled={isDisabled}
      isFullWidth
      style={{ width: toggleWidth }}
      {...toggleProps}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={handleInputClick}
          onChange={handleInputChange}
          autoComplete="off"
          ref={inputRef}
          placeholder={placeholder}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="typeahead-listbox"
        />
        {showClearButton && (
          <TextInputGroupUtilities>
            <Button
              icon={<TimesIcon />}
              variant="plain"
              onClick={handleClear}
              aria-label="Clear selection"
            />
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );
};

export default TypeaheadMenuToggle;
