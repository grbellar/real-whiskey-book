import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Whiskey {
  id: string;
  name: string;
  distillery: string;
  type: string;
  abv?: number;
  age?: number;
  region?: string;
  description?: string;
}

interface Tasting {
  id: string;
  whiskey: Whiskey;
  location: string;
  preparation: string[];
  appearance: string[];
  nose: string[];
  palate: string[];
  finish: string[];
  rating: number;
  notes: string;
  date: string;
}

interface TastingContextType {
  tastings: Tasting[];
  addTasting: (tasting: Omit<Tasting, 'id' | 'date'>) => void;
  updateTasting: (id: string, tasting: Omit<Tasting, 'id' | 'date'>) => void;
  deleteTasting: (id: string) => void;
  addWhiskey: (whiskey: Omit<Whiskey, 'id'>) => Whiskey;
  whiskeyDatabase: Whiskey[];
  editingTasting: Tasting | null;
  setEditingTasting: (tasting: Tasting | null) => void;
}

const TastingContext = createContext<TastingContextType | undefined>(undefined);

// Mock initial whiskey database
const initialWhiskeyDatabase: Whiskey[] = [
  {
    id: '1',
    name: 'Macallan 18',
    distillery: 'Macallan',
    type: 'Single Malt Scotch',
    abv: 43,
    age: 18,
    region: 'Speyside',
    description: 'A sophisticated single malt with rich sherry cask influence'
  },
  {
    id: '2',
    name: 'Lagavulin 16',
    distillery: 'Lagavulin',
    type: 'Single Malt Scotch',
    abv: 43,
    age: 16,
    region: 'Islay',
    description: 'Classic Islay single malt with intense peat smoke'
  },
  {
    id: '3',
    name: 'Buffalo Trace',
    distillery: 'Buffalo Trace',
    type: 'Bourbon',
    abv: 45,
    region: 'Kentucky',
    description: 'Classic American bourbon with vanilla and caramel notes'
  },
  {
    id: '4',
    name: 'Ardbeg 10',
    distillery: 'Ardbeg',
    type: 'Single Malt Scotch',
    abv: 46,
    age: 10,
    region: 'Islay',
    description: 'Intensely smoky single malt with surprising elegance'
  }
];

// Mock initial tastings
const initialTastings: Tasting[] = [
  {
    id: '1',
    whiskey: initialWhiskeyDatabase[0],
    location: 'Home',
    preparation: ['Neat'],
    appearance: ['Amber', 'Rich'],
    nose: ['Vanilla', 'Oak', 'Honey'],
    palate: ['Sweet', 'Complex', 'Smooth'],
    finish: ['Long', 'Warm'],
    rating: 5,
    notes: 'Absolutely exceptional. The complexity and balance are remarkable.',
    date: '2024-01-15'
  },
  {
    id: '2',
    whiskey: initialWhiskeyDatabase[1],
    location: 'Local bar',
    preparation: ['Neat'],
    appearance: ['Dark', 'Golden'],
    nose: ['Smoke', 'Spice', 'Fruit'],
    palate: ['Spicy', 'Rich', 'Peppery'],
    finish: ['Lingering', 'Spicy'],
    rating: 4,
    notes: 'Classic Islay character with beautiful peat smoke.',
    date: '2024-01-10'
  }
];

export function TastingProvider({ children }: { children: ReactNode }) {
  const [tastings, setTastings] = useState<Tasting[]>(initialTastings);
  const [whiskeyDatabase, setWhiskeyDatabase] = useState<Whiskey[]>(initialWhiskeyDatabase);
  const [editingTasting, setEditingTasting] = useState<Tasting | null>(null);

  const addTasting = (newTasting: Omit<Tasting, 'id' | 'date'>) => {
    const tasting: Tasting = {
      ...newTasting,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setTastings(prev => [tasting, ...prev]);
  };

  const updateTasting = (id: string, updatedTasting: Omit<Tasting, 'id' | 'date'>) => {
    setTastings(prev => prev.map(tasting => 
      tasting.id === id 
        ? { ...updatedTasting, id, date: tasting.date }
        : tasting
    ));
  };

  const deleteTasting = (id: string) => {
    setTastings(prev => prev.filter(tasting => tasting.id !== id));
  };

  const addWhiskey = (newWhiskeyData: Omit<Whiskey, 'id'>): Whiskey => {
    const whiskey: Whiskey = {
      ...newWhiskeyData,
      id: Date.now().toString()
    };
    setWhiskeyDatabase(prev => [...prev, whiskey]);
    return whiskey;
  };

  return (
    <TastingContext.Provider value={{ 
      tastings, 
      addTasting, 
      updateTasting,
      deleteTasting,
      addWhiskey, 
      whiskeyDatabase,
      editingTasting,
      setEditingTasting
    }}>
      {children}
    </TastingContext.Provider>
  );
}

export function useTastings() {
  const context = useContext(TastingContext);
  if (context === undefined) {
    throw new Error('useTastings must be used within a TastingProvider');
  }
  return context;
}

export type { Whiskey, Tasting };