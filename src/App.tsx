import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import Settings from "@/pages/Settings";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { IntroVideo } from "@/components/IntroVideo";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CharacterCreation from "./pages/CharacterCreation";
import Quests from "./pages/Quests";
import Journal from "./pages/Journal";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import SearchPlayers from "./pages/SearchPlayers";
import PlayerProfile from "./pages/PlayerProfile";
import RunTracker from "./pages/RunTracker";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    // Check if intro has been shown this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
    setIntroChecked(true);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  if (!introChecked) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {showIntro && <IntroVideo onComplete={handleIntroComplete} />}
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
