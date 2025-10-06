import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from './axios'; 

// Define all the types we'll need


interface ProgressSummary {
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
     badges: string[]; 
}

export interface JournalEntry {
    _id: string;
    practiceDate: string;
    minutes: number;
    mood: number;
    energy: number;
    notes?: string;
}

export type JournalFormData = Omit<JournalEntry, '_id'>;
export type UpdateJournalPayload = { id: string; entryData: JournalFormData };

interface JournalPageState {
    summary: ProgressSummary | null;
    entries: JournalEntry[];
    datesWithEntries: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    

}

const initialState: JournalPageState = {
    summary: null,
    entries: [],
    datesWithEntries: [],
    status: 'idle',
    error: null,
   
};

// A single thunk to fetch all initial page data
export const fetchJournalPageData = createAsyncThunk('journal/fetchPageData', async (_, { rejectWithValue }) => {
    try {
        // Use Promise.all to run requests in parallel for speed
        const [summaryRes, entriesRes] = await Promise.all([
            axios.get('/journal/summary'), // Assumes your progress route is now here
            axios.get('/journal')
        ]);
        return {
            summary: summaryRes.data,
            entries: entriesRes.data
        };
    } catch (error: any) {
        return rejectWithValue('Failed to load journal data.');
    }
});

// All other mutation thunks (create, update, delete)
export const createJournalEntry = createAsyncThunk('journal/createEntry', async (entryData: JournalFormData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/journal', entryData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create entry');
    }
});

export const updateJournalEntry = createAsyncThunk('journal/updateEntry', async ({ id, entryData }: UpdateJournalPayload, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/journal/${id}`, entryData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update entry');
    }
});

export const deleteJournalEntry = createAsyncThunk('journal/deleteEntry', async (entryId: string, { rejectWithValue }) => {
    try {
        await axios.delete(`/journal/${entryId}`);
        return entryId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete entry');
    }
});

export const fetchJournalDatesForMonth = createAsyncThunk('journal/fetchDates', async ({ year, month }: { year: number; month: number }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/journal/dates?year=${year}&month=${month}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch dates');
    }
});


const journalPageSlice = createSlice({
    name: 'journalPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Initial Page Load
            .addCase(fetchJournalPageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJournalPageData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.summary = action.payload.summary;
                state.entries = action.payload.entries;
            })
            .addCase(fetchJournalPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Create
            .addCase(createJournalEntry.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
                state.entries.unshift(action.payload);
            })
            // Update
            .addCase(updateJournalEntry.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
                const index = state.entries.findIndex(entry => entry._id === action.payload._id);
                if (index !== -1) state.entries[index] = action.payload;
            })

        

                    
            // Delete
            .addCase(deleteJournalEntry.fulfilled, (state, action: PayloadAction<string>) => {
                state.entries = state.entries.filter(entry => entry._id !== action.payload);
                
            })
            // Calendar Dates
            .addCase(fetchJournalDatesForMonth.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.datesWithEntries = action.payload;
            });
    }
});

export default journalPageSlice.reducer;