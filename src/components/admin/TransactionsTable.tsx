"use client";

import { useState, useMemo } from "react";
import { Search, RotateCcw, MoreVertical, Loader2 } from "lucide-react";
import { refundPurchase } from "@/features/purchases/action";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  created_at: string;
  stripe_session_id: string;
  price_paid_in_cents: number;
  refunded_at: string | null;
  customer_name: string;
  customer_email: string;
  product_name: string;
  product_id: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "refunded"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [updatedTransactions, setUpdatedTransactions] = useState<Set<string>>(
    new Set(),
  );

  const itemsPerPage = 10;

  // Filter transactions based on search and status
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.stripe_session_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
            ? !t.refunded_at
            : t.refunded_at;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleRefund = async (purchaseId: string) => {
    setRefundingId(purchaseId);
    try {
      const result = await refundPurchase(purchaseId);
      if (!result.error) {
        setUpdatedTransactions((prev) => new Set([...prev, purchaseId]));
      } else {
        toast.error("Failed to refund purchase: " + result.message);
      }
    } catch (error) {
      console.error("Error refunding purchase:", error);
      toast.error("An error occurred while processing the refund");
    } finally {
      setRefundingId(null);
    }
  };

  const getTransactionStatus = (transaction: Transaction) => {
    if (updatedTransactions.has(transaction.id) || transaction.refunded_at) {
      return { label: "Refunded", color: "bg-red-500/10 text-red-400" };
    }
    return { label: "Completed", color: "bg-green-500/10 text-green-400" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const truncateSessionId = (id: string) => {
    return id.substring(0, 8) + "..." + id.substring(id.length - 4);
  };

  return (
    <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] rounded-2xl overflow-hidden">
      {/* Header with Search and Filter */}
      <div className="p-5 border-b border-[#252525] flex flex-col md:flex-row gap-4 md:gap-0 md:items-center md:justify-between">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9c8ab]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search customer or product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-[#252525] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#c9c8ab]/40 focus:outline-none focus:border-brand-yellow/50 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setCurrentPage(1);
            }}
            className="bg-[#141414] border border-[#252525] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-yellow/50 transition-all"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#141414] text-[#c9c8ab] text-xs font-bold uppercase tracking-wider">
              <th className="px-4 md:px-6 py-3">Date</th>
              <th className="px-4 md:px-6 py-3">Product</th>
              <th className="px-4 md:px-6 py-3">Customer</th>
              <th className="px-4 md:px-6 py-3">Amount</th>
              <th className="px-4 md:px-6 py-3">Status</th>
              <th className="px-4 md:px-6 py-3 hidden sm:table-cell">Ref ID</th>
              <th className="px-4 md:px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252525]">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 md:px-6 py-8 text-center text-[#c9c8ab]"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => {
                const status = getTransactionStatus(transaction);
                const isRefunding = refundingId === transaction.id;
                const isRefunded =
                  updatedTransactions.has(transaction.id) ||
                  transaction.refunded_at;

                return (
                  <tr
                    key={transaction.id}
                    className="hover:bg-[#252525]/30 transition-colors border-[#252525]"
                  >
                    <td className="px-4 md:px-6 py-3 text-sm text-white whitespace-nowrap">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm font-medium text-white truncate max-w-xs">
                      {transaction.product_name}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {transaction.customer_name}
                        </span>
                        <span className="text-xs text-[#c9c8ab] hidden md:inline">
                          {transaction.customer_email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm font-medium text-white">
                      {formatCurrency(transaction.price_paid_in_cents)}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs text-[#c9c8ab] font-mono hidden sm:table-cell">
                      {truncateSessionId(transaction.stripe_session_id)}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right">
                      {!isRefunded ? (
                        <button
                          onClick={() => handleRefund(transaction.id)}
                          disabled={isRefunding}
                          className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                            isRefunding
                              ? "bg-gray-500/10 text-gray-400 cursor-not-allowed"
                              : "bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95"
                          }`}
                        >
                          {isRefunding ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span className="hidden sm:inline">
                                Processing
                              </span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span className="hidden sm:inline">Refund</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button className="text-[#c9c8ab]/40 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="px-4 md:px-6 py-3 border-t border-[#252525] bg-[#141414] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-[#c9c8ab]">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}{" "}
            of {filteredTransactions.length} transactions
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#252525] text-white hover:bg-[#252525] disabled:opacity-30 transition-all"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-brand-yellow text-[#1c1d00]"
                    : "border border-[#252525] text-white hover:bg-[#252525]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#252525] text-white hover:bg-[#252525] disabled:opacity-30 transition-all"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
