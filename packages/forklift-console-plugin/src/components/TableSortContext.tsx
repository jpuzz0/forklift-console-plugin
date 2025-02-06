import React, { PropsWithChildren } from 'react';

import { ResourceField, SortType, useSort } from '@kubev2v/common';

type TableSortContextProps = {
  activeSort: SortType;
  setActiveSort: (activeSort: SortType) => void;
  compareFn: (a: unknown, b: unknown) => number;
};

const defaultTableSortContext = {
  activeSort: { isAsc: true, resourceFieldId: undefined, label: '' },
  setActiveSort: () => undefined,
  compareFn: () => undefined,
};

const TableSortContext = React.createContext<TableSortContextProps>(defaultTableSortContext);

type TableSortContextProviderProps = PropsWithChildren & {
  fields: ResourceField[];
};

export const TableSortContextProvider: React.FC<TableSortContextProviderProps> = ({
  fields,
  children,
}) => {
  const [activeSort, setActiveSort, compareFn] = useSort(fields);

  return (
    <TableSortContext.Provider value={{ activeSort, setActiveSort, compareFn }}>
      {children}
    </TableSortContext.Provider>
  );
};

export const useTableSortContext = () => React.useContext(TableSortContext);
