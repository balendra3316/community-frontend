// 'use client';
// import React, { useState } from 'react';
// import { Section, Lesson } from '../../../types/course.types';
// import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

// interface CourseSidebarProps {
//   title: string;
//   progress: number;
//   sections: Section[];
//   currentLessonId: string;
//   onSelectLesson: (sectionId: string, lessonId: string) => void;
// }

// const CourseSidebar: React.FC<CourseSidebarProps> = ({
//   title,
//   progress,
//   sections,
//   currentLessonId,
//   onSelectLesson,
// }) => {
//   const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
//     sections.reduce((acc, section) => {
//       // Set the section with the current lesson as expanded by default
//       const isExpanded = section.lessons.some(lesson => lesson._id === currentLessonId);
//       return { ...acc, [section._id]: isExpanded };
//     }, {})
//   );

//   const toggleSection = (sectionId: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   return (
//     <div className="bg-white w-full lg:w-80 h-full border-r border-gray-200 overflow-y-auto  pt-[140px] lg:pt-[50px]">
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h2>
//         <div className="mt-2">
//           <div className="flex items-center justify-between mb-1">
//             <span className="text-sm font-medium text-gray-700">{progress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-green-500 h-2.5 rounded-full"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       <nav className="mt-2">
//         {sections.map((section) => (
//           <div key={section._id} className="mb-2">
//             <button
//               className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
//               onClick={() => toggleSection(section._id)}
//             >
//               <span className="font-medium">{section.title}</span>
//               {expandedSections[section._id] ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>

//             {expandedSections[section._id] && (
//               <div className="ml-4 pl-2 border-l-2 border-gray-200">
//                 {section.lessons.map((lesson) => {
//                   const isActive = lesson._id === currentLessonId;
//                   return (
//                     <button
//                       key={lesson._id}
//                       className={`w-full flex items-center px-4 py-2 my-1 text-left text-sm rounded-md ${
//                         isActive
//                           ? 'bg-green-50 text-green-600 font-medium'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                       onClick={() => onSelectLesson(section._id, lesson._id)}
//                     >
//                       <div className="flex items-center w-full">
//                         <span className="mr-2 flex-shrink-0">
//                           {isActive && <CheckCircle size={16} className="text-green-500" />}
//                         </span>
//                         <span className="line-clamp-2">{lesson.title}</span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default CourseSidebar;






'use client';
import React, { useState } from 'react';
import { Section, Lesson } from '../../../types/course.types';
import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';

interface CourseSidebarProps {
  title: string;
  progress: number;
  sections: Section[];
  currentLessonId: string;
  completedLessons: string[];
  onSelectLesson: (sectionId: string, lessonId: string) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  title,
  progress,
  sections,
  currentLessonId,
  completedLessons,
  onSelectLesson,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => {
      // Set the section with the current lesson as expanded by default
      const isExpanded = section.lessons.some(lesson => lesson._id === currentLessonId);
      return { ...acc, [section._id]: isExpanded };
    }, {})
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return (
    <div className="bg-white w-full lg:w-80 h-full border-r border-gray-200 overflow-y-auto pt-[140px] lg:pt-[50px]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h2>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <nav className="mt-2">
        {sections.map((section) => (
          <div key={section._id} className="mb-2">
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={() => toggleSection(section._id)}
            >
              <span className="font-medium">{section.title}</span>
              {expandedSections[section._id] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {expandedSections[section._id] && (
              <div className="ml-4 pl-2 border-l-2 border-gray-200">
                {section.lessons.map((lesson) => {
                  const isActive = lesson._id === currentLessonId;
                  const isCompleted = isLessonCompleted(lesson._id);
                  
                  return (
                    <button
                      key={lesson._id}
                      className={`w-full flex items-center px-4 py-2 my-1 text-left text-sm rounded-md ${
                        isActive
                          ? 'bg-green-50 text-green-600 font-medium'
                          : isCompleted 
                            ? 'text-green-600 hover:bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => onSelectLesson(section._id, lesson._id)}
                    >
                      <div className="flex items-center w-full">
                        <span className="mr-2 flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Circle size={16} className="text-gray-400" />
                          )}
                        </span>
                        <span className="line-clamp-2">{lesson.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default CourseSidebar;









