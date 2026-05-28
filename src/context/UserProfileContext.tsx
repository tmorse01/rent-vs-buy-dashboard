import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@mantine/hooks";

interface UserProfileData {
  displayName: string;
  memberSince: string;
}

interface UserProfileContextType {
  displayName: string;
  setDisplayName: (name: string) => void;
  memberSince: string;
  initials: string;
}

const USER_PROFILE_STORAGE_KEY = "rvb-user-profile";

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

function createDefaultProfile(): UserProfileData {
  return {
    displayName: "",
    memberSince: new Date().toISOString(),
  };
}

export function getInitialsFromDisplayName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return "U";
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfileData>({
    key: USER_PROFILE_STORAGE_KEY,
    defaultValue: createDefaultProfile(),
  });

  useEffect(() => {
    if (!profile.memberSince) {
      setProfile((current) => ({
        ...current,
        memberSince: new Date().toISOString(),
      }));
    }
  }, [profile.memberSince, setProfile]);

  const setDisplayName = (displayName: string) => {
    setProfile((current) => ({
      ...current,
      displayName,
    }));
  };

  const value = useMemo(
    () => ({
      displayName: profile.displayName,
      setDisplayName,
      memberSince: profile.memberSince,
      initials: getInitialsFromDisplayName(profile.displayName),
    }),
    [profile.displayName, profile.memberSince],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
