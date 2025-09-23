



"use client";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuth, User } from "../../../context/AuthContext";
import {
  Snackbar,
  Alert,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import AdditionalProfileInfo from "./AdditionalProfileInfo";

interface ProfileEditTabProps {
  user: User
  onUpdateStart: () => void;
  onUpdateEnd: () => void;
}

export default function ProfileEditTab({
  user,
  onUpdateStart,
  onUpdateEnd,
}: ProfileEditTabProps) {
  const { updateProfile } = useAuth();
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");


  const themeYellow = {
    primary: "#FFC107", // Amber/Yellow
    primaryDark: "#FFA000", // Darker Yellow
    primaryLight: "#FFECB3", // Lighter Yellow
    text: "#212121", // Dark text for contrast
  };


  useEffect(() => {
    if (user) {
      setNameInput(user.name);
    }
  }, [user]);


  const validateName = (value: string) => {

    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return "Name should only contain letters and spaces";
    }


    if (value.length > 25) {
      return "Name should be up to 25 characters";
    }


    if (value.trim() === "") {
      return "Name is required";
    }

    return null;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNameInput(newValue);
    setNameError(validateName(newValue));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);


      setSnackbarMessage("Profile picture selected");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();


    const nameValidationError = validateName(nameInput);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    try {

      onUpdateStart();

      const result = await updateProfile({
        name: nameInput !== user.name ? nameInput : undefined,
        avatar: avatarFile,
      });

      if (result) {
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);


        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (err) {
      setSnackbarMessage("Failed to update profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {

      onUpdateEnd();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Edit Profile
      </Typography>

      <form onSubmit={handleProfileUpdate}>
         {/* ... (Your existing avatar and name fields JSX is unchanged) ... */}
        <div className="flex flex-col items-center mb-4"> {/* Using Tailwind for example */}
            <div className="relative">
                <img src={avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="h-32 w-32 rounded-full object-cover bg-gray-200" />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-yellow-400 text-black p-2 rounded-full cursor-pointer flex items-center justify-center">
                    <Camera size={20} />
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
            </div>
        </div>
        <TextField fullWidth label="Full Name" variant="outlined" value={nameInput} onChange={handleNameChange} error={!!nameError} helperText={nameError || "Letters only, up to 25 characters"} sx={{ mb: 3 }}/>
        <Button type="submit" variant="contained" disabled={!!nameError} sx={{ bgcolor: themeYellow.primary, color: themeYellow.text, "&:hover": { bgcolor: themeYellow.primaryDark }}}>
            Save Changes
        </Button>
      </form>
    
      <hr className="my-8" />
      <AdditionalProfileInfo 
        user={user} 
        onUpdateStart={onUpdateStart} 
        onUpdateEnd={onUpdateEnd} 
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            bgcolor: snackbarSeverity === "success" ? "#FFF9C4" : undefined,
            color:
              snackbarSeverity === "success" ? themeYellow.text : undefined,
            "& .MuiAlert-icon": {
              color:
                snackbarSeverity === "success"
                  ? themeYellow.primary
                  : undefined,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
