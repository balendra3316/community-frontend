// // components/LessonList.tsx

// import React from "react";
// import { Lesson } from "../../../types/course.types";

// interface Props {
//   lessons: Lesson[];
//   selectedLesson: Lesson | null;
//   onSelect: (lesson: Lesson) => void;
// }

// const LessonList: React.FC<Props> = ({ lessons, selectedLesson, onSelect }) => {
//   return (
//     <div className="space-y-2">
//       {lessons.map((lesson) => (
//         <div
//           key={lesson._id}
//           onClick={() => onSelect(lesson)}
//           className={`p-2 border rounded cursor-pointer ${
//             selectedLesson?._id === lesson._id ? "bg-yellow-100 border-yellow-400" : "bg-white"
//           }`}
//         >
//           <p className="text-sm font-medium">{lesson.title}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LessonList;
