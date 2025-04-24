// hooks/useUnsavedChangesWarning.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useUnsavedChangesWarning() {
  const router = useRouter();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (unsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  const confirmNavigation = () => {
    if (nextRoute) {
      setShowPrompt(false);
      setUnsavedChanges(false);
      router.push(nextRoute);
    }
  };

  const cancelNavigation = () => {
    setNextRoute(null);
    setShowPrompt(false);
  };

  useEffect(() => {
    if (unsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  return {
    unsavedChanges,
    setUnsavedChanges,
    showPrompt,
    setShowPrompt,
    setNextRoute,
    confirmNavigation,
    cancelNavigation
  };
}