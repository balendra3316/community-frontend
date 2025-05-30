import { Skeleton } from '@mui/material';

export function PostSkeleton() {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden mb-4 w-full mx-auto" 
      style={{ 
        border: '1px solid rgb(228, 228, 228)',
        borderRadius: '10px',
        maxWidth: '750px', 
        height: 'auto' 
      }}
    >
      <div className="p-4">
        {/* Header Skeleton */}
        <div className="flex items-center mb-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton variant="text" width={120} height={20} />
                <div className="flex mt-1 space-x-2">
                  <Skeleton variant="text" width={60} height={16} />
                  <Skeleton variant="text" width={40} height={16} />
                </div>
              </div>
              <Skeleton variant="circular" width={24} height={24} />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Mobile View */}
          <div className="sm:hidden w-full">
            <Skeleton variant="text" width="100%" height={24} style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="60%" height={16} style={{ marginBottom: '12px' }} />
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:flex-row gap-4" style={{ minHeight: '80px', maxHeight: '120px' }}>
            <div className="flex-1 sm:max-w-[68%] overflow-hidden">
              <Skeleton variant="text" width="100%" height={24} style={{ marginBottom: '8px' }} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
            <Skeleton variant="rectangular" width={128} height={112} style={{ borderRadius: '8px' }} />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={80} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}