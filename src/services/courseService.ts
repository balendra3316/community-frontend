

import axios from 'axios';
import { CourseDetail } from '../types/course.types';

export interface Progress {
  completionPercentage: number;
  lastAccessedLesson: string | null;
}





export interface PaginatedCoursesResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
}

// Payload for the new payment verification endpoint
export interface VerifyPaymentPayload {
  courseId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  // ... other properties from Razorpay if needed
}





export interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  totalLessons: number;
  isPaid: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  progress?: Progress;
  isAccessible: boolean;
  needsPayment: boolean;
}

export interface PurchaseCoursePayload {
  courseId: string;
  paymentAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PurchaseCourseResponse {
  message: string;
  courseId: string;
  paymentId: string;
  accessGranted: boolean;
}




export interface PublicCourse {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  isPaid: boolean;
  price: number;
}

// NEW Interface for the protected access details endpoint
export interface CourseAccessDetails extends PublicCourse {
  isPurchased: boolean;
}








const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CourseService = {

  // getAllCourses: async (): Promise<Course[]> => {
  //   try {
  //     const response = await axios.get<Course[]>(`${API_URL}/courses`, {
  //       withCredentials: true,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     return [];
  //   }
  // },

  getAllCourses: async (page: number = 1): Promise<PaginatedCoursesResponse> => {
    try {
      const response = await axios.get<PaginatedCoursesResponse>(`${API_URL}/courses`, {
        params: { page },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // Return a default structure on error to prevent crashes
      return { courses: [], totalPages: 1, currentPage: 1 };
    }
  },

  // NEW: Calls the backend to securely create a payment order
  createCourseOrder: async (courseId: string): Promise<RazorpayOrderResponse> => {
    try {
      const response = await axios.post<RazorpayOrderResponse>(
        `${API_URL}/courses/create-order`,
        { courseId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create payment order.');
      }
      throw new Error('An unexpected error occurred.');
    }
  },

  // MODIFIED: Renamed and updated to send verification data
  verifyCoursePayment: async (payload: VerifyPaymentPayload): Promise<PurchaseCourseResponse> => {
    try {
      // This now calls the new verification endpoint
      const response = await axios.post<PurchaseCourseResponse>(
        `${API_URL}/courses/verify-payment`,
        payload,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to verify payment.');
      }
      throw new Error('An unexpected error occurred.');
    }
  },




  
  getCourseById: async (courseId: string): Promise<CourseDetail | null> => {
    try {
      const response = await axios.get<CourseDetail>(`${API_URL}/courses/${courseId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },



// 
 getPublicCourse: async (courseId: string): Promise<PublicCourse | null> => {
    try {
      const response = await axios.get<PublicCourse>(`${API_URL}/courses/public/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch public course data:", error);
      return null;
    }
  },

  //  New function for protected data
  getCourseAccessDetails: async (courseId: string): Promise<CourseAccessDetails | null> => {
    try {
      const response = await axios.get<CourseAccessDetails>(`${API_URL}/courses/access-details/${courseId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch course access details:", error);
      return null;
    }
  },






  

  purchaseCourse: async (payload: PurchaseCoursePayload): Promise<PurchaseCourseResponse> => {
    try {
      const response = await axios.post<PurchaseCourseResponse>(
        `${API_URL}/courses/purchase`,
        payload,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to purchase course');
      }
      throw new Error('Failed to purchase course');
    }
  },

  // unuse
  getUserPurchasedCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get(`${API_URL}/courses/purchased`, {
        withCredentials: true,
      });
      return response.data.purchasedCourses;
    } catch (error) {
      return [];
    }
  },

  // unuse
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