import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Twoje klucze schowane bezpiecznie na zapleczu
    const appId = "664ef654-dd81-446a-8e5c-f29f805ebbb7";
    const apiKey = "os_v2_app_mzhpmvg5qfcgvds46kpyaxv3w6kdjdy5mbresvuodh6o2ggbjeqbh3kcayyfthr5wblxnyirbifpi6kc2gp3f3v457mrd3fxqecvbby";

    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${apiKey}`
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["All"], 
        headings: { en: "Mieszkanko 🏠" },
        contents: { en: message }
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Błąd wysyłania' }, { status: 500 });
  }
}