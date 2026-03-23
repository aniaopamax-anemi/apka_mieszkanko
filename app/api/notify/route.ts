import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    const appId = "664ef654-dd81-446a-8e5c-f29f805ebbb7";
    const apiKey = "os_v2_app_mzhpmvg5qfcgvds46kpyaxv3w6kdjdy5mbresvuodh6o2ggbjeqbh3kcayyfthr5wblxnyirbifpi6kc2gp3f3v457mrd3fxqecvbby";

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${apiKey}`
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Subscribed Users"], // Próbujemy z tą nazwą
        headings: { en: "Mieszkanko 🏠" },
        contents: { en: message }
      })
    });

    const data = await response.json();

    // Jeśli OneSignal odrzuci powiadomienie, łapiemy ten błąd!
    if (!response.ok) {
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}