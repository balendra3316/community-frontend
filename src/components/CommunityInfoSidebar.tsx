
import { FC } from 'react';
import Link from 'next/link';

const CommunityInfoSidebar: FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-4 animate-fadeIn">
      {/* Community banner with overlay effect */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src="community-info.jpg"
          alt="Dance Academy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Community details */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2 animate-slideInLeft">
          AnyOne Can Dance
        </h2>
        <Link href="https://anyonecandance.in/">
          <p className="text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200">
            www.anyonecandance.in
          </p>
        </Link>
        <p className="text-sm text-gray-700 mb-4 animate-slideInRight">
          We aim to be the most up-to-date dance life for you. You can join us Acd 
        </p>
        
        {/* Community links with hover animations */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 transform transition-all duration-200 hover:translate-x-2 hover:text-yellow-600">
            <Link href="https://learn.anyonecandance.in/acd" className="text-sm relative group">
              <span className="relative z-10">5 Day free workshop</span>
              <span className="absolute inset-0 bg-yellow-100 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </Link>
          </div>
          <div className="flex items-center text-gray-600 transform transition-all duration-200 hover:translate-x-2 hover:text-yellow-600">
            <Link href="https://acdwithsameer.com/" className="text-sm relative group">
              <span className="relative z-10">Refer & Earn</span>
              <span className="absolute inset-0 bg-yellow-100 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </Link>
          </div>
          <div className="flex items-center text-gray-600 transform transition-all duration-200 hover:translate-x-2 hover:text-yellow-600">
            <Link href="https://anyonecandance.in" className="text-sm relative group">
              <span className="relative z-10">Shop</span>
              <span className="absolute inset-0 bg-yellow-100 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </Link>
          </div>
        </div>
        
        {/* Community stats with animation */}
        <div className="flex justify-between text-center border-t border-gray-200 pt-4">
          <div className="animate-bounce-subtle">
            <div className="text-xl font-bold text-blue-600">25k+</div>
            <div className="text-xs text-gray-500">Star Members</div>
          </div>
          <div className="animate-bounce-subtle" style={{animationDelay: '0.1s'}}>
            <div className="text-xl font-bold text-green-600">100K+</div>
            <div className="text-xs text-gray-500">Dancer Member</div>
          </div>
          <div className="animate-bounce-subtle" style={{animationDelay: '0.2s'}}>
            <div className="text-xl font-bold text-purple-600">1</div>
            <div className="text-xs text-gray-500">Coach</div>
          </div>
        </div>
      </div>
      
      {/* Animated Invite button */}
      <div className="px-4 pb-4">
        <div className="animated-border-button">
          <Link href="https://acdwithsameer.com">
          <button className="invite-button">
            <span className="button-text">INVITE PEOPLE</span>
          </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
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
            #e5463a 0deg,
            #e9b457 72deg,
            #50b7f2 144deg,
            #e5463a 216deg,
            #e9b457 288deg,
            #50b7f2 360deg
          );
          background-size: 200% 200%;
          animation: moveGradient 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .animated-border-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
          color: #666;
          transition: color 0.3s ease;
        }

        .invite-button:hover .button-text {
          color: #333;
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
            rgba(255, 255, 255, 0.6),
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
      `}</style>
    </div>
  );
};

export default CommunityInfoSidebar;