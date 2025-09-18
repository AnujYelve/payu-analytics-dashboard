import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KPICard from './KPICard';
import EnhancedPieChart from './EnhancedPieChart';
import { DollarSign, CreditCard, TrendingUp, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/dataParser';






const ProductPerformance = ({ data }) => {
  if (!data || !data.productPerformance) {
    console.log("⚠️ No product performance data available - displaying empty state");
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No data available</div>
        <div className="text-gray-400 text-sm">
          Please upload a valid Excel file with the required columns
        </div>
      </div>
    );
  }

  const { productPerformance, monthlyData } = data;
  const { tpv, revenue, transactions, paymentMethods } = productPerformance;

  console.log("📊 Rendering ProductPerformance with data:", {
    tpv: tpv,
    revenue: revenue,
    transactions: transactions,
    paymentMethods: paymentMethods,
    monthlyDataLength: monthlyData?.length || 0
  });

  const paymentMethodColors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#14b8a6', '#f97316', '#ec4899', '#6366f1',
    '#84cc16', '#f59e0b', '#ef4444'
  ];
  
  const paymentMethodData = Object.entries(paymentMethods).map(([key, value], index) => ({
    name: key,
    value: parseFloat(value),
    color: paymentMethodColors[index % paymentMethodColors.length]
  }));

  const revenueData = Object.entries(revenue).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: value
  }));

  // Graph explanations for developers (console only)
  console.log('[Chart Explainer] Monthly TPV Trend: Line chart over Jan–Dec. Each point = monthly TPV; Y-axis is currency; X-axis is month. Missing months rendered as 0 to keep a consistent 12-month timeline.');
  console.log('[Chart Explainer] Payment Method Mix: Pie chart of payment method share. Labels show % inside slices; legend only shows methods >5%.');
  console.log('[Chart Explainer] Revenue by Business Unit: Bar chart of total revenue per business unit; bars sorted by provided order.');
  console.log('[Chart Explainer] Monthly Revenue Trend: Line chart of monthly revenue (2% fee proxy from TPV) over Jan–Dec; missing months as 0.');

  return (
    <div className="space-y-6">
      {/* Business & Financial KPIs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Financial KPIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Payment Volume (Monthly)"
            value={formatCurrency(tpv.monthly)}
            subtitle="Current month TPV"
            icon={DollarSign}
            color="primary"
            trend="up"
            trendValue="+12.5%"
          />
          <KPICard
            title="Total Payment Volume (Quarterly)"
            value={formatCurrency(tpv.quarterly)}
            subtitle="Q3 2024 TPV"
            icon={TrendingUp}
            color="teal"
            trend="up"
            trendValue="+8.3%"
          />
          <KPICard
            title="Total Payment Volume (Yearly)"
            value={formatCurrency(tpv.yearly)}
            subtitle="2024 projected TPV"
            icon={TrendingUp}
            color="green"
            trend="up"
            trendValue="+15.2%"
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(Object.values(revenue).reduce((a, b) => a + b, 0))}
            subtitle="All business units"
            icon={DollarSign}
            color="purple"
            trend="up"
            trendValue="+9.7%"
          />
        </div>
      </div>

      {/* Transaction & Payment Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction & Payment Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Transactions"
            value={formatNumber(transactions.total)}
            subtitle="Monthly volume"
            icon={CreditCard}
            color="primary"
            trend="up"
            trendValue="+18.2%"
          />
          <KPICard
            title="Success Rate"
            value={formatPercentage(transactions.successRate)}
            subtitle={`${formatNumber(transactions.successful)} successful`}
            icon={TrendingUp}
            color="green"
            trend="up"
            trendValue="+0.8%"
          />
          <KPICard
            title="Average Transaction Value"
            value={formatCurrency(productPerformance.averageTransactionValue)}
            subtitle="Per transaction"
            icon={DollarSign}
            color="teal"
            trend="up"
            trendValue="+5.2%"
          />
          <KPICard
            title="Settlement Time"
            value={`${productPerformance.settlementTime}h`}
            subtitle="Average settlement"
            icon={Clock}
            color="orange"
          />
        </div>
      </div>

      {/* Risk Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk & Quality Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Chargeback Rate"
            value={formatPercentage(productPerformance.chargebackRate)}
            subtitle="Monthly chargebacks"
            icon={AlertTriangle}
            color="red"
            trend="down"
            trendValue="-0.1%"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Monthly TPV Trend */}
         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
           <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly TPV Trend</h4>
           {!monthlyData || monthlyData.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <div className="text-center">
                 <div className="text-4xl mb-2">📈</div>
                 <p>No monthly TPV data available</p>
                 <p className="text-sm text-gray-400">Upload a file with date/timestamp data</p>
               </div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={monthlyData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="month" />
                 <YAxis tickFormatter={(value) => formatCurrency(value)} />
                 <Tooltip formatter={(value) => formatCurrency(value)} />
                 <Line 
                   type="monotone" 
                   dataKey="tpv" 
                   stroke="#3b82f6" 
                   strokeWidth={3}
                   dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           )}
         </div>

        {/* Payment Method Distribution */}
        <EnhancedPieChart 
          data={paymentMethods} 
          title="Payment Method Mix"
          colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f97316', '#ec4899']}
        />

         {/* Revenue by Business Unit */}
         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
           <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Business Unit</h4>
           {!revenueData || revenueData.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <div className="text-center">
                 <div className="text-4xl mb-2">💰</div>
                 <p>No revenue data available</p>
                 <p className="text-sm text-gray-400">Upload a file with transaction amounts</p>
               </div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <BarChart data={revenueData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" />
                 <YAxis tickFormatter={(value) => formatCurrency(value)} />
                 <Tooltip formatter={(value) => formatCurrency(value)} />
                 <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           )}
         </div>

         {/* Monthly Revenue Trend */}
         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
           <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h4>
           {!monthlyData || monthlyData.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-gray-500">
               <div className="text-center">
                 <div className="text-4xl mb-2">📈</div>
                 <p>No monthly revenue data available</p>
                 <p className="text-sm text-gray-400">Upload a file with date/timestamp data</p>
               </div>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={monthlyData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="month" />
                 <YAxis tickFormatter={(value) => formatCurrency(value)} />
                 <Tooltip formatter={(value) => formatCurrency(value)} />
                 <Line 
                   type="monotone" 
                   dataKey="revenue" 
                   stroke="#14b8a6" 
                   strokeWidth={3}
                   dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           )}
         </div>
      </div>
    </div>
  );
};

export default ProductPerformance;

