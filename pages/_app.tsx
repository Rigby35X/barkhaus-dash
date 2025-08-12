import type { AppProps } from 'next/app';
import '../src/index.css';
import { AuthProvider } from '../src/contexts/AuthContext';
import { TenantProvider } from '../src/contexts/TenantContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TenantProvider>
        <Component {...pageProps} />
      </TenantProvider>
    </AuthProvider>
  );
}
