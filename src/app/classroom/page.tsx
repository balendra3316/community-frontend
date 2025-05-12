
// 'use client'
// import NavBar from '../../components/Navbar'
// import { useState } from "react";

// export default function Classroom() {
 
//   return (
//     <main className="min-h-screen bg-white pt-[104px]">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <h1 className="text-2xl font-semibold text-gray-800">Classroom </h1>
//         <div className="flex-grow px-4 py-6 md:px-6 lg:px-8">
        
//       </div>

//       </div>
//     </main>
//   );
// }












'use client';
import { useState, useEffect } from 'react';
import NavBar from '../../components/Navbar';
import CourseGrid from './_components/CourseGrid';
import { CourseService, Course } from '../../services/courseService';

export default function Classroom() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await CourseService.getAllCourses();
        setCourses(data);
        
        // Calculate total pages (assuming 6 courses per page)
        setTotalPages(Math.ceil(data.length / 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    console.log('Courses updated:', courses);
  }, [courses]);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * 6;
  const indexOfFirstCourse = indexOfLastCourse - 6;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <main className="min-h-screen bg-gray-50 pt-[104px]">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Classroom</h1>
        
        <div className="mb-8">
          <CourseGrid courses={currentCourses} loading={loading} />
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-l-md border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-r-md border ${
                  currentPage === totalPages
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
  );
}