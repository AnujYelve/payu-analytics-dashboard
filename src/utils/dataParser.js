import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Parse Excel or CSV file
export const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        let parsedData;
        
        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const result = Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
          });
          parsedData = result.data;
        } else {
          // Parse Excel
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        }
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
};

// Generate dummy data when a file is uploaded
// export const generateDummyData = () => {
//   return {
//     productPerformance: {
//       tpv: {
//         monthly: 125000000,
//         quarterly: 375000000,
//         yearly: 1500000000
//       },
//       revenue: {
//         paymentGateway: 45000000,
//         creditBNPL: 28000000,
//         valueAddedServices: 12000000
//       },
//       transactions: {
//         total: 2500000,
//         successful: 2375000,
//         successRate: 95.0
//       },
//       averageTransactionValue: 600,
//       paymentMethods: {
//         UPI: 45,
//         Cards: 30,
//         Wallets: 15,
//         NetBanking: 8,
//         BNPL: 2
//       },
//       refundRate: 3.2,
//       chargebackRate: 0.8,
//       settlementTime: 24 // hours
//     },
//     customerSentiments: {
//       merchants: {
//         active: 125000,
//         onboarded: 145000,
//         churnRate: 5.2
//       },
//       topSegments: [
//         { name: 'E-commerce', tpv: 450000000 },
//         { name: 'Food & Beverage', tpv: 320000000 },
//         { name: 'Travel', tpv: 280000000 },
//         { name: 'Healthcare', tpv: 180000000 },
//         { name: 'Education', tpv: 120000000 }
//       ],
//       customerRetention: 78.5,
//       nps: 67,
//       sentimentScore: 4.2 // out of 5
//     },
//     marketTrends: {
//       fraudRate: 0.15,
//       disputeResolutionTime: 3.2, // days
//       systemUptime: 99.95,
//       complianceScore: 98.5
//     },
//     monthlyData: [
//       { month: 'Jan', tpv: 120000000, transactions: 200000, revenue: 6000000 },
//       { month: 'Feb', tpv: 135000000, transactions: 225000, revenue: 6750000 },
//       { month: 'Mar', tpv: 142000000, transactions: 237000, revenue: 7100000 },
//       { month: 'Apr', tpv: 138000000, transactions: 230000, revenue: 6900000 },
//       { month: 'May', tpv: 155000000, transactions: 258000, revenue: 7750000 },
//       { month: 'Jun', tpv: 148000000, transactions: 247000, revenue: 7400000 },
//       { month: 'Jul', tpv: 162000000, transactions: 270000, revenue: 8100000 },
//       { month: 'Aug', tpv: 158000000, transactions: 263000, revenue: 7900000 },
//       { month: 'Sep', tpv: 165000000, transactions: 275000, revenue: 8250000 },
//       { month: 'Oct', tpv: 172000000, transactions: 287000, revenue: 8600000 },
//       { month: 'Nov', tpv: 168000000, transactions: 280000, revenue: 8400000 },
//       { month: 'Dec', tpv: 185000000, transactions: 308000, revenue: 9250000 }
//     ]
//   };
// };
// ADD THIS NEW FUNCTION:
export const processExcelData = (parsedData) => {
  if (!parsedData || parsedData.length === 0) {
    return null;
  }

  console.log("Processing Excel data:", parsedData);
     
  
  // Group data by month for trends
  const monthlyData = [];
  const monthlyGroups = {};
  
  parsedData.forEach(row => {
    const date = new Date(row.timestamp || row.transaction_date || row.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const amount = parseFloat(row.amount_inr || row.amount || 0);
    
    if (!monthlyGroups[month]) {
      monthlyGroups[month] = { 
        month, 
        tpv: 0, 
        transactions: 0, 
        revenue: 0 
      };
    }
    
    monthlyGroups[month].tpv += amount;
    monthlyGroups[month].transactions += 1;
    monthlyGroups[month].revenue += amount * 0.02; // Assuming 2% fee
  });
  
  Object.values(monthlyGroups).forEach(group => {
    monthlyData.push(group);
  });

  // Calculate aggregated metrics
  const totalTPV = parsedData.reduce((sum, row) => 
    sum + parseFloat(row.amount_inr || row.amount || 0), 0);
  const totalTransactions = parsedData.length || 1;
  const successfulTransactions = parsedData.filter(row => 
    row.status === 'Success' || row.transaction_status === 'completed').length;
  
  // Payment method distribution
  const paymentMethods = {};
  parsedData.forEach(row => {
    const method = row.payment_method || 'Other';
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });
  
  // Convert to percentages
  const paymentMethodPercentages = {};
  Object.keys(paymentMethods).forEach(method => {
    paymentMethodPercentages[method] = 
      ((paymentMethods[method] / totalTransactions) * 100).toFixed(1);
  });

  const activeMerchants = new Set(parsedData.map(row => row.merchant_id).filter(Boolean)).size;
  
  // Calculate NPS Score - convert from 1-10 scale to NPS scale (-100 to +100)
  const npsValues = parsedData.map(row => parseFloat(row.nps_score)).filter(val => !isNaN(val) && val >= 1 && val <= 10);
  let npsScore = 67; // fallback
  
  if (npsValues.length > 0) {
    const promoters = npsValues.filter(score => score >= 9).length;
    const detractors = npsValues.filter(score => score <= 6).length;
    npsScore = Math.round(((promoters - detractors) / npsValues.length) * 100);
  }

  // Calculate Sentiment Score - convert from -1 to 1 scale to 0-5 scale for display
  const sentimentValues = parsedData.map(row => parseFloat(row.sentiment_score)).filter(val => !isNaN(val) && val >= -1 && val <= 1);
  const sentimentScore = sentimentValues.length > 0
    ? Math.round(((sentimentValues.reduce((sum, val) => sum + val, 0) / sentimentValues.length + 1) / 2 * 5) * 10) / 10
    : 4.2; // fallback - converts -1,1 range to 0,5 range

  // Calculate Customer Retention - use merchant repeat activity as proxy
  // Count merchants with multiple transactions as "retained"
  const merchantTransactionCounts = {};
  parsedData.forEach(row => {
    const merchantId = row.merchant_id;
    merchantTransactionCounts[merchantId] = (merchantTransactionCounts[merchantId] || 0) + 1;
  });
  
  const retainedMerchants = Object.values(merchantTransactionCounts).filter(count => count > 1).length;
  const totalMerchants = Object.keys(merchantTransactionCounts).length;
  
  const customerRetention = totalMerchants > 0
    ? (retainedMerchants / totalMerchants) * 100
    : 75; // fallback
 
  // Customer segments
  const segments = {};
  parsedData.forEach(row => {
    const segment = row.merchant_category || row.category || 'Other';
    const amount = parseFloat(row.amount_inr || row.amount || 0);
    if (!segments[segment]) {
      segments[segment] = { name: segment, tpv: 0 };
    }
    segments[segment].tpv += amount;
  });
  
  const topSegments = Object.values(segments)
    .sort((a, b) => b.tpv - a.tpv)
    .slice(0, 5);

  return {
    productPerformance: {
      tpv: {
        monthly: totalTPV / 12,
        quarterly: totalTPV / 4,
        yearly: totalTPV
      },
      revenue: {
        paymentGateway: totalTPV * 0.015,
        creditBNPL: totalTPV * 0.008,
        valueAddedServices: totalTPV * 0.005
      },
      transactions: {
        total: totalTransactions,
        successful: successfulTransactions,
        successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
      },
      averageTransactionValue: totalTransactions > 0 ? totalTPV / totalTransactions : 0,
      paymentMethods: paymentMethodPercentages,
      refundRate: totalTransactions > 0 ? parsedData.filter(row => 
        row.refund_flag === 'Y' || row.refund === 'yes' || row.is_refund === true).length / totalTransactions * 100 : 0,
      chargebackRate: totalTransactions > 0 ? parsedData.filter(row => 
        row.is_chargeback === true || row.is_chargeback === 'TRUE' || row.chargeback === 'yes').length / totalTransactions * 100 : 0,
      settlementTime: 24
    },
    customerSentiments: {
      merchants: {
        active: activeMerchants,
        onboarded: Math.round(activeMerchants * 1.2), // safer to round
        churnRate: 5.2
      },
      topSegments: topSegments,
      customerRetention,
      nps: npsScore,
      sentimentScore
    },
    marketTrends: {
      fraudRate: totalTransactions > 0 ? parsedData.filter(row => 
        row.is_fraud === true || row.fraud_flag === 'Y' || row.fraud === 'yes').length / totalTransactions * 100 : 0.15,
      disputeResolutionTime: parsedData.length > 0 ? parsedData.reduce((sum, row) => 
        sum + (parseFloat(row.dispute_days) || 0), 0) / parsedData.length : 3.2,
      systemUptime: 99.95,
      complianceScore: 98.5
    },
    monthlyData: monthlyData
  };
};

// Format currency values
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return '₹0';
  const numValue = Number(value);
  if (numValue >= 1000000000) {
    return `₹${(numValue / 1000000000).toFixed(1)}B`;
  } else if (numValue >= 1000000) {
    return `₹${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `₹${(numValue / 1000).toFixed(1)}K`;
  }
  return `₹${numValue.toLocaleString()}`;
};

// Format percentage values
export const formatPercentage = (value) => {
  if (value == null || isNaN(value)) return '0.0%';
  return `${Number(value).toFixed(1)}%`;
};

// Format number with commas
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return '0';
  return Number(value).toLocaleString();
};

