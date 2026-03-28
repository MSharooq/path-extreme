import React from 'react';

export const TrophyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 22V18"></path>
    <path d="M14 22V18"></path>
    <path d="M18 4H6v11a6 6 0 0 0 12 0V4z"></path>
  </svg>
);

export const MedalIcon = ({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
    <path d="M11 12 5.12 2.2"></path>
    <path d="m13 12 5.88-9.8"></path>
    <path d="M8 7h8"></path>
    <circle cx="12" cy="17" r="5"></circle>
    <path d="M12 18v-2"></path>
  </svg>
);

export const StarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const MedalGold = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#gold_grad)" stroke="#D4AF37" strokeWidth="1.5"/>
    <path d="M12 7L13.5 10.5H17L14.25 12.5L15.5 16L12 14L8.5 16L9.75 12.5L7 10.5H10.5L12 7Z" fill="white" fillOpacity="0.8"/>
    <defs>
      <linearGradient id="gold_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700"/>
        <stop offset="0.5" stopColor="#FDB931"/>
        <stop offset="1" stopColor="#D4AF37"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MedalSilver = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#silver_grad)" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M12 7L13.5 10.5H17L14.25 12.5L15.5 16L12 14L8.5 16L9.75 12.5L7 10.5H10.5L12 7Z" fill="white" fillOpacity="0.8"/>
    <defs>
      <linearGradient id="silver_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E2E8F0"/>
        <stop offset="0.5" stopColor="#CBD5E1"/>
        <stop offset="1" stopColor="#94A3B8"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MedalBronze = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#bronze_grad)" stroke="#B45309" strokeWidth="1.5"/>
    <path d="M12 7L13.5 10.5H17L14.25 12.5L15.5 16L12 14L8.5 16L9.75 12.5L7 10.5H10.5L12 7Z" fill="white" fillOpacity="0.8"/>
    <defs>
      <linearGradient id="bronze_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A"/>
        <stop offset="0.5" stopColor="#F59E0B"/>
        <stop offset="1" stopColor="#B45309"/>
      </linearGradient>
    </defs>
  </svg>
);

export const WorldIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
