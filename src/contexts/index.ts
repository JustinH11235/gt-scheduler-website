import React from 'react';
import { Theme, defaultTermData, TermData } from '../types';
import Oscar from '../beans/Oscar';

type Setter<T> = (next: T) => void;

export type ThemeContextValue = [Theme, Setter<Theme>];
export const ThemeContext = React.createContext<ThemeContextValue>([
  'light',
  () => {}
]);

export type VersionsContextValue = [string[], Setter<string[]>];
export const VersionsContext = React.createContext<VersionsContextValue>([
  [],
  () => {}
]);

export type TermsContextValue = [string[], Setter<string[]>];
export const TermsContext = React.createContext<TermsContextValue>([
  [],
  () => {}
]);

export type ScheduleContextData = {
  term: string;
  version_name: string;
  oscar: Oscar;
} & TermData;
export type ScheduleContextSetters = {
  setTerm: Setter<string>;
  setVersionName: Setter<string>;
  setOscar: Setter<Oscar>;
  patchTermData: Setter<Partial<TermData>>;
};
export type ScheduleContextValue = [
  ScheduleContextData,
  ScheduleContextSetters
];
export const ScheduleContext = React.createContext<ScheduleContextValue>([
  {
    term: '',
    version_name: '',
    oscar: (null as unknown) as Oscar,
    ...defaultTermData
  },
  {
    setTerm: () => {},
    setVersionName: () => {},
    setOscar: () => {},
    patchTermData: () => {}
  }
]);

export type OverlayCrnsContextValue = [string[], Setter<string[]>];
export const OverlayCrnsContext = React.createContext<OverlayCrnsContextValue>([
  [],
  () => {}
]);
