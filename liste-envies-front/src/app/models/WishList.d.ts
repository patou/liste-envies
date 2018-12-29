export interface WishList {
  name?: string;
  title?: string;
  description?: string;
  users?: any[];
  owners?: (OwnersEntity)[] | null;
  picture?: string;
  pictures?: string[];
  type?: WishListType;
  date?: number | null;
  privacy?: "PRIVATE" | "OPEN" | "PUBLIC";
  forceAnonymous?: boolean;
  state?: string;
  owner?: boolean;
}

export interface OwnersEntity {
  email?: string;
  name?: string;
  type?: string;
}

export enum WishListPrivacy {
  PRIVATE,
  OPEN,
  PUBLIC
}

export enum WishListType {
  OTHER,
  CHRISTMAS,
  BIRTHDAY,
  BIRTH,
  WEDDING,
  LEAVING,
  SPECIAL_OCCASION
}
