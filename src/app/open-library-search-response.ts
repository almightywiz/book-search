import { Document } from './document';

export interface OpenLibrarySearchResponse {
  num_found: number;
  docs: Document[];
}
