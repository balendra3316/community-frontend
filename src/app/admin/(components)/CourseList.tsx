





















    



      


      














    



















      

      










      














































import { useState } from 'react';
import { courseService, Course } from '../_components/courseManagementService';
import { CourseForm } from './Forms';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
  handleSelectCourse: (courseId: string) => Promise<void>;
}

export default function CourseList({ courses, loading, fetchCourses, handleSelectCourse }: CourseListProps) {
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', coverImage: '', order: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      

      const { coverImageFile, ...courseData } = newCourse as any;
      
      await courseService.createCourse(courseData, coverImageFile);
      setNewCourse({ title: '', description: '', coverImage: '', order: 0 });
      setIsCreatingCourse(false);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseService.deleteCourse(courseId);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <button
          onClick={() => setIsCreatingCourse(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add Course
        </button>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {isCreatingCourse && (
        <CourseForm
          type="course"
          data={newCourse}
          setData={setNewCourse}
          onSubmit={handleCreateCourse}
          onCancel={() => setIsCreatingCourse(false)}
          isLoading={isSubmitting}
        />
      )}
      
      {courses.length === 0 && !loading ? (
        <p className="text-gray-500">No courses found. Create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course._id} className="border p-4 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded-full h-6 w-6 text-xs font-medium">
                      {course.order || 0}
                    </span>
                    <h3 className="font-medium">{course.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSelectCourse(course._id)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}