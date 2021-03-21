import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faEdit,
  faPlus,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import swal from '@sweetalert/with-react';
import { classes } from '../../utils';
import { Button } from '..';
import './stylesheet.scss';

export default function Select({ className, value, options }) {
  const [opened, setOpened] = useState(false);
  const [inputIndex, setInputIndex] = useState('');
  const [inputting, setInputting] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [currentValue, setCurrentValue] = useState(value);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setOpened(inputting);
  }, [inputting]);

  const optionsObtained = options;
  const selectedOption = optionsObtained.find(
    (option) => option.innerValue === currentValue
  );
  const label = selectedOption ? selectedOption.innerLabel : '-';
  const handleChangeVersionName = (e) => {
    const input = e.target.value.trim();
    setVersionName(`${input}`);
  };
  const handleKeyDown = (innerValue, iconsAndFunctions, index, e) => {
    if (e.key === 'Enter') {
      if (versionName === '') {
        setVersionName('Blank');
      }
      if (iconsAndFunctions.functions.edit(versionName)) {
        setCurrentValue(
          innerValue === currentValue ? versionName : currentValue
        );
        optionsObtained[index].innerValue = versionName;
        optionsObtained[index].innerLabel = versionName;
      }
      setInputting(false);
      setInputIndex('');
    }
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
          onClick={() => (!inputting ? setOpened(false) : setOpened(true))}
        />
      )}
      {opened && (
        <div className="option-container">
          {optionsObtained.map(
            (
              {
                innerValue,
                innerLabel,
                onClick,
                iconsAndFunctions = { icons: [], functions: {} }
              },
              index
            ) => (
              <div
                className="option"
                key={innerValue + innerLabel}
                onFocus={() => setShowButtons(true)}
                onMouseOver={() => setShowButtons(true)}
                onMouseLeave={() => setShowButtons(false)}
              >
                {inputting && inputIndex === innerValue ? (
                  <input
                    /* eslint-disable-next-line jsx-a11y/no-autofocus */
                    autoFocus
                    type="text"
                    key={`input${innerValue}`}
                    value={versionName}
                    onChange={handleChangeVersionName}
                    placeholder={innerValue}
                    onKeyDown={(e) => {
                      handleKeyDown(innerValue, iconsAndFunctions, index, e);
                    }}
                  />
                ) : (
                  <Button
                    className="option-text"
                    key={innerValue}
                    onClick={() => onClick(innerValue)}
                  >
                    {iconsAndFunctions.icons.includes('add') ? (
                      <FontAwesomeIcon fixedWidth icon={faPlus} />
                    ) : null}
                    {innerLabel}
                  </Button>
                )}
                {iconsAndFunctions.icons.includes('edit') ? (
                  <Button
                    key={`${innerValue}edit`}
                    onClick={(e) => {
                      if (innerValue === inputIndex) {
                        if (versionName === '') {
                          setVersionName('Blank');
                        }
                        if (iconsAndFunctions.functions.edit(versionName)) {
                          setCurrentValue(
                            innerValue === currentValue
                              ? versionName
                              : currentValue
                          );
                          optionsObtained[index].innerValue = versionName;
                          optionsObtained[index].innerLabel = versionName;
                        }
                        setInputting(false);
                        setInputIndex('');
                      } else {
                        setVersionName(innerValue);
                        setInputting(true);
                        setInputIndex(innerValue);
                        e.stopPropagation();
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ visibility: showButtons ? 'visible' : 'hidden' }}
                      fixedWidth
                      icon={faEdit}
                    />
                  </Button>
                ) : null}
                {iconsAndFunctions.icons.includes('delete') ? (
                  <Button
                    key={`${innerValue}delete`}
                    onClick={() => {
                      swal({
                        buttons: ['Cancel', 'Delete'],
                        content: (
                          <div>
                            <p>
                              Are you sure you want to delete {innerLabel}{' '}
                              schedule?
                            </p>
                          </div>
                        )
                      }).then((val) => {
                        if (val) {
                          iconsAndFunctions.functions.delete();
                        }
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ visibility: showButtons ? 'visible' : 'hidden' }}
                      fixedWidth
                      icon={faTrashAlt}
                    />
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
