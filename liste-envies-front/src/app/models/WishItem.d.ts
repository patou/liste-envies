import { UserInfo } from "firebase";

export interface WishItem {
  id?: number;
  listId?: string;
  listTitle?: string;
  owner?: Owner;
  suggest?: boolean;
  deleted?: boolean;
  archived?: boolean;
  label?: string;
  description?: string | null;
  price?: string | null;
  pictures?: string[];
  date?: number;
  urls?: (UrlsEntity)[] | null;
  userTake?: Owner[];
  given?: boolean;
  userGiven?: boolean;
  allreadyGiven?: boolean;
  canEdit?: boolean;
  canParticipate?: boolean;
  canSuggest?: boolean;
  comments?: WishComment[] | null;
  rating?: number;
  draft?: boolean;
}
export interface Owner {
  email?: string;
  name: string;
  picture?: string;
}
export interface UrlsEntity {
  url: string;
  name: string;
}

export interface WishComment {
  date?: string;
  from?: {
    email?: string;
    name?: string;
  };
  text: string;
  type?: "PRIVATE" | "PUBLIC";
}
