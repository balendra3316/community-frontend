"use client";

import React from "react";
import Image from "next/image";
import { Lesson } from "../../../types/course.types";
import {
  FileText,
  Link as LinkIcon,
  Download,
  CheckCircle,
  XCircle,
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
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if lesson has a valid video URL and extract video ID
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
      // Optimistically update UI first
      const newCompletionStatus = !isCompleted;
      onLessonCompletionToggle(lesson._id, newCompletionStatus);

      // Then make the API call in the background
      await CourseService.toggleLessonCompletion(courseId, lesson._id);

      // Note: We don't need to update the UI again after the API call
      // as we've already updated it optimistically
    } catch (error) {
      // If the API call fails, revert the optimistic update
      console.error("Error toggling lesson completion status:", error);
      onLessonCompletionToggle(lesson._id, isCompleted);
      // Optionally show an error toast/notification here
    }
  };

  // Function to convert Cloudinary raw URL to viewable URL
  const getViewableCloudinaryUrl = (rawUrl: string): string => {
    // Convert from raw upload to image upload for PDF viewing
    // From: https://res.cloudinary.com/db4mveamn/raw/upload/v1747906800/lesson-resources/lesson-1747906796510-Balendra_Singh_resume.pdf
    // To: https://res.cloudinary.com/db4mveamn/image/upload/v1747906800/lesson-resources/lesson-1747906796510-Balendra_Singh_resume.pdf
    return rawUrl.replace("/raw/upload/", "/image/upload/");
  };

  // Function to get download URL with attachment flag
  const getDownloadUrl = (rawUrl: string): string => {
    // Add fl_attachment flag to force download
    return rawUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  // Function to handle file download/view - FIXED VERSION
  const handleFileAction = (
    fileUrl: string,
    fileName: string,
    fileType: string,
    action: "download" | "view"
  ) => {
    try {
      if (action === "view") {
        if (fileType.toLowerCase() === "pdf") {
          // For PDF viewing, use Google Docs viewer or Mozilla PDF.js
          const viewableUrl = getViewableCloudinaryUrl(fileUrl);

          // Option 1: Use Google Docs PDF viewer
          const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
            fileUrl
          )}&embedded=true`;
          window.open(googleViewerUrl, "_blank");

          // Option 2: Try direct URL (uncomment if you prefer)
          // window.open(viewableUrl, '_blank');
        } else {
          window.open(fileUrl, "_blank");
        }
      } else {
        // For download
        const downloadUrl = getDownloadUrl(fileUrl);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("File action failed:", error);
      // Fallback: try Google Docs viewer
      if (fileType.toLowerCase() === "pdf") {
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
          fileUrl
        )}&embedded=true`;
        window.open(googleViewerUrl, "_blank");
      } else {
        window.open(fileUrl, "_blank");
      }
    }
  };

  const isPDF = (fileType: string) => fileType.toLowerCase() === "pdf";

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto pt-[50px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{lesson.title}</h1>

        {/* Mark as Complete/Incomplete Button */}
        <button
          onClick={handleToggleCompletion}
          className={`
          group relative flex items-center justify-center
          px-6 py-3 sm:px-8 sm:py-4
          rounded-full font-medium text-sm sm:text-base
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          min-w-[180px] sm:min-w-[180px]
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
            w-6 h-6 sm:w-7 sm:h-7
            rounded-full mr-3
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
                size={16}
                className="text-white drop-shadow-sm sm:w-[18px] sm:h-[18px]"
              />
            ) : (
              <Circle
                size={16}
                className="text-gray-500 group-hover:text-gray-600 sm:w-[18px] sm:h-[18px]"
              />
            )}
          </div>

          {/* Button Text */}
          <span className="font-semibold tracking-wide">
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </span>

          {/* Subtle shine effect for completed state */}
          {isCompleted && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </button>
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

      {/* Resources Section - UPDATED */}
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
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {resource.fileType.toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* View/Open Button */}
                  <button
                    onClick={() =>
                      handleFileAction(
                        resource.fileUrl,
                        resource.title,
                        resource.fileType,
                        "view"
                      )
                    }
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    title={isPDF(resource.fileType) ? "Open PDF" : "View File"}
                  >
                    <ExternalLink size={14} className="mr-1" />
                    {isPDF(resource.fileType) ? "View PDF" : "Open"}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() =>
                      handleFileAction(
                        resource.fileUrl,
                        resource.title,
                        resource.fileType,
                        "download"
                      )
                    }
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Download File"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Section (Optional - for inline viewing) */}
      {lesson.resources && lesson.resources.some((r) => isPDF(r.fileType)) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">PDF Documents</h2>
          {lesson.resources
            .filter((resource) => isPDF(resource.fileType))
            .map((resource) => (
              <div
                key={`pdf-${resource._id}`}
                className="mb-6 border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-3 flex items-center justify-between">
                  <h3 className="font-medium">{resource.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleFileAction(
                          resource.fileUrl,
                          resource.title,
                          resource.fileType,
                          "view"
                        )
                      }
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
                {/* Inline PDF Viewer with Google Docs */}
                <div className="relative w-full h-96">
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      resource.fileUrl
                    )}&embedded=true`}
                    className="w-full h-full border-0"
                    title={resource.title}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LessonContent;
