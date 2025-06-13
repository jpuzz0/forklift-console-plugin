import type { FC, ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';
import classNames from 'classnames';

import { Button, ButtonVariant, Flex, Icon } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, type ThProps, Tr } from '@patternfly/react-table';

import type { AddButtonType, FieldRow, RemoveButtonType } from './types';

import './FieldBuilderTable.style.scss';

type FieldBuilderTableProps<FormData extends FieldValues> = {
  headers: (Omit<ThProps, 'label'> & { label: ReactNode })[];
  fieldRows: FieldRow<FormData>[];
  addButton: AddButtonType;
  removeButton: RemoveButtonType;
};

const FieldBuilderTable: FC<FieldBuilderTableProps<FormData>> = ({
  addButton,
  fieldRows,
  headers,
  removeButton,
}) => {
  const totalColSpan = headers.length + 1; // +1 for action column

  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
      <Table
        borders={false}
        className="field-builder-table pf-m-grid-md"
        role="grid"
        variant="compact"
      >
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th
                key={index}
                width={header.width}
                className={classNames({ 'pf-v5-u-pl-0': index === 0 })}
              >
                {header.label}
              </Th>
            ))}
            {/* Action column for remove buttons */}
            <Th width={10} />
          </Tr>
        </Thead>

        <Tbody>
          {fieldRows.reduce<ReactNode[]>((acc, fieldRow, rowIndex) => {
            // Main row containing field inputs and remove button
            acc.push(
              <Tr key={fieldRow.id}>
                {fieldRow.inputs.map((fieldInput, inputIndex) => (
                  <Td
                    key={fieldInput.key}
                    className={classNames({ 'pf-v5-u-pl-0': inputIndex === 0 })}
                  >
                    {fieldInput}
                  </Td>
                ))}

                {/* Remove button cell */}
                <Td isActionCell>
                  <Button
                    icon={
                      <Icon size="md">
                        <MinusCircleIcon />
                      </Icon>
                    }
                    isInline
                    variant={ButtonVariant.plain}
                    isDisabled={removeButton.isDisabled}
                    onClick={() => {
                      removeButton.onClick(rowIndex);
                    }}
                  />
                </Td>
              </Tr>,
            );

            // Conditionally add additional options row if it exists
            if (fieldRow.additionalOptions) {
              acc.push(
                <Tr key={`${fieldRow.id}-additional`}>
                  <Td colSpan={totalColSpan} className="pf-v5-u-pl-0">
                    {fieldRow.additionalOptions}
                  </Td>
                </Tr>,
              );
            }

            return acc;
          }, [])}
        </Tbody>
      </Table>

      <Button
        isInline
        variant={ButtonVariant.link}
        icon={<PlusCircleIcon />}
        isDisabled={addButton.isDisabled}
        onClick={addButton.onClick}
      >
        {addButton.label}
      </Button>
    </Flex>
  );
};

export default FieldBuilderTable;
