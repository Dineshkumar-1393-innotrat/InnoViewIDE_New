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

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] md:w-[80px] md:h-[80px] p-1 border rounded cursor-move bg-white shadow-md transition-opacity hover:shadow-lg ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <svg
        viewBox={shape.icon?.viewBox || '0 0 100 100'}
        className="w-full h-full max-w-[50px] max-h-[50px] sm:max-w-[60px] sm:max-h-[60px] md:max-w-[70px] md:max-h-[70px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={shape.icon?.path || ''}
          fill={shape.icon?.fill || '#f8fafc'}
          stroke={shape.icon?.stroke || '#1970fc'}
          strokeWidth={shape.icon?.strokeWidth || '3'}
        />
      </svg>
      <div className="text-[8px] sm:text-[10px] md:text-xs text-center text-gray-700 mt-0.5 truncate w-full px-1">
        {shape.name}
      </div>
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

//   // Suppress default drag preview
//   useEffect(() => {
//     preview(getEmptyImage(), { captureDraggingState: true });
//   }, [preview]);

//   console.log(preview,"preview");
  

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
//           fill={shape.icon?.fill || '#fafafc'}
//           stroke={shape.icon?.stroke || '#1970fc'}
//           strokeWidth={shape.icon?.strokeWidth || '5'}
//         />
//       </svg>
//       <div className="text-xs text-center text-black-700 mt-1 truncate">{shape.name}</div>
//     </div>
//   );
// }


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
