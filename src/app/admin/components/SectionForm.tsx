// // components/SectionForm.tsx

// import React from "react";
// import { Section } from "../../../types/course.types";
// // import { input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";

// interface Props {
//   section: Partial<Section>;
//   onChange: (field: keyof Section, value: string) => void;
//   onSubmit: () => void;
//   isEditing: boolean;
//   onCancel: () => void;
// }

// const SectionForm: React.FC<Props> = ({ section, onChange, onSubmit, isEditing, onCancel }) => {
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit();
//       }}
//       className="space-y-3"
//     >
//       <input
//         placeholder="Section Title"
//         value={section.title || ""}
//         onChange={(e) => onChange("title", e.target.value)}
//       />
//       <div className="flex gap-2">
//         <button type="submit">{isEditing ? "Update" : "Create"}</button>
//         {isEditing && <button  onClick={onCancel}>Cancel</button>}
//       </div>
//     </form>
//   );
// };

// export default SectionForm;
