import React, { useState, ChangeEvent, ClipboardEvent } from 'react';
import { Clipboard, FilePlus, Brain } from 'lucide-react';

interface BaseInputProps {
    handleInit: (input: string, initType: string) => void;
}

export const BaseInput = ({ handleInit }) => {
    // The function to handle the paste event
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            handleInit(text, 'baseInput');
        } catch (error) {
            console.error('Failed to read from clipboard', error);
            // Here, you might want to show an error message to the user.
        }
    };

    // Function to handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const text = await file.text();
                handleInit(text, 'baseInput');
            } catch (error) {
                console.error('Error reading file:', error);
                // Here, you might want to show an error message to the user.
            }
        } else {
            console.error('Unsupported file type');
            // Here, you might want to show an error message to the user.
        }
    };

    // Function to start from scratch
    const handleStartFromScratch = () => {
        handleInit('', 'scratch');
    };

    return (
        <div className="flex flex-col items-center space-y-4 mt-10">
            <div className="bg-white shadow rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-center text-2xl font-bold mb-4">Upload What You Want to Edit</h2>

                <div className="flex flex-col items-center space-y-4">
                    <button
                        className="flex items-center px-4 py-2 border rounded-md shadow text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={handlePaste}
                    >
                        <Clipboard className="mr-2" />
                        Paste Clipboard content
                    </button>

                    <div className="flex flex-col items-center">
                        <label className="flex items-center px-4 py-2 border rounded-md shadow text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer">
                            <FilePlus className="mr-2" />
                            Upload File (.py, .js, .tsx, ...)
                            <input type="file" className="hidden" onChange={handleFileUpload} accept=".py,.tsx" />
                        </label>
                        <span className="text-xs text-gray-500">Supported files: .py, .tsx</span>
                    </div>

                    <div className="w-full relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            className="flex items-center px-4 py-2 border rounded-md shadow text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            onClick={handleStartFromScratch}
                        >
                            <Brain className="mr-2" /> {/* Replace with the actual icon component */}
                            Start from Scratch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
