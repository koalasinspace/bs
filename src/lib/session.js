/**
 * src/lib/session.js
 *
 * After a successful Firebase signInWithEmailAndPassword / createUserWithEmailAndPassword,
 * call setSessionCookies(user, role) to write lightweight cookies that middleware can read.
 *
 * These are NOT the source of truth for auth — Firebase Auth is.
 * They exist solely so Next.js middleware (Edge Runtime) can gate routes
 * without a round-trip to Firestore on every request.
 *
 * The __session cookie stores the Firebase ID token (1-hour expiry).
 * A background refresh (see refreshSession) keeps it current while the
 * user is active.
 */

const COOKIE_OPTS = [
  'path=/',
  'SameSite=Strict',
  // Remove the 'Secure' comment below when on HTTPS (production)
  // 'Secure',
].join('; ');

/**
 * Call this right after a successful Firebase sign-in.
 * @param {import('firebase/auth').User} user - Firebase Auth user object
 * @param {string} role - Firestore role string (e.g. 'admin', 'user')
 */
export async function setSessionCookies(user, role) {
  const idToken = await user.getIdToken();

  // ID token expires in 1 hour — we'll refresh it via onIdTokenChanged
  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

  document.cookie = `__session=${idToken}; expires=${expires}; ${COOKIE_OPTS}`;
  document.cookie = `__role=${role}; expires=${expires}; ${COOKIE_OPTS}`;
}

/**
 * Call this on sign-out.
 */
export function clearSessionCookies() {
  document.cookie = `__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${COOKIE_OPTS}`;
  document.cookie = `__role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${COOKIE_OPTS}`;
}

/**
 * Wire this up in your root layout or AuthProvider via onIdTokenChanged.
 * Firebase silently refreshes the ID token every hour — this keeps the
 * cookie in sync so middleware doesn't see a stale/expired token.
 *
 * Usage in a client component:
 *   import { auth } from '@/lib/firebase';
 *   import { refreshSession } from '@/lib/session';
 *   import { onIdTokenChanged } from 'firebase/auth';
 *
 *   useEffect(() => {
 *     const unsub = onIdTokenChanged(auth, async (user) => {
 *       if (user) await refreshSession(user);
 *       else clearSessionCookies();
 *     });
 *     return unsub;
 *   }, []);
 */
export async function refreshSession(user) {
  if (!user) return;
  const idToken = await user.getIdToken(/* forceRefresh */ true);
  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
  document.cookie = `__session=${idToken}; expires=${expires}; ${COOKIE_OPTS}`;
}
