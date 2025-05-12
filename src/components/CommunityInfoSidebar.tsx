// src/components/CommunityInfoSidebar.tsx
import { FC } from 'react';
import Link from 'next/link';

const CommunityInfoSidebar: FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Community banner */}
      <div className="h-40 bg-gray-200">
        <img
          src="/api/placeholder/600/240"
          alt=" dance sAcademy"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Community details */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">AnyOne Can Dance</h2>
        <p className="text-sm text-gray-500 mb-4">www.anyonecandacnce.in</p>
        
        <p className="text-sm text-gray-700 mb-4">
          We aim to be the most up-to-date dance life for you. you can joi us acd
        </p>
        
        {/* Community links */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Link href="#" className="text-sm hover:text-pink-500">
              5 Day free workshop
            </Link>
          </div>
          <div className="flex items-center text-gray-600">
            <Link href="#" className="text-sm hover:text-pink-500">
              Custom dance guru
            </Link>
          </div>
          <div className="flex items-center text-gray-600">
            <Link href="#" className="text-sm hover:text-pink-500">
              Apify (Start for Free)
            </Link>
          </div>
        </div>
        
        {/* Community stats */}
        <div className="flex justify-between text-center border-t border-gray-200 pt-4">
          <div>
            <div className="text-xl font-bold">6.7k</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div>
            <div className="text-xl font-bold">41</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
          <div>
            <div className="text-xl font-bold">1</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
      
      {/* Member avatars */}
      <div className="px-4 pb-4">
        <div className="flex -space-x-2 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <img
              key={id}
              src={`/api/placeholder/32/32?text=${id}`}
              alt={`Member ${id}`}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            />
          ))}
        </div>
      </div>
      
      {/* Invite button */}
      <div className="px-4 pb-4">
        <button className="w-full py-2 border border-gray-200 rounded-md text-gray-500 font-medium hover:bg-gray-50">
          INVITE PEOPLE
        </button>
      </div>
    </div>
  );
};

export default CommunityInfoSidebar;