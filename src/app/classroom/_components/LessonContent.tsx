// 'use client';
// import React from 'react';
// import Image from 'next/image';
// import { Lesson } from '../../../types/course.types';
// import { FileText, Link as LinkIcon, Download } from 'lucide-react';

// interface LessonContentProps {
//   lesson: Lesson;
// }

// const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
//   // Extract YouTube video ID from URL (assuming URL is in the format http://youtube.com/watch?v=VIDEO_ID or similar)
//   const getYouTubeVideoId = (url: string): string | null => {
//     // This regex extracts the video ID from various YouTube URL formats
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const videoId = getYouTubeVideoId(lesson.videoUrl) || '';

//   const getFileIcon = (fileType: string) => {
//     switch (fileType.toLowerCase()) {
//       case 'pdf':
//         return <div className="bg-red-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
//       case 'docx':
//       case 'doc':
//         return <div className="bg-blue-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
//       default:
//         return <div className="bg-gray-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
//     }
//   };

//   return (
//     <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto pt-[50px]">
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">{lesson.title}</h1>

//       {/* Video Section */}
//       <div className="relative w-full aspect-video mb-8 bg-black rounded-lg overflow-hidden">
//         {videoId ? (
//           <iframe
//             src={`https://www.youtube.com/embed/${videoId}`}
//             className="absolute top-0 left-0 w-full h-full"
//             allowFullScreen
//             title={lesson.title}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-800 text-white">
//             Video not available
//           </div>
//         )}
//       </div>

//       {/* Lesson Content */}
//       <div className="prose max-w-none mb-8">
//         <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
//       </div>

//       {/* Images */}
//       {lesson.images && lesson.images.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Images</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {lesson.images.map((image) => (
//               <div key={image._id} className="overflow-hidden rounded-lg">
//                 <div className="relative h-48 w-full">
//                   <img
//                     src={image.url}
//                     alt={image.altText || image.caption}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 {image.caption && (
//                   <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Resources Section */}
//       {lesson.resources && lesson.resources.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Resources</h2>
//           <div className="space-y-3">
//             {lesson.resources.map((resource) => (
//               <a
//                 key={resource._id}
//                 href={resource.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//               >
//                 <div className="mr-3">
//                   {getFileIcon(resource.fileType)}
//                 </div>
//                 <div className="flex-grow">
//                   <h3 className="font-medium text-gray-900">{resource.title}</h3>
//                   <p className="text-sm text-gray-500">{resource.fileType.toUpperCase()}</p>
//                 </div>
//                 <Download size={18} className="text-gray-500" />
//               </a>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LessonContent;









'use client';

import React from 'react';
import Image from 'next/image';
import { Lesson } from '../../../types/course.types';
import { FileText, Link as LinkIcon, Download, CheckCircle, XCircle } from 'lucide-react';
import { CourseService } from '../../../services/courseService';

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
  onLessonCompletionToggle: () => void;
  isCompleted: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  lesson, 
  courseId, 
  onLessonCompletionToggle,
  isCompleted
}) => {
  // Extract YouTube video ID from URL (assuming URL is in the format http://youtube.com/watch?v=VIDEO_ID or similar)
  const getYouTubeVideoId = (url: string): string | null => {
    // This regex extracts the video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(lesson.videoUrl) || '';

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <div className="bg-red-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
      case 'docx':
      case 'doc':
        return <div className="bg-blue-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
      default:
        return <div className="bg-gray-500 p-2 rounded-md"><FileText size={16} className="text-white" /></div>;
    }
  };

  const handleToggleCompletion = async () => {
    try {
      await CourseService.toggleLessonCompletion(courseId, lesson._id);
      onLessonCompletionToggle();
    } catch (error) {
      console.error('Error toggling lesson completion status:', error);
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto pt-[50px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{lesson.title}</h1>
        
        {/* Mark as Complete/Incomplete Button */}
        <button
          onClick={handleToggleCompletion}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            isCompleted 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={18} className="mr-2" />
              <span>Mark as Incomplete</span>
            </>
          ) : (
            <>
              <XCircle size={18} className="mr-2" />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      </div>

      {/* Video Section */}
      <div className="relative w-full aspect-video mb-8 bg-black rounded-lg overflow-hidden">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            Video not available
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>

      {/* Images */}
      {lesson.images && lesson.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.images.map((image) => (
              <div key={image._id} className="overflow-hidden rounded-lg">
                <div className="relative h-48 w-full">
                  <img
                    src={image.url}
                    alt={image.altText || image.caption}
                    className="object-cover w-full h-full"
                  />
                </div>
                {image.caption && (
                  <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Section */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="space-y-3">
            {lesson.resources.map((resource) => (
              <a
                key={resource._id}
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="mr-3">
                  {getFileIcon(resource.fileType)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.fileType.toUpperCase()}</p>
                </div>
                <Download size={18} className="text-gray-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonContent;