// // app/community/profile/_components/AdditionalProfileInfo.tsx

// "use client";
// import { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useAuth, User } from "../../../../src/context/AuthContext";
// import {
//   TextField, Button, Alert, Snackbar, MenuItem,
//   FormControl, InputLabel, Select, FormHelperText
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// interface AdditionalProfileInfoProps {
//   user: User;
//   onUpdateStart: () => void;
//   onUpdateEnd: () => void;
// }

// // Zod schema for validation
// const profileSchema = z.object({
//   city: z.string().max(50, "City name is too long").optional().or(z.literal('')),
//   whatsappNumber: z.string().max(20, "Number is too long").optional().or(z.literal('')),
//   bloodGroup: z.string().max(5, "Invalid blood group").optional().or(z.literal('')),
//   height: z.preprocess((val) => Number(val) || undefined, z.number().min(50, "Height must be at least 50cm").max(300, "Height cannot exceed 300cm").optional()),
//   weight: z.preprocess((val) => Number(val) || undefined, z.number().min(20, "Weight must be at least 20kg").max(500, "Weight cannot exceed 500kg").optional()),
//   goals: z.string().max(1000, "Goals text is too long").optional().or(z.literal('')),
//   dob: z.date().min(new Date("1900-01-01"), "Invalid date of birth").max(new Date(), "Date of birth cannot be in the future").optional().nullable(),
//   acdStarClubRegisterDate: z.date().optional().nullable(),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//  const themeYellow = {
//     primary: "#FFC107", // Amber/Yellow
//     primaryDark: "#FFA000", // Darker Yellow
//     primaryLight: "#FFECB3", // Lighter Yellow
//     text: "#212121", // Dark text for contrast
//   };

// export default function AdditionalProfileInfo({ user, onUpdateStart, onUpdateEnd }: AdditionalProfileInfoProps) {
//   const { updateProfile } = useAuth();
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

//   const { control, register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       city: user.city || "",
//       whatsappNumber: user.whatsappNumber || "",
//       bloodGroup: user.bloodGroup || "",
//       height: user.height || undefined,
//       weight: user.weight || undefined,
//       goals: user.goals || "",
//       dob: user.dob ? new Date(user.dob) : null,
//       acdStarClubRegisterDate: user.acdStarClubRegisterDate ? new Date(user.acdStarClubRegisterDate) : null,
//     },
//   });

//   useEffect(() => {
//     reset({
//       city: user.city || "",
//       whatsappNumber: user.whatsappNumber || "",
//       bloodGroup: user.bloodGroup || "",
//       height: user.height || undefined,
//       weight: user.weight || undefined,
//       goals: user.goals || "",
//       dob: user.dob ? new Date(user.dob) : null,
//       acdStarClubRegisterDate: user.acdStarClubRegisterDate ? new Date(user.acdStarClubRegisterDate) : null,
//     });
//   }, [user, reset]);

//   const onSubmit = async (data: ProfileFormData) => {
//     onUpdateStart();
//     try {
//       const result = await updateProfile(data);
//       if (result) {
//         setSnackbar({ open: true, message: "Additional info updated successfully!", severity: "success" });
//         reset(data); // Resets form's 'dirty' state
//       } else {
//         throw new Error("Failed to update profile.");
//       }
//     } catch (err) {
//       setSnackbar({ open: true, message: "An error occurred. Please try again.", severity: "error" });
//     } finally {
//       onUpdateEnd();
//     }
//   };

//   return (
//     <div className="mt-6">
//       <h3 className="text-xl font-bold mb-4">Additional Information</h3>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Read-only fields */}
//           <TextField label="Email" value={user.email} InputProps={{ readOnly: true }} fullWidth   sx={{
//     '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//       borderColor: themeYellow.primary, // Yellow color
//     },
//     '& .Mui-focused.MuiInputLabel-root': {
//       color: themeYellow.primary, // Yellow color
//     }
//   }}/>
//           <TextField label="Membership ID" value={user.membershipId || "Will be generated on first update"} InputProps={{ readOnly: true }} fullWidth   sx={{
    
//     '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//       borderColor: themeYellow.primary, // Yellow color
//     },
    
//     '& .Mui-focused.MuiInputLabel-root': {
//       color: themeYellow.primary, // Yellow color
//     }
//   }} />
          
//           {/* Editable fields */}
//           <TextField label="City" {...register("city")} error={!!errors.city} helperText={errors.city?.message} fullWidth    />
//           <TextField label="WhatsApp Number" {...register("whatsappNumber")} error={!!errors.whatsappNumber} helperText={errors.whatsappNumber?.message} fullWidth />
//           <TextField label="Height (cm)" type="number" {...register("height")} error={!!errors.height} helperText={errors.height?.message} fullWidth />
//           <TextField label="Weight (kg)" type="number" {...register("weight")} error={!!errors.weight} helperText={errors.weight?.message} fullWidth />

//           <FormControl fullWidth error={!!errors.bloodGroup}>
//             <InputLabel>Blood Group</InputLabel>
//             <Controller
//               name="bloodGroup"
//               control={control}
//               render={({ field }) => (
//                 <Select label="Blood Group" {...field}>
//                   <MenuItem value=""><em>None</em></MenuItem>
//                   {bloodGroups.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
//                 </Select>
//               )}
//             />
//             <FormHelperText>{errors.bloodGroup?.message}</FormHelperText>
//           </FormControl>
          
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//              <Controller
//                 name="dob"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker 
//                     label="Date of Birth"
//                     {...field}
//                     disableFuture
//                     slotProps={{ textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob?.message } }}
//                   />
//                 )}
//              />
//              <Controller
//                 name="acdStarClubRegisterDate"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker 
//                     label="ACD Star Club Registration Date"
//                     {...field}
//                     disableFuture
//                     slotProps={{ textField: { fullWidth: true, error: !!errors.acdStarClubRegisterDate, helperText: errors.acdStarClubRegisterDate?.message } }}
//                   />
//                 )}
//              />
//           </LocalizationProvider>
          
//           <TextField 
//             label="Your Goals" 
//             {...register("goals")} 
//             error={!!errors.goals} 
//             helperText={errors.goals?.message}
//             fullWidth
//             multiline
//             rows={4}
//             className="md:col-span-2" // Make this field span both columns on medium screens and up
//           />
//         </div>
//         <div className="mt-4">
//           <Button type="submit" variant="contained" disabled={!isDirty}  sx={{ bgcolor: themeYellow.primary, color: themeYellow.text, "&:hover": { bgcolor: themeYellow.primaryDark }}}>
//             Save Additional Info
//           </Button>
//         </div>
//       </form>
//       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//         <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// } 





// app/community/profile/_components/AdditionalProfileInfo.tsx

"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, User } from "../../../../src/context/AuthContext";
import {
  TextField, Button, Alert, Snackbar, MenuItem,
  FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface AdditionalProfileInfoProps {
  user: User;
  onUpdateStart: () => void;
  onUpdateEnd: () => void;
}

// Zod schema for validation - FINAL CORRECTED VERSION
const profileSchema = z.object({
  city: z.string().max(50, "City name is too long").optional().or(z.literal('')),
  whatsappNumber: z.string().max(20, "Number is too long").optional().or(z.literal('')),
  bloodGroup: z.string().max(5, "Invalid blood group").optional().or(z.literal('')),
  
  // This schema now accepts an empty string OR a string that can be converted to a valid number.
  height: z.string().optional().refine(val => {
    if (!val || val.trim() === '') return true; // Allow empty
    const num = Number(val);
    return !isNaN(num) && num >= 50 && num <= 300;
  }, { message: "Height must be a number between 50 and 300" }),

  weight: z.string().optional().refine(val => {
    if (!val || val.trim() === '') return true; // Allow empty
    const num = Number(val);
    return !isNaN(num) && num >= 20 && num <= 500;
  }, { message: "Weight must be a number between 20 and 500" }),
  
  goals: z.string().max(1000, "Goals text is too long").optional().or(z.literal('')),
  dob: z.date().min(new Date("1900-01-01"), "Invalid date of birth").max(new Date(), "Date of birth cannot be in the future").optional().nullable(),
  acdStarClubRegisterDate: z.date().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const themeYellow = {
  primary: "#FFC107",
  primaryDark: "#FFA000",
  text: "#212121",
};

export default function AdditionalProfileInfo({ user, onUpdateStart, onUpdateEnd }: AdditionalProfileInfoProps) {
  const { updateProfile } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const { control, register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    // --- FIX #2: Default values for height/weight must be strings to match the input fields ---
    defaultValues: {
      city: user.city || "",
      whatsappNumber: user.whatsappNumber || "",
      bloodGroup: user.bloodGroup || "",
      height: user.height?.toString() || "", // Convert number to string
      weight: user.weight?.toString() || "", // Convert number to string
      goals: user.goals || "",
      dob: user.dob ? new Date(user.dob) : null,
      acdStarClubRegisterDate: user.acdStarClubRegisterDate ? new Date(user.acdStarClubRegisterDate) : null,
    },
  });

  useEffect(() => {
    reset({
      city: user.city || "",
      whatsappNumber: user.whatsappNumber || "",
      bloodGroup: user.bloodGroup || "",
      height: user.height?.toString() || "",
      weight: user.weight?.toString() || "",
      goals: user.goals || "",
      dob: user.dob ? new Date(user.dob) : null,
      acdStarClubRegisterDate: user.acdStarClubRegisterDate ? new Date(user.acdStarClubRegisterDate) : null,
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    // Convert height and weight back to numbers before sending to the API
    const dataToSend = {
      ...data,
      height: data.height ? Number(data.height) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
    };

    onUpdateStart();
    try {
      const result = await updateProfile(dataToSend);
      if (result) {
        setSnackbar({ open: true, message: "Additional info updated successfully!", severity: "success" });
        reset(data);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (err) {
      setSnackbar({ open: true, message: "An error occurred. Please try again.", severity: "error" });
    } finally {
      onUpdateEnd();
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Additional Information</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Email" value={user.email} InputProps={{ readOnly: true }} fullWidth sx={{ '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: themeYellow.primary }, '& .Mui-focused.MuiInputLabel-root': { color: themeYellow.primary } }} />
          <TextField label="Membership ID" value={user.membershipId || "Will be generated on first update"} InputProps={{ readOnly: true }} fullWidth sx={{ '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: themeYellow.primary }, '& .Mui-focused.MuiInputLabel-root': { color: themeYellow.primary } }} />
          <TextField label="City" {...register("city")} error={!!errors.city} helperText={errors.city?.message} fullWidth />
          <TextField label="WhatsApp Number" {...register("whatsappNumber")} error={!!errors.whatsappNumber} helperText={errors.whatsappNumber?.message} fullWidth />
          <TextField label="Height (cm)" type="number" {...register("height")} error={!!errors.height} helperText={errors.height?.message} fullWidth />
          <TextField label="Weight (kg)" type="number" {...register("weight")} error={!!errors.weight} helperText={errors.weight?.message} fullWidth />
          <FormControl fullWidth error={!!errors.bloodGroup}>
            <InputLabel>Blood Group</InputLabel>
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <Select label="Blood Group" {...field}>
                <MenuItem value=""><em>None</em></MenuItem>
                {bloodGroups.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
              </Select>
            )} />
            <FormHelperText>{errors.bloodGroup?.message}</FormHelperText>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller name="dob" control={control} render={({ field }) => (
              <DatePicker label="Date of Birth" {...field} disableFuture slotProps={{ textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob?.message } }} />
            )} />
            <Controller name="acdStarClubRegisterDate" control={control} render={({ field }) => (
              <DatePicker label="ACD Star Club Registration Date" {...field} disableFuture slotProps={{ textField: { fullWidth: true, error: !!errors.acdStarClubRegisterDate, helperText: errors.acdStarClubRegisterDate?.message } }} />
            )} />
          </LocalizationProvider>
          <TextField label="Your Goals" {...register("goals")} error={!!errors.goals} helperText={errors.goals?.message} fullWidth multiline rows={4} className="md:col-span-2" />
        </div>
        <div className="mt-4">
          <Button type="submit" variant="contained" disabled={!isDirty} sx={{ bgcolor: themeYellow.primary, color: themeYellow.text, "&:hover": { bgcolor: themeYellow.primaryDark } }}>
            Save Additional Info
          </Button>
        </div>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}