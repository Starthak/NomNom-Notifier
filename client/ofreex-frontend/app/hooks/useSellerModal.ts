import { create } from 'zustand';

interface SellerModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSellerModal = create<SellerModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));



export default useSellerModal;