// app/(site)/[slug]/page.tsx  (Server Component)
import { getLiveSite } from '../../../src/editor/lib/liveSite';

export default async function Page({ params }: { params: { slug: string } }) {
  const live = await getLiveSite(); // tagged fetch
  const page = live.pages.find((p: any) => p.slug === params.slug);
  
  if (!page) {
    // Handle case when no page is found
    return <div>Page not found</div>;
  }
  
  // ...render page content
  return <div>Page content for {page.slug}</div>;
}