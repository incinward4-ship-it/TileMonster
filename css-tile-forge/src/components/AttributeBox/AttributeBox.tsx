
import React from 'react';
import { ActiveAttribute } from '../AttributePanel/AttributePanel';

interface AttributeBoxProps {
  attribute: ActiveAttribute;
  onRemove: () => void;
  onUpdate: (newValue: any) => void;
}

// A helper component to render the correct input control for a given attribute definition
const AttributeControl: React.FC<{ definition: any, value: any, onChange: (value: any) => void }> = ({ definition, value, onChange }) => {
  switch (definition.controlType) {
    case 'color':
      return <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />;

    case 'slider':
      return (
        <div className='slider-control'>
          <input
            type="range"
            min={definition.min}
            max={definition.max}
            step={definition.step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
          <span>{value}{definition.id.includes('angle') ? '°' : definition.id.includes('scale') ? '' : 'px'}</span>
        </div>
      );

    case 'select':
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {definition.options?.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      
    case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
        );

    default:
      return <p>Unsupported Control Type</p>;
  }
};

const AttributeBox: React.FC<AttributeBoxProps> = ({ attribute, onRemove, onUpdate }) => {
  const { definition, value } = attribute;

  const handleSubAttributeChange = (subId: string, subValue: any) => {
    onUpdate({ ...value, [subId]: subValue });
  };

  const renderMultiControls = () => {
    if (!definition.subAttributes) return null;

    return (
      <div className='multi-control-group'>
        {definition.subAttributes.map((subDef) => (
          <div key={subDef.id} className='sub-attribute-control'>
            <label>{subDef.label}:</label>
            <AttributeControl
              definition={subDef}
              value={value[subDef.id]}
              onChange={(newValue) => handleSubAttributeChange(subDef.id, newValue)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="attribute-box">
      <div className="attribute-box-header">
        <span>{definition.label}</span>
        <button onClick={onRemove}>X</button>
      </div>
      <div className="attribute-box-controls">
        {definition.controlType === 'multi' ? (
          renderMultiControls()
        ) : (
          <AttributeControl
            definition={definition}
            value={value}
            onChange={onUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default AttributeBox;
