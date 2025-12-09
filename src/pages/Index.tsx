import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { LoadingScreen } from '@/components/LoadingScreen';
import Home from './Home';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.has_created_character) {
      navigate('/create-character');
    }
  }, [profile, profileLoading, navigate]);

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !profile?.has_created_character) {
    return <LoadingScreen />;
  }

  return <Home />;
}
