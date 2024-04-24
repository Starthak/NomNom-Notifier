import { create } from 'zustand';

interface SellerActivationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useActivationModal = create<SellerActivationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useActivationModal;
