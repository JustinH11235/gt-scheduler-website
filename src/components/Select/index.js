import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faEdit,
  faPlus,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { classes } from '../../utils';
import { Button } from '..';
import './stylesheet.scss';

export default function Select({ className, value, options }) {
  const [opened, setOpened] = useState(false);

  const selectedOption = options.find((option) => option.innerValue === value);
  const label = selectedOption ? selectedOption.innerLabel : '-';

  return (
    <div
      className={classes('Button', 'Select', className)}
      onClick={() => setOpened(!opened)}
    >
      <div className="text">{label}</div>
      <FontAwesomeIcon fixedWidth icon={faCaretDown} />
      {opened && <div className="intercept" onClick={() => setOpened(false)} />}
      {opened && (
        <div className="option-container">
          {options.map(
            ({
              innerValue,
              innerLabel,
              onClick,
              iconsAndFunctions = { icons: [], function: [] }
            }) => (
              <Button
                className="option"
                key={innerValue}
                onClick={() => onClick(innerValue)}
              >
                {iconsAndFunctions.icons.includes('add') ? (
                  <FontAwesomeIcon fixedWidth icon={faPlus} />
                ) : null}
                {innerLabel}
                {iconsAndFunctions.icons.includes('edit') ? (
                  <FontAwesomeIcon fixedWidth icon={faEdit} />
                ) : null}
                {iconsAndFunctions.icons.includes('delete') ? (
                  <FontAwesomeIcon fixedWidth icon={faTrashAlt} />
                ) : null}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
