"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"; // Import Button
import { useRef, useState } from "react"; // Import useRef and useState
import * as XLSX from "xlsx"; // Import xlsx library
import { importRegistrations } from "./actions"; // Import the server action

interface Registration {
  id: number;
  full_name: string;
  department: string;
  registered_at: string;
  session: string;
}

const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80, // Smaller size for ID
    maxSize: 80,
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
      const date = new Date(row.getValue("registered_at"));
      return date.toLocaleString(); // Format date nicely
    },
  },
  {
    accessorKey: "session",
    header: "Session",
    size: 100, // Smaller size for Session
    maxSize: 100,
  },
];

export function RegistrationsClientWrapper({ registrations }: { registrations: Registration[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

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
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

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
      <div className="flex justify-end mb-4">
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
      <DataTable columns={columns} data={registrations} />
    </div>
  );
}
