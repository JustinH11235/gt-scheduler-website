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
  const [inputIndex, setInputIndex] = useState('');
  const [inputting, setInputting] = useState(false);
  const [versionName, setVersionName] = useState('');

  const selectedOption = options.find((option) => option.innerValue === value);
  const label = selectedOption ? selectedOption.innerLabel : '-';

  const handleChangeVersionName = (e) => {
    const input = e.target.value.trim();
    setVersionName(input);
  };

  return (
    <div
      className={classes('Button', 'Select', className)}
      onClick={() => (!inputting ? setOpened(!opened) : setOpened(true))}
    >
      <div className="text">{label}</div>
      <FontAwesomeIcon fixedWidth icon={faCaretDown} />
      {opened && (
        <div
          className="intercept"
          onClick={() => (!inputting ? setOpened(false) : null)}
        />
      )}
      {opened && (
        <div className="option-container">
          {options.map(
            ({
              innerValue,
              innerLabel,
              onClick,
              iconsAndFunctions = { icons: [], functions: {} }
            }) => (
              <div className="option" key={innerValue + innerLabel}>
                {inputting && inputIndex === innerValue ? (
                  <input
                    type="text"
                    key={`input${innerValue}`}
                    value={versionName}
                    onChange={handleChangeVersionName}
                    placeholder={innerValue}
                  />
                ) : (
                  <Button key={innerValue} onClick={() => onClick(innerValue)}>
                    {iconsAndFunctions.icons.includes('add') ? (
                      <FontAwesomeIcon fixedWidth icon={faPlus} />
                    ) : null}
                    {inputIndex === innerValue ? versionName : innerLabel}
                  </Button>
                )}
                {iconsAndFunctions.icons.includes('edit') ? (
                  <Button
                    key={`${innerValue}edit`}
                    onClick={() => {
                      if (innerValue === inputIndex) {
                        iconsAndFunctions.functions.edit(versionName);
                        setInputting(false);
                      } else {
                        setVersionName('');
                        setInputting(true);
                        setInputIndex(innerValue);
                      }
                    }}
                  >
                    <FontAwesomeIcon fixedWidth icon={faEdit} />
                  </Button>
                ) : null}
                {iconsAndFunctions.icons.includes('delete') ? (
                  <Button key={`${innerValue}delete`} onClick={() => null}>
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
