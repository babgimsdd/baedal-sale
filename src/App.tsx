import React, { useState, useEffect, useMemo } from 'react';
import { 
  DiscountItem, 
  DiscountTab, 
  FoodCategory, 
  Region, 
  UserInterests, 
  PushNotificationConfig,
  MobileTab,
  ThemeMode,
  DiscountFilters,
  RecentlyViewed,
  DataEngineLog,
  AdminStats
} from './types';
import { INITIAL_REGION, OFFICIAL_DISCOUNTS } from './data/discountsData';
import { runDataEnginePipeline } from './lib/dataEngine';
import { dataEngineOrchestrator } from './engine/orchestrator';
import { CollectorStatus, PipelineSummary } from './engine/types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { DiscountsView } from './components/DiscountsView';
import { FavoritesView } from './components/FavoritesView';
import { AlertsView } from './components/AlertsView';
import { SettingsView } from './components/SettingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { LocationModal } from './components/LocationModal';
import { Footer } from './components/Footer';

export default function App() {
  // Theme Mode State (Default is 'light')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kr_delivery_theme');
    return (saved as ThemeMode) || 'light';
  });

  // Mobile Bottom Nav Tab State
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('home');

  // Location Region State
  const [currentRegion, setCurrentRegion] = useState<Region>(() => {
    const saved = localStorage.getItem('kr_delivery_region');
    return saved ? JSON.parse(saved) : INITIAL_REGION;
  });

  // Data Engine State Engine
  const [itemsState, setItemsState] = useState<DiscountItem[]>(() => {
    const saved = localStorage.getItem('kr_delivery_items');
    return saved ? JSON.parse(saved) : OFFICIAL_DISCOUNTS;
  });

  const [engineLogs, setEngineLogs] = useState<DataEngineLog[]>(() => {
    const saved = localStorage.getItem('kr_delivery_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Run Data Engine Pipeline
  const engineResult = useMemo(() => {
    return runDataEnginePipeline(itemsState, engineLogs);
  }, [itemsState, engineLogs]);

  const processedDiscounts = engineResult.items;
  const adminStats = engineResult.stats;

  // Manual Trigger: Run Data Engine
  const handleRunEngineTrigger = () => {
    const result = runDataEnginePipeline(itemsState, engineLogs);
    setItemsState(result.items);
    setEngineLogs(result.newLogs);
    localStorage.setItem('kr_delivery_items', JSON.stringify(result.items));
    localStorage.setItem('kr_delivery_logs', JSON.stringify(result.newLogs));
  };

  // Manual Trigger: Simulate Link Inspection (Detect Broken/Expired URL)
  const handleSimulateLinkCheck = async () => {
    const updated = [...itemsState];
    const targetIdx = updated.findIndex((i) => i.id === 'yg-002');
    if (targetIdx !== -1) {
      updated[targetIdx].linkStatus = '404_NOT_FOUND';
      updated[targetIdx].status = 'link_error';
      updated[targetIdx].score = 0;
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newLog: DataEngineLog = {
        id: `log-link-sim-${Date.now()}`,
        timestamp: timeStr,
        category: 'LINK_ERROR',
        message: `${updated[targetIdx].deliveryApp} [${updated[targetIdx].title.slice(0, 15)}...] URL 링크 오류 감지 (404) -> 비활성화`,
        itemId: updated[targetIdx].id,
        source: updated[targetIdx].source,
      };

      setItemsState(updated);
      setEngineLogs((prev) => [newLog, ...prev]);
      localStorage.setItem('kr_delivery_items', JSON.stringify(updated));
    }
  };

  // Discounts View Active Filters
  const [activeDiscountTab, setActiveDiscountTab] = useState<DiscountTab>('오늘의 할인');
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory>('전체');
  const [advancedFilters, setAdvancedFilters] = useState<DiscountFilters>(() => {
    const saved = localStorage.getItem('kr_delivery_filters');
    return saved ? JSON.parse(saved) : {
      onlyFreeDelivery: false,
      minDiscount50: false,
      onlyWithCoupon: false,
      endingToday: false,
      onlyNewUser: false,
      onlyCardDiscount: false,
    };
  });

  // Favorites (Scrapped Discount Item IDs)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kr_delivery_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // User Saved Interests (Food, Brand, App)
  const [userInterests, setUserInterests] = useState<UserInterests>(() => {
    const saved = localStorage.getItem('kr_delivery_interests');
    return saved ? JSON.parse(saved) : { favoriteFoods: [], favoriteBrands: [], favoriteApps: [], hiddenApps: [], savedRegions: [] };
  });

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed>(() => {
    const saved = localStorage.getItem('kr_delivery_recent');
    return saved ? JSON.parse(saved) : { discounts: [], brands: [], categories: [] };
  });

  // Web Push Notification Config
  const [pushConfig, setPushConfig] = useState<PushNotificationConfig>(() => {
    const saved = localStorage.getItem('kr_delivery_push_config');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      notifyNewDiscount: true,
      notifyFreeDelivery: true,
      notifyCardDiscount: true,
      notifyMyInterestsOnly: true,
    };
  });

  // Location Selector Modal Open State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('kr_delivery_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('kr_delivery_region', JSON.stringify(currentRegion));
  }, [currentRegion]);

  useEffect(() => {
    localStorage.setItem('kr_delivery_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kr_delivery_interests', JSON.stringify(userInterests));
  }, [userInterests]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleTrackInteraction = (item: DiscountItem) => {
    setRecentlyViewed(prev => {
      const newDiscounts = [item.id, ...prev.discounts.filter(id => id !== item.id)].slice(0, 20);
      let newBrands = prev.brands;
      if (item.brandName) {
        newBrands = [item.brandName, ...prev.brands.filter(b => b !== item.brandName)].slice(0, 10);
      }
      const newCategories = [item.foodCategory, ...prev.categories.filter(c => c !== item.foodCategory)].slice(0, 5);
      
      return { discounts: newDiscounts, brands: newBrands, categories: newCategories };
    });
  };

  const handleNavigateToDiscounts = (filterTab?: string) => {
    if (filterTab) {
      setActiveDiscountTab(filterTab as DiscountTab);
    }
    setActiveMobileTab('discounts');
  };

  // 1. Filter out hidden apps & inactive/expired items for public feed
  const visibleDiscounts = useMemo(() => {
    return processedDiscounts.filter((item) => {
      if (item.status !== 'active') return false; // Show only active items in public feed
      if (userInterests.hiddenApps?.includes(item.deliveryApp)) return false;
      return true;
    });
  }, [processedDiscounts, userInterests.hiddenApps]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white pb-20">
      
      {/* Mobile Top Header */}
      <Header
        currentRegion={currentRegion}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={() => setActiveMobileTab('admin')}
      />

      {/* Main Container Constraints */}
      <main className="flex-1 max-w-md md:max-w-3xl w-full mx-auto px-4 pt-4">
        
        {/* ① 🏠 Home Tab View */}
        {activeMobileTab === 'home' && (
          <HomeView
            items={visibleDiscounts}
            currentRegion={currentRegion}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectFoodCategory={(cat) => setSelectedFoodCategory(cat)}
            onNavigateToDiscounts={handleNavigateToDiscounts}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onTrackInteraction={handleTrackInteraction}
          />
        )}

        {/* ② 🔥 Discounts Tab View */}
        {activeMobileTab === 'discounts' && (
          <DiscountsView
            items={visibleDiscounts}
            currentRegion={currentRegion}
            activeTab={activeDiscountTab}
            onTabChange={setActiveDiscountTab}
            selectedCategory={selectedFoodCategory}
            onSelectCategory={setSelectedFoodCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            advancedFilters={advancedFilters}
            onUpdateAdvancedFilters={setAdvancedFilters}
            onTrackInteraction={handleTrackInteraction}
          />
        )}

        {/* ③ ❤️ Favorites Tab View */}
        {activeMobileTab === 'favorites' && (
          <FavoritesView
            items={visibleDiscounts}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            userInterests={userInterests}
            onSaveInterests={setUserInterests}
            recentlyViewed={recentlyViewed}
            onTrackInteraction={handleTrackInteraction}
          />
        )}

        {/* ④ 🔔 Alerts Tab View */}
        {activeMobileTab === 'alerts' && (
          <AlertsView
            config={pushConfig}
            onUpdateConfig={setPushConfig}
            userInterests={userInterests}
          />
        )}

        {/* ⑤ ⚙️ Settings Tab View */}
        {activeMobileTab === 'settings' && (
          <SettingsView
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {/* ⑥ ⚙️ Admin Dashboard View */}
        {activeMobileTab === 'admin' && (
          <AdminDashboard
            items={processedDiscounts}
            logs={engineLogs}
            stats={adminStats}
            collectorStatuses={dataEngineOrchestrator.getCollectorStatuses()}
            onRunEngineTrigger={() => {
              handleRunEngineTrigger();
              dataEngineOrchestrator.runPipeline(true);
            }}
            onSimulateLinkCheck={handleSimulateLinkCheck}
            onRunSingleCollector={(plat) => {
              dataEngineOrchestrator.runSinglePlatform(plat);
              handleRunEngineTrigger();
            }}
          />
        )}

      </main>

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentRegion={currentRegion}
        onSelectRegion={setCurrentRegion}
        userInterests={userInterests}
        onSaveInterests={setUserInterests}
      />

      {/* Mobile Footer */}
      <Footer />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
        favoritesCount={favorites.length}
      />

    </div>
  );
}

