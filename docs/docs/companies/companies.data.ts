import {defineLoader} from 'vitepress';
import fs from 'node:fs';

export interface Company {
  name: string;
  deepDive?: string;
  website: string;
  sector: string;
  country: string;
  social?: {
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    github?: string;
  };
  incorporation?: string;
}

declare const data: Company[];
export {data};

export default defineLoader({
  watch: ['./companies.json'],
  load(watchedFiles: string[]) {
    const file = watchedFiles[0];
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content);
  },
});
