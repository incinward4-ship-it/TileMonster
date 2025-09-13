
import React from 'react';
import { ActiveAttribute } from '../AttributePanel/AttributePanel';

interface AttributeBoxProps {
  attribute: ActiveAttribute;
  onRemove: () => void;
  onUpdate: (newValue: any) => void;
  randomize: () => void;
}

// A helper component to render the correct input control for a given attribute definition
const AttributeControl: React.FC<{ definition: any, value: any, onChange: (value: any) => void }> = ({ definition, value, onChange }) => {
  switch (definition.controlType) {
    case 'color':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
            <div
                className="color-preview"
                style={{
                width: '24px',
                height: '24px',
                backgroundColor: value || 'transparent',
                border: '1px solid #999',
                borderRadius: '4px',
                }}
            />
        </div>
    );

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
    case 'gradient':
        return (
            <div className="gradient-control">
                <select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}>
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                </select>
                <input type="number" value={value.angle} onChange={e => onChange({ ...value, angle: parseInt(e.target.value) })} />
                <input type="color" value={value.colors[0]} onChange={e => onChange({ ...value, colors: [e.target.value, value.colors[1]] })} />
                <input type="color" value={value.colors[1]} onChange={e => onChange({ ...value, colors: [value.colors[0], e.target.value] })} />
            </div>
        )

    default:
      return <p>Unsupported Control Type</p>;
  }
};

const AttributeBox: React.FC<AttributeBoxProps> = ({ attribute, onRemove, onUpdate, randomize }) => {
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
        <div>
            <button onClick={randomize} className="randomize-small-btn">R</button>
            <button onClick={onRemove}>X</button>
        </div>
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
