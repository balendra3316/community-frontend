"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "./_components/AdminAuthContext";
import {
  courseService,
  Course,
  CourseDetails,
} from "./_components/courseManagementService";
import CourseList from "./(components)/CourseList";
import CourseDetailView from "./(components)/CourseDetailView";

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(
    null
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = async (courseId: string) => {
    try {
      setLoading(true);
      const courseDetails = await courseService.getCourseDetails(courseId);
      setSelectedCourse(courseDetails);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-600">Loading...</p>}

      {!selectedCourse ? (
        <CourseList
          courses={courses}
          loading={loading}
          fetchCourses={fetchCourses}
          handleSelectCourse={handleSelectCourse}
        />
      ) : (
        <CourseDetailView
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          fetchCourses={fetchCourses}
          handleSelectCourse={handleSelectCourse}
        />
      )}
    </div>
  );
}
