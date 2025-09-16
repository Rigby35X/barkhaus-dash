// app/(site)/animals/[id]/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
// Update the import path to the correct location of AnimalDetailPageClient
import { AnimalDetailPageClient } from "./components/AnimalDetailPageClient";

// Updated Dog type to match your comprehensive design
type Dog = {
  id: number | string;
  name: string;
  litter_name?: string;
  species: string;
  age?: string;
  description?: string;
  description_long?: string;
  image?: string | { url?: string };
  image_url?: string;
  images?: Array<string | { url?: string }>;
  photo?: { url?: string };
  breed?: string;
  gender?: string;
  weight?: string;
  vaccinated?: boolean;
  spayed_neutered?: boolean;
  status?: string;
  location?: string;
  medical_notes?: string;
  
  // Additional fields for the "Additional Info" section
  color?: string;
  size?: string;
  intake_date?: string;
  adoption_fee?: number | string;
  microchip?: boolean | string;
  house_trained?: boolean;
  energy_level?: string;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  special_needs?: string;
  training_notes?: string;
  playgroup_notes?: string;
  
  // Organization details
  org_description?: string;
  org_details?: string;
};

async function siteOriginFromHeaders() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

function xanoOriginFromEnv() {
  const base = process.env.XANO_GROUP_DOGS || "";
  try {
    return new URL(base).origin;
  } catch {
    return "";
  }
}

function resolveImageURL(pet: Dog, fallbackOrigin: string, xanoOrigin: string) {
  const firstArrayImage =
    Array.isArray(pet.images) && pet.images.length
      ? (typeof pet.images[0] === "string" ? pet.images[0] : (pet.images[0] as any)?.url)
      : undefined;

  let raw =
    (typeof pet.image === "string" ? pet.image : (pet.image as any)?.url) ||
    pet.image_url ||
    firstArrayImage ||
    pet.photo?.url;

  if (!raw || typeof raw !== "string") {
    return "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
  }
  if (raw.startsWith("//")) raw = "https:" + raw;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://");
  if (raw.startsWith("/")) return (xanoOrigin || fallbackOrigin) + raw;
  if (/^(_?file|uploads?|image:|assets?)/i.test(raw)) {
    const origin = xanoOrigin || fallbackOrigin;
    return `${origin}/${raw.replace(/^\/+/, "")}`;
  }
  return `${(xanoOrigin || fallbackOrigin).replace(/\/+$/, "")}/${raw.replace(/^\/+/, "")}`;
}

async function getAnimal(orgId: string, id: string): Promise<Dog | null> {
  const origin = await siteOriginFromHeaders();
  const url = `${origin}/api/orgs/${encodeURIComponent(orgId)}/animals/${encodeURIComponent(id)}`;
  
  try {
    console.log('Fetching animal from:', url);
    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("Animal detail API failed:", res.status, await res.text());
      return null;
    }

    // Check if the response is actually JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      const text = await res.text();
      console.error('Response body:', text);
      return null;
    }

    const data = await res.json();
    console.log('Received data:', data);
    
    // Handle different response structures from Xano
    const animal = (data && (data as any).animal) ? (data as any).animal : data;
    return (animal ?? null) as Dog | null;
  } catch (error) {
    console.error('Error fetching animal:', error);
    return null;
  }
}

// Helper function to normalize image URLs for your client component
function normalizeAnimalImages(pet: Dog, siteOrigin: string, xanoOrigin: string): Dog {
  const normalizedPet = { ...pet };

  // Normalize the main image
  if (normalizedPet.image_url) {
    normalizedPet.image_url = resolveImageURL(
      { image_url: normalizedPet.image_url } as Dog,
      siteOrigin,
      xanoOrigin
    );
  }

  // Normalize the images array
  if (normalizedPet.images && Array.isArray(normalizedPet.images)) {
    normalizedPet.images = normalizedPet.images.map(img => {
      if (typeof img === 'string') {
        return resolveImageURL({ image_url: img } as Dog, siteOrigin, xanoOrigin);
      } else if (img && typeof img === 'object' && 'url' in img) {
        return resolveImageURL({ image_url: img.url } as Dog, siteOrigin, xanoOrigin);
      }
      return img;
    });
  }

  return normalizedPet;
}

export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? "1";
  const pet = await getAnimal(orgId, params.id);
  
  if (!pet) {
    notFound();
  }

  const siteOrigin = await siteOriginFromHeaders();
  const xanoOrigin = xanoOriginFromEnv();
  
  // Normalize all image URLs before passing to client component
  const normalizedPet = normalizeAnimalImages(pet, siteOrigin, xanoOrigin);

  return (
    <AnimalDetailPageClient 
      animal={normalizedPet} 
      animalId={params.id}
      orgId={orgId}
    />
  );
}