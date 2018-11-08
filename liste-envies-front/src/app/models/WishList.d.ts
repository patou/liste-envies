export interface WishList {
  name?: string;
  title?: string;
  description?: string;
  users?: null;
  owners?: (OwnersEntity)[] | null;
  picture?: string;
  type?: WishListType;
  date?: number | null;
  privacy?: "PRIVATE" | "OPEN" | "PUBLIC";
  forceAnonymus?: boolean;
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
