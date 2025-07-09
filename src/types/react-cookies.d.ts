declare module 'react-cookies' {
  export function load(name: string): any;
  export function save(name: string, value: any, options?: any): void;
  export function remove(name: string, options?: any): void;
  export function select(patterns: string[]): any;
} 