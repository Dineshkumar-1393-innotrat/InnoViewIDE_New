import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon

const BackToHome = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/template');
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '5vh',
            }}
        >
            <div
                onClick={handleClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#007BFF',
                    fontSize: '1rem',
                }}
                title="Back to Home"
            >
                <FaArrowLeft style={{ marginRight: '4px' }} /> {/* Back arrow icon */}
                {/* <span>Back to Home</span> Optional label */}
            </div>
        </div>
    );
};

export default BackToHome;
