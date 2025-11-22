import '../assets/css/material.css';
import React, { useRef } from 'react';
import {
  DiagramComponent,
  SymbolPaletteComponent,
  DiagramTools
} from '@syncfusion/ej2-react-diagrams';
import { ToolbarComponent } from '@syncfusion/ej2-react-navigations';
import './BlockDiagramTest.css';
import BackToHome from './BackToHome';
import Navbarone from './Navbarone';

function App() {
  const diagramRef = useRef(null);
  // Diagram default settings
  const snapSettings = {
    horizontalGridlines: { lineColor: '#E0E0E0', lineIntervals: [1, 10], snapIntervals: [5] },
    verticalGridlines: { lineColor: '#E0E0E0', lineIntervals: [1, 10], snapIntervals: [5] }
  };
  // Get the diagram instance correctly
  const getDiagramInstance = () => {
    return diagramRef.current;
  };
  // Toolbar button actions
  function cut() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.cut();
  }
  function copy() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.copy();
  }
  function paste() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.paste();
  }
  function undo() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.undo();
  }
  function redo() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.redo();
  }
  function zoomIn() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
  }
  function zoomOut() {
    const diagram = getDiagramInstance();
    if (diagram) diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
  }
  // Save the diagram (Export)
  function saveDiagram() {
    const diagram = getDiagramInstance();
    if (diagram) {
      const data = diagram.saveDiagram(); // Convert to JSON
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flowchart.json'; // Download file
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
  // Load the diagram (Import)
  function loadDiagram() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const diagram = getDiagramInstance();
        if (diagram) {
          diagram.clear(); // Clear existing diagram
          diagram.loadDiagram(event.target.result); // Load JSON data
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  // Toolbar items
  const toolbarItems = [
    // { prefixIcon: 'e-icons e-cut', tooltipText: 'Cut', type: 'Button', click: cut },
    // { prefixIcon: 'e-icons e-copy', tooltipText: 'Copy', type: 'Button', click: copy },
    // { prefixIcon: 'e-icons e-paste', tooltipText: 'Paste', type: 'Button', click: paste },
    { type: 'Separator' },
    { prefixIcon: 'e-icons e-undo', tooltipText: 'Undo', type: 'Button', click: undo },
    { prefixIcon: 'e-icons e-redo', tooltipText: 'Redo', type: 'Button', click: redo },
    { type: 'Separator' },
    { prefixIcon: 'e-icons e-zoom-in', tooltipText: 'Zoom In', type: 'Button', click: zoomIn },
    { prefixIcon: 'e-icons e-zoom-out', tooltipText: 'Zoom Out', type: 'Button', click: zoomOut },
    { type: 'Separator' },
    { text: 'Save', tooltipText: 'Save Diagram', type: 'Button', click: saveDiagram },
    { text: 'Load', tooltipText: 'Load Diagram', type: 'Button', click: loadDiagram }
  ];
  // Symbol palette items
  const flowShapes = [
    { id: 'process', shape: { type: 'Flow', shape: 'Process' } },
    { id: 'decision', shape: { type: 'Flow', shape: 'Decision' } },
    { id: 'start', shape: { type: 'Flow', shape: 'Terminator' } },
    { id: 'document', shape: { type: 'Flow', shape: 'Document' } },
    { id: 'predefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' } },
    { id: 'preparation', shape: { type: 'Flow', shape: 'Preparation' } },
    { id: 'data', shape: { type: 'Flow', shape: 'Data' } },
    { id: 'directData', shape: { type: 'Flow', shape: 'DirectData' } },
    { id: 'card', shape: { type: 'Flow', shape: 'Card' } },
    { id: 'delay', shape: { type: 'Flow', shape: 'Delay' } },
    { id: 'manualInput', shape: { type: 'Flow', shape: 'ManualInput' } },
    { id: 'display', shape: { type: 'Flow', shape: 'Display' } }
  ];
  const connectors = [
    {
      id: 'straight',
      type: 'Straight',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 40, y: 40 },
      targetDecorator: { shape: 'Arrow' },
      style: { strokeWidth: 2 }
    },
    {
      id: 'orthogonal',
      type: 'Orthogonal',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 40, y: 40 },
      targetDecorator: { shape: 'Arrow' },
      style: { strokeWidth: 2 }
    },
    {
      id: 'bezier',
      type: 'Bezier',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 40, y: 40 },
      targetDecorator: { shape: 'Arrow' },
      style: { strokeWidth: 2 }
    }
  ];
  return (
    <div className="diagram-builder">
      <Navbarone/>
<div className="header">
        <ToolbarComponent items={toolbarItems} />
      </div>
      <div className="content">
        {/* Sidebar */}
        <div className="sidebarr">
          <SymbolPaletteComponent
            expandMode="Multiple"
            palettes={[
              {
                id: 'flow',
                expanded: true,
                symbols: flowShapes,
                title: 'Flow Shapes'
              },
              {
                id: 'connectors',
                expanded: true,
                symbols: connectors,
                title: 'Connectors'
              }
            ]}
            symbolWidth={100}
            symbolHeight={100}
          />
        </div>
        {/* Diagram Canvas */}
        <div className="diagram-container">
          <DiagramComponent
            ref={diagramRef}
            id="diagram"
            width={"100%"}
            height={"100%"}
            pageSettings={{
              width: 50000,  // Large width
              height: 50000, // Large height to simulate infinite space
              showGrid: true, // Ensure grid is enabled
            }}
            snapSettings={snapSettings}
            tool={DiagramTools.SingleSelect}
          />
        </div>
      </div>
    </div>
  );
}
export default App;