import { create } from 'zustand';

interface SellerLoginModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSellerLoginModal = create<SellerLoginModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));



export default useSellerLoginModal;
