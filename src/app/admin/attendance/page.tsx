
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  CheckCircleOutline,
  CancelOutlined,
  ContentCopy,
  Download,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

// --- Types ---
interface IAttendanceRecord {
  date: string;
  status: "present";
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  attendance: IAttendanceRecord[];
}

interface IApiResponse {
  users: IUser[];
  totalPages: number;
  currentPage: number;
}

interface IFullApiResponse {
  users: IUser[];
}

// --- API Service with Credentials ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const attendanceService = {
  // Service for the paginated table view
  async getAttendance(page: number = 1, limit: number = 15): Promise<IApiResponse> {
    const response = await fetch(`${API_URL}/attendance/get?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <-- Added credentials
    });
    if (!response.ok) throw new Error("Failed to fetch attendance data. You may not be authorized.");
    return response.json();
  },
  // Service for fetching all data for export
  async getAllAttendanceForExport(): Promise<IFullApiResponse> {
    const response = await fetch(`${API_URL}/attendance/export-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <-- Added credentials
    });
    if (!response.ok) throw new Error("Failed to fetch data for export. You may not be authorized.");
    return response.json();
  },
};

// --- Helper function to generate date headers ---
const generateDateHeaders = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  return dates;
};

// --- Main Admin Page Component ---
export default function AttendanceAdminPage() {
  const [data, setData] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [copySuccess, setCopySuccess] = useState({ type: "", visible: false });

  const dateHeaders = useMemo(() => generateDateHeaders(14), []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await attendanceService.getAttendance(currentPage);
        setData(response.users);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const showCopySuccess = (type: "email" | "number") => {
    setCopySuccess({ type, visible: true });
    setTimeout(() => setCopySuccess({ type: "", visible: false }), 2000);
  };

  const handleCopyToClipboard = (text: string, type: "email" | "number") => {
    navigator.clipboard.writeText(text).then(() => showCopySuccess(type));
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const { users: allUsers } = await attendanceService.getAllAttendanceForExport();
      
      const allDates = new Set<string>();
      allUsers.forEach(user => {
        user.attendance.forEach(record => {
          allDates.add(new Date(record.date).toDateString());
        });
      });
      
      const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const dateHeaderLabels = sortedDates.map(d => new Date(d).toLocaleDateString('en-CA'));

      const excelData = allUsers.map(user => {
        const userRow: { [key: string]: any } = {
          Name: user.name,
          Email: user.email,
          "WhatsApp Number": user.whatsappNumber,
        };
        const attendanceMap = new Map(user.attendance.map(r => [new Date(r.date).toDateString(), "P"]));
        
        sortedDates.forEach((dateStr, index) => {
          userRow[dateHeaderLabels[index]] = attendanceMap.get(dateStr) || "A";
        });

        return userRow;
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Records");
      XLSX.writeFile(wb, "Full_Attendance_Report.xlsx");

    } catch (err: any) {
      
      setError(err.message || "Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const createAttendanceMap = (attendanceRecords: IAttendanceRecord[]) => {
    return new Map(attendanceRecords.map((r) => [new Date(r.date).toDateString(), true]));
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: "100%" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          User Attendance
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <Download />}
          onClick={handleExportToExcel}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export All to Excel'}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table stickyHeader aria-label="attendance table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Email
                      <Tooltip title="Copy emails on this page">
                        <IconButton onClick={() => handleCopyToClipboard(data.map(u => u.email).join("\n"), "email")} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Fade in={copySuccess.visible && copySuccess.type === 'email'}>
                        <Typography variant="caption" sx={{ color: "success.main" }}>Copied!</Typography>
                      </Fade>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 180 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      WhatsApp Number
                      <Tooltip title="Copy numbers on this page">
                        <IconButton onClick={() => handleCopyToClipboard(data.map(u => u.whatsappNumber).join("\n"), "number")} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Fade in={copySuccess.visible && copySuccess.type === 'number'}>
                        <Typography variant="caption" sx={{ color: "success.main" }}>Copied!</Typography>
                      </Fade>
                    </Box>
                  </TableCell>
                  {dateHeaders.map((date) => (
                    <TableCell key={date.toISOString()} align="center" sx={{ fontWeight: "bold" }}>
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user) => {
                  const attendanceMap = createAttendanceMap(user.attendance);
                  return (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.whatsappNumber}</TableCell>
                      {dateHeaders.map((headerDate) => (
                        <TableCell key={headerDate.toISOString()} align="center">
                          {attendanceMap.get(headerDate.toDateString()) ? (
                            <CheckCircleOutline color="success" fontSize="small" />
                          ) : (
                            <CancelOutlined color="disabled" fontSize="small" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
            <Typography>Page {currentPage} of {totalPages}</Typography>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</Button>
          </Box>
        </>
      )}
    </Box>
  );
}