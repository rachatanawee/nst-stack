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
      if (!registeredAt) return 'N/A';

      const date = new Date(registeredAt);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate;
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
  const [importProgress, setImportProgress] = useState<string>("");

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
      setImportProgress("กำลังอ่านไฟล์ Excel...");

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setImportProgress("กำลังประมวลผลข้อมูล...");
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

          const formattedData = json.map((row, index) => ({
            employee_id: String(row.EmpID), // Ensure EmpID is string
            registered_at: new Date().toISOString(), // Use current GMT+7 time
            rowNumber: index + 2, // Excel row number (add 2 for header row)
          }));

          setImportProgress(`กำลังนำเข้า ${formattedData.length} รายการ...`);

          // Call server action to import data
          const { error, results } = await importRegistrations(formattedData);

          if (error) {
            console.error("Import completed with errors:", error);

            // Show user-friendly summary
            const successCount = results?.successful || 0;
            const failCount = results?.failed || 0;
            const totalCount = successCount + failCount;

            let message = `📊 Import Summary\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            message += `✅ Successfully imported: ${successCount} records\n`;
            message += `❌ Failed to import: ${failCount} records\n`;
            message += `📈 Success rate: ${totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%\n\n`;

            if (results?.errors && results.errors.length > 0) {
              message += `🔍 First ${Math.min(3, results.errors.length)} errors:\n`;
              message += `─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n`;
              results.errors.slice(0, 3).forEach((err, index) => {
                message += `${index + 1}. Row ${err.row} (${err.employee_id})\n`;
                message += `   Error: ${err.error}\n\n`;
              });

              if (results.errors.length > 3) {
                message += `... and ${results.errors.length - 3} more errors\n`;
              }

              message += `\n💡 Check browser console (F12) for complete error list.`;
            } else {
              message += `🎉 All records processed without specific errors!`;
            }

            alert(message);
          } else {
            const successCount = results?.successful || 0;
            alert(`🎉 Import Successful!\n\n✅ All ${successCount} records imported successfully!\n\nNo errors found.`);
          }

          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Import failed:", error);
          alert("❌ Import failed! Please check the file format and try again.");
        } finally {
          setIsImporting(false);
          setImportProgress("");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isImporting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg border max-w-md mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="font-semibold text-gray-900">กำลังนำเข้าข้อมูล</h3>
                <p className="text-sm text-gray-600">{importProgress}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              กรุณาอย่าปิดหรือรีโหลดหน้าเว็บ
            </div>
          </div>
        </div>
      )}

      <div className={`${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterDay"
                checked={showDay}
                disabled={isImporting}
                onCheckedChange={(checked) => setShowDay(!!checked)}
              />
              <label
                htmlFor="filterDay"
                className={`text-sm font-medium leading-none ${isImporting ? 'cursor-not-allowed opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}`}
              >
                Day
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterNight"
                checked={showNight}
                disabled={isImporting}
                onCheckedChange={(checked) => setShowNight(!!checked)}
              />
              <label
                htmlFor="filterNight"
                className={`text-sm font-medium leading-none ${isImporting ? 'cursor-not-allowed opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}`}
              >
                Night
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterNightShift"
                checked={showIsNightShift}
                disabled={isImporting}
                onCheckedChange={(checked) => setShowIsNightShift(!!checked)}
              />
              <label
                htmlFor="filterNightShift"
                className={`text-sm font-medium leading-none ${isImporting ? 'cursor-not-allowed opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}`}
              >
                Night Shift
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="hidden"
              disabled={isImporting}
            />
            <Button onClick={handleImportClick} disabled={isImporting}>
              {isImporting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังนำเข้า...</span>
                </div>
              ) : (
                "Import Excel"
              )}
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredRegistrations}
          showRefreshButton={!isImporting}
          showExportButton={!isImporting}
          resourceName="registrations"
        />
      </div>
    </div>
  );
}
