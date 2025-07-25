// src/utils/exportImage.js

import { toPng } from 'html-to-image';

export const exportAsPng = async (node) => {
  if (!node) return;
  try {
    const dataUrl = await toPng(node);
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = dataUrl;
    link.click();
  } catch (err) {
    // console.error('Failed to export as PNG:', err);
  }
};

export const saveToJSON = (nodes, edges) => {
  const json = JSON.stringify({ nodes, edges });
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'diagram.json';
  link.click();
};

export const loadFromJSON = (event, dispatch, setNodes, setEdges) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const { nodes, edges } = JSON.parse(reader.result);
      dispatch(setNodes(nodes));
      dispatch(setEdges(edges));
    } catch (err) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
};
