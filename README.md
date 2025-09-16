# PayU Analytics Dashboard

A comprehensive fintech analytics dashboard prototype built with React and Tailwind CSS.

## 🚀 Features

- **Product Performance Analytics**: TPV, revenue, transaction metrics, and payment method analysis
- **Customer Sentiments**: Merchant analytics, customer retention, NPS scores, and satisfaction metrics
- **Market Trends**: Risk management, compliance scores, system performance, and regulatory updates
- **File Upload**: Support for Excel (.xlsx, .xls) and CSV files
- **Interactive Charts**: Built with Recharts for beautiful data visualization
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Recharts** for interactive charts and data visualization
- **Lucide React** for beautiful icons
- **XLSX & PapaParse** for Excel and CSV file parsing

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           # Navigation sidebar with tabs
│   ├── Dashboard.jsx         # Main dashboard container
│   ├── FileUpload.jsx        # File upload component
│   ├── KPICard.jsx          # Reusable KPI card component
│   ├── ProductPerformance.jsx # Product performance analytics
│   ├── CustomerSentiments.jsx # Customer sentiment analytics
│   └── MarketTrends.jsx      # Market trends and risk analytics
├── utils/
│   └── dataParser.js         # File parsing and data utilities
├── App.jsx                   # Root application component
└── index.css                 # Tailwind CSS styles
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📊 How to Use

1. **Upload Data**: Click the file upload area and select an Excel (.xlsx, .xls) or CSV file
2. **View Analytics**: Once uploaded, the dashboard will display comprehensive analytics
3. **Navigate Tabs**: Use the sidebar to switch between different analytics views:
   - **Product Performance**: Financial and transaction metrics
   - **Customer Sentiments**: Merchant and customer analytics
   - **Market Trends**: Risk and compliance metrics

## 📈 Sample Data

A sample CSV file (`sample-data.csv`) is included in the project root for testing purposes. You can upload this file to see the dashboard in action.

## 🎨 Design Features

- **Professional Color Scheme**: Blue, teal, and gray palette
- **Modern UI Components**: Rounded corners, soft shadows, smooth transitions
- **Responsive Grid Layouts**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects and smooth animations
- **Data Visualization**: Line charts, bar charts, pie charts, and radial gauges

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- **Desktop**: Full sidebar and multi-column layouts
- **Tablet**: Optimized layouts with collapsible elements
- **Mobile**: Single-column layouts with touch-friendly interfaces

## 🔧 Customization

The dashboard uses Tailwind CSS custom color schemes that can be modified in `tailwind.config.js`:
- Primary colors (blue shades)
- Teal accent colors
- Custom component classes in `index.css`

## 📊 KPI Metrics Included

### Product Performance
- Total Payment Volume (TPV) - Monthly, Quarterly, Yearly
- Revenue by Business Unit
- Transaction Success Rates
- Payment Method Distribution
- Refund and Chargeback Rates

### Customer Sentiments
- Active vs Onboarded Merchants
- Customer Retention Rates
- Net Promoter Score (NPS)
- Sentiment Analysis
- Top Merchant Segments

### Market Trends
- Fraud Detection Rates
- Dispute Resolution Times
- System Uptime Metrics
- Compliance Scores
- Regulatory Updates

## 🚀 Production Build

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**