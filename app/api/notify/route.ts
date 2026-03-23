import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    const appId = "664ef654-dd81-446a-8e5c-f29f805ebbb7";
    const apiKey = "os_v2_app_mzhpmvg5qfcgvds46kpyaxv3w6kdjdy5mbresvuodh6o2ggbjeqbh3kcayyfthr5wblxnyirbifpi6kc2gp3f3v457mrd3fxqecvbby";

    // ZMIANA 1: Nowy, ulepszony adres API od OneSignal
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ZMIANA 2: Magiczne słówko 'Key' zamiast 'Basic'
        "Authorization": `Key ${apiKey}`
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Subscribed Users"], 
        headings: { en: "Mieszkanko 🏠" },
        contents: { en: message }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}