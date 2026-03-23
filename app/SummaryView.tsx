// SummaryView.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const fixedCategories = ['czynsz', 'woda', 'prąd', 'gaz', 'internet'];

export default function SummaryView() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dueDates, setDueDates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: expData } = await supabase.from('expenses').select('*');
    if (expData) setExpenses(expData);

    const { data: dueData } = await supabase.from('due_dates').select('*');
    if (dueData) setDueDates(dueData);
  };

  const updateDueDate = async (category: string, day: string) => {
    let dayNum = parseInt(day);
    if (dayNum < 1) dayNum = 1;
    if (dayNum > 31) dayNum = 31;

    await supabase.from('due_dates').upsert({ category, due_day: dayNum }, { onConflict: 'category' });
    fetchData(); 
  };

  const summaryByMonth = expenses.reduce((acc, exp) => {
    if (!acc[exp.month]) acc[exp.month] = { totals: {}, inneItems: [] };
    
    acc[exp.month].totals[exp.category] = (acc[exp.month].totals[exp.category] || 0) + exp.amount;
    
    if (exp.category === 'inne' && exp.description) {
      acc[exp.month].inneItems.push(`${exp.description} (${exp.amount.toFixed(2)}zł)`);
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100 transition-colors">Podsumowanie Miesięcy</h2>
        {Object.entries(summaryByMonth as any).map(([month, data]: [string, any]) => (
          <div key={month} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors">
            <h3 className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold p-3 transition-colors">{month}</h3>
            <div className="p-4 bg-white dark:bg-gray-800 grid grid-cols-2 gap-2 transition-colors">
              {Object.entries((data as any).totals || {}).map(([cat, suma]: any) => ( 
                <div key={cat} className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-1 transition-colors">
                  <span className="capitalize dark:text-gray-300">{cat}:</span>
                  <span className="font-bold dark:text-gray-100">{suma.toFixed(2)} zł</span>
                </div>
              ))}
            </div>
            {(data as any).inneItems && (data as any).inneItems.length > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 transition-colors border-t border-gray-100 dark:border-gray-700">
                <strong>Szczegóły "inne":</strong> {(data as any).inneItems.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-300 transition-colors">Terminy płatności (dzień miesiąca)</h2>
        <div className="space-y-3">
          {fixedCategories.map(cat => {
            const currentDue = dueDates.find(d => d.category === cat)?.due_day || '';
            return (
              <div key={cat} className="flex justify-between items-center">
                <span className="capitalize font-medium text-gray-700 dark:text-gray-300 transition-colors">{cat}</span>
                <input 
                  type="number" 
                  min="1" max="31"
                  defaultValue={currentDue}
                  onBlur={(e) => updateDueDate(cat, e.target.value)} 
                  placeholder="np. 10"
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded text-center shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}