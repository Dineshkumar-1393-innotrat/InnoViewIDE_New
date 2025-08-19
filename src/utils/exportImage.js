import { toPng } from 'html-to-image';

export const exportAsPng = async (elementRef) => {
  if (!elementRef.current) {
    console.error('Element reference is not available');
    return;
  }

  try {
    const dataUrl = await toPng(elementRef.current, {
      quality: 1.0,
      backgroundColor: '#e0f2fe',
    });
    
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting image:', error);
  }
}; 