import { ID } from "@datorama/akita";

export interface Wish {
  id: ID;
}

/**
 * A factory function that creates Wish
 */
export function createWish(params: Partial<Wish>) {
  return {} as Wish;
}
