/** @jsxImportSource @emotion/react */
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../contexts/data.context';
import PageContainer from './PageContainer.component';
import * as styles from './styles/CreateNewTraining.css';
import {
  TitleAndDropdown,
  DescriptionTextBox,
  TitleAndTextInput,
} from './Form.components';
import { ButtonText } from './Buttons.components';
import * as Enums from '../helpers/Enums.helper';

const NewTrainingForm = ({ onCreated, onClose }) => {
  const { currentProfile } = useContext(DataContext);
  // Some prefilled form state
  const [form, setForm] = useState({
    category: Enums.TrainingCategory.OBEDIENCE,
    type: Enums.TrainingType.SIT,
    customCategory: '',
    customType: '',
    description: '',
  });

  useEffect(() => {}, [form]);

  const onTextInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const onDropdownInputChange = (name, value) => {
    const enumValue =
      name === 'category'
        ? Enums.getTrainingCategoryFor(value)
        : Enums.getTrainingTypeFor(value);
    setForm({ ...form, [name]: enumValue });
  };

  const getDropdownItems = (name) => {
    if (name === 'type') {
      const dropdownItems = Object.values(
        Enums.getTypesForTrainingTypeCategory(form.category)
      ).map((type) => ({
        rawValue: type,
        title: Enums.getTitleForTrainingType(type),
      }));
      return dropdownItems;
    } else {
      return [];
    }
  };

  return (
    <div>
      <form
        style={styles.addTrainingFormStyle}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div style={styles.closeButtonContainer}>
          <ButtonText variant="circleTextButton" onClick={onClose}>
            x
          </ButtonText>
        </div>
        <h2 style={styles.addTrainingTitleStyle}>{'Add Training'}</h2>

        <TitleAndDropdown
          name={'category'}
          title={'Category'}
          value={Enums.getTitleForTrainingCategory(form.category)}
          dropdownOptions={Object.values(Enums.TrainingCategory).map(
            (type) => ({
              rawValue: type,
              title: Enums.getTitleForTrainingType(type),
            })
          )}
          onChange={(value) => {
            onDropdownInputChange('category', value);
          }}
        />

        {form.category === Enums.TrainingCategory.CUSTOM ? (
          <div>
            <div>
              <h4 style={styles.addTrainingTitleStyle}>
                {'Add your custom training:'}
              </h4>
            </div>
            <TitleAndTextInput
              name={'customCategory'}
              title={'Name'}
              onChange={(e) => {
                onTextInputChange(e);
              }}
            />
            <TitleAndTextInput
              name={'customType'}
              title={'Type'}
              onChange={(e) => {
                onTextInputChange(e);
              }}
            />
          </div>
        ) : form.type === Enums.TrainingType.CUSTOM ? (
          <div>
            <TitleAndDropdown
              name={'type'}
              title={'Type'}
              value={Enums.getTitleForTrainingType(form.type)}
              dropdownOptions={getDropdownItems('type')}
              onChange={(value) => {
                onDropdownInputChange('type', value);
              }}
            />

            <TitleAndTextInput
              name={'customType'}
              title={'Name'}
              onChange={(e) => {
                onTextInputChange(e);
              }}
            />
          </div>
        ) : (
          <TitleAndDropdown
            name={'type'}
            title={'Type'}
            dropdownOptions={getDropdownItems('type')}
            onChange={(value) => {
              onDropdownInputChange('type', value);
            }}
          />
        )}

        <DescriptionTextBox name={'description'} title={'Add Description'} />

        <div style={styles.addTrainingButtonContainerStyle}>
          <ButtonText
            variant="rectangleTextButton"
            onClick={() => onCreated(form, 'addTraining')}
          >
            Add Training
          </ButtonText>
        </div>
      </form>
    </div>
  );
};

export default NewTrainingForm;
