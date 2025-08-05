import dagre from 'dagre';

export const applyAutoLayout = async (nodes, edges, direction = 'TB', zoom = 1) => {
  return new Promise((resolve) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
      rankdir: direction,
      nodesep: 50 * zoom,
      ranksep: 100 * zoom,
      marginx: 20 * zoom,
      marginy: 20 * zoom
    });

    // Add nodes to dagre
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.style?.width || 150,
        height: node.style?.height || 100,
      });
    });

    // Add edges to dagre
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply calculated positions to nodes
    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (nodeWithPosition.width / 2),
          y: nodeWithPosition.y - (nodeWithPosition.height / 2),
        },
      };
    });

    resolve(newNodes);
  });
}; 