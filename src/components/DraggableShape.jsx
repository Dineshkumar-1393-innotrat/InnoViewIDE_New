
import { useDrag } from 'react-dnd';
import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function DraggableShape({ shape }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'shape',
    item: { shape },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Suppress default drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  console.log(preview,"preview");
  

  return (
    <div
      ref={drag}
      className={`w-[80px] h-[80px] border p-2 m-1 rounded cursor-move bg-white shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <svg
        viewBox={shape.icon?.viewBox || '0 0 100 100'}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={shape.icon?.path || ''}
          fill={shape.icon?.fill || '#fafafc'}
          stroke={shape.icon?.stroke || '#1970fc'}
          strokeWidth={shape.icon?.strokeWidth || '5'}
        />
      </svg>
      <div className="text-xs text-center text-black-700 mt-1 truncate">{shape.name}</div>
    </div>
  );
}
