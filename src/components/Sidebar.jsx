import React from 'react';
import { BarChart3, Users, TrendingUp } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'product-performance',
      label: 'Product Performance',
      icon: BarChart3,
      description: 'TPV, Revenue & Transaction Metrics'
    },
    {
      id: 'customer-sentiments',
      label: 'Customer Sentiments',
      icon: Users,
      description: 'Merchant & Customer Analytics'
    },
    {
      id: 'market-trends',
      label: 'Market Trends',
      icon: TrendingUp,
      description: 'Risk, Compliance & Market Data'
    }
  ];

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">PayU Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Fintech Dashboard</p>
      </div>
      
      <nav className="mt-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center">
                <Icon className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <div>Version 1.0.0</div>
          <div className="mt-1">© 2024 PayU Analytics</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

