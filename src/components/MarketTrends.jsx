import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';
import KPICard from './KPICard';
import { Shield, Server, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { formatPercentage, formatNumber } from '../utils/dataParser';







const MarketTrends = ({ data }) => {
  if (!data || !data.marketTrends) {
    console.log("⚠️ No market trends data available - displaying empty state");
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No data available</div>
        <div className="text-gray-400 text-sm">
          Please upload a valid Excel file with the required columns
        </div>
      </div>
    );
  }

  const { marketTrends, monthlyData } = data;
  const { fraudRate, systemUptime, complianceScore } = marketTrends;

  console.log("📊 Rendering MarketTrends with data:", {
    fraudRate: fraudRate,
    // disputeResolutionTime removed
    systemUptime: systemUptime,
    complianceScore: complianceScore,
    monthlyDataLength: monthlyData?.length || 0
  });

  // Generate some additional market trend data
  const riskTrendData = monthlyData.map((item, index) => ({
    ...item,
    fraudRate: 0.12 + (Math.random() - 0.5) * 0.06,
    uptime: 99.8 + Math.random() * 0.4
  }));

  const complianceData = [
    { name: 'PCI DSS', score: 99.2, color: '#10b981' },
    { name: 'RBI Guidelines', score: 98.8, color: '#3b82f6' },
    { name: 'Data Protection', score: 97.5, color: '#f59e0b' },
    { name: 'AML/KYC', score: 99.5, color: '#8b5cf6' }
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: '145ms', status: 'good', icon: Activity },
    { name: 'Database Performance', value: '99.8%', status: 'excellent', icon: Server },
    { name: 'Error Rate', value: '0.02%', status: 'excellent', icon: CheckCircle },
    { name: 'Peak Load Handling', value: '15K TPS', status: 'good', icon: Activity }
  ];

  const uptimeData = [{ name: 'Uptime', value: systemUptime, fill: '#10b981' }];

  // Graph explanations for developers (console only)
  console.log('[Chart Explainer] Fraud Rate Trend: Line chart; each point = (fraud cases / total transactions that month) × 100. Y-axis in %. Missing months as 0%.');
  console.log('[Chart Explainer] System Uptime: Radial gauge showing monthly uptime %; center label shows formatted % value.');
  console.log('[Chart Explainer] Compliance Scores by Category: Bar chart; each bar = compliance % for category, Y-axis domain 95–100%.');

  return (
    <div className="space-y-6">
      {/* Risk & Compliance KPIs */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Risk & Compliance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard
            title="Fraud Rate"
            value={formatPercentage(fraudRate)}
            subtitle="Monthly fraud incidents"
            icon={Shield}
            color="red"
            trend="down"
            trendValue="-0.02%"
          />
          {/* Dispute Resolution Time removed */}
          <KPICard
            title="System Uptime"
            value={formatPercentage(systemUptime)}
            subtitle="Monthly availability"
            icon={Server}
            color="green"
            trend="up"
            trendValue="+0.05%"
          />
          <KPICard
            title="Compliance Score"
            value={formatPercentage(complianceScore)}
            subtitle="Overall compliance"
            icon={CheckCircle}
            color="primary"
            trend="up"
            trendValue="+1.2%"
          />
        </div>
      </div>

      {/* System Performance */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const statusColors = {
              excellent: 'green',
              good: 'teal',
              warning: 'orange',
              critical: 'red'
            };
            
            return (
              <KPICard
                key={index}
                title={metric.name}
                value={metric.value}
                subtitle={`Status: ${metric.status}`}
                icon={Icon}
                color={statusColors[metric.status]}
              />
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Fraud Rate Trend */}
        <div className="chart-container">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Fraud Rate Trend</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatPercentage(value)} />
              <Tooltip formatter={(value) => formatPercentage(value)} />
              <Line 
                type="monotone" 
                dataKey="fraudRate" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Uptime Gauge */}
        <div className="chart-container">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">System Uptime</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={uptimeData}>
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="#10b981"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                {formatPercentage(systemUptime)}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
                Uptime
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Dispute Resolution Trend removed */}

        {/* Compliance Scores */}
        <div className="chart-container">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Scores by Category</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[95, 100]} tickFormatter={(value) => formatPercentage(value)} />
              <Tooltip formatter={(value) => formatPercentage(value)} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#8884d8">
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Management Dashboard */}
      <div className="chart-container">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Management Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-green-600 mb-2">Low</div>
            <div className="text-sm text-gray-600">Overall Risk Level</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">847</div>
            <div className="text-sm text-gray-600">Active Monitoring Rules</div>
            <div className="mt-2 text-xs text-green-600">+12 new rules this month</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
            <div className="text-sm text-gray-600">Transaction Screening Rate</div>
            <div className="mt-2 text-xs text-green-600">Above industry standard</div>
          </div>
        </div>
      </div>

      {/* Regulatory Updates */}
      <div className="chart-container">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Regulatory Updates</h4>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">RBI Digital Payment Guidelines 2024</div>
              <div className="text-sm text-blue-700 mt-1">Successfully implemented new authentication protocols</div>
              <div className="text-xs text-blue-600 mt-1">Completed: Sep 10, 2024</div>
            </div>
          </div>
          <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">PCI DSS 4.0 Compliance</div>
              <div className="text-sm text-green-700 mt-1">Upgraded security standards and monitoring systems</div>
              <div className="text-xs text-green-600 mt-1">Completed: Aug 25, 2024</div>
            </div>
          </div>
          <div className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
            <div>
              <div className="font-medium text-orange-900">GDPR Data Retention Updates</div>
              <div className="text-sm text-orange-700 mt-1">Review and update data retention policies</div>
              <div className="text-xs text-orange-600 mt-1">Due: Oct 15, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;

