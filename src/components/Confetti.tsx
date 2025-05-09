
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50'];
    const numPieces = 50;
    const newPieces = [];
    
    for (let i = 0; i < numPieces; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 20 + 10}%`,
        width: `${Math.random() * 10 + 6}px`,
        height: `${Math.random() * 10 + 6}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards, confetti-shake ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
      };
      
      newPieces.push(<div key={i} className="confetti-piece absolute" style={style} />);
    }
    
    setPieces(newPieces);
    
    const cleanupTimeout = setTimeout(() => {
      setPieces([]);
    }, 5000);
    
    return () => clearTimeout(cleanupTimeout);
  }, []);
  
  return (
    <>
      <style jsx="true">{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes confetti-shake {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          100% {
            transform: translateX(25px) rotate(45deg);
          }
        }
        .confetti-piece {
          position: absolute;
          will-change: transform;
        }
      `}</style>
      <div className="confetti-container fixed inset-0 pointer-events-none overflow-hidden z-50">
        {pieces}
      </div>
    </>
  );
};

export default Confetti;
