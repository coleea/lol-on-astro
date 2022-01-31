import { atom } from "recoil";

export const basicInfoAtom = atom({
    key: "basicInfo",
    default: null,
  });

export const mostInfoAtom = atom({
  key: "mostInfo",
  default: null,
});

export const matchesAtom = atom({
  key: "matches",
  default: null,
});

export const userHeaderInfoAtom = atom({
  key: "userHeaderInfo",
  default: null,
});

export const userSidebarInfoAtom = atom({
  key: "userSidebarInfo",
  default: null,
});

export const latest20SummaryInfoAtom = atom({
  key: "latest20SummaryInfo",
  default: null,
});

export const matchHistoryDetailInfoAtom = atom({
  key: "matchHistoryDetailInfo",
  default: null,
});
