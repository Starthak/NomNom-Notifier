import create from 'zustand';
interface ActivationTokenStore {
  activationToken: string;
  onUpdate: (data: string) => void;
}

export const useActivationToken = create<ActivationTokenStore>((set) => ({
  activationToken: '',
  onUpdate: (data) => set({ activationToken: data }),
}));
