import { Alert } from 'react-native';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastOptions) => {
    Alert.alert(title, description);
  };

  return { toast };
}

// Simple toast function for direct usage
export function toast(options: ToastOptions) {
  Alert.alert(options.title, options.description);
}
