import { type FC, useMemo, useRef, useState } from 'react';

import {
  type MenuToggleElement,
  type MenuToggleProps,
  Select,
  SelectList,
  SelectOption,
  type SelectProps,
} from '@patternfly/react-core';

import { DEFAULT_NO_OPTIONS, DEFAULT_PLACEHOLDER, PLACEHOLDER_VALUES } from './constants';
import TypeaheadMenuToggle from './TypeaheadMenuToggle';
import type { TypeaheadSelectOption } from './types';
import {
  defaultFilterFunction,
  generateFilteredOptions,
  getDefaultCreateMessage,
  getDefaultNoResults,
  isPlaceholderValue,
} from './utils';

type TypeaheadSelectProps = {
  /** Available options */
  options: TypeaheadSelectOption[];
  /** Current selected value (for controlled component) */
  value?: string | number;
  /** Selection change handler */
  onChange?: (value: string | number | undefined) => void;
  /** Input text change handler */
  onInputChange?: (inputValue: string) => void;
  /** Custom filter function */
  filterFunction?: (
    filterValue: string,
    options: TypeaheadSelectOption[],
  ) => TypeaheadSelectOption[];
  /** Allow clearing selection */
  allowClear?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Allow creating new options */
  isCreatable?: boolean;
  /** Message for creating new option */
  createOptionMessage?: string | ((value: string) => string);
  /** No options available message */
  noOptionsMessage?: string;
  /** No filtered results message */
  noResultsMessage?: string | ((filter: string) => string);
  /** Disable the component */
  isDisabled?: boolean;
  /** Toggle width */
  toggleWidth?: string;
  /** Additional toggle props */
  toggleProps?: Omit<MenuToggleProps, 'ref' | 'onClick' | 'isExpanded'>;
} & Omit<SelectProps, 'toggle' | 'onSelect' | 'selected'>;

const TypeaheadSelect: FC<TypeaheadSelectProps> = ({
  allowClear = false,
  createOptionMessage = getDefaultCreateMessage,
  filterFunction = defaultFilterFunction,
  isCreatable = false,
  isDisabled = false,
  noOptionsMessage = DEFAULT_NO_OPTIONS,
  noResultsMessage = getDefaultNoResults,
  onChange,
  onInputChange,
  options = [],
  placeholder = DEFAULT_PLACEHOLDER,
  toggleProps,
  toggleWidth,
  value,
  ...selectProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected option based on value prop
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(
    () =>
      generateFilteredOptions({
        createOptionMessage,
        filterFunction,
        inputValue,
        isCreatable,
        isFiltering,
        noResultsMessage,
        options,
      }),
    [
      isFiltering,
      inputValue,
      options,
      filterFunction,
      isCreatable,
      createOptionMessage,
      noResultsMessage,
    ],
  );

  // Display options (filtered when searching, all when not, or no options message)
  const displayOptions = useMemo(() => {
    if (options.length === 0) {
      return [
        {
          content: noOptionsMessage,
          optionProps: { isDisabled: true },
          value: PLACEHOLDER_VALUES.NO_OPTIONS,
        },
      ];
    }
    return filteredOptions;
  }, [options.length, filteredOptions, noOptionsMessage]);

  const handleToggleClick = (): void => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (!newIsOpen) {
      // Reset filtering when closing
      setIsFiltering(false);
      setInputValue(selectedOption?.content?.toString() ?? '');
    }
  };

  const handleInputValueChange = (newInputValue: string, newIsFiltering: boolean): void => {
    setInputValue(newInputValue);
    setIsFiltering(newIsFiltering);
  };

  const handleSelectionClear = (): void => {
    onChange?.(undefined);
  };

  const handleSelect = (selectedValue: string | number | undefined): void => {
    // Ignore placeholder values
    if (isPlaceholderValue(selectedValue)) {
      return;
    }

    // Check if this is a create action (value not in original options)
    const existingOption = options.find((option) => option.value === selectedValue);

    if (existingOption || isCreatable) {
      onChange?.(selectedValue);
      setIsOpen(false);

      // Reset filtering state and update input value to show selected option
      setIsFiltering(false);
      setInputValue(existingOption?.content?.toString() ?? selectedValue?.toString() ?? '');
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>): React.ReactElement => (
    <TypeaheadMenuToggle
      toggleRef={toggleRef}
      inputRef={inputRef}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isOpen={isOpen}
      toggleWidth={toggleWidth}
      allowClear={allowClear}
      selectedOption={selectedOption}
      isFiltering={isFiltering}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onSelectionClear={handleSelectionClear}
      onToggleClick={handleToggleClick}
      onInputValueChange={handleInputValueChange}
      toggleProps={toggleProps}
    />
  );

  return (
    <Select
      isOpen={isOpen}
      onSelect={(_, selectedValue) => {
        handleSelect(selectedValue);
      }}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
      toggle={toggle}
      shouldFocusFirstItemOnOpen={false}
      {...selectProps}
    >
      <SelectList id="typeahead-listbox">
        {displayOptions.map((option) => (
          <SelectOption key={option.value} value={option.value} {...option.optionProps}>
            {option.content}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

export default TypeaheadSelect;
