import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { NavThemeProvider } from "@/hooks/useNavTheme";
import { BottomNav } from "@/components/BottomNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CharacterCreation from "./pages/CharacterCreation";
import Quests from "./pages/Quests";
import Journal from "./pages/Journal";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SearchPlayers from "./pages/SearchPlayers";
import PlayerProfile from "./pages/PlayerProfile";
import RunTracker from "./pages/RunTracker";
import Store from "./pages/Store";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import QuestManagement from "./pages/admin/QuestManagement";
import ModelManagement from "./pages/admin/ModelManagement";

const queryClient = new QueryClient();

// Pages where we don't show the bottom nav
const hiddenNavRoutes = ['/auth', '/create-character'];

function AppContent() {
  const location = useLocation();
  const showNav = !hiddenNavRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/create-character" element={<CharacterCreation />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search-players" element={<SearchPlayers />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
        <Route path="/run" element={<RunTracker />} />
        <Route path="/store" element={<Store />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/admin/quests" element={<ProtectedRoute requireAdmin><QuestManagement /></ProtectedRoute>} />
        <Route path="/admin/models" element={<ProtectedRoute requireAdmin><ModelManagement /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </NavThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
