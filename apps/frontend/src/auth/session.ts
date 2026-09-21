/**
 * Temporary frontend-only session for the technical challenge.
 * It is not authentication or an authorization boundary.
 */
export const DEMO_USER = {
  initials: 'MS',
  name: 'Milena Santana Borges',
  email: 'milena.santana@energy.org.br',
} as const;

const SESSION_KEY = 'wenlock:demo-session';

function getStorage(): Storage | undefined {
  return typeof window === 'undefined' ? undefined : window.sessionStorage;
}

export function hasDemoSession(): boolean {
  return getStorage()?.getItem(SESSION_KEY) === 'active';
}

export function startDemoSession(): void {
  getStorage()?.setItem(SESSION_KEY, 'active');
}

export function clearDemoSession(): void {
  getStorage()?.removeItem(SESSION_KEY);
}
