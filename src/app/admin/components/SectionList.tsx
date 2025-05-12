import { useState } from 'react';
import { CourseDetails,courseService } from '../_components/courseManagementService';
import {SectionForm} from './Forms';
import {LessonForm} from './Forms';

interface SectionsListProps {
  selectedCourse: CourseDetails;
  handleSelectCourse: (courseId: string) => Promise<void>;
}

export default function SectionsList({ selectedCourse, handleSelectCourse }: SectionsListProps) {
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [isEditing, setIsEditing] = useState<{ type: 'section' | 'lesson', id: string } | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newSection, setNewSection] = useState({ title: '', courseId: '', order: 0 });
  const [isCreatingSectionLesson, setIsCreatingSectionLesson] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({ 
    title: '', 
    courseId: '', 
    sectionId: '', 
    content: '', 
    videoUrl: '',
    videoThumbnail: '',
    videoDuration: 0,
    images: [],
    resources: [],
    order: 0 
  });

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.createSection(selectedCourse._id, {
         ...newSection,
         courseId: selectedCourse._id,
        order: selectedCourse.sections.length + 1
       });
     // if (!response.ok) throw new Error('Failed to create section');
      setNewSection({ title: '', courseId: '', order: 0 });
      setIsCreatingSection(false);
      handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section and all its lessons?')) return;
    try {
     await courseService.deleteSection(sectionId);
     // if (!response.ok) throw new Error('Failed to delete section');
      handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCreateLessonInSection = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    try {
      const section = selectedCourse.sections.find(s => s._id === sectionId);
      const lessonCount = section && 'lessons' in section ? section.lessons?.length || 0 : 0;
      
      // const response = await fetch(`/api/sections/${sectionId}/lessons`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...newLesson,
      //     courseId: selectedCourse._id,
      //     sectionId: sectionId,
      //     order: lessonCount + 1
      //   }),
      // });
 await courseService.createLessonInSection(sectionId, {
         ...newLesson,
         courseId: selectedCourse._id,
         sectionId: sectionId,
         order: lessonCount + 1
       });



     // if (!response.ok) throw new Error('Failed to create lesson in section');
      setNewLesson({ 
        title: '', 
        courseId: '', 
        sectionId: '', 
        content: '', 
        videoUrl: '',
        videoThumbnail: '',
        videoDuration: 0,
        images: [],
        resources: [],
        order: 0,
      });
      setIsCreatingSectionLesson(null);
      handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await courseService.deleteLesson(lessonId)
      //if (!response.ok) throw new Error('Failed to delete lesson');
      handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Sections</h3>
        <button
          onClick={() => setIsCreatingSection(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
        >
          Add Section
        </button>
      </div>
      
      {isCreatingSection && (
        <SectionForm
          data={newSection}
          setData={setNewSection}
          onSubmit={handleCreateSection}
          onCancel={() => setIsCreatingSection(false)}
        />
      )}
      
      <div className="space-y-6">
        {selectedCourse.sections
          .filter(section => section._id !== 'direct')
          .map((section) => {
            if (!('_id' in section)) return null;
            
            return (
              <div key={section._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{section.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing({ type: 'section', id: section._id });
                        setEditData({
                          title: section.title
                        });
                      }}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {isEditing?.type === 'section' && isEditing.id === section._id && (
                  <SectionForm
                    data={editData}
                    setData={setEditData}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await courseService.updateSection(isEditing.id, editData);
                        //if (!response.ok) throw new Error('Failed to update section');
                        setIsEditing(null);
                        setEditData({});
                        handleSelectCourse(selectedCourse._id);
                      } catch (err: any) {
                        console.error(err.message);
                      }
                    }}
                    onCancel={() => {
                      setIsEditing(null);
                      setEditData({});
                    }}
                  />
                )}
                
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => {
                      setIsCreatingSectionLesson(section._id);
                      setNewLesson({
                        ...newLesson,
                        sectionId: section._id,
                        courseId: selectedCourse._id
                      });
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-600 px-2 py-1 rounded text-xs"
                  >
                    Add Lesson
                  </button>
                </div>
                
                {isCreatingSectionLesson === section._id && (
                  <LessonForm
                    data={newLesson}
                    setData={setNewLesson}
                    onSubmit={(e) => handleCreateLessonInSection(e, section._id)}
                    onCancel={() => {
                      setIsCreatingSectionLesson(null);
                      setNewLesson({ 
                        title: '', 
                        courseId: '', 
                        sectionId: '', 
                        content: '', 
                        videoUrl: '',
                        videoThumbnail: '',
                        videoDuration: 0,
                        images: [],
                        resources: [],
                        order: 0,
                      });
                    }}
                  />
                )}
                
                <div className="pl-4 space-y-2">
                  {'lessons' in section && section.lessons && section.lessons.length > 0 ? (
                    section.lessons.map((lesson) => (
                      <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{lesson.title}</h5>
                            {lesson.videoUrl && (
                              <p className="text-xs text-gray-500">Has video</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                          <button
  onClick={() => {
    setIsEditing({ type: 'lesson', id: lesson._id });
    setEditData({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      images: lesson.images || [],
      resources: lesson.resources || [],
      order: lesson.order
    });
  }}
  className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
>
  Edit
</button>
                            <button
                              onClick={() => handleDeleteLesson(lesson._id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {isEditing?.type === 'lesson' && isEditing.id === lesson._id && (
                          <LessonForm
                            data={editData}
                            setData={setEditData}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              try {
                                await courseService.updateLesson(isEditing.id, editData);
                               // if (!response.ok) throw new Error('Failed to update lesson');
                                setIsEditing(null);
                                setEditData({});
                                handleSelectCourse(selectedCourse._id);
                              } catch (err: any) {
                                console.error(err.message);
                              }
                            }}
                            onCancel={() => {
                              setIsEditing(null);
                              setEditData({});
                            }}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No lessons in this section yet.</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      
      {selectedCourse.sections.filter(section => section._id !== 'direct').length === 0 && (
        <p className="text-gray-500 mt-2">No sections created yet.</p>
      )}
    </div>
  );
}