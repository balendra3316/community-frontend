
"use client";

import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../lib/Store"; // adjust path
import {
  createJournalEntry,
  updateJournalEntry,
  JournalEntry,
  JournalFormData,
} from "../../../lib/journalSlice"; // adjust path

// Schema: keep numeric fields coerced, notes defaulted
const formSchema = z.object({
  practiceDate: z.string().min(1, "Date is required"),
  minutes: z.coerce.number().min(1, "Must be at least 1 minute").max(1500, "Too high"),
  mood: z.coerce.number().min(1).max(5),
  energy: z.coerce.number().min(1).max(5),
   notes: z.string().min(1, "Notes are required.").max(500, "Notes cannot exceed 500 characters."),
});

type JournalFormInput = z.input<typeof formSchema>;
type JournalFormValues = z.output<typeof formSchema>;

interface JournalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit: JournalEntry | null;
  showNotification: (message: string, severity: "success" | "error") => void;
}

const marks = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

function emojiFor(val: number | undefined) {
  if (!val) return "😐";
  if (val <= 1) return "😞";
  if (val === 2) return "🙁";
  if (val === 3) return "😐";
  if (val === 4) return "🙂";
  return "😄";
}

function labelFor(val: number | undefined) {
  if (!val) return "Neutral";
  if (val <= 1) return "Very low";
  if (val === 2) return "Low";
  if (val === 3) return "Neutral";
  if (val === 4) return "Good";
  return "Great";
}

export default function JournalFormModal({
  isOpen,
  onClose,
  entryToEdit,
  showNotification,
}: JournalFormModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!entryToEdit;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<JournalFormInput, any, JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      practiceDate: dayjs().format("YYYY-MM-DD"),
      minutes: "30",
      mood: "3",
      energy: "3",
      notes: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (entryToEdit) {
      reset({
        ...entryToEdit,
        practiceDate: dayjs(entryToEdit.practiceDate).format("YYYY-MM-DD"),
        minutes: String((entryToEdit as any).minutes ?? 30),
        mood: String((entryToEdit as any).mood ?? 3),
        energy: String((entryToEdit as any).energy ?? 3),
        notes: (entryToEdit as any).notes ?? "",
      });
    } else {
      reset({
        practiceDate: dayjs().format("YYYY-MM-DD"),
        minutes: "30",
        mood: "3",
        energy: "3",
        notes: "",
      });
    }
  }, [isOpen, entryToEdit, reset]);

  const moodLive = watch("mood");
  const energyLive = watch("energy");
  const moodVal = useMemo(() => Number(moodLive ?? "3"), [moodLive]);
  const energyVal = useMemo(() => Number(energyLive ?? "3"), [energyLive]);

  const onSubmit = async (values: JournalFormValues) => {
    try {
      const entryData: JournalFormData = values;
      if (isEditMode && entryToEdit) {
        await dispatch(updateJournalEntry({ id: entryToEdit._id, entryData })).unwrap();
        showNotification("Entry updated successfully!", "success");
      } else {
        await dispatch(createJournalEntry(entryData)).unwrap();
        showNotification("Entry created successfully!", "success");
      }
      onClose();
    } catch (err: any) {
      showNotification(err?.message || "An error occurred.", "error");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="!pb-0">
        <div className="rounded-t-xl px-4 py-3 bg-gradient-to-r from-emerald-50 via-cyan-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Journal Entry" : "Add New Journal Entry"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Log practice details and track progress over time.
          </p>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="!pt-4">
          <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-white/70 backdrop-blur-sm p-5 space-y-6">
              {/* Date */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Practice Date</label>
                <Controller
                  name="practiceDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      slotProps={{
        // replaces InputProps.readOnly
        input: {
          readOnly: isEditMode,
        },
        // replaces inputProps min/max on the underlying <input>
        htmlInput: !isEditMode
          ? {
              min: dayjs().format("YYYY-MM-DD"),
              max: dayjs().format("YYYY-MM-DD"),
            }
          : undefined,
      }}
                    />
                  )}
                />
              </div>

              {/* Minutes */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Minutes Practiced</label>
                <Controller
                  name="minutes"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="number"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{ className: "bg-white rounded-md" }}
                    />
                  )}
                />
              </div>

              {/* Mood slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Mood
                  </span>
                  <span className="text-sm text-slate-600">
                    <span className="mr-1">{emojiFor(moodVal)}</span>
                    {labelFor(moodVal)}
                  </span>
                </div>
                <Controller
                  name="mood"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Slider
                        value={Number(field.value ?? 3)}
                        onChange={(_, v) => field.onChange(String(v as number))}
                        min={1}
                        max={5}
                        step={1}
                        marks={marks}
                        valueLabelDisplay="auto"
                        sx={{
                          color: "#10b981",
                        }}
                      />
                      {fieldState.error ? (
                        <p className="text-xs text-rose-600 mt-1">{fieldState.error.message}</p>
                      ) : (
                        <p className="text-xs opacity-0 mt-1">placeholder</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Energy slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Energy
                  </span>
                  <span className="text-sm text-slate-600">
                    <span className="mr-1">{emojiFor(energyVal)}</span>
                    {labelFor(energyVal)}
                  </span>
                </div>
                <Controller
                  name="energy"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Slider
                        value={Number(field.value ?? 3)}
                        onChange={(_, v) => field.onChange(String(v as number))}
                        min={1}
                        max={5}
                        step={1}
                        marks={marks}
                        valueLabelDisplay="auto"
                        sx={{
                          color: "#06b6d4",
                        }}
                      />
                      {fieldState.error ? (
                        <p className="text-xs text-rose-600 mt-1">{fieldState.error.message}</p>
                      ) : (
                        <p className="text-xs opacity-0 mt-1">placeholder</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="What did you work on? e.g., Footwork, spins, choreography..."
                      multiline
                      rows={4}
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{ className: "bg-white rounded-md" }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-emerald-100 via-cyan-100 to-indigo-100" />
          </div>
        </DialogContent>

        <DialogActions className="px-6 pb-5 pt-2">
          <Button
            onClick={onClose}
            color="inherit"
            className="!normal-case !text-slate-700 hover:!bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="!normal-case !bg-emerald-600 hover:!bg-emerald-700"
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
