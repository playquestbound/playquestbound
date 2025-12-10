import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { LoadingScreen } from '@/components/LoadingScreen';
import Home from './Home';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, isFetching } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only redirect if we have fresh data (not fetching) and character not created
    if (!profileLoading && !isFetching && profile && !profile.has_created_character) {
      navigate('/create-character', { replace: true });
    }
  }, [profile, profileLoading, isFetching, navigate]);

  const isLoading = authLoading || profileLoading || isFetching;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !profile?.has_created_character) {
    return <LoadingScreen />;
  }

  return <Home />;
}
