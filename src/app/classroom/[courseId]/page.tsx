// //src/app/classroom/[courseId]/page.tsx

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import NavBar from '../../../components/Navbar';
// import CourseSidebar from '../_components/CourseSidebar';
// import LessonContent from '../_components/LessonContent';
// import { CourseService } from '../../../services/courseService';
// import { CourseDetail, Lesson, Section } from '../../../types/course.types';
// import { Menu, X } from 'lucide-react';

// export default function CourseDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const courseId = params.courseId as string;
  
//   const [course, setCourse] = useState<CourseDetail | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentSectionId, setCurrentSectionId] = useState<string>('');
//   const [currentLessonId, setCurrentLessonId] = useState<string>('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       setLoading(true);
//       try {
//         const data = await CourseService.getCourseById(courseId);
//         if (data) {
//           setCourse(data);
          
//           // Set initial lesson (first lesson of first section)
//           if (data.sections && data.sections.length > 0) {
//             const firstSection = data.sections[0];
//             setCurrentSectionId(firstSection._id);
            
//             if (firstSection.lessons && firstSection.lessons.length > 0) {
//               setCurrentLessonId(firstSection.lessons[0]._id);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchCourseDetails();
//   }, [courseId]);
  
//   const handleSelectLesson = async (sectionId: string, lessonId: string) => {
//     setCurrentSectionId(sectionId);
//     setCurrentLessonId(lessonId);
//     setIsSidebarOpen(false);
    
//     // Update lesson progress
//     await CourseService.updateLessonProgress(courseId, lessonId);
//   };
  
//   const getCurrentLesson = (): Lesson | null => {
//     if (!course) return null;
    
//     for (const section of course.sections) {
//       const lesson = section.lessons.find(l => l._id === currentLessonId);
//       if (lesson) return lesson;
//     }
    
//     return null;
//   };
  
//   const currentLesson = getCurrentLesson();
//   const progress = course?.progress?.completionPercentage || 0;
  
//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50 pt-[80px]">
//         <NavBar />
//         <div className="flex justify-center items-center h-96">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//         </div>
//       </main>
//     );
//   }
  
//   if (!course) {
//     return (
//       <main className="min-h-screen bg-gray-50 pt-[80px]">
//         <NavBar />
//         <div className="flex justify-center items-center h-96">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
//             <button 
//               className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//               onClick={() => router.push('/classroom')}
//             >
//               Back to Classroom
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }
  
//   return (
//     <main className="min-h-screen bg-gray-50 pt-[80px]">
//       <NavBar />
      
//       {/* Mobile sidebar toggle */}
//       <div className="fixed top-20 left-4 lg:hidden z-20">
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 bg-white rounded-full shadow-md text-gray-700"
//         >
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>
      
//       <div className="flex flex-col lg:flex-row pt-[80px] min-h-screen">
//         {/* Sidebar - hidden on mobile by default */}
//         <div className={`fixed inset-0 z-10 transform lg:relative lg:transform-none lg:opacity-100 lg:pointer-events-auto ${
//           isSidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
//         } transition-all duration-300 ease-in-out lg:block lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)]`}>
//           <div className="h-full overflow-hidden bg-white shadow-lg lg:shadow-none">
//             <CourseSidebar
//               title={course.title}
//               progress={progress}
//               sections={course.sections}
//               currentLessonId={currentLessonId}
//               onSelectLesson={handleSelectLesson}
//             />
//           </div>
//         </div>
        
//         {/* Main content */}
//         <div className="flex-grow">
//           {currentLesson ? (
//             <LessonContent lesson={currentLesson} />
//           ) : (
//             <div className="flex justify-center items-center h-96">
//               <p className="text-gray-500">Select a lesson to start learning</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

















// //src/app/classroom/[courseId]/page.tsx

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import NavBar from '../../../components/Navbar';
// import CourseSidebar from '../_components/CourseSidebar';
// import LessonContent from '../_components/LessonContent';
// import { CourseService } from '../../../services/courseService';
// import { CourseDetail, Lesson } from '../../../types/course.types';
// import { Menu, X } from 'lucide-react';

// export default function CourseDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const courseId = params.courseId as string;

//   const [course, setCourse] = useState<CourseDetail | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentSectionId, setCurrentSectionId] = useState<string>('');
//   const [currentLessonId, setCurrentLessonId] = useState<string>('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

//   // Check viewport size on initial load and window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) { // lg breakpoint
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };

//     // Initial check
//     handleResize();

//     // Add event listener
//     window.addEventListener('resize', handleResize);

//     // Clean up
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       setLoading(true);
//       try {
//         const data = await CourseService.getCourseById(courseId);
//         if (data) {
//           setCourse(data);

//           // Set initial lesson (first lesson of first section)
//           if (data.sections && data.sections.length > 0) {
//             const firstSection = data.sections[0];
//             setCurrentSectionId(firstSection._id);

//             if (firstSection.lessons && firstSection.lessons.length > 0) {
//               setCurrentLessonId(firstSection.lessons[0]._id);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   const handleSelectLesson = async (sectionId: string, lessonId: string) => {
//     setCurrentSectionId(sectionId);
//     setCurrentLessonId(lessonId);
    
//     if (window.innerWidth < 1024) {
//       setIsSidebarOpen(false);
//     }

//     await CourseService.updateLessonProgress(courseId, lessonId);
//   };

//   const getCurrentLesson = (): Lesson | null => {
//     if (!course) return null;

//     for (const section of course.sections) {
//       const lesson = section.lessons.find(l => l._id === currentLessonId);
//       if (lesson) return lesson;
//     }

//     return null;
//   };

//   const currentLesson = getCurrentLesson();
//   const progress = course?.progress?.completionPercentage || 0;

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50 pt-[100px]">
//         <NavBar />
//         <div className="flex justify-center items-center h-96">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//         </div>
//       </main>
//     );
//   }

//   if (!course) {
//     return (
//       <main className="min-h-screen bg-gray-50 pt-[100px]">
//         <NavBar />
//         <div className="flex justify-center items-center h-96">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
//             <button
//               className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//               onClick={() => router.push('/classroom')}
//             >
//               Back to Classroom
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <NavBar />

//       {/* Mobile sidebar toggle - IMPROVED POSITIONING */}
//       <div className="fixed top-29 left-4 z-50 lg:hidden">
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 bg-white rounded-full shadow-md text-gray-700"
//         >
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       <div className="flex flex-col lg:flex-row pt-[110px] min-h-screen">
//         {/* Sidebar */}
//         <div
//           className={`fixed inset-0 z-40 transform lg:relative lg:transform-none lg:opacity-100 lg:pointer-events-auto ${
//             isSidebarOpen
//               ? 'translate-x-0 opacity-100 pointer-events-auto'
//               : '-translate-x-full opacity-0 pointer-events-none'
//           } transition-all duration-300 ease-in-out lg:block lg:w-80 lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)]`}
//         >
//           {/* Overlay for mobile */}
//           {isSidebarOpen && (
//             <div 
//               className="absolute inset-0 bg-white bg-opacity-50 lg:hidden"
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}
          
//           <div className="relative h-full w-80 max-w-full shadow-xl lg:shadow-none">
//             <CourseSidebar
//               title={course.title}
//               progress={progress}
//               sections={course.sections}
//               currentLessonId={currentLessonId}
//               onSelectLesson={handleSelectLesson}
//             />
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="flex-grow">
//           {currentLesson ? (
//             <LessonContent lesson={currentLesson} />
//           ) : (
//             <div className="flex justify-center items-center h-96">
//               <p className="text-gray-500">Select a lesson to start learning</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }







'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '../../../components/Navbar';
import CourseSidebar from '../_components/CourseSidebar';
import LessonContent from '../_components/LessonContent';
import { CourseService } from '../../../services/courseService';
import { CourseDetail, Lesson } from '../../../types/course.types';
import { Menu, X } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSectionId, setCurrentSectionId] = useState<string>('');
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Check viewport size on initial load and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const data = await CourseService.getCourseById(courseId);
        if (data) {
          setCourse(data);
          
          // Set completed lessons
          if (data.progress && data.progress.completedLessons) {
            setCompletedLessons(data.progress.completedLessons);
          }

          // Set initial lesson (first lesson of first section)
          if (data.sections && data.sections.length > 0) {
            const firstSection = data.sections[0];
            setCurrentSectionId(firstSection._id);

            if (firstSection.lessons && firstSection.lessons.length > 0) {
              setCurrentLessonId(firstSection.lessons[0]._id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleSelectLesson = async (sectionId: string, lessonId: string) => {
    setCurrentSectionId(sectionId);
    setCurrentLessonId(lessonId);
    
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

   // await CourseService.updateLessonProgress(courseId, lessonId);
  };

  const getCurrentLesson = (): Lesson | null => {
    if (!course) return null;

    for (const section of course.sections) {
      const lesson = section.lessons.find(l => l._id === currentLessonId);
      if (lesson) return lesson;
    }

    return null;
  };

  const handleLessonCompletionToggle = async () => {
    try {
      const response = await CourseService.getCourseById(courseId);
      if (response && response.progress && response.progress.completedLessons) {
        setCompletedLessons(response.progress.completedLessons);
        setCourse({
          ...course!,
          progress: response.progress
        });
      }
    } catch (error) {
      console.error('Error refreshing course data:', error);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return completedLessons.includes(lessonId);
  };

  const currentLesson = getCurrentLesson();
  const progress = course?.progress?.completionPercentage || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[100px]">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[100px]">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() => router.push('/classroom')}
            >
              Back to Classroom
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Mobile sidebar toggle - IMPROVED POSITIONING */}
      <div className="fixed top-29 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-full shadow-md text-gray-700"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row pt-[110px] min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-40 transform lg:relative lg:transform-none lg:opacity-100 lg:pointer-events-auto ${
            isSidebarOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : '-translate-x-full opacity-0 pointer-events-none'
          } transition-all duration-300 ease-in-out lg:block lg:w-80 lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)]`}
        >
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="absolute inset-0 bg-white bg-opacity-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className="relative h-full w-80 max-w-full shadow-xl lg:shadow-none">
            <CourseSidebar
              title={course.title}
              progress={progress}
              sections={course.sections}
              currentLessonId={currentLessonId}
              completedLessons={completedLessons}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          {currentLesson ? (
            <LessonContent 
              lesson={currentLesson} 
              courseId={courseId}
              onLessonCompletionToggle={handleLessonCompletionToggle}
              isCompleted={isLessonCompleted(currentLesson._id)}
            />
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">Select a lesson to start learning</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}