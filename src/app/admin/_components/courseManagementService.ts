// src/app/admin/_components/courseManagementService.ts
"use client";

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface Section {
  _id: string;
  title: string;
  courseId: string;
  order?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  lessons?: Lesson[];
}

export interface Resource {
  title: string;
  fileUrl: string;
  fileType: string;
  file?: File;
}

export interface Image {
  url: string;
  caption?: string;
  altText?: string;
  file?: File;
}

export interface Lesson {
  _id: string;
  title: string;
  courseId: string;
  sectionId?: string;
  content: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  resources: Resource[];
  images: Image[];
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CourseDetails extends Course {
  sections: (Section | {
    _id: 'direct';
    title: string;
    lessons: Lesson[];
  })[];
}




// Helper function to prepare form data with files and metadata
const prepareLessonFormData = (lessonData: Partial<Lesson>): FormData => {
  const formData = new FormData();
  const { images = [], resources = [], ...otherData } = lessonData;

  // Add basic fields
  Object.entries(otherData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  // Process images - handle both URLs and files
  images.forEach((img, index) => {
    if (img.url) {
      // Direct URL case
      formData.append(`images[${index}][url]`, img.url);
      if (img.caption) formData.append(`images[${index}][caption]`, img.caption);
      if (img.altText) formData.append(`images[${index}][altText]`, img.altText);
    } else if (img.file) {
      // File upload case
      formData.append(`imageFiles[${index}]`, img.file);
      if (img.caption) formData.append(`images[${index}][caption]`, img.caption);
      if (img.altText) formData.append(`images[${index}][altText]`, img.altText || img.file.name);
    }
  });

  // Process resources - handle both URLs and files
  resources.forEach((res, index) => {
    if (res.fileUrl) {
      // Direct URL case
      formData.append(`resources[${index}][title]`, res.title || '');
      formData.append(`resources[${index}][fileUrl]`, res.fileUrl);
      if (res.fileType) formData.append(`resources[${index}][fileType]`, res.fileType);
    } else if (res.file) {
      // File upload case
      formData.append(`resourceFiles[${index}]`, res.file);
      formData.append(`resources[${index}][title]`, res.title || res.file.name);
      if (res.fileType) formData.append(`resources[${index}][fileType]`, res.fileType);
    }
  });

  return formData;
}










// Course API servic
export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/admin/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  },

  // Get course details
  async getCourseDetails(courseId: string): Promise<CourseDetails> {
    const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course details');
    }

    return response.json();
  },









  // // Create a new course
  // async createCourse(courseData: Partial<Course>): Promise<Course> {
  //   const response = await fetch(`${API_URL}/admin/courses`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify(courseData),
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to create course');
  //   }

  //   return response.json();
  // },

  // // Update an existing course
  // async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
  //   const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify(courseData),
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to update course');
  //   }

  //   return response.json();
  // },





  
async createCourse(courseData: Partial<Course>, coverImageFile?: File): Promise<Course> {
  const formData = new FormData();
  
  // Add course data fields to FormData
  formData.append('title', courseData.title || '');
  if (courseData.description) formData.append('description', courseData.description);
  
  // Add order field explicitly (ensure it's set even if zero)
  formData.append('order', (courseData.order !== undefined ? courseData.order : 0).toString());
  
  // If there's a file, add it to FormData
  if (coverImageFile) {
    formData.append('coverImage', coverImageFile);
  } 
  // If there's a URL but no file, we might still want to keep the existing URL
  else if (courseData.coverImage && !coverImageFile) {
    formData.append('coverImageUrl', courseData.coverImage);
  }

  const response = await fetch(`${API_URL}/admin/courses`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create course');
  }

  return response.json();
},

// Update an existing course
async updateCourse(courseId: string, courseData: Partial<Course>, coverImageFile?: File): Promise<Course> {
  const formData = new FormData();
  
  // Add course data fields to FormData
  if (courseData.title) formData.append('title', courseData.title);
  if (courseData.description !== undefined) formData.append('description', courseData.description);
  
  // Always include the order field when updating a course
  if (courseData.order !== undefined) {
    formData.append('order', courseData.order.toString());
  }
  
  // If there's a file, add it to FormData
  if (coverImageFile) {
    formData.append('coverImage', coverImageFile);
  } 
  // If there's a URL but no file, we might still want to keep the existing URL
  else if (courseData.coverImage && !coverImageFile) {
    formData.append('coverImageUrl', courseData.coverImage);
  }

  const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update course');
  }

  return response.json();
},






  // Delete a course
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete course');
    }

    return response.json();
  },

  // Create a new section
  async createSection(courseId: string, sectionData: Partial<Section>): Promise<Section> {
    const response = await fetch(`${API_URL}/admin/courses/${courseId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create section');
    }

    return response.json();
  },

  // Update a section
  async updateSection(sectionId: string, sectionData: Partial<Section>): Promise<Section> {
    const response = await fetch(`${API_URL}/admin/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update section');
    }

    return response.json();
  },

  // Delete a section
  async deleteSection(sectionId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/sections/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete section');
    }

    return response.json();
  },






// Create a lesson in a course
async createLessonInCourse(courseId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
  const formData = prepareLessonFormData(lessonData);

  const response = await fetch(`${API_URL}/admin/courses/${courseId}/lessons`, {
    method: 'POST',
    credentials: 'include',
    body: formData, // No Content-Type header needed for FormData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create lesson');
  }

  return response.json();
},

// Create a lesson in a section
async createLessonInSection(sectionId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
  const formData = prepareLessonFormData(lessonData);

  const response = await fetch(`${API_URL}/admin/sections/${sectionId}/lessons`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create lesson in section');
  }

  return response.json();
},

// Update a lesson
async updateLesson(lessonId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
  const formData = prepareLessonFormData(lessonData);

  const response = await fetch(`${API_URL}/admin/lessons/${lessonId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update lesson');
  }

  return response.json();
},







  // Delete a lesson
  async deleteLesson(lessonId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/lessons/${lessonId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete lesson');
    }

    return response.json();
  }
};