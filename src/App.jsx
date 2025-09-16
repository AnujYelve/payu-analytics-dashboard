import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { parseFile, processExcelData, formatCurrency, formatPercentage, formatNumber } from "../src/utils/dataParser";

function App() {
  const [activeTab, setActiveTab] = useState('product-performance');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setUploadedFile(file);
    try {
      const parsedData = await parseFile(file);
      console.log("Raw Excel Data:", parsedData);
      const processedData = processExcelData(parsedData);
      console.log("Calculated KPIs:", processedData);
      setDashboardData(processedData);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing file. Please check the format and try again.");
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setDashboardData(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <Dashboard
        activeTab={activeTab}
        uploadedFile={uploadedFile}
        onFileUpload={handleFileUpload}
        onClearFile={handleClearFile}
        dashboardData={dashboardData}
      />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <div className="text-gray-900 font-medium">Processing file...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;