// app/(site)/animals/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

type Dog = {
  id: number | string;
  name: string;
  species: string;
  age?: string;
  description?: string;
  image?: string | { url?: string };
  image_url?: string;
  images?: Array<string | { url?: string }>;
  photo?: { url?: string };
  breed?: string;
  gender?: string;
};

function toQuery(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v && v.trim() !== "") qs.set(k, v);
  return qs.toString();
}

async function siteOriginFromHeaders() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

function xanoOriginFromEnv() {
  // Use dogs group base to derive the Xano origin (scheme + host)
  const base = process.env.XANO_GROUP_DOGS || "";
  try {
    return new URL(base).origin; // e.g. https://x8ki-letl-twmt.n7.xano.io
  } catch {
    return "";
  }
}

function resolveImageURL(pet: Dog, fallbackOrigin: string, xanoOrigin: string) {
  // normalize various shapes: string | {url} | array of strings/objects
  const firstArrayImage =
    Array.isArray(pet.images) && pet.images.length
      ? (typeof pet.images[0] === "string" ? pet.images[0] : pet.images[0]?.url)
      : undefined;

  let raw =
    (typeof pet.image === "string" ? pet.image : pet.image?.url) ||
    pet.image_url ||
    firstArrayImage ||
    pet.photo?.url;

  if (!raw || typeof raw !== "string") {
    return "/placeholder.svg?height=320&width=480&query=animal-image";
  }

  // protocol-relative => https
  if (raw.startsWith("//")) raw = "https:" + raw;

  // absolute => force https
  if (/^https?:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://");

  // leading slash => path on Xano (preferred) or site
  if (raw.startsWith("/")) return (xanoOrigin || fallbackOrigin) + raw;

  // common Xano file-ish prefixes
  if (/^(_?file|uploads?|image:|assets?)/i.test(raw)) {
    const origin = xanoOrigin || fallbackOrigin;
    return `${origin}/${raw.replace(/^\/+/, "")}`;
  }

  // generic fallback: prepend origin
  return `${(xanoOrigin || fallbackOrigin).replace(/\/+$/, "")}/${raw.replace(/^\/+/, "")}`;
}

async function getAnimals(orgId: string, q?: string, species?: string) {
  const qs = toQuery({ q, species: species && species !== "all" ? species : undefined });
  const origin = await siteOriginFromHeaders();
  const url = `${origin}/api/orgs/${encodeURIComponent(orgId)}/animals${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Animals API failed:", res.status, await res.text());
    return [] as Dog[];
  }
  const data = await res.json();
  return (Array.isArray(data) ? data : data.animals ?? []) as Dog[];
}

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams?: { q?: string; species?: string };
}) {
  const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? "1";
  const q = searchParams?.q ?? "";
  const species = searchParams?.species ?? "all";

  const animals = await getAnimals(orgId, q, species);
  const siteOrigin = await siteOriginFromHeaders();
  const xanoOrigin = xanoOriginFromEnv();

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header / Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Available Animals</h1>
          <p className="text-muted-foreground">Click on a pet to learn more and apply to adopt.</p>
        </div>

        {/* Server-friendly filter bar */}
        <form className="flex gap-3" action="/animals" method="get">
          <div className="w-64">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name..."
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
            />
          </div>
          <select
            name="species"
            defaultValue={species}
            className="w-40 rounded-md border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option value="all">All species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
            Filter
          </button>
        </form>
      </div>

      {/* Grid */}
      {animals.length === 0 ? (
        <div className="text-sm text-muted-foreground">No animals found. Try adjusting filters.</div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((pet) => {
            const img = resolveImageURL(pet, siteOrigin, xanoOrigin);
            return (
              <li
                key={String(pet.id)}
                className="group overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-sm"
              >
                <Link href={`/animals/${encodeURIComponent(String(pet.id))}`}>
                  <img
                    src={img}
                    title={img /* helpful while debugging; remove later */}
                    alt={pet.name}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 p-4">
                    <h3 className="font-semibold group-hover:underline underline-offset-4">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.species}
                      {pet.breed ? ` • ${pet.breed}` : ""}
                      {pet.age ? ` • ${pet.age}` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
