import { Spinner } from '@chakra-ui/react';
import React from 'react';

const LoadingSpinner = ({size,color,thickness}) => {
  return (
    <div className="spinner-container">
      <Spinner size={size} color={color} thickness={thickness} />
    </div>
  );
};

export default LoadingSpinner;
