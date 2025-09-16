// app/(site)/[slug]/page.tsx  (Server Component)
import { getLiveSite } from '@/lib/liveSite';

export default async function Page({ params }: { params: { slug: string } }) {
  const live = await getLiveSite(); // tagged fetch
  const page = live.pages.find((p: any) => p.slug === params.slug);
  // ...render
}
// If no page found, you might want to handle it, e.g. return a 404 or a default page