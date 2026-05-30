'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  AddCartItemPayload,
  CartAction,
  CartItem,
  CartState,
} from './types';

const STORAGE_KEY = 'ndwi-cart-v1';

const initialState: CartState = {
  version: 1,
  items: [],
  hydrated: false,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, hydrated: true };

    case 'ADD':
      return { ...state, items: [...state.items, action.payload] };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.id
            ? { ...it, quantity: Math.max(1, Math.floor(action.quantity)) }
            : it
        ),
      };

    case 'UPDATE_NOTES':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.id ? { ...it, notes: action.notes } : it
        ),
      };

    case 'REMOVE':
      return { ...state, items: state.items.filter((it) => it.id !== action.id) };

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  /** Items du panier. Vide tant que le store n'est pas hydraté côté client. */
  items: CartItem[];
  /** Vrai uniquement une fois le contenu localStorage relu (anti hydration mismatch). */
  hydrated: boolean;
  /** Nombre total d'articles (somme des quantités). */
  count: number;
  /** Ajoute un item. Renvoie l'id généré pour pouvoir le manipuler ensuite. */
  addItem: (payload: AddCartItemPayload) => string;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  /** Ouvre / ferme le drawer panier (état partagé). */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function generateId(): string {
  // ID stable, unique, lisible : timestamp + random base36.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const skipNextWrite = useRef(true); // ne pas écrire pendant l'hydratation initiale

  // Hydratation depuis localStorage au montage côté client.
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartState>;
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: 'HYDRATE', payload: parsed.items as CartItem[] });
          return;
        }
      }
    } catch {
      // Si le contenu est corrompu, on l'ignore et on part à vide.
    }
    dispatch({ type: 'HYDRATE', payload: [] });
  }, []);

  // Persiste à chaque changement (après hydratation).
  useEffect(() => {
    if (!state.hydrated) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, items: state.items })
      );
    } catch {
      // Quota dépassé / mode privé : on échoue silencieusement.
    }
  }, [state.items, state.hydrated]);

  // Fermer le drawer avec Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, it) => sum + it.quantity, 0);
    return {
      items: state.items,
      hydrated: state.hydrated,
      count,
      addItem: (payload) => {
        const item: CartItem = { ...payload, id: generateId(), addedAt: Date.now() };
        dispatch({ type: 'ADD', payload: item });
        return item.id;
      },
      updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
      updateNotes: (id, notes) => dispatch({ type: 'UPDATE_NOTES', id, notes }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [state.items, state.hydrated, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart() doit être appelé à l’intérieur d’un <CartProvider>');
  }
  return ctx;
}
