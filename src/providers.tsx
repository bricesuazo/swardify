import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { api } from '~/utils/trpc';

import { supabase } from './trpc/supabase';

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: undefined,
      links: [
        httpBatchLink({
          url: `${process.env.EXPO_PUBLIC_APP_URL}/api/trpc`,
          async headers() {
            const headers = new Map<string, string>();

            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (token) headers.set('authorization', token);

            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}

export default Providers;
