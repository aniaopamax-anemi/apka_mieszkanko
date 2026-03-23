import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    const appId = "664ef654-dd81-446a-8e5c-f29f805ebbb7";
    const apiKey = process.env.ONESIGNAL_API_KEY;

    // --- NOWY RADAR: SPRAWDZAMY CZY KLUCZ W OGÓLE JEST! ---
    if (!apiKey) {
      return NextResponse.json({ error: 'SEJF JEST PUSTY! Vercel nie załadował klucza ONESIGNAL_API_KEY.' }, { status: 400 });
    }

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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