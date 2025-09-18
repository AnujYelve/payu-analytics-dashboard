import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell, Legend } from 'recharts';
import KPICard from './KPICard';
import { Users, UserCheck, Heart, Star, TrendingUp, UserX } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/dataParser';




const CustomerSentiments = ({ data }) => {
  if (!data || !data.customerSentiments) {
    console.log("⚠️ No customer sentiments data available - displaying empty state");
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No data available</div>
        <div className="text-gray-400 text-sm">
          Please upload a valid Excel file with the required columns
        </div>
      </div>
    );
  }

  const { customerSentiments, monthlyData } = data;
  const { merchants, topSegments, customerRetention, nps, sentimentScore } = customerSentiments;

  console.log("📊 Rendering CustomerSentiments with data:", {
    merchants: merchants,
    topSegments: topSegments,
    customerRetention: customerRetention,
    nps: nps,
    sentimentScore: sentimentScore,
    monthlyDataLength: monthlyData?.length || 0
  });

  const npsData = [
    { name: 'NPS Score', value: nps, fill: '#10b981' }
  ];

  const sentimentData = [
    { name: 'Sentiment', value: (sentimentScore / 5) * 100, fill: '#3b82f6' }
  ];

  const segmentColors = ['#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Custom dot renderer for low TPV values
  const renderSegmentDot = (props) => {
    const { cx, cy, payload, index } = props;
    const max = Math.max(...(topSegments || []).map(s => s.tpv || 0), 0);
    const low = (payload?.tpv || 0) < max * 0.2;
    return (
      <circle key={`seg-dot-${index}`} cx={cx} cy={cy} r={6} strokeWidth={2} stroke="#ffffff" fill={low ? '#ef4444' : '#3b82f6'} />
    );
  };

  // Graph explanations for developers (console only)
  console.log('[Chart Explainer] Top Merchant Segments by TPV: Simple line chart; each point = a merchant segment, positioned left-to-right by TPV; the higher the point, the more money moved. Tooltip shows the amount in rupees.');
  console.log('[Chart Explainer] Net Promoter Score: Radial gauge; center label shows NPS (from -100 to 100).');
  console.log('[Chart Explainer] Customer Sentiment Score: Radial gauge; center shows sentiment out of 5 converted to % radius.');
  console.log('[Chart Explainer] Monthly Transaction Volume: Line chart; Y-axis counts transactions, X-axis months; missing months as 0.');

  return (
    <div className="space-y-6">
      {/* Merchant KPIs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Merchant Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Active Merchants"
            value={formatNumber(merchants.active)}
            subtitle="Currently active"
            icon={Users}
            color="primary"
            trend="up"
            trendValue="+8.2%"
          />
          <KPICard
            title="Total Onboarded"
            value={formatNumber(merchants.onboarded)}
            subtitle="Lifetime merchants"
            icon={UserCheck}
            color="teal"
            trend="up"
            trendValue="+12.5%"
          />
          <KPICard
            title="Merchant Churn Rate"
            value={formatPercentage(merchants.churnRate)}
            subtitle="Monthly churn"
            icon={UserX}
            color="red"
            trend="down"
            trendValue="-0.8%"
          />
          <KPICard
            title="Activation Rate"
            value={formatPercentage(merchants.onboarded > 0 ? (merchants.active / merchants.onboarded) * 100 : 0)}
            subtitle="Active vs Onboarded"
            icon={TrendingUp}
            color="green"
            trend="up"
            trendValue="+2.1%"
          />
        </div>
      </div>

      {/* Customer Experience KPIs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Customer Retention"
            value={formatPercentage(customerRetention)}
            subtitle="Repeat transactions"
            icon={Heart}
            color="green"
            trend="up"
            trendValue="+3.2%"
          />
          <KPICard
            title="Net Promoter Score"
            value={nps}
            subtitle="Customer satisfaction"
            icon={Star}
            color="primary"
            trend="up"
            trendValue="+5 points"
          />
          <KPICard
            title="Sentiment Score"
            value={`${sentimentScore}/5`}
            subtitle="Overall sentiment"
            icon={Star}
            color="teal"
            trend="up"
            trendValue="+0.3 points"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Top Merchant Segments - simplified line chart */}
         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
           <h4 className="text-lg font-semibold text-gray-900 mb-2">Top Merchant Segments by TPV (Easy View)</h4>
           <p className="text-sm text-gray-600 mb-4">Each dot is a segment. Higher dot = more money processed.</p>
           {!topSegments || topSegments.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <div className="text-center">
                 <div className="text-4xl mb-2">📊</div>
                 <p>No merchant segment data available</p>
                 <p className="text-sm text-gray-400">Upload a file with merchant categories</p>
               </div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={[...topSegments].sort((a, b) => a.tpv - b.tpv)}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" angle={-20} textAnchor="end" height={50} />
                 <YAxis tickFormatter={(value) => formatCurrency(value)} />
                 <Tooltip formatter={(value) => formatCurrency(value)} />
                 <Legend />
                 <Line
                   type="monotone"
                   name="TPV"
                   dataKey="tpv"
                   stroke="#3b82f6"
                   strokeWidth={3}
                   dot={renderSegmentDot}
                   activeDot={{ r: 7 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           )}
         </div>

        {/* NPS Score Gauge */}
        <div className="chart-container">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Net Promoter Score</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={npsData}>
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="#10b981"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900">
                {nps}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
                NPS Score
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Sentiment Distribution */}
        <div className="chart-container">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Sentiment Score</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={sentimentData}>
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="#3b82f6"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900">
                {sentimentScore}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
                out of 5
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

         {/* Monthly Transaction Volume */}
         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
           <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Transaction Volume</h4>
           {!monthlyData || monthlyData.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <div className="text-center">
                 <div className="text-4xl mb-2">📈</div>
                 <p>No monthly transaction data available</p>
                 <p className="text-sm text-gray-400">Upload a file with date/timestamp data</p>
               </div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={monthlyData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="month" />
                 <YAxis tickFormatter={(value) => formatNumber(value)} />
                 <Tooltip formatter={(value) => formatNumber(value)} />
                 <Line 
                   type="monotone" 
                   dataKey="transactions" 
                   stroke="#8b5cf6" 
                   strokeWidth={3}
                   dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           )}
         </div>
      </div>

      {/* Merchant Segment Details */}
      <div className="chart-container">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Merchant Segment Performance Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Segment</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">TPV</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Share</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topSegments.map((segment, index) => {
                const totalTPV = topSegments.reduce((sum, s) => sum + s.tpv, 0);
                const share = (segment.tpv / totalTPV) * 100;
                const growthRates = ['+15.2%', '+12.8%', '+9.5%', '+18.7%', '+22.1%'];
                
                return (
                  <tr key={segment.name} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: segmentColors[index] }}
                        ></div>
                        {segment.name}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">{formatCurrency(segment.tpv)}</td>
                    <td className="text-right py-3 px-4">{formatPercentage(share)}</td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">{growthRates[index]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerSentiments;

