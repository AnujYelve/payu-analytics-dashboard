import React from 'react';
import FileUpload from './FileUpload';
import ProductPerformance from './ProductPerformance';
import CustomerSentiments from './CustomerSentiments';
import MarketTrends from './MarketTrends';

const Dashboard = ({ 
  activeTab, 
  uploadedFile, 
  onFileUpload, 
  onClearFile, 
  dashboardData 
}) => {
  const renderTabContent = () => {
    if (!dashboardData) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No data available</div>
          <div className="text-gray-400 text-sm">
            Please upload a spreadsheet to view analytics
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'product-performance':
        return <ProductPerformance data={dashboardData} />;
      case 'customer-sentiments':
        return <CustomerSentiments data={dashboardData} />;
      case 'market-trends':
        return <MarketTrends data={dashboardData} />;
      default:
        return <ProductPerformance data={dashboardData} />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'product-performance':
        return 'Product Performance Analytics';
      case 'customer-sentiments':
        return 'Customer Sentiments & Merchant Analytics';
      case 'market-trends':
        return 'Market Trends & Risk Analytics';
      default:
        return 'Product Performance Analytics';
    }
  };

  return (
    <div className="ml-80 min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getTabTitle()}
          </h2>
          <p className="text-gray-600">
            Real-time insights and analytics for your fintech operations
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileUpload={onFileUpload}
            uploadedFile={uploadedFile}
            onClearFile={onClearFile}
          />
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>PayU Analytics Dashboard • Built with React & Tailwind CSS</p>
            <p className="mt-1">Data refreshed: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

