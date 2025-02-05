import React from 'react';

import { FilterDef } from '../../utils';
import { FilterTypeProps } from '../Filter';

import { GlobalFilters } from './types';

interface FilterFromDefProps {
  resourceFieldId: string;
  label: string;
  filterDef: FilterDef;
  selectedFilters: GlobalFilters;
  onFilterUpdate(filters: GlobalFilters): void;
  FilterType: (props: FilterTypeProps) => JSX.Element;
  showFilter?: boolean;
  resolvedLanguage: string;
}

export const FilterFromDef = ({
  resourceFieldId,
  label,
  filterDef: def,
  selectedFilters,
  FilterType,
  onFilterUpdate,
  showFilter = true,
  resolvedLanguage,
}: FilterFromDefProps) => {
  const [filterId, setFilterId] = React.useState(resourceFieldId);

  const selectedFilterValues = React.useMemo(() => {
    const groupSelectedIds = def.groups?.map((group) => group.groupId);

    if (!resourceFieldId && groupSelectedIds.length) {
      return Object.entries(selectedFilters).reduce((acc, [selectedId, selectedValues]) => {
        if (groupSelectedIds.includes(selectedId)) {
          acc = acc.length ? acc.concat(selectedValues) : selectedValues;
        }

        return acc;
      }, []);
    }

    return selectedFilters[filterId] ?? [];
  }, [def.groups, filterId, resourceFieldId, selectedFilters]);

  const setSelectedFilters = (values: string[], selectedResourceId?: string) => {
    if (selectedResourceId) {
      setFilterId(selectedResourceId);
    }

    onFilterUpdate({
      ...selectedFilters,
      [selectedResourceId || resourceFieldId]: values,
    });
  };

  return !def.isHidden && FilterType ? (
    <FilterType
      filterId={filterId}
      onFilterUpdate={setSelectedFilters}
      placeholderLabel={def.placeholderLabel}
      selectedFilters={selectedFilterValues}
      title={def?.fieldLabel ?? label}
      showFilter={showFilter}
      supportedValues={def.values}
      supportedGroups={def.groups}
      resolvedLanguage={resolvedLanguage}
      helperText={def.helperText}
      showFilterIcon={def.showFilterIcon}
    />
  ) : null;
};
