"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"; // Import Button
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { useRef, useState } from "react"; // Import useRef and useState
import * as XLSX from "xlsx"; // Import xlsx library
import { importRegistrations } from "./actions"; // Import the server action

interface ExcelRow {
  EmpID: string | number;
  ClockIn: string | number;
}

interface Registration {
  id: string; // This is now employee_id
  full_name: string;
  department: string;
  registered_at: string | null; // Can be null
  session_name: string | null; // Changed to session_name
  is_night_shift: boolean | null;
}

const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "id", // This is now employee_id
    header: "Employee ID", // Changed header
    size: 120,
    maxSize: 120,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "registered_at",
    header: "Registered At",
    cell: ({ row }) => {
      const registeredAt = row.getValue("registered_at") as string | null;
      return registeredAt ? new Date(registeredAt).toLocaleString() : 'N/A'; // Handle null
    },
  },
  {
    accessorKey: "session_name", // Corrected accessorKey
    header: "Session",
    size: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const sessionName = row.getValue("session_name") as string | null; // Corrected accessorKey
      return sessionName === 'day' ? 'Day' : (sessionName === 'night' ? 'Night' : 'N/A'); // Display Day/Night
    },
  },
  {
    accessorKey: "is_night_shift",
    header: () => <div className="text-center">Night Shift</div>,
    size: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const isNightShift = row.getValue("is_night_shift");
      return (
        <div className="flex justify-center">
          {isNightShift ? <Checkbox checked={true} disabled /> : <Checkbox checked={false} disabled />}
        </div>
      );
    },
  },
];

export function RegistrationsClientWrapper({ registrations }: { registrations: Registration[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showDay, setShowDay] = useState(true); // Default to showing Day
  const [showNight, setShowNight] = useState(true); // Default to showing Night
  const [showIsNightShift, setShowIsNightShift] = useState(true); // New state

  const filteredRegistrations = registrations.filter(reg => {
    if (!showDay && !showNight && !showIsNightShift) {
      return false;
    }

    if (showDay && showNight && showIsNightShift) {
      return true;
    }

    return (showDay && reg.session_name === 'day') ||
           (showNight && reg.session_name === 'night') ||
           (showIsNightShift && reg.is_night_shift);
  });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = json.map((row) => ({
          employee_id: String(row.EmpID), // Ensure EmpID is string
          registered_at: new Date(row.ClockIn).toISOString(), // Convert to ISO string
        }));

        // Call server action to import data
        const { error } = await importRegistrations(formattedData);

        if (error) {
          console.error("Error importing registrations:", error);
          alert("Error importing registrations: " + error.message);
        } else {
          alert("Registrations imported successfully!");
          // Optionally, refresh the page or update the table data
          window.location.reload();
        }
        setIsImporting(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4"> {/* Changed to justify-between */}
        <div className="flex items-center space-x-8"> {/* New div for filters, increased space-x */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filterDay"
              checked={showDay}
              onCheckedChange={(checked) => setShowDay(!!checked)}
            />
            <label
              htmlFor="filterDay"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Day
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filterNight"
              checked={showNight}
              onCheckedChange={(checked) => setShowNight(!!checked)}
            />
            <label
              htmlFor="filterNight"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Night
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filterNightShift"
              checked={showIsNightShift}
              onCheckedChange={(checked) => setShowIsNightShift(!!checked)}
            />
            <label
              htmlFor="filterNightShift"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Night Shift
            </label>
          </div>
        </div>
        <div className="flex justify-end"> {/* Original div for import button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
            disabled={isImporting}
          />
          <Button onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? "Importing..." : "Import Excel"}
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={filteredRegistrations} 
      showRefreshButton={true}
        showExportButton={true}/> {/* Use filteredRegistrations */}
    </div>
  );
}
