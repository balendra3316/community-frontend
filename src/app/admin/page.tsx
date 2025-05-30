// "use client";

// import { useAdminAuth } from './_components/AdminAuthContext';

// export default function AdminDashboard() {
//   const { admin, logout } = useAdminAuth();

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h1 className="text-2xl font-bold mb-6">Hi, this is admin page</h1>
      
//       {admin && (
//         <div className="mb-6">
//           <p className="text-gray-600">Welcome, {admin.name}!</p>
//           <p className="text-sm text-gray-500">{admin.email}</p>
//         </div>
//       )}
      
//       <button
//         onClick={logout}
//         className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
//       >
//         Log Out
//       </button>
//     </div>
//   );
// }








// "use client";

// import { useState, useEffect } from 'react';
// import { useAdminAuth } from './_components/AdminAuthContext';
// import { courseService, Course, CourseDetails, Section, Lesson } from './_components/courseManagementService';

// export default function AdminDashboard() {
//   const { admin } = useAdminAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
//   const [isCreatingCourse, setIsCreatingCourse] = useState(false);
//   const [newCourse, setNewCourse] = useState({ title: '', description: '', coverImage: '' });
//   const [isCreatingSection, setIsCreatingSection] = useState(false);
//   const [newSection, setNewSection] = useState({ title: '', courseId: '', order: 0 });
//   const [isCreatingLesson, setIsCreatingLesson] = useState(false);
//   const [newLesson, setNewLesson] = useState({ 
//     title: '', 
//     courseId: '', 
//     sectionId: '', 
//     content: '', 
//     videoUrl: '',
//     order: 0 
//   });
//   const [isEditing, setIsEditing] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(null);
//   const [editData, setEditData] = useState<any>({});

//   // Fetch all courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const data = await courseService.getAllCourses();
//       setCourses(data);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectCourse = async (courseId: string) => {
//     try {
//       setLoading(true);
//       const courseDetails = await courseService.getCourseDetails(courseId);
//       setSelectedCourse(courseDetails);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch course details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await courseService.createCourse(newCourse);
//       setNewCourse({ title: '', description: '', coverImage: '' });
//       setIsCreatingCourse(false);
//       fetchCourses();
//     } catch (err: any) {
//       setError(err.message || 'Failed to create course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateSection = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       await courseService.createSection(selectedCourse._id, {
//         ...newSection,
//         courseId: selectedCourse._id,
//         order: selectedCourse.sections.length + 1
//       });
//       setNewSection({ title: '', courseId: '', order: 0 });
//       setIsCreatingSection(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLessonInCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       // Count direct lessons (lessons without a section)
//       const directLessons = selectedCourse.sections.find(s => s._id === 'direct')?.lessons || [];
      
//       await courseService.createLessonInCourse(selectedCourse._id, {
//         ...newLesson,
//         courseId: selectedCourse._id,
//         order: directLessons.length + 1
//       });
//       setNewLesson({ title: '', courseId: '', sectionId: '', content: '', videoUrl: '', order: 0 });
//       setIsCreatingLesson(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLessonInSection = async (e: React.FormEvent, sectionId: string) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       // Find the section and count its lessons
//       const section = selectedCourse.sections.find(s => s._id === sectionId);
//       const lessonCount = section && 'lessons' in section ? section.lessons?.length || 0 : 0;
      
//       await courseService.createLessonInSection(sectionId, {
//         ...newLesson,
//         courseId: selectedCourse._id,
//         sectionId: sectionId,
//         order: lessonCount + 1
//       });
//       setNewLesson({ title: '', courseId: '', sectionId: '', content: '', videoUrl: '', order: 0 });
//       setIsCreatingLesson(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create lesson in section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateCourse(selectedCourse._id, editData);
//       setIsEditing(null);
//       setEditData({});
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSection = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isEditing) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateSection(isEditing.id, editData);
//       setIsEditing(null);
//       setEditData({});
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditLesson = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isEditing) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateLesson(isEditing.id, editData);
//       setIsEditing(null);
//       setEditData({});
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteCourse(courseId);
//       setSelectedCourse(null);
//       fetchCourses();
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSection = async (sectionId: string) => {
//     if (!window.confirm('Are you sure you want to delete this section and all its lessons?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteSection(sectionId);
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteLesson = async (lessonId: string) => {
//     if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteLesson(lessonId);
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render course list or course details
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {loading && <p className="text-gray-600">Loading...</p>}
      
//       {!selectedCourse ? (
//         // Course list view
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Courses</h2>
//             <button
//               onClick={() => setIsCreatingCourse(true)}
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//             >
//               Add Course
//             </button>
//           </div>
          
//           {isCreatingCourse && (
//             <div className="bg-gray-100 p-4 rounded mb-4">
//               <h3 className="text-lg font-medium mb-2">Create New Course</h3>
//               <form onSubmit={handleCreateCourse}>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     value={newCourse.title}
//                     onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     value={newCourse.description}
//                     onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
//                   <input
//                     type="text"
//                     value={newCourse.coverImage}
//                     onChange={(e) => setNewCourse({...newCourse, coverImage: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsCreatingCourse(false)}
//                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                   >
//                     Create
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {courses.length === 0 && !loading ? (
//             <p className="text-gray-500">No courses found. Create one to get started.</p>
//           ) : (
//             <div className="space-y-4">
//               {courses.map((course) => (
//                 <div key={course._id} className="border p-4 rounded-lg hover:bg-gray-50">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-500">{course.description}</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleSelectCourse(course._id)}
//                         className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCourse(course._id)}
//                         className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         // Course details view
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">
//               {isEditing?.type === 'course' ? 'Edit Course' : selectedCourse.title}
//             </h2>
//             <div className="flex space-x-2">
//               {isEditing?.type !== 'course' && (
//                 <button
//                   onClick={() => {
//                     setIsEditing({ type: 'course', id: selectedCourse._id });
//                     setEditData({
//                       title: selectedCourse.title,
//                       description: selectedCourse.description,
//                       coverImage: selectedCourse.coverImage
//                     });
//                   }}
//                   className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
//                 >
//                   Edit Course
//                 </button>
//               )}
//               <button
//                 onClick={() => setSelectedCourse(null)}
//                 className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//               >
//                 Back to List
//               </button>
//             </div>
//           </div>
          
//           {isEditing?.type === 'course' && (
//             <div className="bg-gray-100 p-4 rounded mb-6">
//               <form onSubmit={handleEditCourse}>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     value={editData.title}
//                     onChange={(e) => setEditData({...editData, title: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     value={editData.description}
//                     onChange={(e) => setEditData({...editData, description: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
//                   <input
//                     type="text"
//                     value={editData.coverImage}
//                     onChange={(e) => setEditData({...editData, coverImage: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(null);
//                       setEditData({});
//                     }}
//                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {!isEditing?.type && (
//             <>
//               <div className="mb-4">
//                 <p className="text-gray-600">{selectedCourse.description}</p>
//                 {selectedCourse.coverImage && (
//                   <div className="mt-2">
//                     <img 
//                       src={selectedCourse.coverImage} 
//                       alt={selectedCourse.title} 
//                       className="h-40 object-cover rounded"
//                     />
//                   </div>
//                 )}
//               </div>
              
//               {/* Direct Lessons Section */}
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium">Direct Lessons</h3>
//                   <button
//                     onClick={() => setIsCreatingLesson(true)}
//                     className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
//                   >
//                     Add Lesson
//                   </button>
//                 </div>
                
//                 {isCreatingLesson && (
//                   <div className="bg-gray-100 p-4 rounded mb-4">
//                     <h4 className="text-md font-medium mb-2">Create New Lesson</h4>
//                     <form onSubmit={handleCreateLessonInCourse}>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Title</label>
//                         <input
//                           type="text"
//                           value={newLesson.title}
//                           onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           required
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Content</label>
//                         <textarea
//                           value={newLesson.content}
//                           onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           rows={3}
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                         <input
//                           type="text"
//                           value={newLesson.videoUrl}
//                           onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                         />
//                       </div>
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           type="button"
//                           onClick={() => setIsCreatingLesson(false)}
//                           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                         >
//                           Create
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
                
//                 {/* Direct Lessons List */}
//                 <div className="pl-4 space-y-2">
//                   {selectedCourse.sections
//                     .find(section => section._id === 'direct')?.lessons?.map((lesson: Lesson) => (
//                       <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <h4 className="font-medium">{lesson.title}</h4>
//                             {lesson.videoUrl && (
//                               <p className="text-xs text-gray-500">Has video</p>
//                             )}
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setIsEditing({ type: 'lesson', id: lesson._id });
//                                 setEditData({
//                                   title: lesson.title,
//                                   content: lesson.content,
//                                   videoUrl: lesson.videoUrl
//                                 });
//                               }}
//                               className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteLesson(lesson._id)}
//                               className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
                        
//                         {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
//                           <div className="bg-gray-100 p-4 rounded mt-2">
//                             <form onSubmit={handleEditLesson}>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Title</label>
//                                 <input
//                                   type="text"
//                                   value={editData.title}
//                                   onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   required
//                                 />
//                               </div>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Content</label>
//                                 <textarea
//                                   value={editData.content}
//                                   onChange={(e) => setEditData({...editData, content: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   rows={3}
//                                 />
//                               </div>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                 <input
//                                   type="text"
//                                   value={editData.videoUrl}
//                                   onChange={(e) => setEditData({...editData, videoUrl: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                 />
//                               </div>
//                               <div className="flex justify-end space-x-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setIsEditing(null);
//                                     setEditData({});
//                                   }}
//                                   className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button
//                                   type="submit"
//                                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                 >
//                                   Save
//                                 </button>
//                               </div>
//                             </form>
//                           </div>
//                         )}
//                       </div>
//                     )) || <p className="text-gray-500 text-sm">No direct lessons yet.</p>
//                   }
//                 </div>
//               </div>
              
//               {/* Sections */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium">Sections</h3>
//                   <button
//                     onClick={() => setIsCreatingSection(true)}
//                     className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
//                   >
//                     Add Section
//                   </button>
//                 </div>
                
//                 {isCreatingSection && (
//                   <div className="bg-gray-100 p-4 rounded mb-4">
//                     <h4 className="text-md font-medium mb-2">Create New Section</h4>
//                     <form onSubmit={handleCreateSection}>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Title</label>
//                         <input
//                           type="text"
//                           value={newSection.title}
//                           onChange={(e) => setNewSection({...newSection, title: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           required
//                         />
//                       </div>
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           type="button"
//                           onClick={() => setIsCreatingSection(false)}
//                           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
//                         >
//                           Create
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
                
//                 {/* Sections List */}
//                 <div className="space-y-6">
//                   {selectedCourse.sections
//                     .filter(section => section._id !== 'direct')
//                     .map((section) => {
//                       if (!('_id' in section) || section._id === 'direct') return null;
                      
//                       return (
//                         <div key={section._id} className="border rounded-lg p-4">
//                           <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium">{section.title}</h4>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => {
//                                   setIsEditing({ type: 'section', id: section._id });
//                                   setEditData({
//                                     title: section.title
//                                   });
//                                 }}
//                                 className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteSection(section._id)}
//                                 className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
                          
//                           {isEditing?.type === 'section' && isEditing.id === section._id && (
//                             <div className="bg-gray-100 p-4 rounded mb-3">
//                               <form onSubmit={handleEditSection}>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                                   <input
//                                     type="text"
//                                     value={editData.title}
//                                     onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     required
//                                   />
//                                 </div>
//                                 <div className="flex justify-end space-x-2">
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       setIsEditing(null);
//                                       setEditData({});
//                                     }}
//                                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                   >
//                                     Cancel
//                                   </button>
//                                   <button
//                                     type="submit"
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                   >
//                                     Save
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           )}
                          
//                           {/* Section Actions */}
//                           <div className="flex justify-end mb-2">
//                             <button
//                               onClick={() => {
//                                 setIsCreatingLesson(true);
//                                 setNewLesson({
//                                   ...newLesson,
//                                   sectionId: section._id,
//                                   courseId: selectedCourse._id
//                                 });
//                               }}
//                               className="bg-green-100 hover:bg-green-200 text-green-600 px-2 py-1 rounded text-xs"
//                             >
//                               Add Lesson
//                             </button>
//                           </div>
                          
//                           {isCreatingLesson && newLesson.sectionId === section._id && (
//                             <div className="bg-gray-100 p-4 rounded mb-3">
//                               <h5 className="text-sm font-medium mb-2">Create Lesson in {section.title}</h5>
//                               <form onSubmit={(e) => handleCreateLessonInSection(e, section._id)}>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                                   <input
//                                     type="text"
//                                     value={newLesson.title}
//                                     onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     required
//                                   />
//                                 </div>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Content</label>
//                                   <textarea
//                                     value={newLesson.content}
//                                     onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     rows={3}
//                                   />
//                                 </div>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                   <input
//                                     type="text"
//                                     value={newLesson.videoUrl}
//                                     onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   />
//                                 </div>
//                                 <div className="flex justify-end space-x-2">
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       setIsCreatingLesson(false);
//                                       setNewLesson({ title: '', courseId: '', sectionId: '', content: '', videoUrl: '', order: 0 });
//                                     }}
//                                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                   >
//                                     Cancel
//                                   </button>
//                                   <button
//                                     type="submit"
//                                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-xs"
//                                   >
//                                     Create
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           )}
                          
//                           {/* Section Lessons */}
//                           <div className="pl-4 space-y-2">
//                             {'lessons' in section && section.lessons && section.lessons.length > 0 ? (
//                               section.lessons.map((lesson: Lesson) => (
//                                 <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
//                                   <div className="flex justify-between items-center">
//                                     <div>
//                                       <h5 className="font-medium">{lesson.title}</h5>
//                                       {lesson.videoUrl && (
//                                         <p className="text-xs text-gray-500">Has video</p>
//                                       )}
//                                     </div>
//                                     <div className="flex space-x-2">
//                                       <button
//                                         onClick={() => {
//                                           setIsEditing({ type: 'lesson', id: lesson._id });
//                                           setEditData({
//                                             title: lesson.title,
//                                             content: lesson.content,
//                                             videoUrl: lesson.videoUrl
//                                           });
//                                         }}
//                                         className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                                       >
//                                         Edit
//                                       </button>
//                                       <button
//                                         onClick={() => handleDeleteLesson(lesson._id)}
//                                         className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                                       >
//                                         Delete
//                                       </button>
//                                     </div>
//                                   </div>
                                  
//                                   {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
//                                     <div className="bg-gray-100 p-4 rounded mt-2">
//                                       <form onSubmit={handleEditLesson}>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Title</label>
//                                           <input
//                                             type="text"
//                                             value={editData.title}
//                                             onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                             required
//                                           />
//                                         </div>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Content</label>
//                                           <textarea
//                                             value={editData.content}
//                                             onChange={(e) => setEditData({...editData, content: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                             rows={3}
//                                           />
//                                         </div>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                           <input
//                                             type="text"
//                                             value={editData.videoUrl}
//                                             onChange={(e) => setEditData({...editData, videoUrl: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                           />
//                                         </div>
//                                         <div className="flex justify-end space-x-2">
//                                           <button
//                                             type="button"
//                                             onClick={() => {
//                                               setIsEditing(null);
//                                               setEditData({});
//                                             }}
//                                             className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                           >
//                                             Cancel
//                                           </button>
//                                           <button
//                                             type="submit"
//                                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                           >
//                                             Save
//                                           </button>
//                                         </div>
//                                       </form>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))
//                             ) : (
//                               <p className="text-gray-500 text-sm">No lessons in this section yet.</p>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
                
//                 {selectedCourse.sections.filter(section => section._id !== 'direct').length === 0 && (
//                   <p className="text-gray-500 mt-2">No sections created yet.</p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



























// "use client";

// import { useState, useEffect } from 'react';
// import { useAdminAuth } from './_components/AdminAuthContext';
// import { courseService, Course, CourseDetails, Section, Lesson } from './_components/courseManagementService';

// export default function AdminDashboard() {
//   const { admin } = useAdminAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
//   const [isCreatingCourse, setIsCreatingCourse] = useState(false);
//   const [newCourse, setNewCourse] = useState({ title: '', description: '', coverImage: '' });
//   const [isCreatingSection, setIsCreatingSection] = useState(false);
//   const [newSection, setNewSection] = useState({ title: '', courseId: '', order: 0 });
//   const [isCreatingLesson, setIsCreatingLesson] = useState(false);
//   const [newLesson, setNewLesson] = useState({ 
//     title: '', 
//     courseId: '', 
//     sectionId: '', 
//     content: '', 
//     videoUrl: '',
//   videoThumbnail: '',
//   videoDuration: 0,
//   images: [],
//   resources: [],
//     order: 0 
//   });
//   const [isEditing, setIsEditing] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(null);
//   const [editData, setEditData] = useState<any>({});

// // Add these new state variables at the top with your other state declarations
// const [isCreatingDirectLesson, setIsCreatingDirectLesson] = useState(false);
// const [isCreatingSectionLesson, setIsCreatingSectionLesson] = useState<string | null>(null);



//   // Fetch all courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const data = await courseService.getAllCourses();
//       setCourses(data);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectCourse = async (courseId: string) => {
//     try {
//       setLoading(true);
//       const courseDetails = await courseService.getCourseDetails(courseId);
//       setSelectedCourse(courseDetails);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch course details');
//     } finally {
//       setLoading(false);
// //       setIsEditing(null);
// // setEditData({});
//     }
//   };

//   const handleCreateCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await courseService.createCourse(newCourse);
//       setNewCourse({ title: '', description: '', coverImage: '' });
//       setIsCreatingCourse(false);
//       fetchCourses();
//     } catch (err: any) {
//       setError(err.message || 'Failed to create course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateSection = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       await courseService.createSection(selectedCourse._id, {
//         ...newSection,
//         courseId: selectedCourse._id,
//         order: selectedCourse.sections.length + 1
//       });
//       setNewSection({ title: '', courseId: '', order: 0 });
//       setIsCreatingSection(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLessonInCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       // Count direct lessons (lessons without a section)
//       const directLessons = selectedCourse.sections.find(s => s._id === 'direct')?.lessons || [];
      
//       await courseService.createLessonInCourse(selectedCourse._id, {
//         ...newLesson,
//         courseId: selectedCourse._id,
//         order: directLessons.length + 1
//       });
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
//         order: 0,
      
//       });
//       setIsCreatingLesson(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLessonInSection = async (e: React.FormEvent, sectionId: string) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       // Find the section and count its lessons
//       const section = selectedCourse.sections.find(s => s._id === sectionId);
//       const lessonCount = section && 'lessons' in section ? section.lessons?.length || 0 : 0;
      
//       await courseService.createLessonInSection(sectionId, {
//         ...newLesson,
//         courseId: selectedCourse._id,
//         sectionId: sectionId,
//         order: lessonCount + 1
//       });
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
//         order: 0,
//       });
//       setIsCreatingLesson(false);
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to create lesson in section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateCourse(selectedCourse._id, editData);
//       setIsEditing(null);
//       setEditData({});
//       handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSection = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isEditing) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateSection(isEditing.id, editData);
//       setIsEditing(null);
//       setEditData({});
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditLesson = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isEditing) return;
    
//     try {
//       setLoading(true);
//       await courseService.updateLesson(isEditing.id, editData);
//       setIsEditing(null);
//       setEditData({});
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteCourse(courseId);
//       setSelectedCourse(null);
//       fetchCourses();
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSection = async (sectionId: string) => {
//     if (!window.confirm('Are you sure you want to delete this section and all its lessons?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteSection(sectionId);
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete section');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteLesson = async (lessonId: string) => {
//     if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
//     try {
//       setLoading(true);
//       await courseService.deleteLesson(lessonId);
//       if (selectedCourse) handleSelectCourse(selectedCourse._id);
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render course list or course details
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {loading && <p className="text-gray-600">Loading...</p>}
      
//       {!selectedCourse ? (
//         // Course list view
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Courses</h2>
//             <button
//               onClick={() => setIsCreatingCourse(true)}
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//             >
//               Add Course
//             </button>
//           </div>
          
//           {isCreatingCourse && (
//             <div className="bg-gray-100 p-4 rounded mb-4">
//               <h3 className="text-lg font-medium mb-2">Create New Course</h3>
//               <form onSubmit={handleCreateCourse}>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     value={newCourse.title}
//                     onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     value={newCourse.description}
//                     onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
//                   <input
//                     type="text"
//                     value={newCourse.coverImage}
//                     onChange={(e) => setNewCourse({...newCourse, coverImage: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsCreatingCourse(false)}
//                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                   >
//                     Create
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {courses.length === 0 && !loading ? (
//             <p className="text-gray-500">No courses found. Create one to get started.</p>
//           ) : (
//             <div className="space-y-4">
//               {courses.map((course) => (
//                 <div key={course._id} className="border p-4 rounded-lg hover:bg-gray-50">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-500">{course.description}</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleSelectCourse(course._id)}
//                         className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCourse(course._id)}
//                         className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         // Course details view
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">
//               {isEditing?.type === 'course' ? 'Edit Course' : selectedCourse.title}
//             </h2>
//             <div className="flex space-x-2">
//               {isEditing?.type !== 'course' && (
//                 <button
//                   onClick={() => {
//                     setIsEditing({ type: 'course', id: selectedCourse._id });
//                     setEditData({
//                       title: selectedCourse.title,
//                       description: selectedCourse.description,
//                       coverImage: selectedCourse.coverImage
//                     });
//                   }}
//                   className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
//                 >
//                   Edit Course
//                 </button>
//               )}
//               <button
//                 onClick={() => setSelectedCourse(null)}
//                 className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//               >
//                 Back to List
//               </button>
//             </div>
//           </div>
          
//           {isEditing?.type === 'course' && (
//             <div className="bg-gray-100 p-4 rounded mb-6">
//               <form onSubmit={handleEditCourse}>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     value={editData.title}
//                     onChange={(e) => setEditData({...editData, title: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     value={editData.description}
//                     onChange={(e) => setEditData({...editData, description: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
//                   <input
//                     type="text"
//                     value={editData.coverImage}
//                     onChange={(e) => setEditData({...editData, coverImage: e.target.value})}
//                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(null);
//                       setEditData({});
//                     }}
//                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {!isEditing?.type && (
//             <>
//               <div className="mb-4">
//                 <p className="text-gray-600">{selectedCourse.description}</p>
//                 {selectedCourse.coverImage && (
//                   <div className="mt-2">
//                     <img 
//                       src={selectedCourse.coverImage} 
//                       alt={selectedCourse.title} 
//                       className="h-40 object-cover rounded"
//                     />
//                   </div>
//                 )}
//               </div>
              
//               {/* Direct Lessons Section */}
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium">Direct Lessons</h3>
//                   <button
//   onClick={() => setIsCreatingDirectLesson(true)}
//   className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
// >
//   Add Lesson
// </button>
//                 </div>
                
//                 {isCreatingDirectLesson && (
//                   <div className="bg-gray-100 p-4 rounded mb-4">
//                     <h4 className="text-md font-medium mb-2">Create New Lesson</h4>
//                     <form onSubmit={handleCreateLessonInCourse}>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Title</label>
//                         <input
//                           type="text"
//                           value={newLesson.title}
//                           onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           required
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Content</label>
//                         <textarea
//                           value={newLesson.content}
//                           onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           rows={3}
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                         <input
//                           type="text"
//                           value={newLesson.videoUrl}
//                           onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                         />
//                       </div>
//                       <div className="mb-3">


//   <label className="block text-sm font-medium text-gray-700">Image URL</label>
//   <input
//     type="text"
//     value={newLesson.images[0]?.url || ''}
//     onChange={(e) => setNewLesson({...newLesson, images: [{url: e.target.value, caption: '', altText: ''}]})}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Resource Title</label>
//   <input
//     type="text"
//     value={newLesson.resources[0]?.title || ''}
//     onChange={(e) => {
//       const resources = [...(newLesson.resources || [])];
//       if (resources.length === 0) {
//         resources.push({title: e.target.value, fileUrl: '', fileType: 'pdf'});
//       } else {
//         resources[0] = {...resources[0], title: e.target.value};
//       }
//       setNewLesson({...newLesson, resources});
//     }}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Resource URL</label>
//   <input
//     type="text"
//     value={newLesson.resources[0]?.fileUrl || ''}
//     onChange={(e) => {
//       const resources = [...(newLesson.resources || [])];
//       if (resources.length === 0) {
//         resources.push({title: 'Resource', fileUrl: e.target.value, fileType: 'pdf'});
//       } else {
//         resources[0] = {...resources[0], fileUrl: e.target.value};
//       }
//       setNewLesson({...newLesson, resources});
//     }}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Order</label>
//   <input
//     type="number"
//     value={newLesson.order}
//     onChange={(e) => setNewLesson({...newLesson, order: parseInt(e.target.value) || 0})}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
//                       <div className="flex justify-end space-x-2">
//                       <button
//           type="button"
//           onClick={() => setIsCreatingDirectLesson(false)}
//           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//         >
//           Cancel
//         </button>
//                         <button
//                           type="submit"
//                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                         >
//                           Create
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
                
//                 {/* Direct Lessons List */}
//                 <div className="pl-4 space-y-2">
//                   {selectedCourse.sections
//                     .find(section => section._id === 'direct')?.lessons?.map((lesson: Lesson) => (
//                       <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <h4 className="font-medium">{lesson.title}</h4>
//                             {lesson.videoUrl && (
//                               <p className="text-xs text-gray-500">Has video</p>
//                             )}
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setIsEditing({ type: 'lesson', id: lesson._id });
//                                 setEditData({
//                                   title: lesson.title,
//                                   content: lesson.content,
//                                   videoUrl: lesson.videoUrl
//                                 });
//                               }}
//                               className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteLesson(lesson._id)}
//                               className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
                        
//                         {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
//                           <div className="bg-gray-100 p-4 rounded mt-2">
//                             <form onSubmit={handleEditLesson}>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Title</label>
//                                 <input
//                                   type="text"
//                                   value={editData.title}
//                                   onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   required
//                                 />
//                               </div>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Content</label>
//                                 <textarea
//                                   value={editData.content}
//                                   onChange={(e) => setEditData({...editData, content: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   rows={3}
//                                 />
//                               </div>
//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                 <input
//                                   type="text"
//                                   value={editData.videoUrl}
//                                   onChange={(e) => setEditData({...editData, videoUrl: e.target.value})}
//                                   className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                 />
//                               </div>
//                               <div className="flex justify-end space-x-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setIsEditing(null);
//                                     setEditData({});
//                                   }}
//                                   className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button
//                                   type="submit"
//                                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                 >
//                                   Save
//                                 </button>
//                               </div>
//                             </form>
//                           </div>
//                         )}
//                       </div>
//                     )) || <p className="text-gray-500 text-sm">No direct lessons yet.</p>
//                   }
//                 </div>
//               </div>
              
//               {/* Sections */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium">Sections</h3>
//                   <button
//                     onClick={() => setIsCreatingSection(true)}
//                     className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
//                   >
//                     Add Section
//                   </button>
//                 </div>
                
//                 {isCreatingSection && (
//                   <div className="bg-gray-100 p-4 rounded mb-4">
//                     <h4 className="text-md font-medium mb-2">Create New Section</h4>
//                     <form onSubmit={handleCreateSection}>
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700">Title</label>
//                         <input
//                           type="text"
//                           value={newSection.title}
//                           onChange={(e) => setNewSection({...newSection, title: e.target.value})}
//                           className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                           required
//                         />
//                       </div>
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           type="button"
//                           onClick={() => setIsCreatingSection(false)}
//                           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
//                         >
//                           Create
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
                
//                 {/* Sections List */}
//                 <div className="space-y-6">
//                   {selectedCourse.sections
//                     .filter(section => section._id !== 'direct')
//                     .map((section) => {
//                       if (!('_id' in section) || section._id === 'direct') return null;
                      
//                       return (
//                         <div key={section._id} className="border rounded-lg p-4">
//                           <div className="flex justify-between items-center mb-3">
//                             <h4 className="font-medium">{section.title}</h4>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => {
//                                   setIsEditing({ type: 'section', id: section._id });
//                                   setEditData({
//                                     title: section.title
//                                   });
//                                 }}
//                                 className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteSection(section._id)}
//                                 className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
                          
//                           {isEditing?.type === 'section' && isEditing.id === section._id && (
//                             <div className="bg-gray-100 p-4 rounded mb-3">
//                               <form onSubmit={handleEditSection}>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                                   <input
//                                     type="text"
//                                     value={editData.title}
//                                     onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     required
//                                   />
//                                 </div>
//                                 <div className="flex justify-end space-x-2">
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       setIsEditing(null);
//                                       setEditData({});
//                                     }}
//                                     className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                   >
//                                     Cancel
//                                   </button>
//                                   <button
//                                     type="submit"
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                   >
//                                     Save
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           )}
                          
//                           {/* Section Actions */}
//                           <div className="flex justify-end mb-2">
//                           <button
//   onClick={() => {
//     setIsCreatingSectionLesson(section._id);
//     setNewLesson({
//       ...newLesson,
//       sectionId: section._id,
//       courseId: selectedCourse._id
//     });
//   }}
//   className="bg-green-100 hover:bg-green-200 text-green-600 px-2 py-1 rounded text-xs"
// >
//   Add Lesson
// </button>
//                           </div>
                          
//                           {isCreatingSectionLesson === section._id && (
//   <div className="bg-gray-100 p-4 rounded mb-3">
//     <h5 className="text-sm font-medium mb-2">Create Lesson in {section.title}</h5>
//     <form onSubmit={(e) => handleCreateLessonInSection(e, section._id)}>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                                   <input
//                                     type="text"
//                                     value={newLesson.title}
//                                     onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     required
//                                   />
//                                 </div>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Content</label>
//                                   <textarea
//                                     value={newLesson.content}
//                                     onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                     rows={3}
//                                   />
//                                 </div>
//                                 <div className="mb-3">
//                                   <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                   <input
//                                     type="text"
//                                     value={newLesson.videoUrl}
//                                     onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
//                                     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                   />
//                                 </div>
//                                 <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Image URL</label>
//   <input
//     type="text"
//     value={newLesson.images[0]?.url || ''}
//     onChange={(e) => setNewLesson({...newLesson, images: [{url: e.target.value, caption: '', altText: ''}]})}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Resource Title</label>
//   <input
//     type="text"
//     value={newLesson.resources[0]?.title || ''}
//     onChange={(e) => {
//       const resources = [...(newLesson.resources || [])];
//       if (resources.length === 0) {
//         resources.push({title: e.target.value, fileUrl: '', fileType: 'pdf'});
//       } else {
//         resources[0] = {...resources[0], title: e.target.value};
//       }
//       setNewLesson({...newLesson, resources});
//     }}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Resource URL</label>
//   <input
//     type="text"
//     value={newLesson.resources[0]?.fileUrl || ''}
//     onChange={(e) => {
//       const resources = [...(newLesson.resources || [])];
//       if (resources.length === 0) {
//         resources.push({title: 'Resource', fileUrl: e.target.value, fileType: 'pdf'});
//       } else {
//         resources[0] = {...resources[0], fileUrl: e.target.value};
//       }
//       setNewLesson({...newLesson, resources});
//     }}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
// <div className="mb-3">
//   <label className="block text-sm font-medium text-gray-700">Order</label>
//   <input
//     type="number"
//     value={newLesson.order}
//     onChange={(e) => setNewLesson({...newLesson, order: parseInt(e.target.value) || 0})}
//     className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//   />
// </div>
//                                 <div className="flex justify-end space-x-2">
//                                 <button
//           type="button"
//           onClick={() => {
//             setIsCreatingSectionLesson(null);
//             setNewLesson({ 
//               title: '', 
//               courseId: '', 
//               sectionId: '', 
//               content: '', 
//               videoUrl: '',
//               videoThumbnail: '',
//               videoDuration: 0,
//               images: [],
//               resources: [],
//               order: 0,
              
//             });
//           }}
//           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//         >
//           Cancel
//         </button>
//                                   <button
//                                     type="submit"
//                                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-xs"
//                                   >
//                                     Create
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           )}
                          
//                           {/* Section Lessons */}
//                           <div className="pl-4 space-y-2">
//                             {'lessons' in section && section.lessons && section.lessons.length > 0 ? (
//                               section.lessons.map((lesson: Lesson) => (
//                                 <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
//                                   <div className="flex justify-between items-center">
//                                     <div>
//                                       <h5 className="font-medium">{lesson.title}</h5>
//                                       {lesson.videoUrl && (
//                                         <p className="text-xs text-gray-500">Has video</p>
//                                       )}
//                                     </div>
//                                     <div className="flex space-x-2">
//                                       <button
//                                         onClick={() => {
//                                           console.log('Editing lesson:', lesson._id); 
//                                           setIsEditing({ type: 'lesson', id: lesson._id });
//                                           setEditData({
//                                             title: lesson.title,
//                                             content: lesson.content,
//                                             videoUrl: lesson.videoUrl
//                                           });
//                                         }}
//                                         className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
//                                       >
//                                         Edit
//                                       </button>
//                                       <button
//                                         onClick={() => handleDeleteLesson(lesson._id)}
//                                         className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
//                                       >
//                                         Delete
//                                       </button>
//                                     </div>
//                                   </div>
                                  
//                                   {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
//                                     <div className="bg-gray-100 p-4 rounded mt-2">
//                                       {console.log(`Editing lessonlk: ${lesson._id} Setting isEditing to:  lesson id: ${lesson._id}` )}
//                                       <form onSubmit={handleEditLesson}>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Title</label>
//                                           <input
//                                             type="text"
//                                             value={editData.title}
//                                             onChange={(e) => setEditData({...editData, title: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                             required
//                                           />
//                                         </div>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Content</label>
//                                           <textarea
//                                             value={editData.content}
//                                             onChange={(e) => setEditData({...editData, content: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                             rows={3}
//                                           />
//                                         </div>
//                                         <div className="mb-3">
//                                           <label className="block text-sm font-medium text-gray-700">Video URL</label>
//                                           <input
//                                             type="text"
//                                             value={editData.videoUrl}
//                                             onChange={(e) => setEditData({...editData, videoUrl: e.target.value})}
//                                             className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
//                                           />
//                                         </div>
//                                         <div className="flex justify-end space-x-2">
//                                           <button
//                                             type="button"
//                                             onClick={() => {
//                                               setIsEditing(null);
//                                               setEditData({});
//                                             }}
//                                             className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                           >
//                                             Cancel
//                                           </button>
//                                           <button
//                                             type="submit"
//                                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
//                                           >
//                                             Save
//                                           </button>
//                                         </div>
//                                       </form>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))
//                             ) : (
//                               <p className="text-gray-500 text-sm">No lessons in this section yet.</p>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
                
//                 {selectedCourse.sections.filter(section => section._id !== 'direct').length === 0 && (
//                   <p className="text-gray-500 mt-2">No sections created yet.</p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }










// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAdminAuth } from './_components/AdminAuthContext';
import { courseService, Course, CourseDetails } from './_components/courseManagementService';
import CourseList from './(components)/CourseList';
import CourseDetailView from './(components)/CourseDetailView';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);

  // Fetch all courses on component mount
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
      setError(err.message || 'Failed to fetch courses');
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
      setError(err.message || 'Failed to fetch course details');
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