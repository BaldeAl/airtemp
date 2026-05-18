import React from 'react';

const Loading = () => (
  <div className="flex items-center justify-center h-screen gap-2">
    <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" style={{ animation: 'dotBounce 1.4s infinite ease-in-out both', animationDelay: '0s' }} />
    <div className="w-3 h-3 rounded-full bg-[#4ECDC4]" style={{ animation: 'dotBounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
    <div className="w-3 h-3 rounded-full bg-[#FFE66D]" style={{ animation: 'dotBounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
  </div>
);

export default Loading;
