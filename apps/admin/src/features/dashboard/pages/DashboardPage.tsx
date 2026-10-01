import { 
  RefreshCw, 
  Ticket, 
  Users, 
  Building2, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  ArrowRight, 
  AlertCircle,
  UserPlus,
  Bus,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { formatNumber } from "@obtp/business-logic";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl text-center max-w-lg mx-auto mt-10 border border-red-100 dark:border-red-800/30 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
          {t("errorFetchingDashboard")}
        </h3>
        <p className="text-red-600/80 dark:text-red-300/80 text-sm mb-6">
          Vui lòng kiểm tra lại kết nối mạng.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  // Lấy dữ liệu thật từ API (Dùng fallback 0 nếu BE chưa trả về field đó)
  const todayReviews = (stats as any).todayReviews || 0; 
  const topRatedToday = (stats as any).topRatedToday || 0;
  const newUsersToday = (stats as any).newUsersToday || 0; // Đón đầu Backend

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t("dashboardTitle")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {t("welcomeBack")}, <strong className="text-gray-700 dark:text-gray-200">{user?.name || t("admin")}</strong>!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 hidden sm:block bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
            {t("dashboardDataAutoRefresh")}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 transition-all shadow-sm"
            title={t("refresh")}
          >
            <RefreshCw className={`w-5 h-5 ${isRefetching ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* ROW 1: MAIN STATS GRID (THIẾT KẾ ĐỒ SỘ HƠN VỚI CHỈ SỐ TĂNG TRƯỞNG) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tickets (Có báo cáo số vé thêm) */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Ticket className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <TrendingUp size={12} />
                {t("growing") || "Tăng trưởng"}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("totalBookings")}
            </p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">
              {formatNumber(stats.totalBookings)}
            </p>
          </div>
          {/* Bottom Bar: Growth Info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 px-6 py-4 border-t border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <span className="text-lg font-black">+{formatNumber(stats.todayBookings)}</span>
              {t("todayBookings") || "vé hôm nay"}
            </span>
          </div>
        </div>

        {/* Card 2: Users (Có báo cáo số user thêm) */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("systemCustomers")}
            </p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">
              {formatNumber(stats.totalUsers)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 px-6 py-4 border-t border-green-100 dark:border-green-900/30 flex items-center justify-between">
            <span className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
              <span className="text-lg font-black">+{formatNumber(newUsersToday)}</span>
              {t("newUsers") || "khách hàng mới"}
            </span>
          </div>
        </div>

        {/* Card 3: Companies (Có báo cáo số nhà xe thêm) */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("company")}
            </p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">
              {formatNumber(stats.totalCompanies)}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 px-6 py-4 border-t border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-800 dark:text-orange-300 flex items-center gap-2">
              <span className="text-lg font-black">+{formatNumber(stats.newCompaniesToday)}</span>
              {t("newCompanies") || "nhà xe mới"}
            </span>
          </div>
        </div>

        {/* Card 4: Active Trips */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4 relative">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Bus className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="flex h-3 w-3 relative mt-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t("activeTrips")}
            </p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">
              {formatNumber(stats.activeTrips)}
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/10 px-6 py-4 border-t border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
              <Activity size={16} className="animate-pulse" />
              {t("tripsRunning") || "Chuyến xe đang lăn bánh"}
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: FEEDBACK & TODAY HIGHLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column Left: Reviews (Chiếm 2 cột) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-2 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm">
          
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <Star className="w-7 h-7 text-yellow-300 fill-yellow-300 drop-shadow-md" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {t("today")}
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-1">{t("topRatedToday")}</h3>
              <p className="text-white/80 text-sm mb-4 font-medium">{t("excellentServiceQuality")}</p>
              
              <div className="flex items-end gap-4">
                <p className="text-6xl font-black drop-shadow-lg leading-none">
                  {formatNumber(topRatedToday)}
                </p>
                <div className="pb-1.5">
                  <div className="flex gap-0.5 mb-1.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-300 text-yellow-300" />)}
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {t("reviews")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center shadow-inner border border-gray-200 dark:border-gray-600">
                  <MessageSquare className="w-8 h-8 text-gray-700 dark:text-gray-300" />
               </div>
               <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">
                    {t("customerFeedbackToday")}
                  </p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                    {formatNumber(todayReviews)} <span className="text-lg text-gray-400 font-medium">{t("reviews")}</span>
                  </p>
               </div>
            </div>
             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t("realFeedbackDesc")}
                </p>
             </div>
          </div>
        </div>

        {/* Column Right: Today Highlights (Báo cáo nhanh) */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("todayHighlights") || "Hoạt động nổi bật trong ngày"}
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {/* Box 1 */}
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Ticket size={18} />
                  <span className="font-bold text-sm">{t("todayBookings")}</span>
                </div>
                <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-blue-600 font-bold border border-blue-100 dark:border-blue-800">New</span>
              </div>
              <p className="text-2xl font-black text-blue-900 dark:text-blue-100">
                +{formatNumber(stats.todayBookings)} <span className="text-sm font-medium opacity-70">vé</span>
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Building2 size={18} />
                  <span className="font-bold text-sm">{t("newCompanies") || "Nhà xe mới"}</span>
                </div>
              </div>
              <p className="text-2xl font-black text-orange-900 dark:text-orange-100">
                +{formatNumber(stats.newCompaniesToday)} <span className="text-sm font-medium opacity-70">đối tác</span>
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <UserPlus size={18} />
                  <span className="font-bold text-sm">{t("newUsers") || "Khách hàng mới"}</span>
                </div>
              </div>
              <p className="text-2xl font-black text-green-900 dark:text-green-100">
                +{formatNumber(newUsersToday)} <span className="text-sm font-medium opacity-70">tài khoản</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: QUICK ACTIONS */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 ml-2">
          {t("quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/companies')}
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400">
                <Building2 size={20} />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {t("companyManagement")}
              </span>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
          </button>

          <button 
            onClick={() => navigate('/admin/users')}
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 dark:bg-green-900/40 rounded-xl text-green-600 dark:text-green-400">
                <Users size={20} />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {t("userManagement")}
              </span>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-green-500 transition-transform group-hover:translate-x-1" />
          </button>

          <button 
            onClick={() => navigate('/admin/reviews')}
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                <MessageSquare size={20} />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t("reviewManagement")}
              </span>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

    </div>
  );
}