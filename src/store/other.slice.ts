import { Getter, Lens, lens, Setter } from "@dhmk/zustand-lens";
import { StoreApi } from "zustand";
import { StoreState } from "./store";

const state = {
  counter: 0,
  msg: "",
};

export type State = typeof state;

export type Actions = {
  increase: (by: number) => void;
  getMsg: (msg: string) => void;
};

export type OtherStore = State & Actions;

const actions: (
  set: Setter<OtherStore>,
  get: Getter<OtherStore>,
  api: StoreApi<StoreState>,
  path: ReadonlyArray<string>
) => Actions = (set, get, api): Actions => {
  return {
    increase: (by) => {
      set({ counter: get().counter + 1 });
      api.getState().example.increase(2);
    },
    getMsg: (msg: string) => {
      set({ msg });
    },
  };
};

const slice: Lens<OtherStore, StoreState> = (set, get, api, path) => {
  return {
    ...state,
    ...actions(set, get, api, path),
  };
};

export default lens(slice);
