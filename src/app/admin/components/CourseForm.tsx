// import React, { useState } from "react";
// interface Progress {
//     completionPercentage: number;
//     lastAccessedLesson: string | null;
//   }
// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   coverImage: string;
//   order: number;
//   createdAt: string;
//   updatedAt: string;
//   progress?: Progress;
// }

// interface CourseFormProps {
//   onCreate: (course: Omit<Course, "_id">) => void;
// }

// export default function CourseForm({ onCreate }: CourseFormProps) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     onCreate({ title, description, sections: [] });
//     setTitle("");
//     setDescription("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
//       <h2 className="text-lg font-semibold mb-2">Create New Course</h2>
//       <div className="mb-2">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Course Title"
//           className="w-full p-2 border rounded"
//         />
//       </div>
//       <div className="mb-2">
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Course Description"
//           className="w-full p-2 border rounded"
//         />
//       </div>
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Create
//       </button>
//     </form>
//   );
// }
