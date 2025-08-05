# Logo Export Feature

## Overview
The PNG export functionality now includes a branded watermark with the InnoTrait Labs logo. When users export their diagrams as PNG images, a professional watermark appears in the bottom-left corner.

## Features

### Watermark Design
- **Logo**: Custom hexagon-based logo with connection lines representing innovation and connectivity
- **Text**: "Made with InnoTrat Labs" in a clean, professional font
- **Styling**: Semi-transparent white background with subtle shadow and border
- **Position**: Bottom-left corner of the exported image

### Technical Implementation

#### Components
1. **Logo Component** (`src/components/Logo.jsx`)
   - Reusable SVG logo component
   - Customizable size and color
   - Hexagon design with inner elements and connection lines

2. **Watermark System** (`src/components/DiagramEditor.jsx`)
   - Hidden by default, visible only during export
   - Smooth opacity transitions
   - Positioned outside ReactFlow to ensure proper export

#### Export Process
1. User clicks "Export as PNG" button
2. Watermark becomes visible with smooth transition
3. 100ms delay ensures watermark is fully rendered
4. HTML-to-image library captures the entire canvas including watermark
5. PNG file is generated and downloaded
6. Watermark is hidden again

### Customization

#### Logo Design
To modify the logo, edit the SVG paths in `src/components/Logo.jsx`:
```jsx
const Logo = ({ size = 24, color = '#1970fc', className = '' }) => {
  // Modify the SVG paths here
}
```

#### Watermark Styling
To change the watermark appearance, modify the styles in `src/components/DiagramEditor.jsx`:
```jsx
style={{
  position: 'absolute',
  left: 20,
  bottom: 20,
  // Modify colors, size, position, etc.
}}
```

#### Text Content
To change the watermark text, update the span elements:
```jsx
<span style={{ color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>
  Made with
</span>
<span style={{ color: '#1970fc', fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>
  InnoTrat Labs
</span>
```

## Usage

### For Users
1. Create or open a diagram
2. Click the "Export as PNG" button in the header
3. The exported PNG will automatically include the watermark

### For Developers
The watermark system is automatically integrated into the export process. No additional configuration is required.

## Technical Details

### Dependencies
- `html-to-image`: For PNG export functionality
- React hooks: `useRef`, `useCallback` for watermark management

### File Structure
```
src/
├── components/
│   ├── Logo.jsx              # Reusable logo component
│   └── DiagramEditor.jsx     # Main editor with watermark
├── assets/
│   └── logo.svg              # Alternative logo file
└── utils/
    └── exportImage.js        # Export utility functions
```

### Browser Compatibility
- Modern browsers with SVG support
- Requires `html-to-image` library compatibility
- Tested with Chrome, Firefox, Safari, Edge

## Future Enhancements
- Configurable watermark position
- Multiple logo options
- Custom branding for different user tiers
- Watermark opacity controls
- Alternative watermark styles 