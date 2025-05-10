
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    // Turn off confetti after 5 seconds for performance
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isActive) return null;
  
  return (
    <>
      <div className="confetti-container">
        {Array.from({ length: 150 }).map((_, index) => (
          <div 
            key={index}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'][Math.floor(Math.random() * 6)],
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
              animationDuration: `${3 + Math.random() * 7}s`,
            }}
          />
        ))}
      </div>
      <style>
        {`
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            overflow: hidden;
          }
          
          .confetti {
            position: absolute;
            top: -10px;
            border-radius: 0%;
            animation: fall linear forwards;
          }
          
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default Confetti;
