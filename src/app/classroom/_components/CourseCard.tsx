'use client';
import React from 'react';

import Link from 'next/link';
import { Course } from '../../../services/courseService';

interface CourseCardProps {
    course: Course;
  }
  
  const CourseCard: React.FC<CourseCardProps> = ({ course }) => {

    const progress = course.progress?.completionPercentage || 0
    
    return (
      <Link href={`/classroom/${course._id}`}>
       <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col" style={{
  boxShadow: "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
  border: "1px solid rgb(228, 228, 228)"
}}>
          {/* Course Image */}
          <div className="relative w-full h-48 bg-gray-200">
            {course.coverImage ? (

              <img 
                src={course.coverImage}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-500">
                <span className="text-white text-lg font-medium">{course.title}</span>
              </div>
            )}
          </div>
          
          {/* Course Content */}
          <div className="p-4 flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  
  export default CourseCard;