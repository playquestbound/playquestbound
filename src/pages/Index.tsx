import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { LoadingScreen } from '@/components/LoadingScreen';
import Home from './Home';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [hasCheckedCharacter, setHasCheckedCharacter] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only redirect once when we first get profile data
    if (!profileLoading && profile && !hasCheckedCharacter) {
      setHasCheckedCharacter(true);
      if (!profile.has_created_character) {
        navigate('/create-character', { replace: true });
      }
    }
  }, [profile, profileLoading, hasCheckedCharacter, navigate]);

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !profile?.has_created_character) {
    return <LoadingScreen />;
  }

  return <Home />;
}
