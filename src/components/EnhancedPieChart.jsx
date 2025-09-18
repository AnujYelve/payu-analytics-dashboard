import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import SafeResponsiveContainer from './SafeResponsiveContainer';

const EnhancedPieChart = ({ data, title, colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'] }) => {
  if (!data || Object.keys(data).length === 0) {
    console.log(`⚠️ Data missing for ${title} - using default 0%`);
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available</p>
            <p className="text-sm text-gray-400">Upload a file to see data</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert data object to array format for Recharts
  const chartData = Object.entries(data).map(([name, value], index) => ({
    name,
    value: parseFloat(value),
    color: colors[index % colors.length]
  }));

  // Calculate total for percentage display
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  // Dynamic container height: grow with significant legend items to prevent overlaps
  const THRESHOLD = 5;
  const significantCount = chartData.filter(it => ((it.value || 0) / (total || 1)) * 100 > THRESHOLD).length;
  const estimatedLegendRows = Math.max(1, Math.ceil(significantCount / 3));
  // Make chart taller on larger screens, compact on mobile
  const dynamicHeight = Math.max(280, 220 + estimatedLegendRows * 32);

  // Custom label function to show percentages inside slices
  const renderLabel = (entry) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: {data.value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">
            Percentage: {percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend (only show slices > 5%)
  const renderLegend = (props) => {
    const { payload } = props;
    const filtered = (payload || []).filter(e => ((e?.payload?.value || 0) / total) * 100 > THRESHOLD);

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {filtered.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value} ({((entry.payload.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  console.log(`📊 Rendering ${title} pie chart with data:`, chartData);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div style={{ height: dynamicHeight }}>
        {/* Wrap with SafeResponsiveContainer to avoid initial 0-size on mobile */}
        <SafeResponsiveContainer height={dynamicHeight}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // Slightly reduce radius so labels/legend don't overflow on mobile
              outerRadius={50}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </SafeResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Total: {total.toLocaleString()}
      </div>
    </div>
  );
};

export default EnhancedPieChart;
