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
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ]
    },
    { id: 'flow-diamond', name: 'Diamond', icon: { viewBox: '0 0 100 100', path: 'M50 0 L100 50 L50 100 L0 50 Z' }, anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50},{x:75,y:25},{x:75,y:75},{x:25,y:75},{x:25,y:25} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ] },
    { id: 'flow-oval', name: 'Oval', icon: { viewBox: '0 0 100 60', path: 'M50,0 A50,30 0 1,0 50.001,0' }, anchors: [ {x:50,y:0},{x:100,y:30},{x:50,y:60},{x:0,y:30} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
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
    { id: 'flow-triangle', name: 'Triangle', icon: { viewBox: '0 0 100 86.6', path: 'M50 0 L100 86.6 H0 Z' }, anchors: [ {x:50,y:0},{x:100,y:86.6},{x:0,y:86.6},{x:75,y:43.3},{x:25,y:43.3} ] },
    { id: 'flow-cylinder', name: 'Cylinder', icon: { viewBox: '0 0 100 100', path: 'M50 0 C22.386 0 0 15 0 15 V85 C0 85 22.386 100 50 100 C77.614 100 100 85 100 85 V15 C100 15 77.614 0 50 0 Z M0 15 C0 15 22.386 30 50 30 C77.614 30 100 15 100 15' } },
    { id: 'flow-circle', name: 'Circle', icon: { viewBox: '0 0 100 100', path: 'M50,0 C22.386,0 0,22.386 0,50 C0,77.614 22.386,100 50,100 C77.614,100 100,77.614 100,50 C100,22.386 77.614,0 50,0 Z' } },
    { id: 'flow-right-arrow', name: 'Right Arrow', icon: { viewBox: '0 0 100 60', path: 'M0 20 H70 L70 0 L100 30 L70 60 V40 H0 Z' } },
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
  
  'Basic': [
    {
      id: 'basic-square',
      name: 'Square',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 0 H100 V100 H0 Z'
      }
    },
    {
      id: 'basic-circle',
      name: 'Circle',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50,0 A50,50 0 1,0 50.001,0'
      }
    },
    {
      id: 'basic-diamond',
      name: 'Diamond',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 L100 50 L50 100 L0 50 Z'
      }
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
        path: 'M50 20 A20 20 0 1 0 49.99 20 M50 40 V90 M20 60 H80 M50 90 L20 130 M50 90 L80 130',
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

  'Activity & State Diagram': [
    {
      id: 'activity',
      name: 'Activity',
      icon: {
        viewBox: '0 0 100 60',
        path: 'M0 0 H100 V60 H0 Z'
      }
    },
    {
      id: 'decision',
      name: 'Decision',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 L100 50 L50 100 L0 50 Z'
      }
    },
    {
      id: 'start-state',
      name: 'Start',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 A50 50 0 1 0 50.001 0 Z'
      }
    },
    {
      id: 'end-state',
      name: 'End',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M50 0 A50 50 0 1 0 50.001 0 Z M20 20 A30 30 0 1 0 20.001 20 Z'
      }
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

  // 'Text & Labels': [
  //   {
  //     id: 'text-box',
  //     name: 'Text Box',
  //     icon: {
  //       viewBox: '0 0 100 50',
  //       path: 'M0 0 H100 V50 H0 Z'
  //     }
  //   },
  //   {
  //     id: 'label-loop',
  //     name: 'Loop',
  //     icon: {
  //       viewBox: '0 0 100 30',
  //       path: 'M0 15 H100'
  //     }
  //   },
  //   {
  //     id: 'label-condition',
  //     name: 'Condition',
  //     icon: {
  //       viewBox: '0 0 100 30',
  //       path: 'M0 15 H100'
  //     }
  //   },
  //   {
  //     id: 'label-else',
  //     name: 'Else',
  //     icon: {
  //       viewBox: '0 0 100 30',
  //       path: 'M0 15 H100'
  //     }
  //   },
  //   {
  //     id: 'label-reference',
  //     name: 'Reference',
  //     icon: {
  //       viewBox: '0 0 100 30',
  //       path: 'M0 15 H100'
  //     }
  //   }
  // ]

  'Connectors': [
    {
      id: 'connector-line',
      name: 'Line',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 100 L100 0',
        stroke: '#000',
        strokeWidth: 2,
        fill: 'none'
      }
    },
    {
      id: 'connector-diagonal-arrow',
      name: 'Arrow',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 100 L100 0 M80 20 L100 0 L80 0',
        stroke: '#000',
        strokeWidth: 2,
        fill: 'none'
      }
    },
    {
      id: 'connector-curved-1',
      name: 'Curved Connector',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 100 Q100 0 100 100',
        stroke: '#000',
        strokeWidth: 2,
        fill: 'none'
      }
    },
    {
      id: 'connector-curved-2',
      name: 'Curved Arrow',
      icon: {
        viewBox: '0 0 100 100',
        path: 'M0 100 Q100 0 100 100 M80 80 L100 100 L100 80',
        stroke: '#000',
        strokeWidth: 2,
        fill: 'none'
      }
    }
  ],

};