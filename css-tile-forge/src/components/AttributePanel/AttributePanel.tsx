
import React from 'react';
import { CSS_ATTRIBUTES, CssAttribute } from '../../data/css-attributes';
import AttributeBox from '../AttributeBox/AttributeBox';

// Represents an attribute that has been added to the style
export interface ActiveAttribute {
  id: string; // Unique ID for this instance of the attribute
  definition: CssAttribute;
  value: any;
}

interface AttributePanelProps {
  attributes: ActiveAttribute[];
  setAttributes: React.Dispatch<React.SetStateAction<ActiveAttribute[]>>;
}

let nextId = 0;
const getNextId = () => `attr-${nextId++}`;

// Group attributes by category for the dropdown
const attributeGroups = CSS_ATTRIBUTES.reduce((acc, attr) => {
  acc[attr.category] = acc[attr.category] || [];
  acc[attr.category].push(attr);
  return acc;
}, {} as Record<string, CssAttribute[]>);

const AttributePanel: React.FC<AttributePanelProps> = ({ attributes, setAttributes }) => {

  const addAttribute = (attributeId: string) => {
    if (!attributeId) return;

    const definition = CSS_ATTRIBUTES.find(attr => attr.id === attributeId);
    if (!definition) return;
    
    // Prevent adding multiple of certain unique attributes
    if ( (definition.id === 'backgroundColor' || definition.id === 'opacity') && attributes.some(attr => attr.definition.id === definition.id) ) {
      alert(`The ${definition.label} attribute can only be added once.`);
      return;
    }

    const newAttribute: ActiveAttribute = {
      id: getNextId(),
      definition,
      value: definition.defaultValue,
    };

    setAttributes([...attributes, newAttribute]);
  };

  const removeAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const updateAttribute = (id: string, newValue: any) => {
    setAttributes(attributes.map(attr => (attr.id === id ? { ...attr, value: newValue } : attr)));
  };

  return (
    <div className="attribute-panel">
      <div className="attribute-controls">
        <select onChange={(e) => {
          addAttribute(e.target.value);
          e.target.value = "";
        }}>
          <option value="">Add Attribute</option>
          {Object.entries(attributeGroups).map(([category, attrs]) => (
            <optgroup label={category} key={category}>
              {attrs.map(attr => (
                <option key={attr.id} value={attr.id}>
                  {attr.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="attribute-boxes">
        {attributes.map(attr => (
          <AttributeBox
            key={attr.id}
            attribute={attr}
            onRemove={() => removeAttribute(attr.id)}
            onUpdate={(newValue) => updateAttribute(attr.id, newValue)}
          />
        ))}
      </div>
    </div>
  );
};

export default AttributePanel;
