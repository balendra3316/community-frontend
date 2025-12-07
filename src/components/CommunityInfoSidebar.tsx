


import { FC } from 'react';
import Link from 'next/link';
import { CalendarToday, People, Shop } from '@mui/icons-material';

const CommunityInfoSidebar: FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-4 animate-fadeIn">
      {/* Community banner with overlay effect - Responsive height */}
      <div className="relative h-24 sm:h-32 md:h-40 bg-gray-200 overflow-hidden">
        <img
          src="mylogo.png"
          alt="Dance Academy"
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Community details */}
      <div className="p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 animate-slideInLeft">
          Community classes
        </h2>
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <p className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 mb-3 sm:mb-4 transition-colors duration-200 break-words">
            www.communityclasses.in
          </p>
        </Link>
        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 animate-slideInRight">
          Because everybody was born to code
        </p>
        
        {/* Community links with icons and enhanced styling */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center transform transition-all duration-200 hover:translate-x-2 group">
            <CalendarToday 
              sx={{ 
                fontSize: { xs: 16, sm: 18 }, 
                color: '#008894', 
                marginRight: 1,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }} 
            />
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm relative link-with-underline">
              <span className="text-primary-color font-medium hover:text-primary-dark transition-colors duration-200">
                Upcoming Events
              </span>
            </Link>
          </div>
          
          <div className="flex items-center transform transition-all duration-200 hover:translate-x-2 group">
            <People 
              sx={{ 
                fontSize: { xs: 16, sm: 18 }, 
                color: '#008894', 
                marginRight: 1,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }} 
            />
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm relative link-with-underline">
              <span className="text-primary-color font-medium hover:text-primary-dark transition-colors duration-200">
                Refer & Earn
              </span>
            </Link>
          </div>
          
          <div className="flex items-center transform transition-all duration-200 hover:translate-x-2 group">
            <Shop 
              sx={{ 
                fontSize: { xs: 16, sm: 18 }, 
                color: '#008894', 
                marginRight: 1,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }} 
            />
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm relative link-with-underline">
              <span className="text-primary-color font-medium hover:text-primary-dark transition-colors duration-200">
                Shop
              </span>
            </Link>
          </div>
        </div>
        
        {/* Community stats with animation - Responsive layout */}
        <div className="flex justify-between text-center border-t border-gray-200 pt-3 sm:pt-4">
          <div className="animate-bounce-subtle flex-1">
            <div className="text-base sm:text-xl font-bold text-blue-600">2.5k+</div>
            <div className="text-xs text-gray-500 leading-tight"> Subscrib Club Members</div>
          </div>
          <div className="animate-bounce-subtle flex-1" style={{animationDelay: '0.1s'}}>
            <div className="text-base sm:text-xl font-bold text-green-600">100K+</div>
            <div className="text-xs text-gray-500 leading-tight">Coder Member</div>
          </div>
          <div className="animate-bounce-subtle flex-1" style={{animationDelay: '0.2s'}}>
            <div className="text-base sm:text-xl font-bold text-purple-600">1</div>
            <div className="text-xs text-gray-500 leading-tight">Developer</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.text-primary-color) {
          color: #008894 !important;
        }
        
        :global(.text-primary-dark) {
          color: #006b75 !important;
        }

        :global(.link-with-underline) {
          position: relative;
          text-decoration: none;
          word-break: break-word;
        }

        :global(.link-with-underline::after) {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: linear-gradient(90deg, #008894, #00a8b8);
          transition: width 0.3s ease;
        }

        :global(.link-with-underline:hover::after) {
          width: 100%;
        }

        :global(.group:hover .link-with-underline) {
          transform: translateY(-1px);
        }

        @keyframes moveGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out 0.2s both;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out 0.4s both;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }

        .animated-border-button {
          position: relative;
          padding: 2px;
          border-radius: 8px;
          background: conic-gradient(
            from 0deg at 50% 50%,
            #008894 0deg,
            #00a8b8 72deg,
            #50b7f2 144deg,
            #008894 216deg,
            #00a8b8 288deg,
            #50b7f2 360deg
          );
          background-size: 200% 200%;
          animation: moveGradient 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .animated-border-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 136, 148, 0.2);
        }

        .invite-button {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(45deg, #ffffff, #f8f9fa);
          border: none;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .invite-button:hover {
          background: linear-gradient(45deg, #f8f9fa, #e9ecef);
          transform: translateY(-1px);
        }

        .invite-button:active {
          transform: translateY(0);
        }

        .button-text {
          position: relative;
          z-index: 2;
          font-family: 'Roboto', Helvetica, Arial, sans-serif;
          font-weight: bold;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #008894;
          transition: color 0.3s ease;
        }

        .invite-button:hover .button-text {
          color: #006b75;
        }

        .invite-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 136, 148, 0.1),
            transparent
          );
          transition: left 0.5s ease;
        }

        .invite-button:hover::before {
          left: 100%;
        }

        /* Additional page animations */
        .hover-lift {
          transition: transform 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
        }

        /* Pulse animation for stats */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .stat-number {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .animate-bounce-subtle {
            animation-duration: 3s;
          }
          
          :global(.link-with-underline) {
            line-height: 1.4;
          }
        }
      `}</style>
    </div>
  );
};

export default CommunityInfoSidebar;