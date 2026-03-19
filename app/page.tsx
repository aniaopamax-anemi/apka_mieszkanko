"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- KONFIGURACJA I TYPY ---
const LOKATORKI = ['Ania O.', 'Ania P.', 'Ina'];
const KATEGORIE = ['Czynsz', 'Woda', 'Gaz', 'Prąd', 'Internet', 'Inne'];

interface Expense {
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

const getMonths = () => {
  const arr = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    arr.push(d.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }));
  }
  return arr;
};

// --- KOMPONENTY (WYDZIELONE) ---

const MenuGlowne = ({ setView, setMonth }: any) => (
  <div className="flex flex-col gap-4 p-6 text-black">
    <h1 className="text-3xl font-black text-center mb-8 text-blue-600">🏠 Mieszkanie 2026</h1>
    {LOKATORKI.map(osoba => (
      <button key={osoba} onClick={() => { setMonth(null); setView(osoba); }} className="bg-white border-2 border-blue-500 text-blue-600 p-5 rounded-2xl shadow-sm font-bold text-left flex justify-between">
        👤 Portfel: {osoba} <span>→</span>
      </button>
    ))}
    <button onClick={() => setView('dodaj')} className="w-full bg-orange-500 text-white p-5 rounded-2xl shadow-lg font-black text-xl mt-4">➕ DODAJ WYDATEK</button>
    <button onClick={() => setView('podsumowanie')} className="w-full bg-emerald-600 text-white p-5 rounded-2xl shadow-lg font-black text-xl">📊 PODSUMOWANIE</button>
  </div>
);

const Dodawanie = ({ setView, form, setForm, onSave }: any) => (
  <div className="p-6 text-black bg-white min-h-screen">
    <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6 italic">← WRÓĆ DO MENU</button>
    <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
      <h2 className="text-xl font-black text-center">Nowy rachunek</h2>
      <select className="w-full p-4 rounded-xl bg-white shadow-sm" value={form.miesiac} onChange={e => setForm({...form, miesiac: e.target.value})}>
        {getMonths().map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="w-full p-4 rounded-xl bg-white shadow-sm" value={form.kategoria} onChange={e => setForm({...form, kategoria: e.target.value})}>
        {KATEGORIE.map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      {form.kategoria === 'Czynsz' && (
        <select className="w-full p-4 rounded-xl bg-white shadow-sm font-bold text-blue-600" value={form.osoba} onChange={e => setForm({...form, osoba: e.target.value})}>
          {LOKATORKI.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      <input className="w-full p-4 rounded-xl bg-white shadow-sm text-2xl font-black" type="number" inputMode="decimal" placeholder="Kwota łączna" value={form.kwota} onChange={e => setForm({...form, kwota: e.target.value})} />
      <input className="w-full p-4 rounded-xl bg-white shadow-sm" placeholder="Opis (np. za co to?)" value={form.opis} onChange={e => setForm({...form, opis: e.target.value})} />
      <button onClick={onSave} className="w-full bg-black text-white p-5 rounded-2xl font-black text-lg shadow-xl active:scale-95">ZATWIERDŹ I ROZDZIEL</button>
    </div>
  </div>
);

const PortfelOsoby = ({ imie, setView, expenses, onToggle, month, setMonth }: any) => {
  const monthsInDb = Array.from(new Set(expenses.map((e: any) => e.miesiac)));
  if (!month) {
    return (
      <div className="p-6 text-black">
        <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6">← WRÓĆ</button>
        <h1 className="text-2xl font-black mb-6">Wybierz miesiąc:</h1>
        {monthsInDb.map((m: any) => (
          <button key={m} onClick={() => setMonth(m)} className="w-full p-5 mb-3 bg-gray-50 rounded-2xl font-bold text-left border shadow-sm">📅 {m}</button>
        ))}
      </div>
    );
  }
  const filtered = expenses.filter((e: any) => e.osoba === imie && e.miesiac === month);
  return (
    <div className="p-6 text-black">
      <button onClick={() => setMonth(null)} className="text-blue-600 font-bold mb-4">← ZMIEŃ MIESIĄC ({month})</button>
      <h1 className="text-3xl font-black mb-6">{imie}</h1>
      {filtered.map((e: any) => (
        <div key={e.id} onClick={() => onToggle(e.id, e.czy_zaplacone)} className={`p-5 mb-4 rounded-2xl border-2 flex justify-between items-center transition-all ${e.czy_zaplacone ? 'bg-gray-100 opacity-40' : 'bg-white border-blue-100 shadow-md'}`}>
          <div><p className="text-[10px] font-bold text-blue-500 uppercase">{e.kategoria}</p><p className="font-bold text-lg">{e.opis || e.kategoria}</p><p className="text-2xl font-black">{e.kwota.toFixed(2)} zł</p></div>
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${e.czy_zaplacone ? 'bg-green-500 border-green-500' : 'border-gray-200'}`}>{e.czy_zaplacone && "✓"}</div>
        </div>
      ))}
    </div>
  );
};

const Tabela = ({ setView, expenses }: any) => {
  const months = Array.from(new Set(expenses.map((e: any) => e.miesiac)));
  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6">← WRÓĆ</button>
      <h1 className="text-2xl font-black mb-8">Podsumowanie</h1>
      {months.map((m: any) => (
        <div key={m} className="mb-8 bg-white rounded-3xl p-6 shadow-sm border">
          <h2 className="text-xl font-black text-blue-600 border-b pb-2 mb-4 uppercase">{m}</h2>
          {KATEGORIE.map(k => {
            const inCat = expenses.filter((e: any) => e.miesiac === m && e.kategoria === k);
            const total = inCat.reduce((acc: number, curr: any) => acc + Number(curr.kwota), 0);
            if (total === 0) return null;
            return (
              <div key={m+k} className="flex justify-between items-start mb-4 border-b border-gray-50 pb-2">
                <div><p className="font-bold">{k}</p>{k === 'Inne' && <div className="flex gap-1 flex-wrap">{inCat.map((i: any, idx: number) => <span key={idx} className="text-[9px] bg-gray-100 px-1 rounded">{i.opis}</span>)}</div>}</div>
                <p className="font-black">{total.toFixed(2)} zł</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// --- GŁÓWNA APKA ---

export default function App() {
  const [view, setView] = useState('menu');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthPerson, setMonthPerson] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.', 
    miesiac: new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' }) 
  });

  useEffect(() => { fetch(); }, []);
  async function fetch() { const { data } = await supabase.from('mieszkanie2026').select('*').order('created_at', { ascending: false }); setExpenses(data || []); }

  async function handleAdd() {
    if (!form.kwota) return alert("Wpisz kwotę!");
    let payload: any[] = [];
    if (form.kategoria === 'Czynsz') {
      payload.push({ ...form, kwota: Number(form.kwota), opis: form.opis || 'Czynsz', czy_zaplacone: false });
    } else {
      const split = (Number(form.kwota) / 3).toFixed(2);
      LOKATORKI.forEach(o => payload.push({ ...form, osoba: o, kwota: Number(split), opis: form.opis || form.kategoria, czy_zaplacone: false }));
    }
    await supabase.from('mieszkanie2026').insert(payload);
    setForm({ ...form, kwota: '', opis: '' });
    fetch(); setView('menu');
  }

  async function toggle(id: number, stan: boolean) {
    await supabase.from('mieszkanie2026').update({ czy_zaplacone: !stan }).eq('id', id);
    fetch();
  }

  return (
    <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl">
      {view === 'menu' && <MenuGlowne setView={setView} lokatorki={LOKATORKI} setSelectedMonth={setMonthPerson} />}
      {view === 'dodaj' && <Dodawanie setView={setView} form={form} setForm={setForm} onSave={handleAdd} />}
      {LOKATORKI.includes(view) && <PortfelOsoby imie={view} setView={setView} expenses={expenses} onToggle={toggle} month={monthPerson} setMonth={setMonthPerson} />}
      {view === 'podsumowanie' && <Tabela setView={setView} expenses={expenses} />}
    </main>
  );
}