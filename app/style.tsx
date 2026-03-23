const TextStyles = {
  tytul: "text-2xl font-bold text-pink-600 mb-4 text-center",
  naglowek: "text-lg font-semibold text-gray-800 mb-2 text-center",
  zwykly: "text-base text-gray-500",
  sukces: "text-green-600 font-medium italic",
  blad: "text-red-500 font-bold"
} as const;


export const Tytul = (tresc: string) => (
  <h1 className={TextStyles.tytul}>{tresc}</h1>
);

export const Naglowek = (tresc: string) => (
  <h2 className={TextStyles.naglowek}>{tresc}</h2>
);

export const Zwykly = (tresc: string) => (
  <p className={TextStyles.zwykly}>{tresc}</p>
);

export const Komunikat = (tresc: string, typ: 'sukces' | 'blad' = 'sukces') => (
  <p className={TextStyles[typ]}>{tresc} {typ === 'sukces' ? '🎉' : '⚠️'}</p>
);