import { redirect } from "next/navigation";

// 1. Metadata Generation (Social Media Previews)
export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        // Fetch ad data from your backend API
        const res = await fetch(`${process.env.API_BASE_URL}/ads/${id}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) throw new Error("Ad not found");
        const ad = await res.json();

        const title = ad.title || "Keteraraw Ad";
        const price = ad?.details?.price ? ` - ${ad.details.price} ETB` : "";
        const finalTitle = `${title}${price}`;

        const rawImage = ad.images?.[0];
        let image = "https://keteraraw-link-server.vercel.app/preview.png"; // Fallback image

        if (rawImage) {
            const baseUrl = process.env.API_BASE_URL.replace(/\/$/, "");
            image = rawImage.startsWith("http") ? rawImage : `${baseUrl}/${rawImage.replace(/^\//, "")}`;
        }

        return {
            title: finalTitle,
            description: ad.description || "See this property on Keteraraw",
            openGraph: {
                title: finalTitle,
                description: ad.description,
                images: [{ url: image, width: 1200, height: 630 }],
                type: "website",
                url: `https://keteraraw-link-server.vercel.app/ad/${id}`,
            },
            twitter: {
                card: "summary_large_image",
                title: finalTitle,
                description: ad.description,
                images: [image],
            },
        };
    } catch (e) {
        return { title: "Keteraraw - Real Estate" };
    }
}

// 2. The Page Component (The browser-side redirect)
export default async function AdPage({ params }) {
    const { id } = await params;

    // Next.js performs this redirect on the server-side immediately
    redirect(`https://keteraraw.com/ad/${id}`);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-sans">
            <p className="text-gray-600">Redirecting to Keteraraw...</p>
        </div>
    );
}