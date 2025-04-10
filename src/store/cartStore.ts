import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            // Hitung jumlah total yang akan diperbarui
            const newQuantity = existingItem.quantity + quantity;

            // Pastikan tidak melebihi stok
            if (newQuantity > product.quantity) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: product.quantity } // Batasi hingga stok
                    : item
                ),
              };
            }

            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: newQuantity } // Tambahkan sesuai jumlah
                  : item
              ),
            };
          }

          // Jika produk belum ada di keranjang, tambahkan dengan batas stok
          const limitedQuantity = quantity > product.quantity ? product.quantity : quantity;
          return {
            items: [...state.items, { ...product, quantity: limitedQuantity }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage', // Nama untuk localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan createJSONStorage
    }
  )
);
