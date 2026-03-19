"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- DEFINICJE DANYCH ---

interface Expense {
  id: number;
  osoba: string;
  kategoria: string;
  opis: string;
  kwota: number;
  czy_zaplacone: boolean;
  miesiac: string;
}

interface FormState {
  kategoria: string;
  kwota: string;
  opis: string;
  osoba: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPONENTY WIDOKÓW (NA ZEWNĄTRZ) ---

// 1. MENU GŁÓWNE
const Menu = ({ setView, lokatorki }: any) => (
  <div className="flex flex-col gap-4 p-6 text-black">
    <h1 className="text-2xl font-bold text-center mb-6">🏠 Menu Lokatorskie</h1>
    
    <div className="grid grid-cols-1 gap-3">
      {lokatorki.map((osoba: string) => (
        <button 
          key={osoba} 
          onClick={() => setView(osoba)} 
          className="bg-blue-600 text-white p-4 rounded-xl shadow-md font-bold hover:bg-blue-700 active:scale-95 transition-all text-left"
        >
          👤 Portfel: {osoba}
        </button>
      ))}
      
      <div className="mt-4 space-y-3">
        <button 
          onClick={() => setView('dodaj')} 
          className="w-full bg-orange-500 text-white p-4 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          ➕ Dodaj Nowy Wydatek
        </button>
        
        <button 
          onClick={() => setView('podsumowanie')} 
          className="w-full bg-emerald-600 text-white p-4 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          📊 Tabela Podsumowania
        </button>
      </div>
    </div>
  </div>
);

// 2. NOWA STRONA: DODAWANIE WYDATKU
const WidokDodawania = ({ setView, lokatorki, kategorie, form, setForm, dodajWydatek }: any) => (
  <div className="p-6 text-black">
    <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6 flex items-center">
      ← Wróć do Menu
    </button>
    
    <h1 className="text-2xl font-black mb-6 text-center">Nowy Wydatek</h1>
    
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kategoria</label>
      <select 
        className="w-full p-4 mb-5 border-2 border-gray-100 rounded-xl bg-gray-50 text-lg" 
        value={form.kategoria} 
        onChange={e => setForm({...form, kategoria: e.target.value})}
      >
        {kategorie.map((k: string) => <option key={k} value={k}>{k}</option>)}
      </select>

      {form.kategoria === 'Czynsz' && (
        <>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dla kogo?</label>
          <select 
            className="w-full p-4 mb-5 border-2 border-gray-100 rounded-xl bg-gray-50 text-lg" 
            value={form.osoba} 
            onChange={e => setForm({...form, osoba: e.target.value})}
          >
            {lokatorki.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        </>
      )}

      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kwota łączna (zł)</label>
      <input 
        className="w-full p-4 mb-5 border-2 border-gray-100 rounded-xl bg-gray-50 text-2xl font-bold" 
        type="number" 
        inputMode="decimal"
        placeholder="0.00" 
        value={form.kwota} 
        onChange={e => setForm({...form, kwota: e.target.value})} 
      />

      {form.kategoria === 'Inne' && (
        <>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Co kupione?</label>
          <input 
            className="w-full p-4 mb-5 border-2 border-gray-100 rounded-xl bg-gray-50 text-lg" 
            placeholder="np. Papier toaletowy" 
            value={form.opis} 
            onChange={e => setForm({...form, opis: e.target.value})} 
          />
        </>
      )}

      <button 
        onClick={dodajWydatek} 
        className="w-full bg-black text-white p-5 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all mt-4"
      >
        Zatwierdź i Rozdziel
      </button>
    </div>
  </div>
);

// 3. WIDOK OSOBY (Bez zmian)
const WidokOsoby = ({ imie, setView, expenses, toggleZaplacone }: any) => (
  <div className="p-6 text-black">
    <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6 flex items-center">
      ← Wróć do Menu
    </button>
    <h1 className="text-2xl font-black mb-6">Płatności: {imie}</h1>
    <div className="space-y-4">
      {expenses.filter((e: Expense) => e.osoba === imie).map((e: Expense) => (
        <div 
          key={e.id} 
          onClick={() => toggleZaplacone(e.id, e.czy_zaplacone)}
          className={`p-5 border-2 rounded-2xl flex justify-between items-center transition-all ${
            e.czy_zaplacone ? 'bg-gray-100 border-transparent opacity-50' : 'bg-white border-blue-100 shadow-md'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase">{e.kategoria}</p>
            <p className="font-bold text-lg">{e.opis && e.opis !== e.kategoria ? e.opis : e.kategoria}</p>
            <p className="text-2xl font-black">{e.kwota.toFixed(2)} zł</p>
          </div>
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${e.czy_zaplacone ? 'bg-green-500 border-green-500' : 'border-gray-200'}`}>
            {e.czy_zaplacone && <span className="text-white font-bold">✓</span>}
          </div>
        </div>
      ))}
      {expenses.filter((e: Expense) => e.osoba === imie).length === 0 && (
        <p className="text-center text-gray-400 py-20 italic">Wszystko czyste! ✨</p>
      )}
    </div>
  </div>
);

// 4. PODSUMOWANIE (Bez zmian)
const Podsumowanie = ({ setView, expenses, kategorie }: any) => {
  const miesiace = Array.from(new Set(expenses.map((e: Expense) => e.miesiac)));
  return (
    <div className="p-6 text-black">
      <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6 flex items-center">
        ← Wróć do Menu
      </button>
      <h1 className="text-2xl font-black mb-6">Tabela Wydatków</h1>
      {miesiace.map((m: any) => (
        <div key={m} className="mb-8 bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="text-lg font-bold border-b pb-2 mb-4 text-blue-600">{m}</h2>
          <table className="w-full text-left">
            <tbody className="divide-y">
              {kategorie.map((k: string) => {
                const suma = expenses
                  .filter((e: Expense) => e.miesiac === m && e.kategoria === k)
                  .reduce((acc: number, curr: Expense) => acc + Number(curr.kwota), 0);
                return suma > 0 ? (
                  <tr key={m + k}>
                    <td className="py-3 font-medium text-sm">{k}</td>
                    <td className="py-3 text-right font-black">{suma.toFixed(2)} zł</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

// --- KOMPONENT GŁÓWNY ---

export default function App() {
  const [view, setView] = useState('menu');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<FormState>({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.' });

  const lokatorki = ['Ania O.', 'Ania P.', 'Ina'];
  const kategorie = ['Czynsz', 'Woda', 'Gaz', 'Prąd', 'Internet', 'Inne'];

  useEffect(() => { fetchExpenses(); }, []);

  async function fetchExpenses() {
    const { data } = await supabase.from('mieszkanie2026').select('*').order('created_at', { ascending: false });
    setExpenses(data || []);
  }

  async function dodajWydatek() {
    if (!form.kwota) return alert("Wpisz kwotę!");
    const miesiac = new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
    
    let doWyslania: any[] = [];
    if (form.kategoria === 'Czynsz') {
      doWyslania.push({ osoba: form.osoba, kategoria: form.kategoria, kwota: Number(form.kwota), opis: form.opis || 'Czynsz', miesiac, czy_zaplacone: false });
    } else {
      const kwotaNaGlowe = (Number(form.kwota) / 3).toFixed(2);
      lokatorki.forEach(osoba => {
        doWyslania.push({ osoba, kategoria: form.kategoria, kwota: Number(kwotaNaGlowe), opis: form.opis || form.kategoria, miesiac, czy_zaplacone: false });
      });
    }

    await supabase.from('mieszkanie2026').insert(doWyslania);
    setForm({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.' });
    fetchExpenses();
    setView('menu'); // POWRÓT DO MENU PO DODANIU
    alert("Rozliczone! ✅");
  }

  async function toggleZaplacone(id: number, stan: boolean) {
    await supabase.from('mieszkanie2026').update({ czy_zaplacone: !stan }).eq('id', id);
    fetchExpenses();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        {view === 'menu' && <Menu setView={setView} lokatorki={lokatorki} />}
        {view === 'dodaj' && (
          <WidokDodawania 
            setView={setView} 
            lokatorki={lokatorki} 
            kategorie={kategorie} 
            form={form} 
            setForm={setForm} 
            dodajWydatek={dodajWydatek} 
          />
        )}
        {lokatorki.includes(view) && (
          <WidokOsoby imie={view} setView={setView} expenses={expenses} toggleZaplacone={toggleZaplacone} />
        )}
        {view === 'podsumowanie' && (
          <Podsumowanie setView={setView} expenses={expenses} kategorie={kategorie} />
        )}
      </main>
    </div>
  );
}