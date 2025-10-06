// 'use client';
// import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
// import { Button } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import NavBar from '../../components/Navbar';
// import { CourseService, Course } from '../../services/courseService';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import ChatBot from '@/components/ChatBot';

// const CourseGrid = lazy(() => import('./_components/CourseGrid'));

// const COURSES_PER_PAGE = 6;


// const StyledButton = styled(Button)(({ theme, variant }) => ({
//   minWidth: '100px',
//   fontWeight: 600,
//   textTransform: 'none',
//   borderRadius: '8px',
//   ...(variant === 'contained' && {
//     background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
//     color: '#92400E',
//     boxShadow: '0 2px 8px rgba(252, 211, 77, 0.3)',
//     '&:hover': {
//       background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
//       boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
//     },
//     '&:disabled': {
//       background: '#F3F4F6',
//       color: '#9CA3AF',
//     },
//   }),
//   ...(variant === 'outlined' && {
//     borderColor: '#F59E0B',
//     color: '#D97706',
//     '&:hover': {
//       borderColor: '#D97706',
//       backgroundColor: '#FFFBEB',
//     },
//   }),
// }));

// export default function Classroom() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const fetchCourses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await CourseService.getAllCourses();
//       setCourses(data);
//     } catch (error) {
     
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCourses();
//   }, [fetchCourses]);


//   const handlePurchaseSuccess = useCallback(() => {
//     fetchCourses();

//     setCurrentPage(1);
//   }, [fetchCourses]);

//   const paginationData = useMemo(() => {
//     const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
//     const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
//     const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
//     const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    
//     return { currentCourses, totalPages };
//   }, [courses, currentPage]);

//   const handlePreviousPage = useCallback(() => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   }, []);

//   const handleNextPage = useCallback(() => {
//     setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
//   }, [paginationData.totalPages]);

//   const handlePageClick = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);

//   const pageNumbers = useMemo(() => 
//     Array.from({ length: paginationData.totalPages }, (_, i) => i + 1),
//     [paginationData.totalPages]
//   );


//   const { freeCourses, paidAccessibleCourses, paidLockedCourses } = useMemo(() => {
//     const free: Course[] = [];
//     const paidAccessible: Course[] = [];
//     const paidLocked: Course[] = [];

//     paginationData.currentCourses.forEach(course => {
//       if (!course.isPaid) {
//         free.push(course);
//       } else if (course.isAccessible) {
//         paidAccessible.push(course);
//       } else {
//         paidLocked.push(course);
//       }
//     });

//     return {
//       freeCourses: free,
//       paidAccessibleCourses: paidAccessible,
//       paidLockedCourses: paidLocked
//     };
//   }, [paginationData.currentCourses]);

//   return (
//     <ProtectedRoute>
//       <main className="min-h-screen bg-[rgb(248,247,245)] pt-13 md:pt-[104px] pb-16 md:pb-0">
//         <NavBar />
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-semibold text-gray-800">Classroom</h1>
//             <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
//               {courses.length} course{courses.length !== 1 ? 's' : ''} available
//             </div>
//           </div>

//           {/* Compact Course Statistics */}
//           <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-8">
//             <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 py-2 shadow-sm border border-blue-200 min-w-[140px] h-[50px] flex items-center">
//               <div className="flex items-center w-full">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-xs text-blue-700 font-medium truncate">Free Courses</div>
//                   <div className="text-lg font-bold text-blue-800 leading-tight">
//                     {courses.filter(c => !c.isPaid).length}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg px-4 py-2 shadow-sm border border-green-200 min-w-[140px] h-[50px] flex items-center">
//               <div className="flex items-center w-full">
//                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-xs text-green-700 font-medium truncate">Purchased</div>
//                   <div className="text-lg font-bold text-green-800 leading-tight">
//                     {courses.filter(c => c.isPaid && c.isAccessible).length}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg px-4 py-2 shadow-sm border border-amber-200 min-w-[140px] h-[50px] flex items-center">
//               <div className="flex items-center w-full">
//                 <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 flex-shrink-0"></div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-xs text-amber-700 font-medium truncate">Available to Buy</div>
//                   <div className="text-lg font-bold text-amber-800 leading-tight">
//                     {courses.filter(c => c.needsPayment).length}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="mb-8">
//             <Suspense fallback={
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[1, 2, 3, 4, 5, 6].map((i) => (
//                   <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md h-full animate-pulse">
//                     <div className="w-full h-48 bg-gradient-to-r from-gray-300 to-gray-300"></div>
//                     <div className="p-4">
//                       <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//                       <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
//                       <div className="h-4 bg-gray-300 rounded w-2/3"></div>
//                     </div>
//                     <div className="px-4 pb-4">
//                       <div className="w-full bg-gray-300 rounded-full h-2.5 mt-4"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             }>
//               <CourseGrid 
//                 courses={paginationData.currentCourses} 
//                 loading={loading}
//                 onPurchaseSuccess={handlePurchaseSuccess}
//               />
//             </Suspense>
//           </div>
          

//            <ChatBot/>
//           {/* Enhanced Pagination with Material-UI */}
//           {paginationData.totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <nav className="inline-flex rounded-lg shadow-lg bg-white p-1">
//                 <StyledButton
//                   onClick={handlePreviousPage}
//                   disabled={currentPage === 1}
//                   variant="outlined"
//                   size="small"
//                   className="rounded-l-md"
//                 >
//                   Previous
//                 </StyledButton>
                
//                 <div className="flex">
//                   {pageNumbers.map((page) => (
//                     <StyledButton
//                       key={page}
//                       onClick={() => handlePageClick(page)}
//                       variant={currentPage === page ? "contained" : "outlined"}
//                       size="small"
//                       className="mx-0.5"
//                       sx={{
//                         minWidth: '40px',
//                         ...(currentPage === page && {
//                           background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
//                           color: '#92400E',
//                           fontWeight: 700,
//                         })
//                       }}
//                     >
//                       {page}
//                     </StyledButton>
//                   ))}
//                 </div>
                
//                 <StyledButton
//                   onClick={handleNextPage}
//                   disabled={currentPage === paginationData.totalPages}
//                   variant="outlined"
//                   size="small"
//                   className="rounded-r-md"
//                 >
//                   Next
//                 </StyledButton>
//               </nav>
//             </div>
//           )}
//         </div>
//       </main>
//     </ProtectedRoute>
//   );
// }























'use client';
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavBar from '../../components/Navbar';
import { CourseService, Course } from '../../services/courseService';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatBot from '@/components/ChatBot';

const CourseGrid = lazy(() => import('./_components/CourseGrid'));

//const COURSES_PER_PAGE = 6;


const StyledButton = styled(Button)(({ theme, variant }) => ({
  minWidth: '100px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
    color: '#92400E',
    boxShadow: '0 2px 8px rgba(252, 211, 77, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
    },
    '&:disabled': {
      background: '#F3F4F6',
      color: '#9CA3AF',
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: '#F59E0B',
    color: '#D97706',
    '&:hover': {
      borderColor: '#D97706',
      backgroundColor: '#FFFBEB',
    },
  }),
}));

export default function Classroom() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

const fetchCourses = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await CourseService.getAllCourses(page);
      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      // Optionally set an error state here to show a message to the user
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage, fetchCourses]);


  const handlePurchaseSuccess = useCallback(() => {
    fetchCourses(currentPage);
  }, [fetchCourses, currentPage]);

  // const paginationData = useMemo(() => {
  //   const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  //   const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
  //   const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
  //   const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    
  //   return { currentCourses, totalPages };
  // }, [courses, currentPage]);
const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // MODIFIED: Page numbers are now based on totalPages from the API
  const pageNumbers = useMemo(() =>
    Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  // const { freeCourses, paidAccessibleCourses, paidLockedCourses } = useMemo(() => {
  //   const free: Course[] = [];
  //   const paidAccessible: Course[] = [];
  //   const paidLocked: Course[] = [];

  //   paginationData.currentCourses.forEach(course => {
  //     if (!course.isPaid) {
  //       free.push(course);
  //     } else if (course.isAccessible) {
  //       paidAccessible.push(course);
  //     } else {
  //       paidLocked.push(course);
  //     }
  //   });

  //   return {
  //     freeCourses: free,
  //     paidAccessibleCourses: paidAccessible,
  //     paidLockedCourses: paidLocked
  //   };
  // }, [paginationData.currentCourses]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[rgb(248,247,245)] pt-13 md:pt-[104px] pb-16 md:pb-0">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Classroom</h1>
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              {courses.length} course{courses.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Compact Course Statistics */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 py-2 shadow-sm border border-blue-200 min-w-[140px] h-[50px] flex items-center">
              <div className="flex items-center w-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-blue-700 font-medium truncate">Free Courses</div>
                  <div className="text-lg font-bold text-blue-800 leading-tight">
                    {courses.filter(c => !c.isPaid).length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg px-4 py-2 shadow-sm border border-green-200 min-w-[140px] h-[50px] flex items-center">
              <div className="flex items-center w-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-green-700 font-medium truncate">Purchased</div>
                  <div className="text-lg font-bold text-green-800 leading-tight">
                    {courses.filter(c => c.isPaid && c.isAccessible).length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg px-4 py-2 shadow-sm border border-amber-200 min-w-[140px] h-[50px] flex items-center">
              <div className="flex items-center w-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-amber-700 font-medium truncate">Available to Buy</div>
                  <div className="text-lg font-bold text-amber-800 leading-tight">
                    {courses.filter(c => c.needsPayment).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md h-full animate-pulse">
                    <div className="w-full h-48 bg-gradient-to-r from-gray-300 to-gray-300"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="w-full bg-gray-300 rounded-full h-2.5 mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <CourseGrid
                courses={courses} // Pass the paginated courses directly
                loading={loading}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </Suspense>
          </div>
          

           <ChatBot/>
          {/* Enhanced Pagination with Material-UI */}
         {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-lg shadow-lg bg-white p-1">
                <StyledButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || loading}
                  variant="outlined"
                  size="small"
                >
                  Previous
                </StyledButton>
                
              <div className="flex">
                  {pageNumbers.map((page) => (
                    <StyledButton
                      key={page}
                      onClick={() => handlePageClick(page)}
                      variant={currentPage === page ? "contained" : "outlined"}
                      disabled={loading}
                      size="small"
                      className="mx-0.5"
                      sx={{
                        minWidth: '40px',
                        ...(currentPage === page && {
                          background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                          color: '#92400E',
                          fontWeight: 700,
                        })
                      }}
                    >
                      {page}
                    </StyledButton>
                  ))}
                </div>
                
                <StyledButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  variant="outlined"
                  size="small"
                >
                  Next
                </StyledButton>
              </nav>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}