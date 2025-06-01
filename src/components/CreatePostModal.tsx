



import { useState, lazy, Suspense } from "react";
import { Filter } from "bad-words";
import { Button, IconButton,  Typography, CircularProgress,} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createPost } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import PostFormFields from "./subcomCreatePost/PostFormFields";
import PostToolbar from "./subcomCreatePost//PostToolbar";

const PostExtensions = lazy(() => import("./subcomCreatePost/PostExtensions"));

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated?: () => void;
  onPostError?: () => void;
  onPostStart?: () => void;
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
}: CreatePostModalProps) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideoInfo | null>(
    null
  );

  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { text: "" },
    { text: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [extensionType, setExtensionType] = useState<
    "youtube" | "emoji" | null
  >(null);
  const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");

  const [filter] = useState(() => {
    const filterInstance = new Filter();
    filterInstance.addWords("fuckk", "customword2");
    const variations = [
      "fuckk",
      "fuuuck",
      "fuuck",
      "f u c k",
      "f*ck",
      "f**k",
      "fuk",
    ];
    filterInstance.addWords(...variations);
    return filterInstance;
  });

  const categories = ["DanceTips", "SelfLove", "Events"];

  const containsBadWords = (text: string) => {
    try {
      if (filter.isProfane(text)) return true;

      const normalizedText = text
        .toLowerCase()
        .replace(/\b(\w)\s+(\w)\s+(\w)\s+(\w)\b/g, "$1$2$3$4")
        .replace(/[*_\-\.@#\$%\^&\+\=\[\]\{\}]/g, "")
        .replace(/([a-z])\1+/g, "$1");

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
    content.trim() !== "" &&
    selectedCategory !== "" &&
    !containsBadWords(title) &&
    !containsBadWords(content) &&
    titleWordCount <= 30 &&
    contentWordCount <= 200;

  const handleOpenYoutube = () => {
    setExtensionType("youtube");
    setShowExtensions(true);
  };

  const handleOpenEmoji = (target: "title" | "content" = "content") => {
    console.log("Opening emoji picker for:", target); // Debug log
    setEmojiTarget(target);
    setExtensionType("emoji");
    setShowExtensions(true);
  };

  const handleCloseExtensions = () => {
    setShowExtensions(false);
    setExtensionType(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log("Emoji selected:", emoji, "for target:", emojiTarget); // Debug log
    if (emojiTarget === "title") {
      setTitle((prev) => prev + emoji);
    } else {
      setContent((prev) => prev + emoji);
    }
    // Close the extensions after emoji selection
    setShowExtensions(false);
    setExtensionType(null);
  };

  const handleSubmit = async () => {
    if (titleWordCount > 30 || contentWordCount > 200) {
      setErrorMessage("Word limits exceeded.");
      return;
    }

    if (containsBadWords(title) || containsBadWords(content)) {
      setErrorMessage("Contains inappropriate language. Please revise.");
      return;
    }

    if (!isPostButtonEnabled) return;

    try {
      if (onPostStart) onPostStart();
      onClose();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (selectedCategory) formData.append("tags", selectedCategory);
      if (selectedImage) formData.append("image", selectedImage);
      if (youtubeVideo) formData.append("youtubeLink", youtubeVideo.url);

      if (showPoll && pollOptions.some((option) => option.text.trim() !== "")) {
        const validOptions = pollOptions
          .filter((option) => option.text.trim() !== "")
          .map((option) => option.text);

        if (validOptions.length >= 2) {
          formData.append("poll", JSON.stringify(validOptions));
        }
      }

      await createPost(formData);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      if (onPostError) onPostError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[rgba(144,144,144,0.6)] bg-opacity-75 flex items-start justify-center pt-4 pb-4">
      <div className="relative bg-white max-w-lg w-full mx-4 max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={user?.avatar || "/api/placeholder/32/32"}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <Typography variant="body1" className="ml-2">
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="ml-3">
              posting in
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              className="ml-1 font-medium"
            >
              Acd
            </Typography>
          </div>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Scrollable Content Area with custom scrollbar */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {/* Form Fields */}
         
<PostFormFields
  title={title}
  content={content}
  titleWordCount={titleWordCount}
  contentWordCount={contentWordCount}
  errorMessage={errorMessage}
  selectedImage={selectedImage}
  imagePreview={imagePreview}
  youtubeVideo={youtubeVideo}
  showPoll={showPoll}
  pollOptions={pollOptions}
  containsBadWords={containsBadWords}
  onTitleChange={(newTitle) => {
    if (getWordCount(newTitle) <= 30) {
      setTitle(newTitle);
      if (newTitle && containsBadWords(newTitle)) {
        setErrorMessage(
          "Your title contains inappropriate language. Please revise."
        );
      } else if (errorMessage.includes("title")) {
        setErrorMessage("");
      }
    }
  }}
  onContentChange={(newContent) => {
    if (getWordCount(newContent) <= 200) {
      setContent(newContent);
      if (newContent && containsBadWords(newContent)) {
        setErrorMessage(
          "Your content contains inappropriate language. Please revise."
        );
      } else if (errorMessage.includes("content")) {
        setErrorMessage("");
      }
    }
  }}
  onImageUpload={(file, preview) => {
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
      const updatedOptions = [...pollOptions];
      updatedOptions.splice(index, 1);
      setPollOptions(updatedOptions);
    }
  }}
  onCancelPoll={() => {
    setShowPoll(false);
    setPollOptions([{ text: "" }, { text: "" }]);
  }}
  onTitleEmojiClick={() => handleOpenEmoji("title")}
  onContentEmojiClick={() => handleOpenEmoji("content")} // Add this line
/>


<PostToolbar
  selectedCategory={selectedCategory}
  categories={categories}
  onCategorySelect={setSelectedCategory}
  onImageUpload={(file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
  }}
  onYoutubeClick={handleOpenYoutube}
  onPollClick={() => setShowPoll(!showPoll)}
  
/>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end mt-4 gap-2 px-4 pb-4 flex-shrink-0 border-t border-gray-100 pt-4">
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={submitting}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!isPostButtonEnabled}
            onClick={handleSubmit}
          >
            POST
          </Button>
        </div>
      </div>

      {/* Lazy loaded extensions */}
      {showExtensions && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(144,144,144,0.6)] bg-opacity-50">
              <CircularProgress />
            </div>
          }
        >
          <PostExtensions
            type={extensionType}
            emojiTarget={emojiTarget}
            onClose={handleCloseExtensions}
            onYoutubeAdd={(video) => {
              setYoutubeVideo(video);
              handleCloseExtensions();
            }}
            onEmojiSelect={handleEmojiSelect}
          />
        </Suspense>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default CreatePostModal;