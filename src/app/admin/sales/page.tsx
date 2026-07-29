import { DollarSign, TrendingUp, Users, AlertCircle } from "lucide-react";
import {
  getSalesMetrics,
  getRevenueByProduct,
  getAllTransactions,
} from "@/features/purchases/action";
import { TransactionsTable } from "@/components/admin/TransactionsTable";

// Dummy data fallback
const getDummyMetrics = () => ({
  totalRevenue: 0,
  totalSales: 0,
  activeUsers: 0,
  refundRate: 0,
  monthlyGrowth: 0,
  currentMonthRevenue: 0,
  lastMonthRevenue: 0,
});

export default async function SalesPage() {
  let metrics = getDummyMetrics();
  let productBreakdown = [];
  let transactions = [];

  try {
    [metrics, productBreakdown] = await Promise.all([
      getSalesMetrics(),
      getRevenueByProduct(),
    ]);
  } catch (error) {
    console.warn("Failed to fetch metrics, using dummy data:", error);
  }

  try {
    transactions = await getAllTransactions();
  } catch (error) {
    console.warn("Failed to fetch transactions:", error);
  }

  return (
    <div className="flex-1 w-full space-y-8 pb-16">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Sales Analytics
          </h1>
          <p className="text-sm text-[#c9c8ab]">
            Real-time revenue and transaction tracking
          </p>
        </div>

        <div />
      </div>

      {/* Stats Bento Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <DollarSign className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Total Revenue
          </span>
          <p className="text-3xl font-extrabold text-white">
            ${metrics.totalRevenue.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-1 rounded">
              +{metrics.monthlyGrowth.toFixed(1)}%
            </span>
            <span className="text-xs text-[#c9c8ab]">vs last month</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <TrendingUp className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Total Sales
          </span>
          <p className="text-3xl font-extrabold text-white">
            {metrics.totalSales}
          </p>
          <span className="text-xs text-[#c9c8ab]">transactions completed</span>
        </div>

        {/* Active Users */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <Users className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Active Subscribers
          </span>
          <p className="text-3xl font-extrabold text-white">
            {metrics.activeUsers}
          </p>
          <span className="text-xs text-[#c9c8ab]">active students</span>
        </div>

        {/* Refund Rate */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <AlertCircle className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Refund Rate
          </span>
          <p className="text-3xl font-extrabold text-white">
            {metrics.refundRate.toFixed(1)}%
          </p>
          <span className="text-xs text-[#c9c8ab]">below industry average</span>
        </div>
      </div>

      {/* Product Breakdown */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">
          Revenue by Product
        </h3>
        <div className="space-y-4">
          {productBreakdown.length === 0 ? (
            <p className="text-sm text-[#c9c8ab]">No products found</p>
          ) : (
            productBreakdown.map((product) => {
              const totalRev = parseFloat(String(product.total_revenue)) || 0;
              const maxRevenue = Math.max(
                ...productBreakdown.map(
                  (p) => parseFloat(String(p.total_revenue)) || 0,
                ),
                1,
              );
              const percentage = (totalRev / maxRevenue) * 100;

              return (
                <div key={product.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white truncate">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold text-brand-yellow">
                      ${totalRev.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-[#252525]">
                    <div
                      className="bg-linear-to-r from-brand-yellow to-brand-yellow/60 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#c9c8ab] mt-1">
                    {parseInt(String(product.sales_count))} sale
                    {parseInt(String(product.sales_count)) !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="w-full mt-6 py-2 border border-[#252525] rounded-lg font-bold text-xs text-white hover:bg-[#141414] transition-colors uppercase tracking-wider">
          View All Products
        </button>
      </div>

      {/* Recent Transactions */}
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
