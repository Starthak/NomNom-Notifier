import { create } from 'zustand';

interface BankDetailsModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const BankDetailsModal = create<BankDetailsModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));



export default BankDetailsModal;