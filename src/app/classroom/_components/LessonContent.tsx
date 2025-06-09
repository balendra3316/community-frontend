

"use client";

import React from "react";

import { Lesson } from "../../../types/course.types";
import {
  FileText,
  Link as LinkIcon,
  Download,
  CheckCircle,
  ExternalLink,
  Circle,
} from "lucide-react";
import { CourseService } from "../../../services/courseService";
import { Button } from "@mui/material";

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
  onLessonCompletionToggle: (lessonId: string, isCompleted: boolean) => void;
  isCompleted: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  courseId,
  onLessonCompletionToggle,
  isCompleted,
}) => {
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = lesson.videoUrl ? getYouTubeVideoId(lesson.videoUrl) : null;

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return (
          <div className="bg-red-500 p-2 rounded-md">
            <FileText size={16} className="text-white" />
          </div>
        );
      case "docx":
      case "doc":
        return (
          <div className="bg-blue-500 p-2 rounded-md">
            <FileText size={16} className="text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 p-2 rounded-md">
            <FileText size={16} className="text-white" />
          </div>
        );
    }
  };

  const handleToggleCompletion = async () => {
    try {
      const newCompletionStatus = !isCompleted;
      onLessonCompletionToggle(lesson._id, newCompletionStatus);

      await CourseService.toggleLessonCompletion(courseId, lesson._id);
    } catch (error) {
      onLessonCompletionToggle(lesson._id, isCompleted);
    }
  };

  const getDownloadUrl = (rawUrl: string): string => {
    return rawUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    try {
      const downloadUrl = getDownloadUrl(fileUrl);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Fallback to direct URL if download URL fails
      window.open(fileUrl, "_blank");
    }
  };

  const handleUrlClick = (url: string) => {
    window.open(url, "_blank");
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto pt-[50px]">
      {/* Header Section with Button Above Title */}
      <div className="mb-6">
        {/* Mark as Complete/Incomplete Button - Positioned at top right */}
        <div className="flex justify-end mb-3">
          <button
            onClick={handleToggleCompletion}
            className={`
              group relative flex items-center justify-center
              px-3 py-2 sm:px-4 sm:py-2
              rounded-lg font-medium text-xs sm:text-sm
              transition-all duration-300 ease-in-out
              transform hover:scale-105 active:scale-95
              shadow-md hover:shadow-lg
              w-auto max-w-[140px] sm:max-w-[160px]
              ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
              }
            `}
          >
            {/* Circular Icon Container */}
            <div
              className={`
                flex items-center justify-center
                w-4 h-4 sm:w-5 sm:h-5
                rounded-full mr-2
                transition-all duration-300
                ${
                  isCompleted
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
            >
              {isCompleted ? (
                <CheckCircle
                  size={12}
                  className="text-white drop-shadow-sm sm:w-[14px] sm:h-[14px]"
                />
              ) : (
                <Circle
                  size={12}
                  className="text-gray-500 group-hover:text-gray-600 sm:w-[14px] sm:h-[14px]"
                />
              )}
            </div>

            {/* Button Text */}
            <span className="font-semibold tracking-wide truncate">
              {isCompleted ? "Incomplete" : "Complete"}
            </span>

            {/* Subtle shine effect for completed state */}
            {isCompleted && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            )}
          </button>
        </div>

        {/* Title - Now has full width without interference */}
        <h1 className="text-2xl font-semibold text-gray-900 leading-relaxed">
          {lesson.title}
        </h1>
      </div>

      {/* Video Section - Only show if there's a valid video URL and video ID */}
      {lesson.videoUrl && videoId && (
        <div className="relative w-full aspect-video mb-8 bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* Lesson Content */}
      <div className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>

      {/* Images */}
      {lesson.images && lesson.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.images.map((image) => (
              <div key={image._id} className="overflow-hidden rounded-lg">
                <div className="relative h-48 w-full">
                  <img
                    src={image.url}
                    alt={image.altText || image.caption}
                    className="object-cover w-full h-full"
                  />
                </div>
                {image.caption && (
                  <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URLs Section */}
      {lesson.urls && lesson.urls.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <div className="space-y-3">
            {lesson.urls.map((urlItem, index) => (
              <div
                key={index}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                onClick={() => handleUrlClick(urlItem.url)}
              >
                <div className="mr-3">
                  <div className="bg-blue-500 p-2 rounded-md">
                    <LinkIcon size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {urlItem.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    <span className="hidden sm:inline">
                      {truncateUrl(urlItem.url, 60)}
                    </span>
                    <span className="sm:hidden">
                      {truncateUrl(urlItem.url, 30)}
                    </span>
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Section - Simplified with only Download button */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="space-y-3">
            {lesson.resources.map((resource) => (
              <div
                key={resource._id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="mr-3">{getFileIcon(resource.fileType)}</div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {resource.fileType.toUpperCase()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {/* Download Button Only */}
                  <button
                    onClick={() =>
                      handleFileDownload(resource.fileUrl, resource.title)
                    }
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Download File"
                  >
                    <Download size={14} className="mr-1" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">DL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonContent;