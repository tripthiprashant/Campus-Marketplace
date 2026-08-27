import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Check, X, CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/Badge';

export const RequestCard = ({
  request,
  type = 'received', // 'received' (as seller) | 'sent' (as buyer)
  onAccept,
  onReject,
  onCancel,
  onComplete,
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  if (!request) return null;

  const handleAction = async (actionFn) => {
    try {
      setActionLoading(true);
      await actionFn(request.id);
    } finally {
      setActionLoading(false);
    }
  };

  const isPending = request.status === 'PENDING';
  const isAccepted = request.status === 'ACCEPTED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
          <Package className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900">
              Request #{request.id} for Product #{request.product}
            </span>
            <StatusBadge status={request.status} />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {type === 'received' ? `Buyer: ${request.buyer}` : `Sent to Seller`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(request.created_at)}
            </span>
          </div>

          <Link
            to={`/products/${request.product}`}
            className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline mt-1"
          >
            <span>View Product Listing</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
        {/* Seller Actions */}
        {type === 'received' && isPending && (
          <>
            <button
              onClick={() => handleAction(onAccept)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Accept
            </button>
            <button
              onClick={() => handleAction(onReject)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          </>
        )}

        {type === 'received' && isAccepted && (
          <button
            onClick={() => handleAction(onComplete)}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            Complete & Mark Sold
          </button>
        )}

        {/* Buyer Actions */}
        {type === 'sent' && isPending && (
          <button
            onClick={() => handleAction(onCancel)}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
