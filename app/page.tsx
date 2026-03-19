"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Połączenie z bazą przy użyciu Twoich kluczy z pliku .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [rachunki, setRachunki] = useState<any[]>([]);
  const [nowaNazwa, setNowaNazwa] = useState("");
  const [nowaKwota, setNowaKwota] = useState("");

  // Funkcja pobierająca dane z Twojej tabeli mieszkanie2026
  const fetchRachunki = async () => {
    const { data } = await supabase
      .from("mieszkanie2026")
      .select("*")
      .order("id", { ascending: false });
    if (data) setRachunki(data);
  };

  useEffect(() => {
    fetchRachunki();
  }, []);

  // Funkcja dodająca nowy wpis do bazy
  const dodajRachunek = async () => {
    if (!nowaNazwa || !nowaKwota) return;
    const { error } = await supabase.from("mieszkanie2026").insert([
      { nazwa: nowaNazwa, kwota: parseFloat(nowaKwota), zaplacone: false }
    ]);
    
    if (error) {
        alert("Błąd zapisu: " + error.message);
    } else {
        setNowaNazwa(""); 
        setNowaKwota("");
        fetchRachunki(); // Odświeżamy listę po dodaniu
    }
  };

  // Funkcja odznaczania zapłaconych rachunków
  const przelaczZaplacone = async (id: number, obecnyStan: boolean) => {
    await supabase.from("mieszkanie2026").update({ zaplacone: !obecnyStan }).eq("id", id);
    fetchRachunki();
  };

  const sumaNiezaplaconych = rachunki
    .filter(r => !r.zaplacone)
    .reduce((acc, curr) => acc + curr.kwota, 0);

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-white text-slate-900 font-sans">
      <h1 className="text-3xl font-black mb-8 text-blue-600 text-center tracking-tight">MOJA APKA LOKATORSKA</h1>
      
      {/* Karta z sumą */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-3xl shadow-xl mb-8 text-white">
        <h2 className="text-xs font-bold uppercase opacity-80 mb-1">Do przelania na osobę:</h2>
        <p className="text-4xl font-black">{(sumaNiezaplaconych / 3).toFixed(2)} zł</p>
        <p className="text-[10px] mt-2 opacity-70 italic">* Liczone z niezapłaconych rachunków podzielonych na 3</p>
      </div>

      {/* Formularz dodawania */}
      <div className="space-y-3 mb-10 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <input 
          placeholder="Nazwa (np. Prąd, Internet)" 
          className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={nowaNazwa} onChange={(e) => setNowaNazwa(e.target.value)}
        />
        <input 
          type="number" placeholder="Ile wyszło łącznie?" 
          className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={nowaKwota} onChange={(e) => setNowaKwota(e.target.value)}
        />
        <button 
          onClick={dodajRachunek}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-black shadow-lg active:scale-95 transition-all"
        >
          DODAJ I POWIADOM
        </button>
      </div>

      {/* Lista wydatków */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase ml-2">Historia wydatków</h3>
        {rachunki.length === 0 && <p className="text-center text-gray-400 py-10">Brak wpisów. Dodaj pierwszy!</p>}
        {rachunki.map(r => (
          <div key={r.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${r.zaplacone ? 'bg-gray-50 border-transparent opacity-60' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div>
              <p className={`font-bold text-lg ${r.zaplacone ? "line-through text-gray-400" : "text-gray-800"}`}>{r.nazwa}</p>
              <p className="text-sm text-gray-500">Razem: {r.kwota} zł | <span className="text-blue-600 font-bold">Na głowę: {(r.kwota/3).toFixed(2)} zł</span></p>
            </div>
            <input 
              type="checkbox" checked={r.zaplacone} 
              onChange={() => przelaczZaplacone(r.id, r.zaplacone)}
              className="w-7 h-7 rounded-full border-2 border-blue-200 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </main>
  );
}