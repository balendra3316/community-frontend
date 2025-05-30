

// 'use client';
// import { useState, useEffect } from 'react';
// import NavBar from '../../components/Navbar';
// import CourseGrid from './_components/CourseGrid';
// import { CourseService, Course } from '../../services/courseService';
// import ProtectedRoute from '@/components/ProtectedRoute';

// export default function Classroom() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const data = await CourseService.getAllCourses();
//         setCourses(data);
        
//         // Calculate total pages (assuming 6 courses per page)
//         setTotalPages(Math.ceil(data.length / 6));
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     console.log('Courses updated:', courses);
//   }, [courses]);

//   // Get current courses for pagination
//   const indexOfLastCourse = currentPage * 6;
//   const indexOfFirstCourse = indexOfLastCourse - 6;
//   const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

//   return (
//     <ProtectedRoute>
//     <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-6">Classroom</h1>
        
//         <div className="mb-8">
//           <CourseGrid courses={currentCourses} loading={loading} />
//         </div>
        
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8">
//             <nav className="inline-flex rounded-md shadow">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded-l-md border ${
//                   currentPage === 1
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-white text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-4 py-2 border-t border-b ${
//                     currentPage === page
//                       ? 'bg-green-500 text-white'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded-r-md border ${
//                   currentPage === totalPages
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-white text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </main>
//     </ProtectedRoute>
//   );
// }









//src/app/classroom/page.tsx
'use client';
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import NavBar from '../../components/Navbar';
import { CourseService, Course } from '../../services/courseService';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load CourseGrid component
const CourseGrid = lazy(() => import('./_components/CourseGrid'));

// Constants
const COURSES_PER_PAGE = 6;

export default function Classroom() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Memoized fetch function to prevent recreation on every render
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CourseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
    const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
    const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    
    return { currentCourses, totalPages };
  }, [courses, currentPage]);

  // Memoized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
  }, [paginationData.totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Memoized page numbers array
  const pageNumbers = useMemo(() => 
    Array.from({ length: paginationData.totalPages }, (_, i) => i + 1),
    [paginationData.totalPages]
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[rgb(248,247,245)] pt-[104px]">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Classroom</h1>
          
          <div className="mb-8">
            <Suspense fallback={<div>Loading courses...</div>}>
              <CourseGrid courses={paginationData.currentCourses} loading={loading} />
            </Suspense>
          </div>
          
          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-4 py-2 border-t border-b ${
                      currentPage === page
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === paginationData.totalPages}
                  className={`px-4 py-2 rounded-r-md border ${
                    currentPage === paginationData.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}