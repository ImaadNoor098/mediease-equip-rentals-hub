
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold text-medieaze-600">
        Medi<span className="text-medieaze-800">Eaze</span>
      </span>
    </Link>
  );
};

export default Logo;
