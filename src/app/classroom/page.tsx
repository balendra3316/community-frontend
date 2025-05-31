


'use client';
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import NavBar from '../../components/Navbar';
import { CourseService, Course } from '../../services/courseService';
import ProtectedRoute from '@/components/ProtectedRoute';


const CourseGrid = lazy(() => import('./_components/CourseGrid'));


const COURSES_PER_PAGE = 6;

export default function Classroom() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CourseService.getAllCourses();
      setCourses(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);


  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
    const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
    const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    
    return { currentCourses, totalPages };
  }, [courses, currentPage]);


  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
  }, [paginationData.totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);


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
            <Suspense fallback={ <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md h-full animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
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
      </div>}>
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