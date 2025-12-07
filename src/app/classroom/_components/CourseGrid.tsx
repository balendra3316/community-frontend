


'use client';
import React from 'react';
import CourseCard from './CourseCard';
import { Course } from '../../../services/courseService'

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
  onPurchaseSuccess?: () => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading, onPurchaseSuccess }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No courses available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course._id} 
          course={course} 
          onPurchaseSuccess={onPurchaseSuccess}
        />
      ))}
    </div>
  );
};

export default CourseGrid;