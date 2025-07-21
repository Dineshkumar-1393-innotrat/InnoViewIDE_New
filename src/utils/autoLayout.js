import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

export async function applyAutoLayout(nodes, edges, direction = 'RIGHT') {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction,
      'elk.spacing.nodeNode': '50',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: parseFloat(node.style?.width || 100),
      height: parseFloat(node.style?.height || 60),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);

  // map layout results back to React Flow nodes
  const positionedNodes = nodes.map((node) => {
    const layoutNode = layout.children.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode.x,
        y: layoutNode.y,
      },
    };
  });

  return positionedNodes;
}
