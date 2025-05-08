import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn/ui
import { File, FilePlus, XCircle, AlertTriangle } from 'lucide-react'; // For icons
import { cn } from '@/lib/utils'; // Utility for combining class names

// interface CSVUploadProps {
//     onFileChange: (file: File | null) => void;
//     errorMessage?: string; // Optional error message
//     clearError?: () => void; // Optional function to clear the error
// }

const CSVUpload = ({ onFileChange, errorMessage, clearError }) => {
    const [fileName, setFileName] = useState('');
    const inputRef = useRef(null);

    const handleFileChange = useCallback(
        (e) => {
            const file = e.target.files?.[0] || null;
            onFileChange(file);
            setFileName(file ? file.name : '');
            if (clearError) {
                clearError(); // Clear error on new file selection
            }
        },
        [onFileChange, clearError]
    );

    const triggerInput = () => {
        inputRef.current?.click();
    };

    const clearFile = () => {
        setFileName('');
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = ''; // Clear the input value
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    'flex items-center justify-between gap-4 p-4 rounded-lg border-2 transition-colors duration-300',
                    'bg-white/5 backdrop-blur-md',
                    fileName
                        ? 'border-green-500/50 text-green-400'
                        : 'border-dashed border-gray-700 text-gray-400 hover:border-gray-600',
                    errorMessage && 'border-red-500/50 text-red-400' // Apply red border if there's an error
                )}
                onClick={triggerInput} // Make the whole box clickable
                style={{ cursor: 'pointer' }}
            >
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={inputRef}
                    aria-label="Upload CSV file"
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {fileName ? (
                        <>
                            <File className="w-5 h-5 shrink-0" />
                            <span className="truncate text-sm font-medium">{fileName}</span>
                        </>
                    ) : (
                        <>
                            <FilePlus className="w-5 h-5 shrink-0" />
                            <span className="text-sm">Upload CSV File</span>
                        </>
                    )}
                </div>
                {fileName && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click from triggering input
                            clearFile();
                        }}
                        className="text-gray-400 hover:text-gray-300"
                        aria-label="Clear file"
                    >
                        <XCircle className="w-4 h-4" />
                    </Button>
                )}
            </div>
            {errorMessage && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm">{errorMessage}</p>
                </div>
            )}
        </div>
    );
};


export default CSVUpload