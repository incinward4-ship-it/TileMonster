
import React, { useState, useEffect } from 'react';
import AttributePanel from '../AttributePanel/AttributePanel';
import Preview from '../Preview/Preview';
import { CSS_ATTRIBUTES, CssAttribute } from '../../data/css-attributes';
import { ActiveAttribute, TileStyle } from '../../data/types';

interface TextureCreatorProps {
  saveToPalette: (style: TileStyle) => void;
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

const defaultTileStyle: TileStyle = {
  backgroundColor: '#d3d3d3', // light gray
  border: '2px solid darkgrey',
  borderRadius: '8px',
};

const TextureCreator: React.FC<TextureCreatorProps> = ({ saveToPalette }) => {
  const [activeAttributes, setActiveAttributes] = useState<ActiveAttribute[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle>(defaultTileStyle);
  const [isBlendMode, setIsBlendMode] = useState<boolean>(false);

  useEffect(() => {
    const newStyles: React.CSSProperties = {};
    const gradients: string[] = [];
    const filters: string[] = [];
    const transforms: string[] = [];

    if (activeAttributes.length === 0) {
        setTileStyles(defaultTileStyle);
        return;
    }

    activeAttributes.forEach(({ definition, value }) => {
      switch (definition.id) {
        case 'backgroundColor':
          newStyles.backgroundColor = value;
          break;
        case 'backgroundPosition': newStyles.backgroundPosition = value; break;
        case 'backgroundSize': newStyles.backgroundSize = value; break;
        case 'backgroundRepeat': newStyles.backgroundRepeat = value; break;
        case 'borderRadius': newStyles.borderRadius = `${value}px`; break;
        case 'clipPath': newStyles.clipPath = value; break;

        case 'border':
          newStyles.border = `${value.width}px ${value.style} ${value.color}`;
          break;
        case 'boxShadow':
          const shadow = `${value.inset ? 'inset ' : ''}${value.offsetX}px ${value.offsetY}px ${value.blurRadius}px ${value.spreadRadius}px ${value.color}`;
          newStyles.boxShadow = newStyles.boxShadow ? `${newStyles.boxShadow}, ${shadow}` : shadow;
          break;

        case 'linear-gradient':
          gradients.push(`linear-gradient(${value.angle}deg, ${value.color1}, ${value.color2})`);
          break;
        case 'radial-gradient':
          gradients.push(`radial-gradient(circle, ${value.color1}, ${value.color2})`);
          break;
        case 'filter':
          Object.keys(value).forEach(key => {
            const subDef = definition.subAttributes?.find(d => d.id === key);
            if (subDef && value[key] !== subDef.defaultValue) {
              const unit = key === 'hueRotate' ? 'deg' : key === 'blur' ? 'px' : '';
              filters.push(`${key}(${value[key]}${unit})`);
            }
          });
          break;
        case 'transform':
            Object.keys(value).forEach(key => {
                const subDef = definition.subAttributes?.find(d => d.id === key);
                if (subDef && value[key] !== subDef.defaultValue) {
                    const unit = key.includes('translate') ? 'px' : key.includes('rotate') ? 'deg' : '';
                    const transformKey = key.includes('scale') ? key : key.split(/(?=[A-Z])/).join('-').toLowerCase();
                    transforms.push(`${transformKey}(${value[key]}${unit})`);
                }
            });
            break;
      }
    });

    if (gradients.length > 0) newStyles.backgroundImage = gradients.join(', ');
    if (filters.length > 0) newStyles.filter = filters.join(' ');
    if (transforms.length > 0) newStyles.transform = transforms.join(' ');

    setTileStyles(newStyles);
  }, [activeAttributes]);

  const handleSave = () => {
    const finalStyle: TileStyle = {
      ...tileStyles,
      blend: isBlendMode,
      transform: tileStyles.transform, // Already in tileStyles
    };
    saveToPalette(finalStyle);
  };

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
      <Preview tileStyles={tileStyles} isBlendMode={isBlendMode} onBlendChange={setIsBlendMode} />
      <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={handleRandomize}>Randomize</button>
        <button onClick={handleSave}>Save to Palette</button>
      </div>
      <AttributePanel attributes={activeAttributes} setAttributes={setActiveAttributes} />
    </div>
  );
};

export default TextureCreator;
