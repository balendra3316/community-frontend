
// import { useState, lazy, Suspense } from "react";
// import { Filter } from "bad-words";
// import { Button, IconButton, Typography, CircularProgress, Avatar } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
// import { createPost } from "../services/postService";
// import { useAuth } from "../context/AuthContext";
// import PostFormFields from "./subcomCreatePost/PostFormFields";
// import PostToolbar from "./subcomCreatePost//PostToolbar";

// const PostExtensions = lazy(() => import("./subcomCreatePost/PostExtensions"));

// // PROPS and INTERFACES
// interface CreatePostModalProps {
//   onClose: () => void;
//   onPostCreated?: () => void;
//   onPostError?: () => void;
//   onPostStart?: () => void;
// }

// interface PollOption {
//   text: string;
// }

// interface YouTubeVideoInfo {
//   thumbnail: string;
//   title: string;
//   url: string;
// }

// // MAIN COMPONENT
// const CreatePostModal = ({
//   onClose,
//   onPostCreated,
//   onPostError,
//   onPostStart,
// }: CreatePostModalProps) => {
//   const { user } = useAuth();

//   // STATE MANAGEMENT
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(null);
//   const [links, setLinks] = useState<string[]>([]); // New state for links

//   const [showPoll, setShowPoll] = useState(false);
//   const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: "" }, { text: "" }]);

//   const [submitting, setSubmitting] = useState(false);
//   const [showExtensions, setShowExtensions] = useState(false);
//   const [extensionType, setExtensionType] = useState<"youtube" | "emoji" | "link" | null>(null); // Added 'link'
//   const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");

//   // BAD-WORDS FILTER
//   const [filter] = useState(() => {
//     const filterInstance = new Filter();
//     filterInstance.addWords("fuckk", "customword2");
//     const variations = ["fuckk", "fuuuck", "fuuck", "f u c k", "f*ck", "f**k", "fuk"];
//     filterInstance.addWords(...variations);
//     return filterInstance;
//   });

//   const categories = ["Practice Videos", "IndiaMoves20x30", "Challenge Submissions", "Q&A", "Key Information"];

//   // HELPER FUNCTIONS
//   const containsBadWords = (text: string) => {
//     try {
//       if (filter.isProfane(text)) return true;
//       const normalizedText = text
//         .toLowerCase()
//         .replace(/\b(\w)\s+(\w)\s+(\w)\s+(\w)\b/g, "$1$2$3$4")
//         .replace(/[*_\-\.@#\$%\^&\+\=\[\]\{\}]/g, "")
//         .replace(/([a-z])\1+/g, "$1");
//       return filter.isProfane(normalizedText);
//     } catch (error) {
//       return false;
//     }
//   };

//   const getWordCount = (text: string) => {
//     const words = text.trim().split(/\s+/);
//     return words.length === 1 && words[0] === "" ? 0 : words.length;
//   };

//   const titleWordCount = getWordCount(title);
//   const contentWordCount = getWordCount(content);

//   const isPostButtonEnabled =
//     !submitting &&
//     title.trim() !== "" &&
//     content.trim() !== "" &&
//     selectedCategory !== "" &&
//     !containsBadWords(title) &&
//     !containsBadWords(content) &&
//     titleWordCount <= 30 &&
//     contentWordCount <= 200;

//   // EVENT HANDLERS for EXTENSIONS
//   const handleOpenYoutube = () => {
//     setExtensionType("youtube");
//     setShowExtensions(true);
//   };

//   const handleOpenLink = () => { // New handler for opening link modal
//     setExtensionType("link");
//     setShowExtensions(true);
//   };

//   const handleOpenEmoji = (target: "title" | "content" = "content") => {
//     setEmojiTarget(target);
//     setExtensionType("emoji");
//     setShowExtensions(true);
//   };

//   const handleCloseExtensions = () => {
//     setShowExtensions(false);
//     setExtensionType(null);
//   };

//   const handleEmojiSelect = (emoji: string) => {
//     if (emojiTarget === "title") {
//       setTitle((prev) => prev + emoji);
//     } else {
//       setContent((prev) => prev + emoji);
//     }
//     handleCloseExtensions();
//   };

//   const handleAddLink = (url: string) => { // New handler for adding a link
//     if (url && !links.includes(url)) {
//       setLinks((prev) => [...prev, url]);
//     }
//     handleCloseExtensions();
//   };

//   const handleRemoveLink = (linkToRemove: string) => { // New handler for removing a link
//     setLinks((prev) => prev.filter((link) => link !== linkToRemove));
//   };


//   // FORM SUBMISSION
//   const handleSubmit = async () => {
//     if (titleWordCount > 30 || contentWordCount > 200) {
//       setErrorMessage("Word limits exceeded.");
//       return;
//     }
//     if (containsBadWords(title) || containsBadWords(content)) {
//       setErrorMessage("Contains inappropriate language. Please revise.");
//       return;
//     }
//     if (!isPostButtonEnabled) return;

//     try {
//       if (onPostStart) onPostStart();
//       onClose();

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);

//       if (selectedCategory) formData.append("tags", selectedCategory);
//       if (selectedImage) formData.append("image", selectedImage);
//       if (youtubeVideo) formData.append("youtubeLink", youtubeVideo.url);
//       if (links.length > 0) formData.append("links", links.join(",")); // Append links to form data

//       if (showPoll && pollOptions.some((option) => option.text.trim() !== "")) {
//         const validOptions = pollOptions
//           .filter((option) => option.text.trim() !== "")
//           .map((option) => option.text);

//         if (validOptions.length >= 2) {
//           formData.append("poll", JSON.stringify(validOptions));
//         }
//       }

//       await createPost(formData);
//       if (onPostCreated) onPostCreated();
//     } catch (error) {
//       if (onPostError) onPostError();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-60 overflow-hidden bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-start justify-center pt-4 pb-4">
//       <div className="relative bg-white max-w-lg w-full mx-4 max-h-[90vh] rounded-lg shadow-xl flex flex-col">
//         {/* Header - Fixed */}
//         <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center gap-1">
//             <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
//               <Avatar
//                 src={user?.avatar}
//                 alt={user?.name?.charAt(0).toUpperCase()}
//                 className="cursor-pointer transition-transform duration-200 hover:scale-105"
//                 sx={{ width: 34, height: 34 }}
//               />
//             </div>
//             {/* Mobile View */}
//             <div className="flex items-center gap-1 sm:hidden">
//                 <Typography variant="body1" className="ml-2 text-sm font-medium">{user?.name?.split(' ')[0] || "User"}</Typography>
//                 <Typography variant="body2" color="textSecondary" className="text-xs whitespace-nowrap">posting in</Typography>
//                 <Typography variant="body2" color="primary" className="font-medium text-xs">Acd</Typography>
//             </div>
//             {/* Desktop View */}
//             <div className="hidden sm:flex sm:items-center sm:gap-1">
//                 <Typography variant="body1" className="ml-2">{user?.name || "User"}</Typography>
//                 <Typography variant="body2" color="textSecondary" className="ml-3">posting in</Typography>
//                 <Typography variant="body2" color="primary" className="ml-1 font-medium">Acd</Typography>
//             </div>
//           </div>
//           <IconButton size="small" onClick={onClose}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </div>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
//             <PostFormFields
//                 title={title}
//                 content={content}
//                 titleWordCount={titleWordCount}
//                 contentWordCount={contentWordCount}
//                 errorMessage={errorMessage}
//                 selectedImage={selectedImage}
//                 imagePreview={imagePreview}
//                 youtubeVideo={youtubeVideo}
//                 links={links} // Pass links
//                 onRemoveLink={handleRemoveLink} // Pass remove handler
//                 showPoll={showPoll}
//                 pollOptions={pollOptions}
//                 containsBadWords={containsBadWords}
//                 onTitleChange={(newTitle) => {
//                     if (getWordCount(newTitle) <= 30) {
//                         setTitle(newTitle);
//                         if (newTitle && containsBadWords(newTitle)) {
//                             setErrorMessage("Your title contains inappropriate language. Please revise.");
//                         } else if (errorMessage.includes("title")) {
//                             setErrorMessage("");
//                         }
//                     }
//                 }}
//                 onContentChange={(newContent) => {
//                     if (getWordCount(newContent) <= 200) {
//                         setContent(newContent);
//                         if (newContent && containsBadWords(newContent)) {
//                             setErrorMessage("Your content contains inappropriate language. Please revise.");
//                         } else if (errorMessage.includes("content")) {
//                             setErrorMessage("");
//                         }
//                     }
//                 }}
//                 onImageUpload={(file, preview) => {
//                     setSelectedImage(file);
//                     setImagePreview(preview);
//                 }}
//                 onRemoveImage={() => {
//                     setSelectedImage(null);
//                     setImagePreview(null);
//                 }}
//                 onRemoveYoutube={() => setYoutubeVideo(null)}
//                 onPollOptionUpdate={(index, text) => {
//                     const updatedOptions = [...pollOptions];
//                     updatedOptions[index].text = text;
//                     setPollOptions(updatedOptions);
//                 }}
//                 onAddPollOption={() => {
//                     if (pollOptions.length < 4) {
//                         setPollOptions([...pollOptions, { text: "" }]);
//                     }
//                 }}
//                 onRemovePollOption={(index) => {
//                     if (pollOptions.length > 2) {
//                         const updatedOptions = [...pollOptions];
//                         updatedOptions.splice(index, 1);
//                         setPollOptions(updatedOptions);
//                     }
//                 }}
//                 onCancelPoll={() => {
//                     setShowPoll(false);
//                     setPollOptions([{ text: "" }, { text: "" }]);
//                 }}
//                 onTitleEmojiClick={() => handleOpenEmoji("title")}
//                 onContentEmojiClick={() => handleOpenEmoji("content")}
//             />
//             <PostToolbar
//                 selectedCategory={selectedCategory}
//                 categories={categories}
//                 onCategorySelect={setSelectedCategory}
//                 onImageUpload={(file, preview) => {
//                     setSelectedImage(file);
//                     setImagePreview(preview);
//                 }}
//                 onYoutubeClick={handleOpenYoutube}
//                 onLinkClick={handleOpenLink} // Pass link click handler
//                 onPollClick={() => setShowPoll(!showPoll)}
//             />
//         </div>

//         {/* Action Buttons - Fixed at bottom */}
//         <div className="flex justify-end mt-4 gap-2 px-4 pb-4 flex-shrink-0 border-t border-gray-100 pt-4">
//           <Button variant="outlined" color="inherit" size="small" onClick={onClose} disabled={submitting}>CANCEL</Button>
//           <Button variant="contained" color="primary" size="small" disabled={!isPostButtonEnabled} onClick={handleSubmit}>POST</Button>
//         </div>
//       </div>

//       {/* Lazy loaded extensions */}
//       {showExtensions && (
//         <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(144,144,144,0.6)] bg-opacity-50"><CircularProgress /></div>}>
//           <PostExtensions
//             type={extensionType}
//             emojiTarget={emojiTarget}
//             onClose={handleCloseExtensions}
//             onYoutubeAdd={(video) => {
//               setYoutubeVideo(video);
//               handleCloseExtensions();
//             }}
//             onLinkAdd={handleAddLink} // Pass add link handler
//             onEmojiSelect={handleEmojiSelect}
//           />
//         </Suspense>
//       )}

//       <style jsx>{`
//         .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e0 transparent; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 2px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #a0aec0; }
//       `}</style>
//     </div>
//   );
// };

// export default CreatePostModal;











// "use client";
// import { useState, useEffect, lazy, Suspense } from "react";
// import { Filter } from "bad-words";
// import { Button, IconButton, Typography, CircularProgress, Avatar } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
// import { createPost, updatePost, Post as PostType } from "../services/postService";
// import { useAuth } from "../context/AuthContext";
// import PostFormFields from "./subcomCreatePost/PostFormFields";
// import PostToolbar from "./subcomCreatePost/PostToolbar";

// const PostExtensions = lazy(() => import("./subcomCreatePost/PostExtensions"));

// interface CreatePostModalProps {
//   onClose: () => void;
//   onPostCreated?: () => void;
//   onPostError?: () => void;
//   onPostStart?: () => void;
//   postToEdit?: PostType | null;
// }

// interface PollOption {
//   text: string;
// }

// interface YouTubeVideoInfo {
//   thumbnail: string;
//   title: string;
//   url: string;
// }

// const CreatePostModal = ({
//   onClose,
//   onPostCreated,
//   onPostError,
//   onPostStart,
//   postToEdit,
// }: CreatePostModalProps) => {
//   const { user } = useAuth();
//   const isEditMode = !!postToEdit;

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(null);
//   const [links, setLinks] = useState<string[]>([]);
//   const [showPoll, setShowPoll] = useState(false);
//   const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: "" }, { text: "" }]);
//   const [submitting, setSubmitting] = useState(false);
//   const [showExtensions, setShowExtensions] = useState(false);
//   const [extensionType, setExtensionType] = useState<"youtube" | "emoji" | "link" | null>(null);
//   const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");
  
//   const [filter] = useState(() => {
//     const filterInstance = new Filter();
//     filterInstance.addWords("fuckk", "customword2");
//     const variations = ["fuckk", "fuuuck", "fuuck", "f u c k", "f*ck", "f**k", "fuk"];
//     filterInstance.addWords(...variations);
//     return filterInstance;
//   });

//   const categories = ["Practice Videos", "IndiaMoves20x30", "Challenge Submissions", "Q&A", "Key Information"];

//   // --- MODIFIED: useEffect to populate form for editing, now includes polls ---
//   useEffect(() => {
//     if (isEditMode && postToEdit) {
//       setTitle(postToEdit.title);
//       setContent(postToEdit.content);
//       if (postToEdit.tags && postToEdit.tags.length > 0) {
//         setSelectedCategory(postToEdit.tags[0]);
//       }
//       if (postToEdit.image) {
//         setImagePreview(postToEdit.image);
//       }
//       if (postToEdit.youtubeLink) {
//         const getYoutubeId = (url: string): string => {
//             if (!url) return "";
//             const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
//             const match = url.match(regExp);
//             return match && match[2].length === 11 ? match[2] : "";
//         };
//         setYoutubeVideo({
//           url: postToEdit.youtubeLink,
//           thumbnail: `https://img.youtube.com/vi/${getYoutubeId(postToEdit.youtubeLink)}/hqdefault.jpg`,
//           title: "YouTube Video",
//         });
//       }
//       if (postToEdit.links) {
//         setLinks(postToEdit.links);
//       }
//       // --- ADDED: Poll population logic ---
//       if (postToEdit.poll && postToEdit.poll.options.length > 0) {
//         setShowPoll(true);
//         setPollOptions(postToEdit.poll.options.map(opt => ({ text: opt.text })));
//       }
//       // --- END OF POLL LOGIC ---
//     }
//   }, [isEditMode, postToEdit]);

//   const handleSubmit = async () => {
//     // ... (validation logic remains the same)
//     if (submitting) return;

//     try {
//       if (onPostStart) onPostStart();
//       setSubmitting(true);
//       onClose(); // Close modal immediately for better UX

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       if (selectedCategory) formData.append("tags", selectedCategory);
//       if (selectedImage) formData.append("image", selectedImage);
//       if (youtubeVideo) formData.append("youtubeLink", youtubeVideo.url);
//       if (links.length > 0) formData.append("links", links.join(","));

//       // --- MODIFIED: Poll data handling ---
//       if (showPoll && pollOptions.some((option) => option.text.trim() !== "")) {
//         const validOptions = pollOptions
//           .filter((option) => option.text.trim() !== "")
//           .map((option) => option.text);

//         if (validOptions.length >= 2) {
//           formData.append("poll", JSON.stringify(validOptions));
//         }
//       }
//       // --- END OF MODIFICATION ---

//       if (isEditMode) {
//         await updatePost(postToEdit._id, formData);
//       } else {
//         await createPost(formData);
//       }
      
//       if (onPostCreated) onPostCreated();

//     } catch (error) {
//       if (onPostError) onPostError();
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // The rest of the component's JSX and helper functions remain the same.
//   // ...
//   const containsBadWords = (text: string) => {
//     try {
//       if (filter.isProfane(text)) return true;
//       const normalizedText = text
//         .toLowerCase()
//         .replace(/\b(\w)\s+(\w)\s+(\w)\s+(\w)\b/g, "$1$2$3$4")
//         .replace(/[*_\-\.@#\$%\^&\+\=\[\]\{\}]/g, "")
//         .replace(/([a-z])\1+/g, "$1");
//       return filter.isProfane(normalizedText);
//     } catch (error) {
//       return false;
//     }
//   };

//   const getWordCount = (text: string) => {
//     const words = text.trim().split(/\s+/);
//     return words.length === 1 && words[0] === "" ? 0 : words.length;
//   };

//   const titleWordCount = getWordCount(title);
//   const contentWordCount = getWordCount(content);

//   const isPostButtonEnabled =
//     !submitting &&
//     title.trim() !== "" &&
//    // content.trim() !== "" &&
//     selectedCategory !== "" &&
//     !containsBadWords(title) &&
//     !containsBadWords(content) &&
//     titleWordCount <= 30 &&
//     contentWordCount <= 200;

//   const handleOpenYoutube = () => {
//     setExtensionType("youtube");
//     setShowExtensions(true);
//   };

//   const handleOpenLink = () => {
//     setExtensionType("link");
//     setShowExtensions(true);
//   };

//   const handleOpenEmoji = (target: "title" | "content" = "content") => {
//     setEmojiTarget(target);
//     setExtensionType("emoji");
//     setShowExtensions(true);
//   };

//   const handleCloseExtensions = () => {
//     setShowExtensions(false);
//     setExtensionType(null);
//   };

//   const handleEmojiSelect = (emoji: string) => {
//     if (emojiTarget === "title") {
//       setTitle((prev) => prev + emoji);
//     } else {
//       setContent((prev) => prev + emoji);
//     }
//     handleCloseExtensions();
//   };

//   const handleAddLink = (url: string) => {
//     if (url && !links.includes(url)) {
//       setLinks((prev) => [...prev, url]);
//     }
//     handleCloseExtensions();
//   };

//   const handleRemoveLink = (linkToRemove: string) => {
//     setLinks((prev) => prev.filter((link) => link !== linkToRemove));
//   };
  
//   return (
//     <div className="fixed inset-0 z-60 overflow-hidden bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-start justify-center pt-4 pb-4">
//       <div className="relative bg-white max-w-lg w-full mx-4 max-h-[90vh] rounded-lg shadow-xl flex flex-col">
//         <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 flex-shrink-0">
//           <Typography variant="h6">{isEditMode ? "Edit Post" : "Create Post"}</Typography>
//           <IconButton size="small" onClick={onClose}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </div>
//         <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
//           <PostFormFields
//             title={title}
//             content={content}
//             titleWordCount={titleWordCount}
//             contentWordCount={contentWordCount}
//             errorMessage={errorMessage}
//             selectedImage={selectedImage}
//             imagePreview={imagePreview}
//             youtubeVideo={youtubeVideo}
//             links={links}
//             onRemoveLink={handleRemoveLink}
//             showPoll={showPoll}
//             pollOptions={pollOptions}
//             containsBadWords={containsBadWords}
//             onTitleChange={setTitle}
//             onContentChange={setContent}
//             onImageUpload={(file, preview) => {
//               setSelectedImage(file);
//               setImagePreview(preview);
//             }}
//             onRemoveImage={() => {
//               setSelectedImage(null);
//               setImagePreview(null);
//             }}
//             onRemoveYoutube={() => setYoutubeVideo(null)}
//             onPollOptionUpdate={(index, text) => {
//               const updatedOptions = [...pollOptions];
//               updatedOptions[index].text = text;
//               setPollOptions(updatedOptions);
//             }}
//             onAddPollOption={() => {
//               if (pollOptions.length < 4) {
//                 setPollOptions([...pollOptions, { text: "" }]);
//               }
//             }}
//             onRemovePollOption={(index) => {
//               if (pollOptions.length > 2) {
//                 const updatedOptions = pollOptions.filter((_, i) => i !== index);
//                 setPollOptions(updatedOptions);
//               }
//             }}
//             onCancelPoll={() => {
//                 setShowPoll(false);
//                 setPollOptions([{ text: "" }, { text: "" }]);
//             }}
//             onTitleEmojiClick={() => handleOpenEmoji("title")}
//             onContentEmojiClick={() => handleOpenEmoji("content")}
//           />
//           <PostToolbar
//             selectedCategory={selectedCategory}
//             categories={categories}
//             onCategorySelect={setSelectedCategory}
//             onImageUpload={(file, preview) => {
//               setSelectedImage(file);
//               setImagePreview(preview);
//             }}
//             onYoutubeClick={handleOpenYoutube}
//             onLinkClick={handleOpenLink}
//             onPollClick={() => setShowPoll(!showPoll)}
//           />
//         </div>
//         <div className="flex justify-end mt-4 gap-2 px-4 pb-4 flex-shrink-0 border-t border-gray-100 pt-4">
//           <Button variant="outlined" color="inherit" size="small" onClick={onClose} disabled={submitting}>CANCEL</Button>
//           <Button variant="contained" color="primary" size="small" disabled={!isPostButtonEnabled} onClick={handleSubmit}>
//             {submitting ? <CircularProgress size={24} /> : (isEditMode ? "UPDATE" : "POST")}
//           </Button>
//         </div>
//       </div>
//       {showExtensions && (
//         <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(144,144,144,0.6)] bg-opacity-50"><CircularProgress /></div>}>
//           <PostExtensions
//             type={extensionType}
//             emojiTarget={emojiTarget}
//             onClose={handleCloseExtensions}
//             onYoutubeAdd={(video) => {
//               setYoutubeVideo(video);
//               handleCloseExtensions();
//             }}
//             onLinkAdd={handleAddLink}
//             onEmojiSelect={handleEmojiSelect}
//           />
//         </Suspense>
//       )}
//       <style jsx>{`
//         .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e0 transparent; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 2px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #a0aec0; }
//       `}</style>
//     </div>
//   );
// };

// export default CreatePostModal;






// components/CreatePostModal.tsx

"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { Filter } from "bad-words";
import { Button, IconButton, Typography, CircularProgress } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createPost, updatePost, Post as PostType } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import PostFormFields from "./subcomCreatePost/PostFormFields";
import PostToolbar from "./subcomCreatePost/PostToolbar";

const PostExtensions = lazy(() => import("./subcomCreatePost/PostExtensions"));

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated?: () => void;
  onPostError?: () => void;
  onPostStart?: () => void;
  postToEdit?: PostType | null;
}

interface PollOption {
  text: string;
}

interface YouTubeVideoInfo {
  thumbnail: string;
  title: string;
  url: string;
}

const CreatePostModal = ({
  onClose,
  onPostCreated,
  onPostError,
  onPostStart,
  postToEdit,
}: CreatePostModalProps) => {
  const { user } = useAuth();
  const isEditMode = !!postToEdit;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Media State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(null);

  // Other state
  const [links, setLinks] = useState<string[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: "" }, { text: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [extensionType, setExtensionType] = useState<"youtube" | "emoji" | "link" | null>(null);
  const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");
  
  const [filter] = useState(() => {
    const filterInstance = new Filter();
    // Add custom words and variations to the filter
    filterInstance.addWords("fuckk", "customword2");
    const variations = ["fuckk", "fuucck", "fuuck", "f u c k", "f*ck", "f**k", "fuk"];
    filterInstance.addWords(...variations);

    //filterInstance.removeWords('god'); 
    
    return filterInstance;
  });

  const categories = ["Practice Videos", "IndiaMoves20x30", "Challenge Submissions", "Q&A", "Key Information"];

  // --- Helper to clear all media types ---
  const clearMedia = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedVideo(null);
    if (videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview); // Clean up blob URL
    }
    setVideoPreview(null);
    setYoutubeVideo(null);
  };

  // --- Populate form for editing ---
  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      if (postToEdit.tags && postToEdit.tags.length > 0) {
        setSelectedCategory(postToEdit.tags[0]);
      }
      if (postToEdit.links) {
        setLinks(postToEdit.links);
      }
      if (postToEdit.poll && postToEdit.poll.options.length > 0) {
        setShowPoll(true);
        setPollOptions(postToEdit.poll.options.map(opt => ({ text: opt.text })));
      }

      // Populate media
      if (postToEdit.image) setImagePreview(postToEdit.image);
      if (postToEdit.videoUrl) setVideoPreview(postToEdit.videoUrl);
      if (postToEdit.youtubeLink) {
        const getYoutubeId = (url: string): string => {
            if (!url) return "";
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[2].length === 11 ? match[2] : "";
        };
        setYoutubeVideo({
          url: postToEdit.youtubeLink,
          thumbnail: `https://img.youtube.com/vi/${getYoutubeId(postToEdit.youtubeLink)}/hqdefault.jpg`,
          title: "YouTube Video",
        });
      }
    }
  }, [isEditMode, postToEdit]);

  // --- Video Selection and Validation ---
  const handleVideoSelect = (file: File) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 120) {
        setErrorMessage("Video cannot be longer than 2 minutes.");
      } else {
        clearMedia();
        setSelectedVideo(file);
        setVideoPreview(URL.createObjectURL(file));
        setErrorMessage("");
      }
    };
    video.onerror = () => {
      setErrorMessage("Could not read video file.");
    };
    video.src = URL.createObjectURL(file);
  };

  const handleSubmit = async () => {
    if (submitting || !isPostButtonEnabled) return;

    try {
      if (onPostStart) onPostStart();
      setSubmitting(true);
      onClose();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (selectedCategory) formData.append("tags", selectedCategory);
      
      // Append the correct media file
      if (selectedImage) formData.append("image", selectedImage);
      if (selectedVideo) formData.append("video", selectedVideo);
      
      // If user removed media in edit mode, send a flag to the backend
      if (isEditMode && postToEdit?.image && !imagePreview) formData.append("removeImage", "true");
      if (isEditMode && postToEdit?.videoUrl && !videoPreview) formData.append("removeVideo", "true");

      if (youtubeVideo) {
        formData.append("youtubeLink", youtubeVideo.url);
      } else if (isEditMode && postToEdit?.youtubeLink) {
        // Handle removal of youtube link
        formData.append("youtubeLink", "");
      }

      if (links.length > 0) formData.append("links", links.join(","));
      
      if (showPoll && pollOptions.some((option) => option.text.trim() !== "")) {
        const validOptions = pollOptions
          .filter((option) => option.text.trim() !== "")
          .map((option) => option.text);

        if (validOptions.length >= 2) {
          formData.append("poll", JSON.stringify(validOptions));
        }
      } else if (isEditMode && postToEdit?.poll) {
        // Handle removal of poll
        formData.append("poll", "");
      }

      if (isEditMode) {
        await updatePost(postToEdit!._id, formData);
      } else {
        await createPost(formData);
      }
      
      if (onPostCreated) onPostCreated();

    } catch (error) {
      //console.error("Failed to submit post:", error);
      if (onPostError) onPostError();
    } finally {
      setSubmitting(false);
    }
  };

  const containsBadWords = (text: string) => {
    try {
      if (filter.isProfane(text)) return true;
      const normalizedText = text
        .toLowerCase()
        .replace(/\b(\w)\s+(\w)\s+(\w)\s+(\w)\b/g, "$1$2$3$4")
        .replace(/[*_\-\.@#\$%\^&\+\=\[\]\{\}]/g, "")
       // .replace(/([a-z])\1+/g, "$1");
      return filter.isProfane(normalizedText);
    } catch (error) {
      return false;
    }
  };

  const getWordCount = (text: string) => {
    const words = text.trim().split(/\s+/);
    return words.length === 1 && words[0] === "" ? 0 : words.length;
  };

  const titleWordCount = getWordCount(title);
  const contentWordCount = getWordCount(content);

  const isPostButtonEnabled =
    !submitting &&
    title.trim() !== "" &&
    selectedCategory !== "" &&
    !containsBadWords(title) &&
    !containsBadWords(content) &&
    titleWordCount <= 30 &&
    contentWordCount <= 200;

  const handleOpenYoutube = () => {
    setExtensionType("youtube");
    setShowExtensions(true);
  };

  const handleOpenLink = () => {
    setExtensionType("link");
    setShowExtensions(true);
  };

  const handleOpenEmoji = (target: "title" | "content" = "content") => {
    setEmojiTarget(target);
    setExtensionType("emoji");
    setShowExtensions(true);
  };

  const handleCloseExtensions = () => {
    setShowExtensions(false);
    setExtensionType(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (emojiTarget === "title") {
      setTitle((prev) => prev + emoji);
    } else {
      setContent((prev) => prev + emoji);
    }
    handleCloseExtensions();
  };

  const handleAddLink = (url: string) => {
    if (url && !links.includes(url)) {
      setLinks((prev) => [...prev, url]);
    }
    handleCloseExtensions();
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setLinks((prev) => prev.filter((link) => link !== linkToRemove));
  };

  return (
    <div className="fixed inset-0 z-60 overflow-hidden bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-start justify-center pt-4 pb-4">
      <div className="relative bg-white max-w-lg w-full mx-4 max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <Typography variant="h6">{isEditMode ? "Edit Post" : "Create Post"}</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <PostFormFields
            title={title}
            content={content}
            titleWordCount={titleWordCount}
            contentWordCount={contentWordCount}
            errorMessage={errorMessage}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            youtubeVideo={youtubeVideo}
            links={links}
            onRemoveLink={handleRemoveLink}
            showPoll={showPoll}
            pollOptions={pollOptions}
            containsBadWords={containsBadWords}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onImageUpload={(file, preview) => {
              clearMedia();
              setSelectedImage(file);
              setImagePreview(preview);
            }}
            onRemoveImage={() => {
              setSelectedImage(null);
              setImagePreview(null);
            }}
            onRemoveYoutube={() => setYoutubeVideo(null)}
            onPollOptionUpdate={(index, text) => {
              const updatedOptions = [...pollOptions];
              updatedOptions[index].text = text;
              setPollOptions(updatedOptions);
            }}
            onAddPollOption={() => {
              if (pollOptions.length < 4) {
                setPollOptions([...pollOptions, { text: "" }]);
              }
            }}
            onRemovePollOption={(index) => {
              if (pollOptions.length > 2) {
                const updatedOptions = pollOptions.filter((_, i) => i !== index);
                setPollOptions(updatedOptions);
              }
            }}
            onCancelPoll={() => {
                setShowPoll(false);
                setPollOptions([{ text: "" }, { text: "" }]);
            }}
            onTitleEmojiClick={() => handleOpenEmoji("title")}
            onContentEmojiClick={() => handleOpenEmoji("content")}
            videoPreview={videoPreview}
            onRemoveVideo={() => {
              setSelectedVideo(null);
              if (videoPreview?.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
              setVideoPreview(null);
            }}
          />
          <PostToolbar
            selectedCategory={selectedCategory}
            categories={categories}
            onCategorySelect={setSelectedCategory}
            onImageUpload={(file, preview) => {
              clearMedia();
              setSelectedImage(file);
              setImagePreview(preview);
            }}
            onVideoUpload={handleVideoSelect}
            onYoutubeClick={() => {
              clearMedia();
              handleOpenYoutube();
            }}
            onLinkClick={handleOpenLink}
            onPollClick={() => setShowPoll(!showPoll)}
          />
        </div>
        <div className="flex justify-end mt-4 gap-2 px-4 pb-4 flex-shrink-0 border-t border-gray-100 pt-4">
          <Button variant="outlined" color="inherit" size="small" onClick={onClose} disabled={submitting}>CANCEL</Button>
          <Button variant="contained" color="primary" size="small" disabled={!isPostButtonEnabled} onClick={handleSubmit}>
            {submitting ? <CircularProgress size={24} /> : (isEditMode ? "UPDATE" : "POST")}
          </Button>
        </div>
      </div>
      {showExtensions && (
        <Suspense fallback={<div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(144,144,144,0.6)] bg-opacity-50"><CircularProgress /></div>}>
          <PostExtensions
            type={extensionType}
            emojiTarget={emojiTarget}
            onClose={handleCloseExtensions}
            onYoutubeAdd={(video) => {
              setYoutubeVideo(video);
              handleCloseExtensions();
            }}
            onLinkAdd={handleAddLink}
            onEmojiSelect={handleEmojiSelect}
          />
        </Suspense>
      )}
      <style jsx>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e0 transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #a0aec0; }
      `}</style>
    </div>
  );
};

export default CreatePostModal;
