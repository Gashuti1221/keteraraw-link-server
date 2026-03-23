import { redirect } from "next/navigation";

// Define the base URL for your link server
const SERVER_URL = "https://keteraraw-link-server.vercel.app";
const FALLBACK_IMAGE = `${SERVER_URL}/preview.png`;

export async function generateMetadata({ params }) {
    const { id } = await params;

    // 1. Set a metadataBase to resolve paths correctly
    const metadataBase = new URL(SERVER_URL);

    try {
        const apiUrl = `${process.env.API_BASE_URL}/ads/${id}`;
        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error("Ad not found");
        const ad = await res.json();

        const title = ad.title || "Keteraraw Ad";
        const price = ad?.details?.price ? ` - ${ad.details.price} ETB` : "";
        const finalTitle = `${title}${price}`;
        const description = ad.description || "See this property on Keteraraw";

        // Logic to get the correct image URL
        let image = FALLBACK_IMAGE;
        if (ad.photos?.[0]) {
            const rawImage = ad.photos[0];
            const baseUrl = process.env.API_BASE_URL.replace(/\/$/, "");
            image = rawImage.startsWith("http") ? rawImage : `${baseUrl}/${rawImage.replace(/^\//, "")}`;
        }

        return {
            metadataBase,
            title: finalTitle,
            description: description,
            openGraph: {
                title: finalTitle,
                description: description,
                images: [{ url: image, width: 1200, height: 630 }],
                type: "website",
                url: `${SERVER_URL}/ad/${id}`,
            },
            twitter: {
                card: "summary_large_image",
                title: finalTitle,
                description: description,
                images: [image],
            },
        };
    } catch (e) {
        // IMPORTANT: Always return image metadata even on error
        return {
            metadataBase,
            title: "Keteraraw - Add Details",
            description: "Explore properties on Keteraraw",
            openGraph: {
                images: [{ url: FALLBACK_IMAGE }],
            },
            twitter: {
                card: "summary_large_image",
                images: [FALLBACK_IMAGE],
            }
        };
    }
}

export default async function AdPage({ params }) {
    const { id } = await params;

    // The redirect stays here
    redirect(`https://keteraraw.com/ad/${id}`);

    return null; // Next.js handles the redirect before this renders
}