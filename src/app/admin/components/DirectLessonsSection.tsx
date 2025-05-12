


// import { useState } from 'react';
// import { CourseDetails, courseService } from '../_components/courseManagementService';
// import { LessonForm } from './Forms';

// interface DirectLessonsSectionProps {
//   selectedCourse: CourseDetails;
//   handleSelectCourse: (courseId: string) => Promise<void>;
// }

// export default function DirectLessonsSection({ selectedCourse, handleSelectCourse }: DirectLessonsSectionProps) {
//   const [isCreatingDirectLesson, setIsCreatingDirectLesson] = useState(false);
//   const [isEditing, setIsEditing] = useState<{ type: 'lesson', id: string } | null>(null);
//   const [editData, setEditData] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [newLesson, setNewLesson] = useState({ 
//     title: '', 
//     courseId: '', 
//     sectionId: '', 
//     content: '', 
//     videoUrl: '',
//     videoThumbnail: '',
//     videoDuration: 0,
//     images: [],
//     resources: [],
//     order: 0 
//   });

//   // Function to prepare form data with files for upload
//   const prepareFormDataWithFiles = (lessonData: any) => {
//     const formData = new FormData();
    
//     // Add basic lesson data
//     Object.keys(lessonData).forEach(key => {
//       if (key !== 'images' && key !== 'resources') {
//         formData.append(key, lessonData[key]);
//       }
//     });
    
//     // Handle images
//     const imagesWithoutFiles = lessonData.images.map((img: any, index: number) => {
//       const { file, ...restImg } = img;
//       // If image has a file property, we need to upload the file
//       if (file) {
//         formData.append('imageFiles', file);
//         // Add metadata for this image
//         const imageMetadata = {
//           caption: img.caption || '',
//           altText: img.altText || ''
//         };
//         return { ...restImg, pendingUpload: true };
//       }
//       return restImg;
//     });
    
//     // Handle resources
//     const resourcesWithoutFiles = lessonData.resources.map((res: any, index: number) => {
//       const { file, ...restRes } = res;
//       // If resource has a file property, we need to upload the file
//       if (file) {
//         formData.append('resourceFiles', file);
//         // Add metadata for this resource
//         const resourceMetadata = {
//           title: res.title || '',
//           fileType: res.fileType || 'document'
//         };
//         return { ...restRes, pendingUpload: true };
//       }
//       return restRes;
//     });
    
//     // Append image metadata as JSON
//     const imageMetadataArray = lessonData.images
//       .filter((img: any) => img.file)
//       .map((img: any) => ({ caption: img.caption || '', altText: img.altText || '' }));
    
//     if (imageMetadataArray.length > 0) {
//       formData.append('imageMetadata', JSON.stringify(imageMetadataArray));
//     }
    
//     // Append resource metadata as JSON
//     const resourceMetadataArray = lessonData.resources
//       .filter((res: any) => res.file)
//       .map((res: any) => ({ title: res.title || '', fileType: res.fileType || 'document' }));
    
//     if (resourceMetadataArray.length > 0) {
//       formData.append('resourceMetadata', JSON.stringify(resourceMetadataArray));
//     }
    
//     // Add processed arrays without file objects
//     formData.append('images', JSON.stringify(imagesWithoutFiles));
//     formData.append('resources', JSON.stringify(resourcesWithoutFiles));
    
//     return formData;
//   };

//   const handleCreateLessonInCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       // Check if we have files to upload
//       const hasFiles = newLesson.images.some((img: any) => img.file) || 
//                       newLesson.resources.some((res: any) => res.file);
      
//       // Prepare the lesson data for the next order
//       const directSection = selectedCourse.sections.find(s => s._id === 'direct');
//       const lessonOrder = directSection?.lessons ? directSection.lessons.length : 0;
//       const lessonData = {
//         ...newLesson,
//         courseId: selectedCourse._id,
//         order: lessonOrder
//       };

//       if (hasFiles) {
//         // If we have files, we need special handling
//         const formData = prepareFormDataWithFiles(lessonData);
        
//         // Custom implementation for file uploads - you would need to adapt this to your API
//         // This is a placeholder that would need to be replaced with actual API call to handle multipart/form-data
//         await courseService.createLessonInCourse(selectedCourse._id, lessonData);
//       } else {
//         // No files, use the standard API
//         await courseService.createLessonInCourse(selectedCourse._id, lessonData);
//       }

//       // Reset form and reload course data
//       setNewLesson({ 
//         title: '', 
//         courseId: '', 
//         sectionId: '', 
//         content: '', 
//         videoUrl: '',
//         videoThumbnail: '',
//         videoDuration: 0,
//         images: [],
//         resources: [],
//         order: 0 
//       });
//       setIsCreatingDirectLesson(false);
//       await handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       console.error("Error creating lesson:", err.message);
//       alert(`Failed to create lesson: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateLesson = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isEditing) return;
    
//     setIsLoading(true);
//     try {
//       // Check if we have files to upload
//       const hasFiles = editData.images?.some((img: any) => img.file) || 
//                       editData.resources?.some((res: any) => res.file);
      
//       if (hasFiles) {
//         // If we have files, we need special handling
//         const formData = prepareFormDataWithFiles(editData);
        
//         // Custom implementation for file uploads
//         await courseService.updateLesson(isEditing.id, editData);
//       } else {
//         // No files, use the standard API
//         await courseService.updateLesson(isEditing.id, editData);
//       }

//       // Reset form and reload course data
//       setIsEditing(null);
//       setEditData({});
//       await handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       console.error("Error updating lesson:", err.message);
//       alert(`Failed to update lesson: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteLesson = async (lessonId: string) => {
//     if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
//     setIsLoading(true);
//     try {
//       await courseService.deleteLesson(lessonId);
//       await handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       console.error("Error deleting lesson:", err.message);
//       alert(`Failed to delete lesson: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get direct lessons sorted by order
//   const directLessons = selectedCourse.sections
//     .find(section => section._id === 'direct')?.lessons
//     ?.sort((a, b) => a.order - b.order) || [];

//   return (
//     <div className="mb-8">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">Direct Lessons</h3>
//         <button
//           onClick={() => setIsCreatingDirectLesson(true)}
//           className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
//           disabled={isLoading}
//         >
//           Add Lesson
//         </button>
//       </div>
      
//       {isCreatingDirectLesson && (
//         <LessonForm
//           data={newLesson}
//           setData={setNewLesson}
//           onSubmit={handleCreateLessonInCourse}
//           onCancel={() => setIsCreatingDirectLesson(false)}
//         />
//       )}
      
//       <div className="pl-4 space-y-2">
//         {directLessons.length > 0 ? (
//           directLessons.map((lesson) => (
//             <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
//                     {lesson.order + 1}
//                   </span>
//                   <div>
//                     <h4 className="font-medium">{lesson.title}</h4>
//                     <div className="flex space-x-2 text-xs text-gray-500">
//                       {lesson.videoUrl && <span>📺 Video</span>}
//                       {lesson.images?.length > 0 && <span>🖼️ {lesson.images.length} image(s)</span>}
//                       {lesson.resources?.length > 0 && <span>📄 {lesson.resources.length} resource(s)</span>}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => {
//                       setIsEditing({ type: 'lesson', id: lesson._id });
//                       setEditData({
//                         _id: lesson._id,
//                         title: lesson.title,
//                         content: lesson.content,
//                         videoUrl: lesson.videoUrl,
//                         images: lesson.images || [],
//                         resources: lesson.resources || [],
//                         order: lesson.order
//                       });
//                     }}
//                     className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                     disabled={isLoading}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteLesson(lesson._id)}
//                     className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                     disabled={isLoading}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
              
//               {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
//                 <LessonForm
//                   data={editData}
//                   setData={setEditData}
//                   onSubmit={handleUpdateLesson}
//                   onCancel={() => {
//                     setIsEditing(null);
//                     setEditData({});
//                   }}
//                 />
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-sm">No direct lessons yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }












import { useState } from 'react';
import { CourseDetails, courseService, Lesson } from '../_components/courseManagementService';
import { LessonForm } from './Forms';

interface DirectLessonsSectionProps {
  selectedCourse: CourseDetails;
  handleSelectCourse: (courseId: string) => Promise<void>;
}

export default function DirectLessonsSection({ selectedCourse, handleSelectCourse }: DirectLessonsSectionProps) {
  const [isCreatingDirectLesson, setIsCreatingDirectLesson] = useState(false);
  const [isEditing, setIsEditing] = useState<{ type: 'lesson', id: string } | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ 
    title: '', 
    courseId: '', 
    content: '', 
    videoUrl: '',
    videoThumbnail: '',
    videoDuration: 0,
    images: [],
    resources: [],
    order: 0,
    isPublished: false
  });

  const handleCreateLessonInCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Set the course ID and prepare the lesson data
      const directSection = selectedCourse.sections.find(s => s._id === 'direct');
      const lessonOrder = directSection?.lessons ? directSection.lessons.length : 0;
      
      const lessonData = {
        ...newLesson,
        courseId: selectedCourse._id,
        order: lessonOrder
      };

      // Let the API service handle the formData preparation
      await courseService.createLessonInCourse(selectedCourse._id, lessonData);

      // Reset form and reload course data
      setNewLesson({ 
        title: '', 
        courseId: '', 
        content: '', 
        videoUrl: '',
        videoThumbnail: '',
        videoDuration: 0,
        images: [],
        resources: [],
        order: 0,
        isPublished: false
      });
      setIsCreatingDirectLesson(false);
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error("Error creating lesson:", err.message);
      alert(`Failed to create lesson: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) return;
    
    setIsLoading(true);
    try {
      // Let the API service handle the formData preparation
      await courseService.updateLesson(isEditing.id, editData);

      // Reset form and reload course data
      setIsEditing(null);
      setEditData({});
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error("Error updating lesson:", err.message);
      alert(`Failed to update lesson: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    setIsLoading(true);
    try {
      await courseService.deleteLesson(lessonId);
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error("Error deleting lesson:", err.message);
      alert(`Failed to delete lesson: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get direct lessons sorted by order
  const directLessons = selectedCourse.sections
    .find(section => section._id === 'direct')?.lessons
    ?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Direct Lessons</h3>
        <button
          onClick={() => setIsCreatingDirectLesson(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
          disabled={isLoading}
        >
          Add Lesson
        </button>
      </div>
      
      {isCreatingDirectLesson && (
        <LessonForm
          data={newLesson}
          setData={setNewLesson}
          onSubmit={handleCreateLessonInCourse}
          onCancel={() => setIsCreatingDirectLesson(false)}
        />
      )}
      
      <div className="pl-4 space-y-2">
        {directLessons.length > 0 ? (
          directLessons.map((lesson) => (
            <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                    {lesson.order + 1}
                  </span>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{lesson.title}</h4>
                      {lesson.isPublished ? (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Published</span>
                      ) : (
                        <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Draft</span>
                      )}
                    </div>
                    <div className="flex space-x-2 text-xs text-gray-500">
                      {lesson.videoUrl && <span>📺 Video</span>}
                      {lesson.images?.length > 0 && <span>🖼️ {lesson.images.length} image(s)</span>}
                      {lesson.resources?.length > 0 && <span>📄 {lesson.resources.length} resource(s)</span>}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing({ type: 'lesson', id: lesson._id });
                      setEditData({
                        _id: lesson._id,
                        title: lesson.title,
                        content: lesson.content,
                        videoUrl: lesson.videoUrl || '',
                        images: lesson.images || [],
                        resources: lesson.resources || [],
                        order: lesson.order,
                        isPublished: lesson.isPublished || false
                      });
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
                <LessonForm
                  data={editData}
                  setData={setEditData}
                  onSubmit={handleUpdateLesson}
                  onCancel={() => {
                    setIsEditing(null);
                    setEditData({});
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No direct lessons yet.</p>
        )}
      </div>
    </div>
  );
}