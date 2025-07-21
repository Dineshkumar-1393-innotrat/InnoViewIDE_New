
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


// import { useDrag } from 'react-dnd';
// import { useEffect } from 'react';
// import { getEmptyImage } from 'react-dnd-html5-backend';

// export default function DraggableShape({ shape }) {
//   const [{ isDragging }, drag, preview] = useDrag(() => ({
//     type: 'shape',
//     item: { shape },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   useEffect(() => {
//     preview(getEmptyImage(), { captureDraggingState: true });
//   }, [preview]);

//   return (
//     <div
//       ref={drag}
//       className={`w-[80px] h-[80px] border p-2 m-1 rounded cursor-move bg-white shadow ${
//         isDragging ? 'opacity-50' : ''
//       }`}
//     >
//       <svg
//         viewBox={shape.icon?.viewBox || '0 0 100 100'}
//         className="w-full h-full"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <path
//           d={shape.icon?.path || ''}
//           fill={shape.icon?.fill || '#4B5563'}
//           stroke={shape.icon?.stroke || '#1F2937'}
//           strokeWidth={shape.icon?.strokeWidth || '1'}
//         />
//       </svg>
//       <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
//     </div>
//   );
// }





// // import { useDrag } from 'react-dnd';
// // import { useEffect } from 'react';
// // import { getEmptyImage } from 'react-dnd-html5-backend';



// // export default function DraggableShape({ shape }) {
// //   const [{ isDragging }, drag] = useDrag(() => ({
// //     type: 'shape',
// //     item: { shape },
// //     collect: (monitor) => ({
// //       isDragging: !!monitor.isDragging(),
// //     }),
// //   }));
// // useEffect(() => {
// //   dragPreview(getEmptyImage(), { captureDraggingState: true });
// // }, []);
// //   return (
// //    <div
// //   ref={drag}
// //   className={`w-[80px] h-[80px] border p-2 m-1 rounded cursor-move bg-white shadow ${
// //     isDragging ? 'opacity-50' : ''
// //   }`}
// // >

// //       {/* <svg
// //         viewBox={shape.icon?.viewBox || '0 0 100 100'}
// //         width="100%"
// //         height="100%"
// //         preserveAspectRatio="xMidYMid meet"
// //         className="w-12 h-12 mx-auto"
// //       > */}
// //       <svg
// //   viewBox={shape.icon?.viewBox || '0 0 100 100'}
// //   className="w-full h-full"
// //   preserveAspectRatio="xMidYMid meet"
// // >

// //         <path
// //           d={shape.icon?.path || ''}
// //           fill={shape.icon?.fill || '#4B5563'}
// //           stroke={shape.icon?.stroke || '#1F2937'}
// //           strokeWidth={shape.icon?.strokeWidth || '1'}
// //         />
// //       </svg>
// //       <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
// //     </div>
// //   );
// // }


// // import { useDrag } from 'react-dnd';

// // export default function DraggableShape({ shape }) {
// //   const [{ isDragging }, drag] = useDrag(() => ({
// //     type: 'shape',
// //     item: { shape },
// //     collect: (monitor) => ({
// //       isDragging: !!monitor.isDragging(),
// //     }),
// //   }));

// //   return (
// //     <div
// //       ref={drag}
// //       className={`border p-2 m-1 rounded cursor-move bg-white shadow ${
// //         isDragging ? 'opacity-50' : ''
// //       }`}
// //     >
// //      <svg
// //   viewBox={shape.icon?.viewBox || "0 0 100 100"}
// //   width="100%"
// //   height="100%"
// //   preserveAspectRatio="xMidYMid meet"
// //    className="w-12 h-12 mx-auto"
// // >
// //  d={shape.icon?.path || ""}
// //           fill={shape.icon?.fill || "#4B5563"}
// //           stroke={shape.icon?.stroke || "#1F2937"}
// //           strokeWidth={shape.icon?.strokeWidth || "1"}
// // </svg>

// //        <div className="text-xs text-center text-gray-700 mt-1">{shape.name}</div>
// //     </div>
// //   );
// // }
