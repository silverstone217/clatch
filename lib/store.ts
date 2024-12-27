import { create } from "zustand";
import { CartDataType } from "../types/watch";

type UserType = {
  // id: string;
  name: string;
  email: string;
  password: string;
};
type Store = {
  myCartsData: CartDataType[];
  setMyCartsData: (carts: CartDataType[]) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const useCartStore = create<Store>()((set) => ({
  myCartsData: [],
  setMyCartsData: (carts) => set({ myCartsData: carts }),
  user: null,
  setUser: (user) => set({ user }),
}));
