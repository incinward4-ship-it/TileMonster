
import React from 'react';
import AttributePanel from '../AttributePanel/AttributePanel';
import { CSS_ATTRIBUTES, CssAttribute } from '../../data/css-attributes';
import { ActiveAttribute, TileStyle } from '../../data/types';

interface TextureCreatorProps {
  saveToPalette: (style: TileStyle) => void;
  activeAttributes: ActiveAttribute[];
  setActiveAttributes: React.Dispatch<React.SetStateAction<ActiveAttribute[]>>;
}

// --- Helper functions for randomization ---
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

const getRandomValue = (min: number, max: number, step: number) => {
  const steps = (max - min) / step;
  return parseFloat((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2));
};

const generateRandomValueFor = (definition: CssAttribute): any => {
  switch (definition.controlType) {
    case 'color':
      return getRandomColor();
    case 'slider':
      return getRandomValue(definition.min!, definition.max!, definition.step!);
    case 'select':
      const randomIndex = Math.floor(Math.random() * definition.options!.length);
      return definition.options![randomIndex].value;
    case 'checkbox':
      return Math.random() > 0.5;
    case 'multi':
      const multiValue: { [key: string]: any } = {};
      definition.subAttributes?.forEach(subDef => {
        multiValue[subDef.id] = generateRandomValueFor(subDef as any);
      });
      return multiValue;
    default:
      return definition.defaultValue;
  }
};
// --- End of Randomization Helpers ---

const TextureCreator: React.FC<TextureCreatorProps> = ({ saveToPalette, activeAttributes, setActiveAttributes }) => {

  const handleRandomize = () => {
    const newAttributes: ActiveAttribute[] = [];
    const attrCount = Math.floor(Math.random() * 4) + 2;
    const availableAttrs = [...CSS_ATTRIBUTES];

    for (let i = 0; i < attrCount && availableAttrs.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableAttrs.length);
      const randomDef = availableAttrs[randomIndex];
      availableAttrs.splice(randomIndex, 1);
      if(CSS_ATTRIBUTES.find(a => a.category === 'Background' && a.id !== randomDef.id && newAttributes.some(na => na.definition.category === 'Background'))) continue;

      newAttributes.push({
        id: `rand-${Date.now()}-${i}`,
        definition: randomDef,
        value: generateRandomValueFor(randomDef),
      });
    }
    setActiveAttributes(newAttributes);
  };

  return (
    <div className="texture-creator">
      <h2>Texture Creator</h2>
      <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={handleRandomize}>Randomize</button>
        <button onClick={() => saveToPalette}>Save to Palette</button>
      </div>
      <AttributePanel attributes={activeAttributes} setAttributes={setActiveAttributes} />
    </div>
  );
};

export default TextureCreator;
