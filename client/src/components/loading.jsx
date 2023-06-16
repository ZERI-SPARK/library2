import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../loading.json'; // JSON file
import './loading.css'
const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='loadingContainer'>
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default Loading;
