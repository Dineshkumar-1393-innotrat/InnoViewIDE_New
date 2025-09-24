import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEdge } from '../features/flow/flowSlice';

const OneClickConnection = () => {
  const [sourceNode, setSourceNode] = useState(null);
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.flow.nodes);

  const handleNodeClick = (event, node) => {
    if (!sourceNode) {
      setSourceNode(node);
    } else {
      const newEdge = {
        id: `e${sourceNode.id}-${node.id}`,
        source: sourceNode.id,
        target: node.id,
        type: 'custom',
        animated: true,
      };
      dispatch(addEdge(newEdge));
      setSourceNode(null);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
      <button onClick={() => setSourceNode(null)} disabled={!sourceNode}>
        {sourceNode ? `Connecting from ${sourceNode.data.label}` : 'Click a node to start connecting'}
      </button>
    </div>
  );
};

export default OneClickConnection;
