"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TYPY (TypeScript) ---
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
  miesiac: string;
}

// Połączenie z bazą
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Pomocnicza lista miesięcy
const getMonthsList = () => {
  const months = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    months.push(d.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }));
  }
  return months;
};

// --- KOMPONENTY WIDOKÓW (Zdefiniowane na zewnątrz = klawiatura działa) ---

const MainMenu = ({ setView, lokatorki, setSelectedMonth }: any) => (
  <div className="flex flex-col gap-4 p-6 text-black">
    <h1 className="text-3xl font-black text-center mb-8 text-blue-600">🏠 Mieszkanie 2026</h1>
    <div className="grid grid-cols-1 gap-4">
      {lokatorki.map((osoba: string) => (
        <button 
          key={osoba} 
          onClick={() => { setSelectedMonth(null); setView(osoba); }}
          className="bg-white border-2 border-blue-500 text-blue-600 p-5 rounded-2xl shadow-sm font-bold text-lg active:scale-95 transition-all text-left flex justify-between items-center"
        >
          👤 Portfel: {osoba} <span className="text-gray-300">→</span>
        </button>
      ))}
      <button 
        onClick={() => setView('dodaj')} 
        className="w-full bg-orange-500 text-white p-5 rounded-2xl shadow-lg font-black text-xl mt-4 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        ➕ DODAJ WYDATEK
      </button>
      <button 
        onClick={() => setView('podsumowanie')} 
        className="w-full bg-emerald-600 text-white p-5 rounded-2xl shadow-lg font-black text-xl active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        📊 PODSUMOWANIE
      </button>
    </div>
  </div>
);

const AddExpenseView = ({ setView, lokatorki, kategorie, form, setForm, dodajWydatek, months }: any) => (
  <div className="p-6 text-black bg-white min-h-screen">
    <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6 flex items-center gap-2">← WRÓĆ</button>
    <h1 className="text-2xl font-black mb-6">Nowy rachunek</h1>
    <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Miesiąc</label>
        <select className="w-full p-4 rounded-xl border-2 border-white bg-white shadow-sm" value={form.miesiac} onChange={e => setForm({...form, miesiac: e.target.value})}>
          {months.map((m: string) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Kategoria</label>
        <select className="w-full p-4 rounded-xl border-2 border-white bg-white shadow-sm" value={form.kategoria} onChange={e => setForm({...form, kategoria: e.target.value})}>
          {kategorie.map((k: string) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      {form.kategoria === 'Czynsz' && (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Dla kogo czynsz?</label>
          <select className="w-full p-4 rounded-xl border-2 border-white bg-white shadow-sm" value={form.osoba} onChange={e => setForm({...form, osoba: e.target.value})}>
            {lokatorki.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Kwota łączna (zł)</label>
        <input className="w-full p-4 rounded-xl border-2 border-white bg-white shadow-sm text-2xl font-black" type="number" inputMode="decimal" placeholder="0.00" value={form.kwota} onChange={e => setForm({...form, kwota: e.target.value})} />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Opis (np. co kupione)</label>
        <input className="w-full p-4 rounded-xl border-2 border-white bg-white shadow-sm" placeholder="np. Papier toaletowy" value={form.opis} onChange={e => setForm({...form, opis: e.target.value})} />
      </div>
      <button onClick={dodajWydatek} className="w-full bg-black text-white p-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">ZATWIERDŹ I ROZDZIEL</button>
    </div>
  </div>
);

const PersonView = ({ imie, setView, expenses, toggleZaplacone, selectedMonth, setSelectedMonth }: any) => {
  const availableMonths = Array.from(new Set(expenses.map((e: Expense) => e.miesiac)));
  
  if (!selectedMonth) {
    return (
      <div className="p-6 text-black">
        <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6">← WRÓĆ</button>
        <h1 className="text-2xl font-black mb-6">Wybierz miesiąc dla {imie}:</h1>
        <div className="space-y-3">
          {availableMonths.map((m: any) => (
            <button key={m} onClick={() => setSelectedMonth(m)} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-left flex justify-between">
              📅 {m} <span>→</span>
            </button>
          ))}
          {availableMonths.length === 0 && <p className="text-gray-400 italic text-center py-10">Brak wpisów w bazie...</p>}
        </div>
      </div>
    );
  }

  const filtered = expenses.filter((e: Expense) => e.osoba === imie && e.miesiac === selectedMonth);

  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setSelectedMonth(null)} className="text-blue-600 font-bold">← ZMIEŃ MIESIĄC</button>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{selectedMonth}</span>
      </div>
      <h1 className="text-3xl font-black mb-6">{imie}</h1>
      <div className="space-y-4">
        {filtered.map((e: Expense) => (
          <div key={e.id} onClick={() => toggleZaplacone(e.id, e.czy_zaplacone)} className={`p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${e.czy_zaplacone ? 'bg-gray-50 border-transparent opacity-50' : 'bg-white border-blue-50 shadow-md'}`}>
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase">{e.kategoria}</p>
              <p className="font-bold text-lg">{e.opis || e.kategoria}</p>
              <p className="text-2xl font-black">{e.kwota.toFixed(2)} zł</p>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${e.czy_zaplacone ? 'bg-green-500 border-green-500' : 'border-gray-200'}`}>
              {e.czy_zaplacone && <span className="text-white font-bold">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SummaryView = ({ setView, expenses, kategorie }: any) => {
  const months = Array.from(new Set(expenses.map((e: Expense) => e.miesiac)));
  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6">← WRÓĆ</button>
      <h1 className="text-3xl font-black mb-8 text-center">Tabela Wydatków</h1>
      {months.map((m: any) => (
        <div key={m} className="mb-10 bg-white rounded-3xl shadow-sm border p-6">
          <h2 className="text-xl font-black text-blue-600 mb-4 border-b pb-2 uppercase tracking-widest">{m}</h2>
          <div className="space-y-4">
            {kategorie.map((k: string) => {
              const inCat = expenses.filter((e: Expense) => e.miesiac === m && e.kategoria === k);
              const total = inCat.reduce((acc: number, curr: Expense) => acc + Number(curr.kwota), 0);
              if (total === 0) return null;
              return (
                <div key={m+k} className="flex justify-between items-start border-b border-gray-50 pb-3">
                  <div className="max-w-[70%]">
                    <p className="font-bold text-gray-800">{k}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(new Set(inCat.map(i => i.opis))).map((o, idx) => (
                        <span key={idx} className="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{o}</span>
                      ))}
                    </div>
                  </div>
                  <p className="font-black text-lg whitespace-nowrap">{total.toFixed(2)} zł</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---

export default function App() {
  const [view, setView] = useState('menu');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  const currentMonth = new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
  const [form, setForm] = useState<FormState>({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.', miesiac: currentMonth });

  const lokatorki = ['Ania O.', 'Ania P.', 'Ina'];
  const kategorie = ['Czynsz', 'Woda', 'Gaz', 'Prąd', 'Internet', 'Inne'];
  const months = getMonthsList();

  useEffect(() => { fetchExpenses(); }, []);

  async function fetchExpenses() {
    const { data } = await supabase.from('mieszkanie2026').select('*').order('created_at', { ascending: false });
    setExpenses(data || []);
  }

  async function dodajWydatek() {
    if (!form.kwota) return alert("Wpisz kwotę!");
    let doWyslania: any[] = [];
    if (form.kategoria === 'Czynsz') {
      doWyslania.push({ ...form, kwota: Number(form.kwota), opis: form.opis || 'Czynsz', czy_zaplacone: false });
    } else {
      const split = (Number(form.kwota) / 3).toFixed(2);
      lokatorki.forEach(o => doWyslania.push({ ...form, osoba: o, kwota: Number(split), opis: form.opis || form.kategoria, czy_zaplacone: false }));
    }
    await supabase.from('mieszkanie2026').insert(doWyslania);
    setForm({ ...form, kwota: '', opis: '' });
    fetchExpenses();
    setView('menu');
    alert("Zapisano! ✅");
  }

  async function toggleZaplacone(id: number, stan: boolean) {
    await supabase.from('mieszkanie2026').update({ czy_zaplacone: !stan }).eq('id', id);
    fetchExpenses();
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative">
        {view === 'menu' && <MainMenu setView={setView} lokatorki={lokatorki} setSelectedMonth={setSelectedMonth} />}
        {view === 'dodaj' && <AddExpenseView setView={setView} lokatorki={lokatorki} kategorie={kategorie} form={form} setForm={setForm} dodajWydatek={dodajWydatek} months={months} />}
        {lokatorki.includes(view) && <PersonView imie={view} setView={setView} expenses={expenses} toggleZaplacone={toggleZaplacone} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
        {view === 'podsumowanie' && <SummaryView setView={setView} expenses={expenses} kategorie={kategorie} />}
      </main>
    </div>
  );
}