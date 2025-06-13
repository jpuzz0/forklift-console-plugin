import type { SelectOptionProps } from '@patternfly/react-core';

export type TypeaheadSelectOption = {
  /** Display content for the option */
  content: string | number;
  /** Unique value for the option */
  value: string | number;
  /** Additional option props */
  optionProps?: Omit<SelectOptionProps, 'content' | 'value'>;
};

export type FilterOptionsConfig = {
  isFiltering: boolean;
  inputValue: string;
  options: TypeaheadSelectOption[];
  filterFunction: (
    filterValue: string,
    options: TypeaheadSelectOption[],
  ) => TypeaheadSelectOption[];
  isCreatable: boolean;
  createOptionMessage: string | ((value: string) => string);
  noResultsMessage: string | ((filter: string) => string);
};
