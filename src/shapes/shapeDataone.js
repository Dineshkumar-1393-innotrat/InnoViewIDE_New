export const ItemTypes = { 
  SHAPE: 'shape',
};

export const shapeDataone = {
  'Block-Diagram': [
    // Rectangle
    { id: 'block-rectangle', name: 'Rectangle', icon: { viewBox: '0 0 100 60', path: 'M0 0 H100 V60 H0 Z' }, anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:30},{x:100,y:60},{x:50,y:60},{x:0,y:60},{x:0,y:30} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ] },
    // Rectangle Dotted
    { id: 'block-rectangle-dotted', name: 'Rectangle Dotted', icon: { viewBox: '0 0 100 60', path: 'M2 2 H98 V58 H2 Z', stroke: '#000', strokeWidth: 2, fill: 'none', strokeDasharray: '6,4' } },
    // Arrow
    { id: 'block-arrow', name: 'Arrow', icon: { viewBox: '0 0 100 60', path: 'M10 30 H70 V15 L95 30 L70 45 V30', stroke: '#000', strokeWidth: 2, fill: 'none' } },
    // Square
    { id: 'block-square', name: 'Square', icon: { viewBox: '0 0 100 100', path: 'M0 0 H100 V100 H0 Z' }, anchors: [ {x:0,y:0},{x:50,y:0},{x:100,y:0},{x:100,y:50},{x:100,y:100},{x:50,y:100},{x:0,y:100},{x:0,y:50} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ] },
    // Dotted Square
    { id: 'block-dotted-square', name: 'Dotted Square', icon: { viewBox: '0 0 100 100', path: 'M2 2 H98 V98 H2 Z', stroke: '#000', strokeWidth: 2, fill: 'none', strokeDasharray: '6,4' } },
    // Circle
    { id: 'block-circle', name: 'Circle', icon: { viewBox: '0 0 100 100', path: 'M50,0 C22.386,0 0,22.386 0,50 C0,77.614 22.386,100 50,100 C77.614,100 100,77.614 100,50 C100,22.386 77.614,0 50,0 Z' }, anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ] },
    // Dotted Circle
    { id: 'block-dotted-circle', name: 'Dotted Circle', icon: { viewBox: '0 0 100 100', path: 'M50,2 A48,48 0 1,0 50.001,2', stroke: '#000', strokeWidth: 2, fill: 'none', strokeDasharray: '6,4' } },
    // Diamond
    { id: 'block-diamond', name: 'Diamond', icon: { viewBox: '0 0 100 100', path: 'M50 0 L100 50 L50 100 L0 50 Z' }, anchors: [ {x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50},{x:75,y:25},{x:75,y:75},{x:25,y:75},{x:25,y:25} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '50%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '50%', left: '100%' } },
      ] },
    // Parallelogram
    { id: 'block-parallelogram', name: 'Parallelogram', icon: { viewBox: '0 0 100 60', path: 'M20 0 H100 L80 60 H0 Z' }, anchors: [ {x:20,y:0},{x:100,y:0},{x:80,y:60},{x:0,y:60},{x:60,y:0},{x:90,y:30},{x:40,y:60},{x:10,y:30} ], getHandles: () => {
        const slant = 20; const width = 100; const leftOffset = slant / width;
        return [
          { id: 'top', position: Position.Top, style: { top: '0%', left: '60%' } },
          { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '40%' } },
          { id: 'left', position: Position.Left, style: { top: '50%', left: `${leftOffset * 50}%` } },
          { id: 'right', position: Position.Right, style: { top: '50%', left: `${100 - (leftOffset * 50)}%` } },
        ];
      } },
    // Double Line (two parallel lines)
    { id: 'block-doubleline', name: 'Double Line', icon: { viewBox: '0 0 100 20', path: 'M5 5 H95 M5 15 H95', stroke: '#000', strokeWidth: 2, fill: 'none' } },
    // Cylinder
    { id: 'block-cylinder', name: 'Cylinder', icon: { viewBox: '0 0 100 100', path: 'M50 0 C22.386 0 0 15 0 15 V85 C0 85 22.386 100 50 100 C77.614 100 100 85 100 85 V15 C100 15 77.614 0 50 0 Z M0 15 C0 15 22.386 30 50 30 C77.614 30 100 15 100 15' } },
    // Zig Zag Line
    { id: 'block-zigzag', name: 'Zig Zag Line', icon: { viewBox: '0 0 100 20', path: 'M0 20 L10 0 L20 20 L30 0 L40 20 L50 0 L60 20 L70 0 L80 20 L90 0 L100 20', stroke: '#000', strokeWidth: 2, fill: 'none' } },
    // Dashed Line
    { id: 'block-dashed-line', name: 'Dashed Line', icon: { viewBox: '0 0 100 20', path: 'M5 10 H95', stroke: '#000', strokeWidth: 2, fill: 'none', strokeDasharray: '8,6' } },
    // Triangle
    { id: 'block-triangle', name: 'Triangle', icon: { viewBox: '0 0 100 86.6', path: 'M50 0 L100 86.6 H0 Z' }, anchors: [ {x:50,y:0},{x:100,y:86.6},{x:0,y:86.6},{x:75,y:43.3},{x:25,y:43.3} ], getHandles: () => [
        { id: 'top', position: Position.Top, style: { top: '0%', left: '50%' } },
        { id: 'bottom', position: Position.Bottom, style: { top: '100%', left: '50%' } },
        { id: 'left', position: Position.Left, style: { top: '75%', left: '0%' } },
        { id: 'right', position: Position.Right, style: { top: '75%', left: '100%' } },
      ] },
    // Oval Dotted
    { id: 'block-ovaldotted', name: 'Oval Dotted', icon: { viewBox: '0 0 100 60', path: 'M50,2 A48,28 0 1,0 50.001,2', stroke: '#000', strokeWidth: 2, fill: 'none', strokeDasharray: '6,4' } },
    // Oval
    { id: 'block-oval', name: 'Oval', icon: { viewBox: '0 0 100 60', path: 'M50,0 A50,30 0 1,0 50.001,0' } },
    // Cloud
    { id: 'block-cloud', name: 'Cloud', icon: { viewBox: '0 0 100 60', path: 'M20,40 Q10,30 20,20 Q15,5 35,10 Q40,0 55,10 Q70,0 75,15 Q95,15 90,35 Q100,45 85,50 Q80,60 65,55 Q55,65 45,55 Q30,65 25,50 Q5,50 20,40 Z', stroke: '#000', strokeWidth: 2, fill: 'white' } },
    // Chevron
    { id: 'block-chevron', name: 'Chevron', icon: { viewBox: '0 0 100 100', path: 'M0 0 L50 50 L0 100', stroke: '#000', strokeWidth: 4, fill: 'none' } },
  ],
  

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