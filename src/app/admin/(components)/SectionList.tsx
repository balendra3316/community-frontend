
import { useState } from 'react';
import { CourseDetails,courseService, Section } from '../_components/courseManagementService';
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
  const [isLoading, setIsLoading] = useState(false);
  const [newSection, setNewSection] = useState({ 
    title: '', 
    courseId: '', 
    order: selectedCourse.sections.length + 1 
  });
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
    urls: [], // Added urls field
    order: 0 
  });

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await courseService.createSection(selectedCourse._id, {
         ...newSection,
         courseId: selectedCourse._id
       });
      setNewSection({ title: '', courseId: '', order: selectedCourse.sections.length + 1 });
      setIsCreatingSection(false);
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      alert(`Failed to create section: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section and all its lessons?')) return;
    setIsLoading(true);
    try {
     await courseService.deleteSection(sectionId);
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      alert(`Failed to delete section: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLessonInSection = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const section = selectedCourse.sections.find(s => s._id === sectionId);
      const lessonCount = section && 'lessons' in section ? section.lessons?.length || 0 : 0;
      
      await courseService.createLessonInSection(sectionId, {
         ...newLesson,
         courseId: selectedCourse._id,
         sectionId: sectionId,
         order: lessonCount + 1
       });

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
        urls: [], // Reset urls field
        order: 0,
      });
      setIsCreatingSectionLesson(null);
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      alert(`Failed to create lesson: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    setIsLoading(true);
    try {
      await courseService.deleteLesson(lessonId)
      await handleSelectCourse(selectedCourse._id);
    } catch (err: any) {
      alert(`Failed to delete lesson: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedSections  = [...selectedCourse.sections]
    .filter(section => section._id !== 'direct')
    .sort((a, b) => (('order' in a ? a.order : 0) || 0) - (('order' in b ? b.order : 0) || 0))

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Sections</h3>
        <button
          onClick={() => setIsCreatingSection(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
          disabled={isLoading}
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
          isLoading={isLoading}
        />
      )}
      
      <div className="space-y-6">
        {sortedSections.map((section) => {
          if (!('_id' in section)) return null;
          
          return (
            <div key={section._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                    {('order' in section ? section.order : 0) || 0}
                  </span>
                  <h4 className="font-medium">{section.title}</h4>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing({ type: 'section', id: section._id });
                      setEditData({
                        title: section.title,
                        order: ('order' in section ? section.order : 0) || 0
                      });
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                    disabled={isLoading}
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
                    setIsLoading(true);
                    try {
                      await courseService.updateSection(isEditing.id, editData);
                      setIsEditing(null);
                      setEditData({});
                      await handleSelectCourse(selectedCourse._id);
                    } catch (err: any) {
                      alert(`Failed to update section: ${err.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onCancel={() => {
                    setIsEditing(null);
                    setEditData({});
                  }}
                  isLoading={isLoading}
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
                  disabled={isLoading}
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
                      urls: [], // Reset urls field
                      order: 0,
                    });
                  }}
                />
              )}
              
              <div className="pl-4 space-y-2">
                {'lessons' in section && section.lessons && section.lessons.length > 0 ? (
                  [...(section.lessons || [])]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((lesson) => (
                      <div key={lesson._id} className="border-l-2 border-gray-200 pl-4 py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                              {lesson.order + 1}
                            </span>
                            <div>
                              <h5 className="font-medium">{lesson.title}</h5>
                              <div className="flex space-x-2 text-xs text-gray-500">
                                {lesson.videoUrl && <span>📺 Video</span>}
                                {lesson.images?.length > 0 && <span>🖼️ {lesson.images.length} image(s)</span>}
                                {lesson.resources?.length > 0 && <span>📄 {lesson.resources.length} resource(s)</span>}
                                {lesson.urls && lesson.urls.length > 0 && <span>🔗 {lesson.urls.length} link(s)</span>}
                              </div>
                            </div>
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
                                  urls: lesson.urls || [], // ✅ Fixed: Added urls field
                                  order: lesson.order
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
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setIsLoading(true);
                              try {
                                await courseService.updateLesson(isEditing.id, editData);
                                setIsEditing(null);
                                setEditData({});
                                await handleSelectCourse(selectedCourse._id);
                              } catch (err: any) {
                                alert(`Failed to update lesson: ${err.message}`);
                              } finally {
                                setIsLoading(false);
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
    </div>
  )
}