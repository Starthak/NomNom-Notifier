import { FieldValues } from 'react-hook-form';
import create from 'zustand';
interface DataStore {
  obj: FieldValues;
  onUpdate: (data: FieldValues) => void;
}

export const useData = create<DataStore>((set) => ({
  obj: {},
  onUpdate: (data) => set({ obj: data }),
}));
