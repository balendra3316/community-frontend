//  //src/app/classroom/[courseId]/page.tsx

"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "../../../components/Navbar";
import { CourseService } from "../../../services/courseService";
import { CourseDetail, Lesson } from "../../../types/course.types";
import { Menu, X } from "lucide-react";

// Lazy load heavy components
const CourseSidebar = lazy(() => import("../_components/CourseSidebar"));
const LessonContent = lazy(() => import("../_components/LessonContent"));

// Component fallback for lazy loading
const ComponentFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSectionId, setCurrentSectionId] = useState<string>("");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);

  // Memoized resize handler to prevent recreation on every render
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, []);

  // Viewport size effect with optimized cleanup
  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Memoized course fetching function
  const fetchCourseDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CourseService.getCourseById(courseId);
      if (data) {
        setCourse(data);

        // Set completed lessons
        if (data.progress?.completedLessons) {
          setCompletedLessons(data.progress.completedLessons);
          setProgress(data.progress.completionPercentage || 0);
        }

        // Set initial lesson (first lesson of first section)
        if (data.sections?.length > 0) {
          const firstSection = data.sections[0];
          setCurrentSectionId(firstSection._id);

          if (firstSection.lessons?.length > 0) {
            setCurrentLessonId(firstSection.lessons[0]._id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  // Optimized lesson selection handler
  const handleSelectLesson = useCallback(
    (sectionId: string, lessonId: string) => {
      setCurrentSectionId(sectionId);
      setCurrentLessonId(lessonId);

      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    },
    []
  );

  // Memoized total lessons calculation
  const totalLessons = useMemo(() => {
    if (!course?.sections) return 0;
    return course.sections.reduce(
      (total, section) => total + section.lessons.length,
      0
    );
  }, [course?.sections]);

  // Memoized progress calculation
  const updateProgressPercentage = useCallback(
    (lessonsCompleted: string[]): number => {
      if (totalLessons === 0) return 0;
      return Math.round((lessonsCompleted.length / totalLessons) * 100);
    },
    [totalLessons]
  );

  // Optimized lesson completion handler with useCallback
  const handleLessonCompletionToggle = useCallback(
    (lessonId: string, isCompleted: boolean) => {
      setCompletedLessons((prevCompleted) => {
        const newCompletedLessons = isCompleted
          ? [...prevCompleted, lessonId]
          : prevCompleted.filter((id) => id !== lessonId);

        // Calculate new progress
        const newProgress = updateProgressPercentage(newCompletedLessons);
        setProgress(newProgress);

        // Update course object
        setCourse((prevCourse) => {
          if (!prevCourse?.progress) return prevCourse;

          return {
            ...prevCourse,
            progress: {
              ...prevCourse.progress,
              completedLessons: newCompletedLessons,
              completionPercentage: newProgress,
              lastAccessedLesson:
                prevCourse.progress.lastAccessedLesson || null,
            },
          };
        });

        return newCompletedLessons;
      });
    },
    [updateProgressPercentage]
  );

  // Memoized current lesson finder
  const currentLesson = useMemo((): Lesson | null => {
    if (!course?.sections) return null;

    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l._id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  }, [course?.sections, currentLessonId]);

  // Memoized completion checker
  const isLessonCompleted = useCallback(
    (lessonId: string): boolean => {
      return completedLessons.includes(lessonId);
    },
    [completedLessons]
  );

  // Memoized sidebar toggle handler
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Memoized overlay click handler
  const handleOverlayClick = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Memoized back to classroom handler
  const handleBackToClassroom = useCallback(() => {
    router.push("/classroom");
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[100px]">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[100px]">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Course not found
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleBackToClassroom}
            >
              Back to Classroom
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Mobile sidebar toggle */}
      <div className="fixed top-29 left-4 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-full shadow-md text-gray-700"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row pt-[110px] min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-40 transform lg:relative lg:transform-none lg:opacity-100 lg:pointer-events-auto ${
            isSidebarOpen
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none"
          } transition-all duration-300 ease-in-out lg:block lg:w-80 lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)]`}
        >
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="absolute inset-0 bg-white bg-opacity-50 lg:hidden"
              onClick={handleOverlayClick}
            />
          )}

          <div className="relative h-full w-80 max-w-full shadow-xl lg:shadow-none">
            <Suspense fallback={<ComponentFallback />}>
              <CourseSidebar
                title={course.title}
                progress={progress}
                sections={course.sections}
                currentLessonId={currentLessonId}
                completedLessons={completedLessons}
                onSelectLesson={handleSelectLesson}
              />
            </Suspense>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          {currentLesson ? (
            <Suspense fallback={<ComponentFallback />}>
              <LessonContent
                lesson={currentLesson}
                courseId={courseId}
                onLessonCompletionToggle={handleLessonCompletionToggle}
                isCompleted={isLessonCompleted(currentLesson._id)}
              />
            </Suspense>
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">Select a lesson to start learning</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
