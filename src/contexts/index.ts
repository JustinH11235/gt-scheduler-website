import React from 'react';
import {
  Theme,
  defaultScheduleData,
  ScheduleData,
  VersionsData
} from '../types';
import Oscar from '../beans/Oscar';

type Setter<T> = (next: T) => void;

export type ThemeContextValue = [Theme, Setter<Theme>];
export const ThemeContext = React.createContext<ThemeContextValue>([
  'light',
  () => {}
]);

export type TermsContextValue = [string[], Setter<string[]>];
export const TermsContext = React.createContext<TermsContextValue>([
  [],
  () => {}
]);

export type VersionsContextValue = [
  VersionsData,
  { patchVersionsData: Setter<Partial<VersionsData>> }
];
export const VersionsContext = React.createContext<VersionsContextValue>([
  {},
  { patchVersionsData: () => {} }
]);

export type ScheduleContextData = {
  term: string;
  versionName: string;
  oscar: Oscar;
} & ScheduleData;
export type ScheduleContextSetters = {
  setTerm: Setter<string>;
  setVersionName: Setter<string>;
  setOscar: Setter<Oscar>;
  patchScheduleData: Setter<Partial<ScheduleData>>;
};
export type ScheduleContextValue = [
  ScheduleContextData,
  ScheduleContextSetters
];
export const ScheduleContext = React.createContext<ScheduleContextValue>([
  {
    term: '',
    versionName: '',
    oscar: (null as unknown) as Oscar,
    ...defaultScheduleData
  },
  {
    setTerm: () => {},
    setVersionName: () => {},
    setOscar: () => {},
    patchScheduleData: () => {}
  }
]);

export type OverlayCrnsContextValue = [string[], Setter<string[]>];
export const OverlayCrnsContext = React.createContext<OverlayCrnsContextValue>([
  [],
  () => {}
]);
