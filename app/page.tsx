"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Definiujemy, jak wygląda pojedynczy wydatek (to jest ten "strażnik" TypeScript)
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

// --- KOMPONENTY POMOCNICZE ---

const Menu = ({ setView, lokatorki, kategorie, form, setForm, dodajWydatek }: any) => (
  <div className="flex flex-col gap-4 p-6">
    <h1 className="text-2xl font-bold text-center mb-4">🏠 Menu Lokatorskie</h1>
    {lokatorki.map((osoba: string) => (
      <button key={osoba} onClick={() => setView(osoba)} className="bg-blue-500 text-white p-4 rounded-xl shadow-lg text-lg">
        Opcje: {osoba}
      </button>
    ))}
    <button onClick={() => setView('podsumowanie')} className="bg-green-600 text-white p-4 rounded-xl shadow-lg text-lg mt-4">
      📊 Podsumowanie Miesiąca
    </button>
    
    <div className="mt-8 border-t pt-4">
      <h2 className="font-bold mb-2 text-center">Dodaj nowy rachunek:</h2>
      
      <label className="text-xs text-gray-500">Kategoria</label>
      <select className="w-full p-2 mb-2 border rounded text-black" value={form.kategoria} onChange={e => setForm({...form, kategoria: e.target.value})}>
        {kategorie.map((k: string) => <option key={k} value={k}>{k}</option>)}
      </select>

      {form.kategoria === 'Czynsz' && (
        <>
          <label className="text-xs text-gray-500">Dla kogo czynsz?</label>
          <select className="w-full p-2 mb-2 border rounded text-black" value={form.osoba} onChange={e => setForm({...form, osoba: e.target.value})}>
            {lokatorki.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        </>
      )}

      <label className="text-xs text-gray-500">Kwota (całość)</label>
      <input 
        className="w-full p-2 mb-2 border rounded text-black" 
        type="number" 
        inputMode="decimal"
        placeholder="0.00" 
        value={form.kwota} 
        onChange={e => setForm({...form, kwota: e.target.value})} 
      />

      {form.kategoria === 'Inne' && (
        <>
          <label className="text-xs text-gray-500">Opis wydatku</label>
          <input className="w-full p-2 mb-2 border rounded text-black" placeholder="np. Papier toaletowy" value={form.opis} onChange={e => setForm({...form, opis: e.target.value})} />
        </>
      )}

      <button onClick={dodajWydatek} className="w-full bg-black text-white p-3 rounded-lg mt-2 font-bold">Dodaj i rozdziel</button>
    </div>
  </div>
);

const WidokOsoby = ({ imie, setView, expenses, toggleZaplacone }: any) => (
  <div className="p-6">
    <button onClick={() => setView('menu')} className="text-blue-500 mb-4 flex items-center">← Wróć do menu</button>
    <h1 className="text-2xl font-bold mb-4">Płatności: {imie}</h1>
    <div className="flex flex-col gap-3 text-black">
      {expenses.filter((e: Expense) => e.osoba === imie).map((e: Expense) => (
        <div key={e.id} className={`p-4 border rounded-xl flex justify-between items-center ${e.czy_zaplacone ? 'bg-green-100 opacity-60' : 'bg-white shadow'}`}>
          <div>
            <p className="font-bold">{e.kategoria} {e.opis && e.opis !== e.kategoria ? `(${e.opis})` : ''}</p>
            <p className="text-xl font-black">{e.kwota} zł</p>
            <p className="text-xs text-gray-400">{e.miesiac}</p>
          </div>
          <input 
            type="checkbox" 
            className="w-8 h-8 cursor-pointer" 
            checked={e.czy_zaplacone} 
            onChange={() => toggleZaplacone(e.id, e.czy_zaplacone)} 
          />
        </div>
      ))}
    </div>
  </div>
);

const Podsumowanie = ({ setView, expenses, kategorie }: any) => {
  const miesiace = Array.from(new Set(expenses.map((e: Expense) => e.miesiac)));
  return (
    <div className="p-6 text-black">
      <button onClick={() => setView('menu')} className="text-blue-500 mb-4 flex items-center">← Wróć do menu</button>
      <h1 className="text-2xl font-bold mb-4">Tabela Miesięczna</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Miesiąc</th>
              <th className="border p-2">Kategoria</th>
              <th className="border p-2 text-right">Suma</th>
            </tr>
          </thead>
          <tbody>
            {miesiace.map((m: any) => (
              kategorie.map((k: string) => {
                const suma = expenses
                  .filter((e: Expense) => e.miesiac === m && e.kategoria === k)
                  .reduce((acc: number, curr: Expense) => acc + Number(curr.kwota), 0);
                return suma > 0 ? (
                  <tr key={m + k}>
                    <td className="border p-2 text-sm">{m}</td>
                    <td className="border p-2 text-sm">{k}</td>
                    <td className="border p-2 text-right font-bold">{suma.toFixed(2)} zł</td>
                  </tr>
                ) : null;
              })
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---

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
      doWyslania.push({ 
        osoba: form.osoba, 
        kategoria: form.kategoria, 
        kwota: Number(form.kwota), 
        opis: form.opis, 
        miesiac, 
        czy_zaplacone: false 
      });
    } else {
      const kwotaNaGlowe = (Number(form.kwota) / 3).toFixed(2);
      lokatorki.forEach(osoba => {
        doWyslania.push({ 
          osoba, 
          kategoria: form.kategoria, 
          kwota: Number(kwotaNaGlowe), 
          opis: form.opis || form.kategoria,
          miesiac, 
          czy_zaplacone: false 
        });
      });
    }

    await supabase.from('mieszkanie2026').insert(doWyslania);
    setForm({ kategoria: 'Woda', kwota: '', opis: '', osoba: 'Ania O.' });
    fetchExpenses();
  }

  async function toggleZaplacone(id: number, stan: boolean) {
    await supabase.from('mieszkanie2026').update({ czy_zaplacone: !stan }).eq('id', id);
    fetchExpenses();
  }

  return (
    <main className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl pb-10 font-sans">
      {view === 'menu' && (
        <Menu 
          setView={setView} 
          lokatorki={lokatorki} 
          kategorie={kategorie} 
          form={form} 
          setForm={setForm} 
          dodajWydatek={dodajWydatek} 
        />
      )}
      {lokatorki.includes(view) && (
        <WidokOsoby 
          imie={view} 
          setView={setView} 
          expenses={expenses} 
          toggleZaplacone={toggleZaplacone} 
        />
      )}
      {view === 'podsumowanie' && (
        <Podsumowanie 
          setView={setView} 
          expenses={expenses} 
          kategorie={kategorie} 
        />
      )}
    </main>
  );
}