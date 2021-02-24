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
              <div className="option">
                <Button key={innerValue} onClick={() => onClick(innerValue)}>
                  {iconsAndFunctions.icons.includes('add') ? (
                    <FontAwesomeIcon fixedWidth icon={faPlus} />
                  ) : null}
                  {innerLabel}
                </Button>
                {iconsAndFunctions.icons.includes('edit') ? (
                  <Button
                    key={`${innerValue}edit`}
                    classname="icon-button"
                    onClick={() => null}
                  >
                    <FontAwesomeIcon fixedWidth icon={faEdit} />
                  </Button>
                ) : null}
                {iconsAndFunctions.icons.includes('delete') ? (
                  <Button
                    key={`${innerValue}edit`}
                    classname="icon-button"
                    onClick={() => null}
                  >
                    <FontAwesomeIcon fixedWidth icon={faTrashAlt} />
                  </Button>
                ) : null}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
