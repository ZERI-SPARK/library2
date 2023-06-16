
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../bookload.json'; // JSON file
const Book = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{maxWidth:'150px'}}>
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default Book;
