
import React, { useState } from 'react';

export const PNGFileCard = ({
  onClick = () => alert("Opening PNG...")
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Main PNG Card */}
      <div
        className={`
          relative group cursor-pointer select-none
          transform transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
          ${isPressed ? 'scale-95' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300
          bg-gradient-to-r from-green-400 to-green-600
          ${isHovered ? 'opacity-20' : ''}
        `} />
        
        {/* Main card container */}
        <div className={`
          relative w-32 h-40 rounded-2xl p-4
          bg-gradient-to-br from-green-500 to-green-700
          border border-green-400/30
          shadow-xl transition-all duration-300
          ${isHovered ? 'shadow-2xl border-green-300/50' : ''}
          overflow-hidden
        `}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/20 rounded rotate-12" />
            <div className="absolute bottom-4 left-2 w-6 h-6 border border-white/15 rounded-full" />
          </div>

          {/* File icon */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className={`
              transform transition-all duration-300
              ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
            `}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-white drop-shadow-lg"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            
            {/* PNG label */}
            <div className="mt-3">
              <span className="text-white text-sm font-bold tracking-wider drop-shadow-md">
                PNG
              </span>
            </div>
          </div>

          {/* Shine effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 transition-transform duration-700
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>
      </div>

      {/* File info */}
      <div className={`
        text-center transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'}
      `}>
        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-32">
          {}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {}
        </p>
      </div>
    </div>
  );
};

export const PDFFileCard = ({
  onClick = () => alert("Opening PDF...")
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Main PDF Card */}
      <div
        className={`
          relative group cursor-pointer select-none
          transform transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
          ${isPressed ? 'scale-95' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300
          bg-gradient-to-r from-red-400 to-red-600
          ${isHovered ? 'opacity-20' : ''}
        `} />
        
        {/* Main card container */}
        <div className={`
          relative w-32 h-40 rounded-2xl p-4
          bg-gradient-to-br from-red-500 to-red-700
          border border-red-400/30
          shadow-xl transition-all duration-300
          ${isHovered ? 'shadow-2xl border-red-300/50' : ''}
          overflow-hidden
        `}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/20 rounded rotate-12" />
            <div className="absolute bottom-4 left-2 w-6 h-6 border border-white/15 rounded-full" />
          </div>

          {/* File icon */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className={`
              transform transition-all duration-300
              ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
            `}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-white drop-shadow-lg"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            
            {/* PDF label */}
            <div className="mt-3">
              <span className="text-white text-sm font-bold tracking-wider drop-shadow-md">
                PDF
              </span>
            </div>
          </div>

          {/* Shine effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 transition-transform duration-700
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>

      </div>

      {/* File info */}
      <div className={`
        text-center transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'}
      `}>
        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-32">
          {}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {}
        </p>
      </div>
    </div>
  );
};

export const DOCFileCard = ({
  onClick = () => alert("Opening DOC...")
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Main DOC Card */}
      <div
        className={`
          relative group cursor-pointer select-none
          transform transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
          ${isPressed ? 'scale-95' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300
          bg-gradient-to-r from-blue-400 to-blue-600
          ${isHovered ? 'opacity-20' : ''}
        `} />
        
        {/* Main card container */}
        <div className={`
          relative w-32 h-40 rounded-2xl p-4
          bg-gradient-to-br from-blue-500 to-blue-700
          border border-blue-400/30
          shadow-xl transition-all duration-300
          ${isHovered ? 'shadow-2xl border-blue-300/50' : ''}
          overflow-hidden
        `}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/20 rounded rotate-12" />
            <div className="absolute bottom-4 left-2 w-6 h-6 border border-white/15 rounded-full" />
          </div>

          {/* File icon */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className={`
              transform transition-all duration-300
              ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
            `}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-white drop-shadow-lg"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            
            {/* DOC label */}
            <div className="mt-3">
              <span className="text-white text-sm font-bold tracking-wider drop-shadow-md">
                DOC
              </span>
            </div>
          </div>

          {/* Shine effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 transition-transform duration-700
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>
      </div>

      {/* File info */}
      <div className={`
        text-center transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'}
      `}>
        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-32">
          {}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {}
        </p>
      </div>
    </div>
  );
};
export const JPGFileCard = ({
  onClick = () => alert("Opening JPG...")
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Main JPG Card */}
      <div
        className={`
          relative group cursor-pointer select-none
          transform transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
          ${isPressed ? 'scale-95' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300
          bg-gradient-to-r from-purple-400 to-purple-600
          ${isHovered ? 'opacity-20' : ''}
        `} />
        
        {/* Main card container */}
        <div className={`
          relative w-32 h-40 rounded-2xl p-4
          bg-gradient-to-br from-purple-500 to-purple-700
          border border-purple-400/30
          shadow-xl transition-all duration-300
          ${isHovered ? 'shadow-2xl border-purple-300/50' : ''}
          overflow-hidden
        `}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/20 rounded rotate-12" />
            <div className="absolute bottom-4 left-2 w-6 h-6 border border-white/15 rounded-full" />
          </div>

          {/* File icon */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className={`
              transform transition-all duration-300
              ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
            `}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-white drop-shadow-lg"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            
            {/* JPG label */}
            <div className="mt-3">
              <span className="text-white text-sm font-bold tracking-wider drop-shadow-md">
                JPG
              </span>
            </div>
          </div>

          {/* Shine effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 transition-transform duration-700
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>
      </div>

      {/* File info */}
      <div className={`
        text-center transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'}
      `}>
        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-32">
          {}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {}
        </p>
      </div>
    </div>
  );
};