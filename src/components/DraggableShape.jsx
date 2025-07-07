import React from 'react';
import { useDrag } from 'react-dnd';
import Shape from './Shape';

const DraggableShape = ({ shape }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shape',
    item: shape,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Shape icon={shape.icon} name={shape.name} />
    </div>
  );
};

export default DraggableShape;