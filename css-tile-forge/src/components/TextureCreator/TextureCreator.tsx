
import React from 'react';
import AttributePanel from '../AttributePanel/AttributePanel';
import { ActiveAttribute, TileStyle } from '../../data/types';
import { CSS_ATTRIBUTES } from '../../data/css-attributes';

interface TextureCreatorProps {
  saveToPalette: (style: TileStyle) => void;
  activeAttributes: ActiveAttribute[];
  setActiveAttributes: React.Dispatch<React.SetStateAction<ActiveAttribute[]>>;
  tileStyles: TileStyle;
}

const TextureCreator: React.FC<TextureCreatorProps> = ({
  saveToPalette,
  activeAttributes,
  setActiveAttributes,
  tileStyles,
}) => {

  const handleRandomize = () => {
    const presentIds = activeAttributes.map(attr => attr.definition.id);
    const availableAttrs = CSS_ATTRIBUTES.filter(attr => !presentIds.includes(attr.id) || ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].includes(attr.id));
    if (availableAttrs.length === 0) return;
    const randomAttr = availableAttrs[Math.floor(Math.random() * availableAttrs.length)];

    const newAttr: ActiveAttribute = {
      id: `rand-${Date.now()}`,
      definition: randomAttr,
      value: randomAttr.defaultValue,
    };

    setActiveAttributes([...activeAttributes, newAttr]);
  };

  const clearAll = () => setActiveAttributes([]);

  const randomizeAllAttributes = () => {
    const randomizedAttributes = activeAttributes.map(attr => {
      const def = CSS_ATTRIBUTES.find(d => d.id === attr.definition.id);
      if (!def) return attr;
      return {
        ...attr,
        value: generateRandomForAttr(def),
      };
    });
    setActiveAttributes(randomizedAttributes);
  };

  const randomizeAttribute = (attrId: string) => {
    const attr = activeAttributes.find(a => a.id === attrId);
    if (!attr) return;
    const def = attr.definition;
    if (!def) return;
    const randomValue = generateRandomForAttr(def);

    setActiveAttributes(activeAttributes.map(a =>
      a.id === attrId ? { ...a, value: randomValue } : a
    ));
  };

  const generateRandomForAttr = (def: any): any => {
    const generateRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    switch (def.controlType) {
      case 'color':
        return generateRandomColor();
      case 'slider':
        return Math.floor(Math.random() * (def.max - def.min + 1)) + def.min;
      case 'select':
        const opts = def.options || [];
        if (opts.length === 0) return def.defaultValue;
        return opts[Math.floor(Math.random() * opts.length)].value;
      case 'checkbox':
        return Math.random() > 0.5;
      case 'multi':
        const multiValue: any = {};
        def.subAttributes?.forEach((sub: any) => {
          multiValue[sub.id] = generateRandomForAttr(sub);
        });
        return multiValue;
      case 'gradient':
        return {
          type: 'linear',
          angle: Math.floor(Math.random() * 361),
          colors: [generateRandomColor(), generateRandomColor()],
        };
      default:
        return def.defaultValue;
    }
  };

  return (
    <div className="texture-creator">
      <h2>Texture Creator</h2>
      <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={clearAll}>Clear All</button>
        <button onClick={handleRandomize}>Randomize One</button>
        <button onClick={randomizeAllAttributes}>Randomize All</button>
        <button onClick={() => saveToPalette(tileStyles)}>Save to Palette</button>
      </div>
      <AttributePanel
        attributes={activeAttributes}
        setAttributes={setActiveAttributes}
        randomizeAttribute={randomizeAttribute}
      />
    </div>
  );
};

export default TextureCreator;
