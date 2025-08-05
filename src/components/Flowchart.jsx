
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Flowchart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new diagram editor
    navigate('/diagram-editor', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Redirecting to Diagram Editor...
    </div>
  );
};

export default Flowchart;