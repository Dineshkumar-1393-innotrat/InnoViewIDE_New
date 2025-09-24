import { Position } from 'reactflow';

export const ItemTypes = { 
  SHAPE: 'shape',
};

export const shapeData = {
    'Flowchart': [
    { 
      id: 'flow-rectangle', 
      name: 'Rectangle', 
      icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z' }, 
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { id: 'flow-diamond', name: 'Diamond', icon: { viewBox: '0 0 100 100', path: 'M50 0 L100 50 L50 100 L0 50 Z' }, anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ] },
    { id: 'flow-oval', name: 'Oval', icon: { viewBox: '0 0 100 60', path: 'M50,0 A50,30 0 1,0 50,60 A50,30 0 1,0 50,0' }, anchors: [ {x:50,y:0},{x:100,y:30},{x:50,y:60},{x:0,y:30} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ] },
    { 
      id: 'flow-parallelogram', 
      name: 'Parallelogram', 
      icon: { viewBox: '0 0 100 60', path: 'M20 0 H100 L80 60 H0 Z' }, 
      anchors: [ {x:20,y:0},{x:100,y:0},{x:80,y:60},{x:0,y:60},{x:60,y:0},{x:90,y:30},{x:40,y:60},{x:10,y:30} ],
      getHandles: () => {
        // Path: M20 0 H100 L80 60 H0 Z
        const slant = 20; // The horizontal offset of the slanted sides
        const width = 100;
        const leftOffset = slant / width;

        return [
          { id: 'top', position: Position.Top, style: { top: '0%', left: '60%' } }, // Midpoint of top edge (20,0) to (100,0)
          { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '40%' } }, // Midpoint of bottom edge (80,60) to (0,60)
          { id: 'left', position: Position.Left, style: { top: '50%', left: `${leftOffset * 50}%` } }, // Midpoint of left edge (0,60) to (20,0)
          { id: 'right', position: Position.Right, style: { top: '50%', left: `${100 - (leftOffset * 50)}%` } }, // Midpoint of right edge (100,0) to (80,60)
        ];
      }
    },
    { id: 'flow-triangle', name: 'Triangle', icon: { viewBox: '0 0 100 86.6', path: 'M50 0 L100 86.6 H0 Z' }, anchors: [ {x:50,y:0},{x:100,y:86.6},{x:0,y:86.6},{x:75,y:43.3},{x:25,y:43.3} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom-left', position: Position.Bottom, style: { top: '100%', left: '25%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom-right', position: Position.Bottom, style: { top: '100%', left: '75%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ] },
    { id: 'flow-cylinder', name: 'Cylinder', icon: { viewBox: '0 0 100 100', path: 'M50 0 C22.386 0 0 15 0 15 V85 C0 85 22.386 100 50 100 C77.614 100 100 85 100 85 V15 C100 15 77.614 0 50 0 Z M0 15 C0 15 22.386 30 50 30 C77.614 30 100 15 100 15' }, anchors: [ {x:50,y:0},{x:100,y:15},{x:100,y:85},{x:50,y:100},{x:0,y:85},{x:0,y:15} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ] },
    { id: 'flow-circle', name: 'Circle', icon: { viewBox: '0 0 100 100', path: 'M50,0 C22.386,0 0,22.386 0,50 C0,77.614 22.386,100 50,100 C77.614,100 100,77.614 100,50 C100,22.386 77.614,0 50,0 Z' }, anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ] },
    { id: 'flow-right-arrow', name: 'Right Arrow', icon: { viewBox: '0 0 100 60', path: 'M0 20 H70 L70 0 L100 30 L70 60 V40 H0 Z' }, anchors: [ {x:0,y:30},{x:70,y:30},{x:100,y:30},{x:70,y:0},{x:70,y:60} ], getHandles: () => [
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
        { id: 'top', position: Position.Top, style: { top: '0%', left: '70%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '70%', transform: 'translate(-50%, -50%)' } },
      ] },
    { id: 'flow-bracket-open', name: 'Bracket Open', icon: { viewBox: '0 0 30 100', path: 'M20 0 H10 V100 H20' } },
    { id: 'flow-bracket-close', name: 'Bracket Close', icon: { viewBox: '0 0 30 100', path: 'M10 0 H20 V100 H10' } },
    { id: 'flow-brace-open', name: 'Brace Open', icon: { viewBox: '0 0 30 100', path: 'M20 0 H10 C5 0 5 25 10 25 V75 C5 75 5 100 10 100 H20' } },
    { id: 'flow-brace-close', name: 'Brace Close', icon: { viewBox: '0 0 30 100', path: 'M10 0 H20 C25 0 25 25 20 25 V75 C25 75 25 100 20 100 H10' } },
    { id: 'flow-square', name: 'Square', icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z' }, anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:50},{x:100,y:100},{x:50,y:100},{x:0,y:100},{x:0,y:50} ] },
    { id: 'flow-hourglass', name: 'Hourglass', icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 L0 100 H100 Z' } },
    { id: 'flow-document-wavy', name: 'Document', icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V80 C 75 70, 25 90, 0 80 Z' } },
    { id: 'flow-magnetic-drum', name: 'Magnetic Drum', icon: { viewBox: '0 0 100 100', path: 'M15 0 C15 22, 0 22, 0 50 C0 78, 15 78, 15 100 H85 C85 78, 100 78, 100 50 C100 22, 85 22, 85 0 Z' } },
    { id: 'flow-manual-input', name: 'Manual Input', icon: { viewBox: '0 0 100 60', path: 'M0 60 H100 V0 H20 Z' } },
    { id: 'flow-document-cut', name: 'Document', icon: { viewBox: '0 0 100 100', path: 'M0 0 H75 L100 25 V100 H0 Z' } },
    { id: 'flow-trapezoid', name: 'Trapezoid', icon: { viewBox: '0 0 100 60', path: 'M20 0 H80 L100 60 H0 Z' } },
    { id: 'flow-inverted-trapezoid', name: 'Inverted Trapezoid', icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 L80 60 H20 Z' } },
    { id: 'flow-inverted-triangle', name: 'Inverted Triangle', icon: { viewBox: '0 0 100 86.6', path: 'M0 0 H100 L50 86.6 Z' } },
    { id: 'flow-shield', name: 'Shield', icon: { viewBox: '0 0 100 100', path: 'M0 20 L50 0 L100 20 V80 C50 100, 50 100, 0 80 Z' } },
    { id: 'flow-cross', name: 'Cross', icon: { viewBox: '0 0 100 100', path: 'M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M50 20 V80 M20 50 H80' } },
    { id: 'flow-flag', name: 'Flag', icon: { viewBox: '0 0 100 100', path: 'M0 0 V100 V0 H50 C 60 10, 90 10, 100 0 V50 C 90 40, 60 40, 50 50 H0 Z' } },
    { id: 'flow-equals-diamonds', name: 'Equals', icon: { viewBox: '0 0 120 100', path: 'M10 50 L25 35 L40 50 L25 65 Z M45 50 L60 35 L75 50 L60 65 Z M80 50 L95 35 L110 50 L95 65 Z' } },
    { id: 'flow-hexagon-arrow', name: 'Hexagon Arrow', icon: { viewBox: '0 0 100 86.6', path: 'M0 43.3 L25 0 H75 L100 43.3 L75 86.6 H25 Z' } },
    { id: 'flow-circle-x', name: 'Circle X', icon: { viewBox: '0 0 100 100', path: 'M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M20 20 L80 80 M80 20 L20 80' } },
    { id: 'flow-fat-arrow', name: 'Fat Arrow', icon: { viewBox: '0 0 100 100', path: 'M0 25 H50 V0 L100 50 L50 100 V75 H0 Z' } },
    { id: 'flow-pentagon', name: 'Pentagon', icon: { viewBox: '0 0 100 95.1', path: 'M50 0 L100 36.3 L80.9 95.1 H19.1 L0 36.3 Z' }, anchors: [ {x:50,y:0},{x:100,y:36.3},{x:80.9,y:95.1},{x:19.1,y:95.1},{x:0,y:36.3},{x:75,y:65.7},{x:25,y:65.7} ] },
    { id: 'flow-hexagon', name: 'Hexagon', icon: { viewBox: '0 0 100 86.6', path: 'M25 0 L75 0 L100 43.3 L75 86.6 H25 L0 43.3 Z' }, anchors: [ {x:25,y:0},{x:75,y:0},{x:100,y:43.3},{x:75,y:86.6},{x:25,y:86.6},{x:0,y:43.3},{x:50,y:0},{x:100,y:65},{x:50,y:86.6},{x:0,y:21.6} ] },
    { id: 'flow-stored-data', name: 'Stored Data', icon: { viewBox: '0 0 100 60', path: 'M20 0 C 30 0, 70 0, 80 0 H 100 V 60 H 20 C 10 60, -10 60, 0 60 V 0 H 20' } },
    { id: 'flow-internal-storage', name: 'Internal Storage', icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M0 20 H100 M20 0 V100' } },
    { id: 'block-cloud', name: 'Cloud', icon: { viewBox: '0 0 100 60', path: 'M20,40 Q10,30 20,20 Q15,5 35,10 Q40,0 55,10 Q70,0 75,15 Q95,15 90,35 Q100,45 85,50 Q80,60 65,55 Q55,65 45,55 Q30,65 25,50 Q5,50 20,40 Z', stroke: '#000', strokeWidth: 2, fill: 'white' } },
    { id: 'flow-paper-tape', name: 'Paper Tape', icon: { viewBox: '0 0 100 120', path: 'M0 20 C 25 10, 75 10, 100 20 V 100 C 75 110, 25 110, 0 100 Z' } }
  ],

  'Block Diagram': [
    { 
      id: 'block-process', 
      name: 'Process', 
      icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z' }, 
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-decision', 
      name: 'Decision', 
      icon: { viewBox: '0 0 100 100', path: 'M50 0 L100 50 L50 100 L0 50 Z' }, 
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-data', 
      name: 'Data', 
      icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100' }, 
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-terminal', 
      name: 'Terminal', 
      icon: { viewBox: '0 0 100 60', path: 'M20 0 H80 Q100 0 100 20 V40 Q100 60 80 60 H20 Q0 60 0 40 V20 Q0 0 20 0 Z' }, 
      anchors: [ {x:20,y:0},{x:50,y:0},{x:80,y:0},{x:100,y:20},{x:100,y:40},{x:80,y:60},{x:50,y:60},{x:20,y:60},{x:0,y:40},{x:0,y:20} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-connector', 
      name: 'Connector', 
      icon: { viewBox: '0 0 100 100', path: 'M50 0 A50 50 0 1 0 50.001 0 Z' }, 
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-off-page', 
      name: 'Off Page', 
      icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M10 0 V60 M20 0 V60 M30 0 V60 M40 0 V60 M50 0 V60 M60 0 V60 M70 0 V60 M80 0 V60 M90 0 V60' }, 
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-summing', 
      name: 'Summing', 
      icon: { viewBox: '0 0 100 100', path: 'M50 0 A50 50 0 1 0 50.001 0 Z M50 20 A30 30 0 1 0 50.001 20 Z' }, 
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    { 
      id: 'block-delay', 
      name: 'Delay', 
      icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z M0 15 H100 M0 30 H100 M0 45 H100' }, 
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    }
  ],
  
  'Basic': [
    {
      id: 'basic-square',
      name: 'Square',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 0 H100 V100 H0 Z'
      },
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:50},{x:100,y:100},{x:50,y:100},{x:0,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'basic-circle',
      name: 'Circle',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50,0 A50,50 0 1,0 50.001,0'
      },
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'basic-diamond',
      name: 'Diamond',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 L100 50 L50 100 L0 50 Z'
      },
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'basic-triangle-up',
      name: 'Triangle Up',
      icon: {
        viewBox: '0 0 100 86.6',
        path: 'M50 0 L100 86.6 H0 Z'
      }
    },
    {
      id: 'basic-triangle-down',
      name: 'Triangle Down',
      icon: {
        viewBox: '0 0 100 86.6',
        path: 'M0 0 H100 L50 86.6 Z'
      }
    },
    {
      id: 'basic-ellipse',
      name: 'Ellipse',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M50 0 C22 0 0 27 0 30 C0 33 22 60 50 60 C78 60 100 33 100 30 C100 27 78 0 50 0 Z'
      }
    },
    {
      id: 'basic-pentagon',
      name: 'Pentagon',
      icon: {
        viewBox: '0 0 100 95.1',
        path: 'M50 0 L100 36.3 L80.9 95.1 H19.1 L0 36.3 Z'
      }
    },
    {
      id: 'basic-octagon',
      name: 'Octagon',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M30 0 H70 L100 30 V70 L70 100 H30 L0 70 V30 Z'
      }
    },
    {
      id: 'basic-plus',
      name: 'Plus',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M40 0 H60 V40 H100 V60 H60 V100 H40 V60 H0 V40 H40 Z'
      }
    },
    {
      id: 'basic-left-arrow',
      name: 'Left Arrow',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M100 20 H30 V0 L0 30 L30 60 V40 H100 Z'
      }
    },
    {
      id: 'basic-right-arrow',
      name: 'Right Arrow',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M0 20 H70 V0 L100 30 L70 60 V40 H0 Z'
      }
    },
    {
      id: 'basic-chevron',
      name: 'Chevron',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 0 L50 50 L0 100'
      }
    },
    {
      id: 'basic-star',
      name: 'Star',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 L61 35 H98 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 H39 Z'
      }
    },
    {
      id: 'basic-chat-bubble',
      name: 'Chat Bubble',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 0 H100 V80 H30 L0 100 Z'
      }
    }
  ],

  'UML Use Case Diagram': [
    {
      id: 'use-case',
      name: 'Use Case',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M50 0 C22 0 0 27 0 30 C0 33 22 60 50 60 C78 60 100 33 100 30 C100 27 78 0 50 0 Z'
      }
    },
    {
      id: 'actor',
      name: 'Actor',
      icon: {
        viewBox: '0 0 100 140',
        // Use two arcs to draw a full circle for the head to avoid renderer inconsistencies
        path: 'M50 20 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 M50 40 V90 M20 60 H80 M50 90 L20 130 M50 90 L80 130',
        stroke: '#000',
        strokeWidth: 4,
        fill: 'none'
      }
    },
    {
      id: 'extension-point',
      name: 'Extension Point',
      icon: {
        viewBox: '0 0 100 20',
        path: 'M0 10 H100'
      }
    }
  ],

  'UML Sequence Diagram': [
    {
      id: 'lifeline',
      name: 'Lifeline',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 V100 M45 0 H55'
      }
    },
    {
      id: 'message',
      name: 'Message',
      icon: {
        viewBox: '0 0 100 10',
        path: 'M0 5 H90 L80 0 M90 5 L80 10'
      }
    },
    {
      id: 'activation-bar',
      name: 'Activation Bar',
      icon: {
        viewBox: '0 0 20 80',
        path: 'M0 0 H20 V80 H0 Z'
      }
    }
  ],

  'UML Timing Diagram': [
    {
      id: 'time-line',
      name: 'Time Line',
      icon: {
        viewBox: '0 0 100 10',
        path: 'M0 5 H100 M10 0 V10 M30 0 V10 M50 0 V10'
      }
    },
    {
      id: 'state-transition',
      name: 'State Transition',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 50 H50 V100 H100'
      }
    },
    {
      id: 'timing-box',
      name: 'Timing Box',
      icon: {
        viewBox: '0 0 100 50',
        path: 'M0 0 H100 V50 H0 Z'
      }
    }
  ],

  'Data Structures': [
    {
      id: 'dsa-array',
      name: 'Array',
      icon: { viewBox: '0 0 100 25', path: 'M0 0 H20 V25 H0 Z M25 0 H45 V25 H25 Z M50 0 H70 V25 H50 Z M75 0 H95 V25 H75 Z' },
      slotGrid: { rows: 1, cols: 4, margin: 3, inset: { top: 10, right: 2, bottom: 10, left: 2 } },
      slotDefaults: { format: '{i}' }
    },
    {
      id: 'dsa-linked-list',
      name: 'Linked List',
      icon: { viewBox: '0 0 120 25', path: 'M0 0 H20 V25 H0 Z M20 12.5 H35 M35 12.5 L30 7.5 M35 12.5 L30 17.5 M40 0 H60 V25 H40 Z M60 12.5 H75 M75 12.5 L70 7.5 M75 12.5 L70 17.5 M80 0 H100 V25 H80 Z' },
      slotGrid: { rows: 1, cols: 3, margin: 3, inset: { top: 10, right: 2, bottom: 10, left: 2 } },
      slotDefaults: { format: '{n}' }
    },
    {
      id: 'dsa-stack',
      name: 'Stack',
      icon: { viewBox: '0 0 50 100', path: 'M0 0 V100 H50 V0 M0 25 H50 M0 50 H50 M0 75 H50' },
      slotGrid: { rows: 4, cols: 1, margin: 6, inset: { top: 4, right: 6, bottom: 4, left: 6 } },
      slotDefaults: { format: '{n}' }
    },
    {
      id: 'dsa-queue',
      name: 'Queue',
      icon: { viewBox: '0 0 100 40', path: 'M0 10 V30 H80 V10 H0 M15 0 V10 M15 30 V40 M80 20 L100 20 M95 15 L100 20 L95 25' },
      slotGrid: { rows: 1, cols: 3, margin: 4, inset: { top: 20, right: 20, bottom: 20, left: 4 } },
      slotDefaults: { format: '{n}' }
    },
    {
      id: 'dsa-heap',
      name: 'Heap',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50 M30 60 L20 80 M20 90 A10 10 0 1 1 19.9 90 M30 60 L40 80 M40 90 A10 10 0 1 1 39.9 90' }
    },
    {
      id: 'dsa-priority-queue',
      name: 'Priority Queue',
      icon: { viewBox: '0 0 100 60', path: 'M10 30 L20 30 M30 10 L40 10 M50 30 L60 30 M70 10 L80 10 M90 30 L100 30 M40 10 L50 30 L30 10 M60 30 L70 10 L50 30 M80 10 L90 30 L70 10 M20 30 L30 10 M10 30 L20 50 L30 30 M50 30 L40 50 L30 30' }
    },
    {
      id: 'dsa-circular-buffer',
      name: 'Circular Buffer',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A 40 40 0 1 1 10 50 M10 50 L0 40 M10 50 L20 40 M50 10 A 40 40 0 1 0 90 50' }
    },
    {
      id: 'dsa-hash-table',
      name: 'Hash Table',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100' },
      slotGrid: { rows: 4, cols: 4, margin: 3, inset: { top: 2, right: 2, bottom: 2, left: 2 } },
      slotDefaults: { format: 'r{r}c{c}' }
    },
    {
      id: 'dsa-binary-tree',
      name: 'Binary Tree',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50 M30 60 L20 80 M20 90 A10 10 0 1 1 19.9 90 M30 60 L40 80 M40 90 A10 10 0 1 1 39.9 90' }
    },
    {
      id: 'dsa-heap-2',
      name: 'Heap',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50 M30 60 L20 80 M20 90 A10 10 0 1 1 19.9 90 M30 60 L40 80 M40 90 A10 10 0 1 1 39.9 90 M70 60 L60 80 M60 90 A10 10 0 1 1 59.9 90' }
    },
    {
      id: 'dsa-graph',
      name: 'Graph',
      icon: { viewBox: '0 0 100 100', path: 'M10 50 A10 10 0 1 1 9.9 50 M20 50 L40 30 M50 20 A10 10 0 1 1 49.9 20 M60 20 L80 30 M90 40 A10 10 0 1 1 89.9 40 M90 60 L80 70 M90 80 A10 10 0 1 1 89.9 80 M50 80 L40 70 M30 60 A10 10 0 1 1 29.9 60 M40 70 L20 50' }
    },
    {
      id: 'dsa-red-black-tree',
      name: 'Red-Black Tree',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50 M30 60 L20 80 M20 90 A10 10 0 1 1 19.9 90' }
    },
    {
      id: 'dsa-trie',
      name: 'Trie',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L50 40 M50 50 A10 10 0 1 1 49.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50' }
    },
    {
      id: 'dsa-bitmask',
      name: 'Bitmask',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M12.5 25 H25 V75 H12.5 Z M37.5 25 H50 V75 H37.5 Z M62.5 25 H75 V75 H62.5 Z M87.5 25 H100 V75 H87.5 Z' },
      slotGrid: { rows: 1, cols: 4, margin: 6, inset: { top: 20, right: 6, bottom: 20, left: 6 } },
      slotDefaults: { format: '0' }
    },
    {
      id: 'dsa-state-table',
      name: 'State Table',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100' },
      slotGrid: { rows: 4, cols: 4, margin: 3, inset: { top: 2, right: 2, bottom: 2, left: 2 } },
      slotDefaults: { format: 'r{r}c{c}' }
    },
    {
      id: 'dsa-doubly-linked-list',
      name: 'Doubly Linked List',
      icon: { viewBox: '0 0 120 25', path: 'M0 0 H20 V25 H0 Z M20 7.5 H35 M35 7.5 L30 2.5 M35 7.5 L30 12.5 M20 17.5 H35 M20 17.5 L25 12.5 M20 17.5 L25 22.5 M40 0 H60 V25 H40 Z M60 7.5 H75 M75 7.5 L70 2.5 M75 7.5 L70 12.5 M60 17.5 H75 M60 17.5 L65 12.5 M60 17.5 L65 22.5 M80 0 H100 V25 H80 Z' },
      slotGrid: { rows: 1, cols: 3, margin: 3, inset: { top: 10, right: 2, bottom: 10, left: 2 } },
      slotDefaults: { format: '{n}' }
    },
    {
      id: 'dsa-red-black-tree-2',
      name: 'Red-Black Tree',
      icon: { viewBox: '0 0 100 100', path: 'M50 10 A10 10 0 1 1 49.9 10 M50 20 L30 40 M30 50 A10 10 0 1 1 29.9 50 M50 20 L70 40 M70 50 A10 10 0 1 1 69.9 50 M30 60 L20 80 M20 90 A10 10 0 1 1 19.9 90' }
    },
    {
      id: 'dsa-task-control-block',
      name: 'Task Control Block',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V20 H0 Z M10 30 H90 V90 H10 Z M20 40 H80 M20 50 H80 M20 60 H80 M20 70 H80 M20 80 H80' }
    },
    {
      id: 'dsa-graph-adjacency-list',
      name: 'Graph Adjacency List',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H20 V100 H0 Z M30 10 H50 V30 H30 Z M60 10 H80 V30 H60 Z M30 40 H50 V60 H30 Z M60 40 H80 V60 H60 Z M30 70 H50 V90 H30 Z' },
      slotGrid: { rows: 3, cols: 2, margin: 3, inset: { top: 10, right: 10, bottom: 10, left: 30 } },
      slotDefaults: { format: 'v{n}' }
    },
    {
      id: 'dsa-interrupt-vector-table',
      name: 'Interrupt Vector Table',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100' },
      slotGrid: { rows: 4, cols: 4, margin: 3, inset: { top: 2, right: 2, bottom: 2, left: 2 } },
      slotDefaults: { format: 'r{r}c{c}' }
    },
    {
      id: 'dsa-semaphore',
      name: 'Semaphore',
      icon: { viewBox: '0 0 100 100', path: 'M50 70 A20 20 0 0 0 50 30 A20 20 0 0 0 50 70 M30 50 H70 M50 30 V10 M40 10 H60' }
    },
    {
      id: 'dsa-mutex',
      name: 'Mutex',
      icon: { viewBox: '0 0 100 100', path: 'M50 70 A20 20 0 0 0 50 30 A20 20 0 0 0 50 70 M30 50 H70 M50 30 V10 M40 10 H60' }
    },
    {
      id: 'dsa-lru-cache',
      name: 'LRU Cache',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V20 H0 Z M0 30 H100 V50 H0 Z M0 60 H100 V80 H0 Z' },
      slotGrid: { rows: 3, cols: 1, margin: 6, inset: { top: 6, right: 6, bottom: 6, left: 6 } },
      slotDefaults: { format: '{n}' }
    },
    {
      id: 'dsa-buffer-pool',
      name: 'Buffer Pool',
      icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100' },
      slotGrid: { rows: 4, cols: 4, margin: 3, inset: { top: 2, right: 2, bottom: 2, left: 2 } },
      slotDefaults: { format: 'r{r}c{c}' }
    }
  ],

  'Activity & State Diagram': [
    {
      id: 'activity',
      name: 'Activity',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M0 0 H100 V60 H0 Z'
      },
      anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'decision',
      name: 'Decision',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 L100 50 L50 100 L0 50 Z'
      },
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'start-state',
      name: 'Start',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 A50 50 0 1 0 50.001 0 Z'
      },
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'end-state',
      name: 'End',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 A50 50 0 1 0 50.001 0 Z M20 20 A30 30 0 1 0 20.001 20 Z'
      },
      anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ],
      getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' } },
      ]
    },
    {
      id: 'note',
      name: 'Note',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 0 H70 L100 30 V100 H0 Z M70 0 V30 H100'
      }
    }
  ],

  // 'Connectors': [
  //   {
  //     id: 'connector-line',
  //     name: 'Line',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: 'M0 100 L100 0',
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   },
  //   {
  //     id: 'connector-diagonal-arrow',
  //     name: 'Arrow',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: 'M0 100 L100 0 M80 20 L100 0 L80 0',
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   },
  //   {
  //     id: 'connector-double-arrow',
  //     name: 'Double Arrow',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: 'M5 95 L95 5 M75 25 L95 5 L75 5 M25 75 L5 95 L25 95',
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   },
  //   {
  //     id: 'connector-curved-1',
  //     name: 'Curved Connector',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: 'M0 100 Q100 0 100 100',
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   },
  //   {
  //     id: 'connector-curved-2',
  //     name: 'Curved Arrow',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: 'M0 100 Q100 0 100 100 M80 80 L100 100 L100 80',
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   },
  //   {
  //     id: 'connector-double-arrow-header',
  //     name: 'Double Arrow Header',
  //     icon: {
  //       viewBox: '0 0 100 100',
  //       path: `
  //         M10 50 L90 50
  //         M10 50 L20 45 L20 55 Z
  //         M90 50 L80 45 L80 55 Z
  //       `,
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       fill: 'none'
  //     }
  //   }
    
  // ],

}; 