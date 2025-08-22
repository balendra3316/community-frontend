"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
    isPaid:boolean;
  price:number;
  isPublished?: boolean
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
  urls?: Array<{ title: string; url: string;}>;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CourseDetails extends Course {
  sections: (
    | Section
    | {
        _id: "direct";
        title: string;
        lessons: Lesson[];
      }
  )[];
    isPaid:boolean;
  price:number;
}




// const prepareLessonFormData = (lessonData: Partial<Lesson>): FormData => {
//   const formData = new FormData();
//   const { images = [], resources = [], ...otherData } = lessonData;

//   Object.entries(otherData).forEach(([key, value]) => {
//     if (value !== undefined) {
//       formData.append(key, value.toString());
//     }
//   });

//   images.forEach((img, index) => {
//     if (img.url) {
//       formData.append(`images[${index}][url]`, img.url);
//       if (img.caption)
//         formData.append(`images[${index}][caption]`, img.caption);
//       if (img.altText)
//         formData.append(`images[${index}][altText]`, img.altText);
//     } else if (img.file) {
//       formData.append(`imageFiles[${index}]`, img.file);
//       if (img.caption)
//         formData.append(`images[${index}][caption]`, img.caption);
//       if (img.altText)
//         formData.append(
//           `images[${index}][altText]`,
//           img.altText || img.file.name
//         );
//     }
//   });

//   resources.forEach((res, index) => {
//     if (res.fileUrl) {
//       formData.append(`resources[${index}][title]`, res.title || "");
//       formData.append(`resources[${index}][fileUrl]`, res.fileUrl);
//       if (res.fileType)
//         formData.append(`resources[${index}][fileType]`, res.fileType);
//     } else if (res.file) {
//       formData.append(`resourceFiles[${index}]`, res.file);
//       formData.append(`resources[${index}][title]`, res.title || res.file.name);
//       if (res.fileType)
//         formData.append(`resources[${index}][fileType]`, res.fileType);
//     }
//   });





// if (lessonData.urls && lessonData.urls.length > 0) {
//   lessonData.urls.forEach((urlItem, index) => {
//     if (urlItem.title) {
//       formData.append(`urls[${index}][title]`, urlItem.title);
//     }
//     if (urlItem.url) {
//       formData.append(`urls[${index}][url]`, urlItem.url);
//     }
//   });
// }






//   return formData
// };



const prepareLessonFormData = (lessonData: Partial<Lesson>): FormData => {
  const formData = new FormData();
  // IMPORTANT: Destructure urls here as well for consistent handling
  const { images = [], resources = [], urls = [], ...otherData } = lessonData;

  Object.entries(otherData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) { // Added null check for safety
      formData.append(key, value.toString());
    }
  });

  // FIX START: Logic for Images
  if (images.length > 0) {
    images.forEach((img, index) => {
      // Keep your existing logic for populated arrays
      if (img.url) {
        formData.append(`images[${index}][url]`, img.url);
        if (img.caption) formData.append(`images[${index}][caption]`, img.caption);
        if (img.altText) formData.append(`images[${index}][altText]`, img.altText);
      } else if (img.file) {
        formData.append(`imageFiles[${index}]`, img.file);
        if (img.caption) formData.append(`images[${index}][caption]`, img.caption);
        if (img.altText) formData.append(`images[${index}][altText]`, img.altText || img.file.name);
      }
    });
  } else {
    // This is the crucial part: send an empty array string if the array is empty.
    formData.append('images', '[]');
  }
  // FIX END

  // FIX START: Logic for Resources
  if (resources.length > 0) {
    resources.forEach((res, index) => {
      // Keep your existing logic for populated arrays
      if (res.fileUrl) {
        formData.append(`resources[${index}][title]`, res.title || "");
        formData.append(`resources[${index}][fileUrl]`, res.fileUrl);
        if (res.fileType) formData.append(`resources[${index}][fileType]`, res.fileType);
      } else if (res.file) {
        formData.append(`resourceFiles[${index}]`, res.file);
        formData.append(`resources[${index}][title]`, res.title || res.file.name);
        if (res.fileType) formData.append(`resources[${index}][fileType]`, res.fileType);
      }
    });
  } else {
    // Crucial part for resources
    formData.append('resources', '[]');
  }
  // FIX END

  // FIX START: Logic for URLs
  if (urls.length > 0) {
    urls.forEach((urlItem, index) => {
      // Keep your existing logic for populated arrays
      if (urlItem.title) {
        formData.append(`urls[${index}][title]`, urlItem.title);
      }
      if (urlItem.url) {
        formData.append(`urls[${index}][url]`, urlItem.url);
      }
    });
  } else {
    // Crucial part for URLs
    formData.append('urls', '[]');
  }
  // FIX END

  return formData;
};













export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/admin/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },

  async getCourseDetails(courseId: string): Promise<CourseDetails> {
    const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }

    return response.json();
  },






async createCourse(
  courseData: Partial<Course>,
  coverImageFile?: File
): Promise<Course> {
  const formData = new FormData();

  formData.append("title", courseData.title || "");
  if (courseData.description)
    formData.append("description", courseData.description);

  formData.append(
    "order",
    (courseData.order !== undefined ? courseData.order : 0).toString()
  );
  
  if (courseData.isPaid === true) {
    formData.append("isPaid", "true");
  }
  
  if (courseData.isPublished !== undefined) {
    formData.append("isPublished", courseData.isPublished.toString());
  }

  if (courseData.isPaid && courseData.price !== undefined) {
    formData.append("price", courseData.price.toString());
  }

  if (coverImageFile) {
    formData.append("coverImage", coverImageFile);
  } else if (courseData.coverImage && !coverImageFile) {
    formData.append("coverImageUrl", courseData.coverImage);
  }

  const response = await fetch(`${API_URL}/admin/courses`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create course");
  }

  return response.json();
},







async updateCourse(
  courseId: string,
  courseData: Partial<Course>,
  coverImageFile?: File
): Promise<Course> {
  const formData = new FormData();

  if (courseData.title) formData.append("title", courseData.title);
  if (courseData.description !== undefined)
    formData.append("description", courseData.description);

  if (courseData.order !== undefined) {
    formData.append("order", courseData.order.toString());
  }


  if (courseData.isPaid !== undefined) {
    formData.append("isPaid", courseData.isPaid.toString());
  }


 if (courseData.isPublished !== undefined) {
    formData.append("isPublished", courseData.isPublished.toString());
  }




  if (courseData.isPaid && courseData.price !== undefined) {
    formData.append("price", courseData.price.toString());
  }

  if (coverImageFile) {
    formData.append("coverImage", coverImageFile);
  } else if (courseData.coverImage && !coverImageFile) {
    formData.append("coverImageUrl", courseData.coverImage);
  }

  const response = await fetch(`${API_URL}/admin/courses/${courseId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update course");
  }

  return response.json();
},


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

  async createSection(
    courseId: string,
    sectionData: Partial<Section>
  ): Promise<Section> {
    const response = await fetch(
      `${API_URL}/admin/courses/${courseId}/sections`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sectionData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create section");
    }

    return response.json();
  },

  async updateSection(
    sectionId: string,
    sectionData: Partial<Section>
  ): Promise<Section> {
    const response = await fetch(`${API_URL}/admin/sections/${sectionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update section");
    }

    return response.json();
  },

  async deleteSection(sectionId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/sections/${sectionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete section");
    }

    return response.json();
  },

  async createLessonInCourse(
    courseId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> {
    const formData = prepareLessonFormData(lessonData);

    const response = await fetch(
      `${API_URL}/admin/courses/${courseId}/lessons`,
      {
        method: "POST",
        credentials: "include",
        body: formData, // No Content-Type header needed for FormData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create lesson");
    }

    return response.json();
  },

  async createLessonInSection(
    sectionId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> {
    const formData = prepareLessonFormData(lessonData);

    const response = await fetch(
      `${API_URL}/admin/sections/${sectionId}/lessons`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create lesson in section");
    }

    return response.json();
  },

  async updateLesson(
    lessonId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> {
    const formData = prepareLessonFormData(lessonData);

    const response = await fetch(`${API_URL}/admin/lessons/${lessonId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update lesson");
    }

    return response.json();
  },

  async deleteLesson(lessonId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/lessons/${lessonId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete lesson");
    }

    return response.json();
  },
};
