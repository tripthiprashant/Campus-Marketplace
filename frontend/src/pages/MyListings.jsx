import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  Inbox,
  Send,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import productService from '../services/productService';
import requestService from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { StatusBadge, ConditionBadge } from '../components/common/Badge';
import { getImageUrl, getProductPlaceholder } from '../utils/imageHelper';
import RequestCard from '../components/requests/RequestCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export const MyListings = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'listings'; // 'listings' | 'received' | 'sent'

  const [myProducts, setMyProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      const [productsData, requestsData] = await Promise.all([
        productService.getProducts(),
        requestService.getRequests(),
      ]);

      const allProducts = productsData.results || productsData || [];
      // Filter products where seller matches current user username
      const userProducts = allProducts.filter((p) => p.seller === user.username);

      setMyProducts(userProducts);
      setRequests(requestsData || []);
    } catch (err) {
      console.error('Failed to load user listings and requests', err);
      showError('Unable to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Delete product
  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(productToDelete.id);
      showSuccess(`Deleted listing "${productToDelete.title}"`);
      setMyProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      showError('Failed to delete listing.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Request actions
  const handleAcceptRequest = async (reqId) => {
    try {
      await requestService.acceptRequest(reqId);
      showSuccess('Purchase request accepted! Item marked as reserved.');
      loadData();
    } catch (err) {
      showError('Failed to accept request.');
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      await requestService.rejectRequest(reqId);
      showSuccess('Purchase request declined.');
      loadData();
    } catch (err) {
      showError('Failed to reject request.');
    }
  };

  const handleCancelRequest = async (reqId) => {
    try {
      await requestService.cancelRequest(reqId);
      showSuccess('Purchase request cancelled.');
      loadData();
    } catch (err) {
      showError('Failed to cancel request.');
    }
  };

  const handleCompleteRequest = async (reqId) => {
    try {
      await requestService.completeRequest(reqId);
      showSuccess('Transaction completed! Product marked as SOLD.');
      loadData();
    } catch (err) {
      showError('Failed to complete transaction.');
    }
  };

  // Filter requests by role
  // Received requests: buyer != user.username (or seller is user)
  const receivedRequests = requests.filter((r) => r.buyer !== user?.username);
  // Sent requests: buyer == user.username
  const sentRequests = requests.filter((r) => r.buyer === user?.username);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Campus Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your posted listings and campus purchase transactions.
          </p>
        </div>

        <Link
          to="/add-product"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Listing</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px overflow-x-auto">
        <button
          onClick={() => handleTabChange('listings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {myProducts.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('received')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'received'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Buyer Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 font-semibold">
            {receivedRequests.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('sent')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sent'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Sent Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <LoadingSpinner message="Loading dashboard data..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. MY LISTINGS TAB */}
          {activeTab === 'listings' && (
            <div>
              {myProducts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="You haven't listed anything yet"
                  description="Put your old textbooks, notes, and electronics in front of hundreds of students on your campus."
                  actionText="Sell Your First Item"
                  actionLink="/add-product"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map((prod) => {
                    const imageUrl = getImageUrl(prod.image, 'product');
                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getProductPlaceholder();
                            }}
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <ConditionBadge condition={prod.condition} />
                            {prod.status && <StatusBadge status={prod.status} />}
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="font-semibold text-slate-700">
                              {formatPrice(prod.price)}
                            </span>
                            <span>{formatDate(prod.created_at)}</span>
                          </div>

                          <Link
                            to={`/products/${prod.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {prod.title}
                          </Link>

                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {prod.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <Link
                              to={`/products/${prod.id}`}
                              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View
                            </Link>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/edit-product/${prod.id}`}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                                title="Edit Listing"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setDeleteModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. RECEIVED REQUESTS TAB */}
          {activeTab === 'received' && (
            <div className="space-y-4">
              {receivedRequests.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No purchase requests received yet"
                  description="When other students want to buy your listings, their requests and meetup proposals will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {receivedRequests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      type="received"
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      onComplete={handleCompleteRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SENT REQUESTS TAB */}
          {activeTab === 'sent' && (
            <div className="space-y-4">
              {sentRequests.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No active sent purchase requests"
                  description="Explore campus listings and send purchase requests when you find textbooks or gadgets you want."
                  actionText="Browse Marketplace"
                  actionLink="/products"
                />
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      type="sent"
                      onCancel={handleCancelRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Listing"
        message={`Are you sure you want to permanently delete "${productToDelete?.title}"?`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyListings;
