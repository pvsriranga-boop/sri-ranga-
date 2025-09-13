import React from 'react';

const UniversityIcon = () => (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="w-full bg-transparent p-4 flex items-center justify-center space-x-3 flex-shrink-0">
      <UniversityIcon />
      <h1 className="text-xl font-bold tracking-wider italic bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-fuchsia-500 to-orange-400">
        Smart Campus Assistant
      </h1>
    </header>
  );
};