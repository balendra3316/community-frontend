
export interface Resource {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
  }
  
  export interface Image {
    _id: string;
    url: string;
    caption: string;
    altText: string;
  }
  
  export interface Lesson {
    _id: string;
    title: string;
    courseId: string;
    sectionId: string;
    content: string;
    videoUrl: string;
    videoThumbnail: string;
    videoDuration: number;
    resources: Resource[];
    images: Image[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface Section {
    _id: string;
    title: string;
    courseId: string;
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    lessons: Lesson[];
  }
  
  export interface Progress {
    completionPercentage: number;
    lastAccessedLesson: string | null;
    completedLessons: string[]
  }
  
  export interface CourseDetail {
    _id: string;
    title: string;
    description: string;
    coverImage: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    sections: Section[];
    progress: Progress | null;
  }