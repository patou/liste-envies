import {ID} from '@datorama/akita';
import {OwnersEntity, WishListType} from '../../models/WishList';

export interface WishesList {
  id: ID;
  name?: string;
  title?: string;
  description?: string;
  users?: null;
  owners?: (OwnersEntity)[] | null;
  picture?: string;
  type?: WishListType;
  date?: number | null;
  privacy?: 'PRIVATE' | 'OPEN' | 'PUBLIC';
  forceAnonymus?: boolean;
  state?: string;
  owner?: boolean;
  test?: string;
}

/**
 * A factory function that creates WishesList
 */
export function createWishesList(params: Partial<WishesList>) {
  return {
    ...params
  } as WishesList;
}
