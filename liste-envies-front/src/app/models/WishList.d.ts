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
  privacy?: WishListPrivacy;
  forceAnonymous?: boolean;
  state?: string;
  owner?: boolean;
}

export interface UserShare {
  email?: string;
  name?: string;
  type?: "SHARED" | "OWNER" | string;
  photoURL?: string;
}

export type WishListPrivacy = "PRIVATE" | "OPEN" | "PUBLIC";

export type WishListType =
  | "OTHER"
  | "CHRISTMAS"
  | "BIRTHDAY"
  | "BIRTH"
  | "WEDDING"
  | "LEAVING"
  | "HOUSE_WARMING"
  | "RETIREMENT"
  | "CEREMONY"
  | "SPECIAL_OCCASION";
