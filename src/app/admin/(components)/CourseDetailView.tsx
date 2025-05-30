// import { useState } from 'react';
// import { CourseDetails, courseService } from '../_components/courseManagementService';
// import DirectLessonsSection from './DirectLessonsSection';
// import SectionsList from './SectionList';
// import {CourseForm} from './Forms';

// interface CourseDetailViewProps {
//   selectedCourse: CourseDetails;
//   setSelectedCourse: (course: CourseDetails | null) => void;
//   fetchCourses: () => Promise<void>;
//   handleSelectCourse: (courseId: string) => Promise<void>;
// }

// export default function CourseDetailView({
//   selectedCourse,
//   setSelectedCourse,
//   fetchCourses,
//   handleSelectCourse
// }: CourseDetailViewProps) {
//   const [isEditing, setIsEditing] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(null);
//   const [editData, setEditData] = useState<any>({});

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">
//           {isEditing?.type === 'course' ? 'Edit Course' : selectedCourse.title}
//         </h2>
//         <div className="flex space-x-2">
//           {isEditing?.type !== 'course' && (
//             <button
//               onClick={() => {
//                 setIsEditing({ type: 'course', id: selectedCourse._id });
//                 setEditData({
//                   title: selectedCourse.title,
//                   description: selectedCourse.description,
//                   coverImage: selectedCourse.coverImage
//                 });
//               }}
//               className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
//             >
//               Edit Course
//             </button>
//           )}
//           <button
//             onClick={() => setSelectedCourse(null)}
//             className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>
      


//       {isEditing?.type === 'course' ? (
//         <CourseForm
//           type="course"
//           data={editData}
//           setData={setEditData}
//           onSubmit={async (e) => {
//             e.preventDefault();
//             try {
//                await courseService.updateCourse(selectedCourse._id, editData);
//               //if (!response.ok) throw new Error('Failed to update course');
//               setIsEditing(null);
//               setEditData({});
//               handleSelectCourse(selectedCourse._id);
//             } catch (err: any) {
//               console.error(err.message);
//             }
//           }}
//           onCancel={() => {
//             setIsEditing(null);
//             setEditData({});
//           }}
//         />
//       ) : (
//         <>
//           <div className="mb-4">
//             <p className="text-gray-600">{selectedCourse.description}</p>
//             {selectedCourse.coverImage && (
//               <div className="mt-2">
//                 <img 
//                   src={selectedCourse.coverImage} 
//                   alt={selectedCourse.title} 
//                   className="h-40 object-cover rounded"
//                 />
//               </div>
//             )}
//           </div>
          
//           <DirectLessonsSection 
//             selectedCourse={selectedCourse}
//             handleSelectCourse={handleSelectCourse}
//           />
          
//           <SectionsList 
//             selectedCourse={selectedCourse}
//             handleSelectCourse={handleSelectCourse}
//           />
//         </>
//       )}
//     </div>
//   );
// }
















// import { useState } from 'react';
// import { CourseDetails, courseService } from '../_components/courseManagementService';
// import DirectLessonsSection from './DirectLessonsSection';
// import SectionsList from './SectionList';
// import { CourseForm } from './Forms';

// interface CourseDetailViewProps {
//   selectedCourse: CourseDetails;
//   setSelectedCourse: (course: CourseDetails | null) => void;
//   fetchCourses: () => Promise<void>;
//   handleSelectCourse: (courseId: string) => Promise<void>;
// }

// export default function CourseDetailView({
//   selectedCourse,
//   setSelectedCourse,
//   fetchCourses,
//   handleSelectCourse
// }: CourseDetailViewProps) {
//   const [isEditing, setIsEditing] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(null);
//   const [editData, setEditData] = useState<any>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">
//           {isEditing?.type === 'course' ? 'Edit Course' : selectedCourse.title}
//         </h2>
//         <div className="flex space-x-2">
//           {isEditing?.type !== 'course' && (
//             <button
//               onClick={() => {
//                 setIsEditing({ type: 'course', id: selectedCourse._id });
//                 setEditData({
//                   title: selectedCourse.title,
//                   description: selectedCourse.description,
//                   coverImage: selectedCourse.coverImage
//                 });
//               }}
//               className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
//             >
//               Edit Course
//             </button>
//           )}
//           <button
//             onClick={() => setSelectedCourse(null)}
//             className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>
      
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

//       {isEditing?.type === 'course' ? (
//         <CourseForm
//           type="course"
//           data={editData}
//           setData={setEditData}
//           onSubmit={async (e) => {
//             e.preventDefault();
//             if (isSubmitting) return;
            
//             try {
//               setIsSubmitting(true);
//               setError(null);
              
//               // Extract the file from the data if it exists
//               const { coverImageFile, ...courseData } = editData;
              
//               await courseService.updateCourse(selectedCourse._id, courseData, coverImageFile);
//               setIsEditing(null);
//               setEditData({});
//               handleSelectCourse(selectedCourse._id);
//             } catch (err: any) {
//               setError(err.message || 'Failed to update course');
//               console.error(err.message);
//             } finally {
//               setIsSubmitting(false);
//             }
//           }}
//           onCancel={() => {
//             setIsEditing(null);
//             setEditData({});
//           }}
//           isLoading={isSubmitting}
//         />
//       ) : (
//         <>
//           <div className="mb-4">
//             <p className="text-gray-600">{selectedCourse.description}</p>
//             {selectedCourse.coverImage && (
//               <div className="mt-2">
//                 <img 
//                   src={selectedCourse.coverImage} 
//                   alt={selectedCourse.title} 
//                   className="h-40 object-cover rounded"
//                 />
//               </div>
//             )}
//           </div>
          
//           <DirectLessonsSection 
//             selectedCourse={selectedCourse}
//             handleSelectCourse={handleSelectCourse}
//           />
          
//           <SectionsList 
//             selectedCourse={selectedCourse}
//             handleSelectCourse={handleSelectCourse}
//           />
//         </>
//       )}
//     </div>
//   );
// }















import { useState } from 'react';
import { CourseDetails, courseService } from '../_components/courseManagementService';
import DirectLessonsSection from './DirectLessonsSection';
import SectionsList from './SectionList';
import { CourseForm } from './Forms';

interface CourseDetailViewProps {
  selectedCourse: CourseDetails;
  setSelectedCourse: (course: CourseDetails | null) => void;
  fetchCourses: () => Promise<void>;
  handleSelectCourse: (courseId: string) => Promise<void>;
}

export default function CourseDetailView({
  selectedCourse,
  setSelectedCourse,
  fetchCourses,
  handleSelectCourse
}: CourseDetailViewProps) {
  const [isEditing, setIsEditing] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {selectedCourse.order !== undefined && (
            <span className="inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded-full h-6 w-6 text-xs font-medium mr-2">
              {selectedCourse.order}
            </span>
          )}
          <h2 className="text-xl font-semibold">
            {isEditing?.type === 'course' ? 'Edit Course' : selectedCourse.title}
          </h2>
        </div>
        <div className="flex space-x-2">
          {isEditing?.type !== 'course' && (
            <button
              onClick={() => {
                setIsEditing({ type: 'course', id: selectedCourse._id });
                setEditData({
                  title: selectedCourse.title,
                  description: selectedCourse.description,
                  coverImage: selectedCourse.coverImage,
                  order: selectedCourse.order || 0
                });
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
            >
              Edit Course
            </button>
          )}
          <button
            onClick={() => setSelectedCourse(null)}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
          >
            Back to List
          </button>
        </div>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {isEditing?.type === 'course' ? (
        <CourseForm
          type="course"
          data={editData}
          setData={setEditData}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            
            try {
              setIsSubmitting(true);
              setError(null);
              
              // Extract the file from the data if it exists
              const { coverImageFile, ...courseData } = editData;
              
              await courseService.updateCourse(selectedCourse._id, courseData, coverImageFile);
              setIsEditing(null);
              setEditData({});
              handleSelectCourse(selectedCourse._id);
            } catch (err: any) {
              setError(err.message || 'Failed to update course');
              console.error(err.message);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => {
            setIsEditing(null);
            setEditData({});
          }}
          isLoading={isSubmitting}
        />
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">{selectedCourse.description}</p>
            {selectedCourse.coverImage && (
              <div className="mt-2">
                <img 
                  src={selectedCourse.coverImage} 
                  alt={selectedCourse.title} 
                  className="h-40 object-cover rounded"
                />
              </div>
            )}
          </div>
          
          <DirectLessonsSection 
            selectedCourse={selectedCourse}
            handleSelectCourse={handleSelectCourse}
          />
          
          <SectionsList 
            selectedCourse={selectedCourse}
            handleSelectCourse={handleSelectCourse}
          />
        </>
      )}
    </div>
  );
}