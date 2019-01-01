export interface WishList {
  name?: string;
  title?: string;
  description?: string;
  users?: UserShare[];
  owners?: UserShare[] | null;
  picture?: string;
  pictures?: string[];
  type?: WishListType;
  date?: number | null;
  privacy?: "PRIVATE" | "OPEN" | "PUBLIC";
  forceAnonymous?: boolean;
  state?: string;
  owner?: boolean;
}

export interface UserShare {
  email?: string;
  name?: string;
  type?: "SHARED" | "OWNER" | string;
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
