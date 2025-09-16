import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

const FileUpload = ({ onFileUpload, uploadedFile, onClearFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.csv')) {
        onFileUpload(file);
      } else {
        alert('Please upload a valid Excel (.xlsx, .xls) or CSV file.');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onClearFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Upload</h2>
      
      {!uploadedFile ? (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Upload your spreadsheet
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports Excel (.xlsx, .xls) and CSV files
          </p>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
            Choose File
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <FileSpreadsheet className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {uploadedFile && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            ✅ File uploaded successfully! Analytics data is now available in the dashboard below.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

