export const saveToJSON = (nodes, edges) => {
  const json = JSON.stringify({ nodes, edges });
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'flow.json';
  link.click();
};

export const loadFromJSON = (event, dispatch, setNodes, setEdges) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      let { nodes, edges } = JSON.parse(reader.result);
      // Autofix nodes
      nodes = nodes.map(node => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
        data: {
          label: node.data?.label || node.data?.shape?.name || 'Node',
          ...node.data
        },
        style: {
          width: node.style?.width || 100,
          height: node.style?.height || 60,
          background: node.style?.background || '#2563eb',
          ...node.style
        }
      }));
      // Autofix edges
      edges = edges.map(edge => ({
        ...edge,
        color: edge.color || '#4F46E5',
        type: edge.type || 'custom',
      }));
      dispatch(setNodes(nodes));
      dispatch(setEdges(edges));
    } catch (err) {
      // alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
};

import { toPng } from 'html-to-image';

export const exportAsPng = (ref) => {
  if (!ref?.current) return;
  toPng(ref.current).then((dataUrl) => {
    const link = document.createElement('a');
    link.download = 'flowchart.png';
    link.href = dataUrl;
    link.click();
  });
};
