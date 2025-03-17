import React from 'react';
import { FieldError } from 'react-hook-form';

import { FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

type FormErrorHelperTextProps = {
  error: Partial<FieldError>;
};

export const FormErrorHelperText: React.FC<FormErrorHelperTextProps> = ({ error }) => {
  return error ? (
    <FormHelperText>
      <HelperText>
        <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
          {error?.message?.toString()}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  ) : null;
};
