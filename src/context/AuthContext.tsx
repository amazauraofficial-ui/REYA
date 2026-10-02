import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  initAuth,
  googleSignIn,
  setAccessToken,
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { recordAuditLog } from '../services/appointmentService';

export type UserRole = 'PATIENT' | 'PROVIDER' | 'STAFF' | 'ADMIN';

export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  googleConnected?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: AppUserProfile | null;
  role: UserRole;
  accessToken: string | null;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<AppUserProfile>) => Promise<void>;
  clearAuthError: () => void;
}

const DEFAULT_DEMO_PROFILES: Record<UserRole, AppUserProfile> = {
  PATIENT: {
    uid: 'demo-patient-1',
    email: 'elena.rostova@example.com',
    displayName: 'Elena Rostova',
    role: 'PATIENT',
    phone: '+375 29 345-44-55',
  },
  PROVIDER: {
    uid: 'demo-provider-1',
    email: 'master.somchai@reya.spa',
    displayName: 'Master Somchai (Lead Therapist)',
    role: 'PROVIDER',
    phone: '+1 (310) 555-8912',
  },
  STAFF: {
    uid: 'demo-staff-1',
    email: 'concierge@reya.spa',
    displayName: 'Sanctuary Concierge Desk',
    role: 'STAFF',
    phone: '+1 (310) 555-7392',
  },
  ADMIN: {
    uid: 'demo-admin-1',
    email: 'amazauraofficial@gmail.com',
    displayName: 'Clinic Medical Director (Admin)',
    role: 'ADMIN',
    phone: '+1 (310) 555-0000',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(DEFAULT_DEMO_PROFILES.PATIENT);
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [accessToken, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Persistent session listener with Firebase Authentication
    const unsubscribe = initAuth(
      async (firebaseUser, token) => {
        setUser(firebaseUser);
        if (token) {
          setTokenState(token);
          setAccessToken(token);
        }

        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(userDocRef);

            if (snap.exists()) {
              const data = snap.data() as AppUserProfile;
              setProfile(data);
              setRole(data.role || 'PATIENT');
            } else {
              // Default admin for app owner, otherwise PATIENT
              const isOwnerAdmin = firebaseUser.email === 'amazauraofficial@gmail.com';
              const newProf: AppUserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Cherished Guest',
                role: isOwnerAdmin ? 'ADMIN' : 'PATIENT',
                googleConnected: Boolean(token),
                createdAt: new Date().toISOString(),
              };
              await setDoc(userDocRef, newProf);
              setProfile(newProf);
              setRole(newProf.role);
            }

            await recordAuditLog({
              actor: firebaseUser.email || firebaseUser.uid,
              role: 'PATIENT',
              action: 'AUTH_SESSION_RESUME',
              resource: `users/${firebaseUser.uid}`,
              details: `Active session resumed for ${firebaseUser.email}`,
            });
          } catch (err) {
            console.warn('Could not read user profile from Firestore:', err);
          }
        } else {
          // If no active Firebase user, keep fallback demo patient active for seamless preview
        }
        setLoading(false);
      },
      () => {
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Real Google OAuth Login with Google Calendar Scopes
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setTokenState(result.accessToken);
        setAccessToken(result.accessToken);

        const isOwner = result.user.email === 'amazauraofficial@gmail.com';
        const updatedProf: AppUserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Cherished Guest',
          role: isOwner ? 'ADMIN' : 'PATIENT',
          googleConnected: true,
          avatarUrl: result.user.photoURL || undefined,
        };

        setProfile(updatedProf);
        setRole(updatedProf.role);

        // Sync to Firestore
        try {
          await setDoc(doc(db, 'users', result.user.uid), updatedProf, { merge: true });
        } catch {
          // ignore
        }

        await recordAuditLog({
          actor: result.user.email || 'guest',
          role: updatedProf.role,
          action: 'LOGIN_GOOGLE_OAUTH',
          resource: `users/${result.user.uid}`,
          details: 'Successfully authenticated via Google with Calendar scopes',
        });
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        // User voluntarily closed or cancelled the popup - no error message needed
        return;
      }
      setAuthError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Real Email / Password Sign In
   */
  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setUser(cred.user);

      // Fetch or build profile
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      if (snap.exists()) {
        const d = snap.data() as AppUserProfile;
        setProfile(d);
        setRole(d.role);
      } else {
        const isOwner = email === 'amazauraofficial@gmail.com';
        const newProf: AppUserProfile = {
          uid: cred.user.uid,
          email,
          displayName: cred.user.displayName || email.split('@')[0],
          role: isOwner ? 'ADMIN' : 'PATIENT',
        };
        setProfile(newProf);
        setRole(newProf.role);
      }

      await recordAuditLog({
        actor: email,
        role: profile?.role || 'PATIENT',
        action: 'LOGIN_EMAIL_PASSWORD',
        resource: `users/${cred.user.uid}`,
        details: 'User authenticated with password',
      });
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Real Email / Password Registration
   */
  const registerWithEmail = async (email: string, pass: string, name: string, assignedRole: UserRole = 'PATIENT') => {
    setLoading(true);
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(cred.user, { displayName: name });
      setUser(cred.user);

      const effectiveRole = email === 'amazauraofficial@gmail.com' ? 'ADMIN' : assignedRole;
      const newProf: AppUserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        role: effectiveRole,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProf);
      setProfile(newProf);
      setRole(effectiveRole);

      await recordAuditLog({
        actor: email,
        role: effectiveRole,
        action: 'USER_REGISTER',
        resource: `users/${cred.user.uid}`,
        details: `New account created as ${effectiveRole}`,
      });
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Password Reset
   */
  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err.message || 'Password reset request failed.');
      throw err;
    }
  };

  /**
   * Sign Out
   */
  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    setTokenState(null);
    setAccessToken(null);
    setProfile(DEFAULT_DEMO_PROFILES.PATIENT);
    setRole('PATIENT');
  };

  /**
   * Switch persona (for quick reviewer testing)
   */
  const switchDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    setProfile(DEFAULT_DEMO_PROFILES[newRole]);
  };

  /**
   * Update Profile
   */
  const updateUserProfile = async (updates: Partial<AppUserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    try {
      await setDoc(doc(db, 'users', profile.uid), updated, { merge: true });
    } catch {
      // ignore
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        accessToken,
        loading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logoutUser,
        switchDemoRole,
        updateUserProfile,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
