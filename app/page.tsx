import React, { useState } from 'react';
import { Download, Lock } from 'lucide-react'; 

const PlannerGenerator = () => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');
  const [pattern, setPattern] = useState('none');
  const [selectedSections, setSelectedSections] = useState([]);
  const [fontFamily, setFontFamily] = useState('default');
  const [customColors, setCustomColors] = useState(null);
  const [hiddenSections, setHiddenSections] = useState([]);
  const [sectionReplacements, setSectionReplacements] = useState({});

  /* -------------------- templates -------------------- */
  const templates = {
    minimalist: {
      name: 'Minimalist',
      description: 'Clean, simple, uncluttered',
      background: '#FFFFFF',
      primary: '#F5F5F5',
      accent: '#666666',
      border: '#CCCCCC',
      text: '#333333',
      layout: 'simple-grid'
    },
    // ... (UNCHANGED — rest of your templates)
  };

  /* -------------------- OPTIONAL SECTIONS -------------------- */
  const optionalSections = {
    // ... (UNCHANGED — entire optionalSections object)
  };

  /* -------------------- HELPERS -------------------- */
  const renderSectionOrReplacement = (
    sectionId,
    hiddenSections,
    replacements,
    colors,
    originalContent,
    yPosition
  ) => {
    if (!hiddenSections.includes(sectionId)) {
      return originalContent;
    } else if (replacements[sectionId] && optionalSections[replacements[sectionId]]) {
      return optionalSections[replacements[sectionId]].render(colors, yPosition);
    }
    return null;
  };

  /* -------------------- ALL LAYOUT RENDERERS -------------------- */
  // (UNCHANGED — all renderMinimalistLayout → renderElegantLayout)

  const renderJournalLayout = (colors, hiddenSections = [], replacements = {}) => {
    return (
      <g>
        {/* header */}
        <text x="425" y="70" fontSize="28" fontWeight="400" fill={colors.text} textAnchor="middle" fontFamily="Georgia">
          Journal
        </text>
        <line x1="300" y1="85" x2="550" y2="85" stroke={colors.accent} strokeWidth="1" />

        {/* date */}
        <text x="100" y="130" fontSize="12" fill={colors.text}>Date: _______________</text>
        <text x="600" y="130" fontSize="12" fill={colors.text}>Day: _______________</text>

        {/* lines */}
        {[...Array(31)].map((_, i) => (
          <line
            key={i}
            x1="100"
            y1={160 + i * 24}
            x2="750"
            y2={160 + i * 24}
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.6"
          />
        ))}

        {/* margin */}
        <line x1="130" y1="160" x2="130" y2="880" stroke={colors.accent} strokeWidth="1" opacity="0.3" />

        {/* quote */}
        <text
          x="425"
          y="870"
          fontSize="11"
          fill={colors.accent}
          textAnchor="middle"
          fontStyle="italic"
        >
          "Write your story..."
        </text>
      </g>
    );
  };  // ✅ FIX #1 — properly closed function

  const renderDreamJournalLayout = (colors, hiddenSections = [], replacements = {}) => {
    return (
      <g>
        {/* UNCHANGED */}
      </g>
    );
  };

  /* -------------------- UI + SVG -------------------- */

  const renderPattern = (patternType, colors) => {
    if (patternType === 'none') return null;
    return (
      <defs>
        {/* UNCHANGED */}
      </defs>
    );
  };

  const getPatternFill = (patternType) => {
    if (patternType === 'none') return null;
    const map = {
      zebra: 'url(#zebraPattern)',
      leopard: 'url(#leopardPattern)',
      stars: 'url(#starsPattern)',
      hearts: 'url(#heartsPattern)',
      polkadot: 'url(#polkadotPattern)',
    };
    return map[patternType];
  };

  const getActiveColors = () => {
    const baseColors = templates[selectedTemplate];
    if (!customColors) return baseColors;
    return {
      ...baseColors,
      accent: customColors.accent || baseColors.accent,
      border: customColors.border || baseColors.border,
      text: customColors.text || baseColors.text,
    };
  };

  const handleLogin = () => {
    if (accessCode === 'PLAN2024') setIsAuthenticated(true);
    else alert('Invalid code');
  };

  const downloadSVG = () => {
    try {
      const svg = document.getElementById('template-svg');
      if (!svg) return alert('Not found');
      const clone = svg.cloneNode(true);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const content = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate}-planner.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('✅ Downloaded!');
    } catch {
      alert('Failed');
    }
  };

  /* -------------------- PREVIEW -------------------- */
  return (
    <svg id="template-svg">
      {/* ... */}
      {selectedTemplate === 'children' && (
        <g fontFamily={fontOptions[fontFamily].family}>
          {renderChildrenLayout(
            getActiveColors(),
            hiddenSections,
            sectionReplacements
          )} {/* ✅ FIX #2 — JSX comment */}
        </g>
      )}
    </svg>
  );
};

export default PlannerGenerator;
