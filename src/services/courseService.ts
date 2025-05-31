
import axios from 'axios';
import {  CourseDetail } from '../types/course.types';

export interface Progress {
  completionPercentage: number;
  lastAccessedLesson: string | null;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  progress?: Progress;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const CourseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get<Course[]>(`${API_URL}/courses`, {
        withCredentials: true, // ← This is necessary
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  getCourseById: async (courseId: string): Promise<CourseDetail | null> => {
    try {
      const response = await axios.get<CourseDetail>(`${API_URL}/courses/${courseId}`,{
        withCredentials:true,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  updateLessonProgress: async (courseId: string, lessonId: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/progress`, {
        courseId,
        lessonId,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  toggleLessonCompletion: async (courseId: string, lessonId: string): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_URL}/courses/progress/toggle`,
        {
          lessonId,
          courseId,
          status: true 
        },
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }



};

export default CourseService;