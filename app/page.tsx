"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Definiujemy, jak wygląda jeden wpis o wydatku (dla TypeScripta)
interface Wydatek {
  id: number;
  osoba: string;
  kategoria: string;
  opis: string;
  kwota: number;
  czy_zaplacone: boolean;
  miesiac: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [view, setView] = useState<string>('menu'); // menu, Ania O., Ania P., Ina, podsumowanie
  const [expenses, setExpenses] = useState<Wydatek[]>([]);
  const [form, setForm] = useState({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.' });

  const lokatorki = ['Ania O.', 'Ania P.', 'Ina'];
  const kategorie = ['Czynsz', 'Woda', 'Gaz', 'Prąd', 'Internet', 'Inne'];

  useEffect(() => { fetchExpenses(); }, []);

  async function fetchExpenses() {
    const { data } = await supabase.from('mieszkanie2026').select('*').order('created_at', { ascending: false });
    if (data) setExpenses(data);
  }

  async function dodajWydatek() {
    if (!form.kwota) return alert("Wpisz kwotę!");
    const miesiacStr = new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
    
    let doWyslania: any[] = [];

    if (form.kategoria === 'Czynsz') {
      // Czynsz dla konkretnej osoby (bez dzielenia)
      doWyslania.push({
        osoba: form.osoba,
        kategoria: form.kategoria,
        kwota: parseFloat(form.kwota),
        opis: 'Czynsz',
        miesiac: miesiacStr,
        czy_zaplacone: false
      });
    } else {
      // Wszystko inne dzielimy na 3
      const kwotaNaGlowe = parseFloat((parseFloat(form.kwota) / 3).toFixed(2));
      lokatorki.forEach(osoba => {
        doWyslania.push({ 
          osoba, 
          kategoria: form.kategoria, 
          kwota: kwotaNaGlowe, 
          opis: form.opis || form.kategoria,
          miesiac: miesiacStr, 
          czy_zaplacone: false 
        });
      });
    }

    await supabase.from('mieszkanie2026').insert(doWyslania);
    setForm({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.' });
    fetchExpenses();
    alert("Dodano pomyślnie!");
  }

  async function toggleZaplacone(id: number, stan: boolean) {
    await supabase.from('mieszkanie2026').update({ czy_zaplacone: !stan }).eq('id', id);
    fetchExpenses();
  }

  // --- KOMPONENTY WIDOKU ---

  const Menu = () => (
    <div className="flex flex-col gap-4 p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-black text-center mb-6 text-gray-800">MIESZKANKO 2026</h1>
      
      <div className="grid grid-cols-1 gap-3">
        {lokatorki.map(osoba => (
          <button key={osoba} onClick={() => setView(osoba)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl shadow-md font-bold text-xl transition-all">
            👤 {osoba}
          </button>
        ))}
        <button onClick={() => setView('podsumowanie')} className="bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl shadow-md font-bold text-xl mt-4">
          📊 PODSUMOWANIE
        </button>
      </div>

      <div className="mt-10 p-5 bg-gray-100 rounded-3xl">
        <h2 className="font-black text-lg mb-4 text-center">DODAJ RACHUNEK</h2>
        
        <label className="text-xs font-bold text-gray-500 ml-1">KATEGORIA</label>
        <select className="w-full p-3 mb-3 border-2 border-gray-200 rounded-xl" value={form.kategoria} onChange={e => setForm({...form, kategoria: e.target.value})}>
          {kategorie.map(k => <option key={k} value={k}>{k}</option>)}
        </select>

        {form.kategoria === 'Czynsz' && (
          <>
            <label className="text-xs font-bold text-gray-500 ml-1">DLA KOGO CZYNSZ?</label>
            <select className="w-full p-3 mb-3 border-2 border-gray-200 rounded-xl" value={form.osoba} onChange={e => setForm({...form, osoba: e.target.value})}>
              {lokatorki.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </>
        )}

        <label className="text-xs font-bold text-gray-500 ml-1">KWOTA CAŁKOWITA</label>
        <input className="w-full p-3 mb-3 border-2 border-gray-200 rounded-xl text-lg font-bold" type="number" placeholder="0.00 zł" value={form.kwota} onChange={e => setForm({...form, kwota: e.target.value})} />

        {form.kategoria === 'Inne' && (
          <input className="w-full p-3 mb-3 border-2 border-gray-200 rounded-xl" placeholder="Co to za wydatek?" value={form.opis} onChange={e => setForm({...form, opis: e.target.value})} />
        )}

        <button onClick={dodajWydatek} className="w-full bg-black text-white p-4 rounded-xl font-bold hover:opacity-80 transition-all">
          DODAJ I ROZLICZ
        </button>
      </div>
    </div>
  );

  const WidokOsoby = ({ imie }: { imie: string }) => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => setView('menu')} className="text-indigo-600 font-bold mb-6 flex items-center">← POWRÓT</button>
      <h1 className="text-2xl font-black mb-6">PŁATNOŚCI: {imie.toUpperCase()}</h1>
      <div className="space-y-3">
        {expenses.filter(e => e.osoba === imie).map(e => (
          <div key={e.id} className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${e.czy_zaplacone ? 'bg-green-50 border-green-200 opacity-60' : 'bg-white border-white shadow-sm'}`}>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{e.kategoria}</p>
              <p className="font-bold text-gray-800">{e.opis}</p>
              <p className="text-2xl font-black text-gray-900">{e.kwota} zł</p>
              <p className="text-[10px] text-gray-400 uppercase">{e.miesiac}</p>
            </div>
            <input 
              type="checkbox" 
              className="w-10 h-10 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              checked={e.czy_zaplacone} 
              onChange={() => toggleZaplacone(e.id, e.czy_zaplacone)} 
            />
          </div>
        ))}
      </div>
    </div>
  );

  const Podsumowanie = () => {
    const miesiace = Array.from(new Set(expenses.map(e => e.miesiac)));
    return (
      <div className="p-6 bg-white min-h-screen">
        <button onClick={() => setView('menu')} className="text-indigo-600 font-bold mb-6">← POWRÓT</button>
        <h1 className="text-2xl font-black mb-6">TABELA WYDATKÓW</h1>
        {miesiace.map(m => (
          <div key={m} className="mb-8">
            <h2 className="bg-gray-800 text-white p-2 px-4 rounded-lg inline-block text-sm mb-4 font-bold uppercase">{m}</h2>
            <div className="border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-xs font-black text-gray-500">KATEGORIA</th>
                    <th className="p-3 text-xs font-black text-gray-500">SUMA ŁĄCZNA</th>
                  </tr>
                </thead>
                <tbody>
                  {kategorie.map(k => {
                    const suma = expenses
                      .filter(e => e.miesiac === m && e.kategoria === k)
                      .reduce((acc, curr) => acc + curr.kwota, 0);
                    return suma > 0 ? (
                      <tr key={m + k} className="border-b last:border-0">
                        <td className="p-3 font-bold text-gray-700">{k}</td>
                        <td className="p-3 font-black text-indigo-600">{suma.toFixed(2)} zł</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="max-w-md mx-auto shadow-2xl min-h-screen bg-white">
      {view === 'menu' && <Menu />}
      {lokatorki.includes(view) && <WidokOsoby imie={view} />}
      {view === 'podsumowanie' && <Podsumowanie />}
    </main>
  );
}