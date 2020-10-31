export interface WishItem {
  id?: number;
  state?: WishItemState;
  listId?: string;
  listTitle?: string;
  owner?: Person;
  suggest?: boolean;
  deleted?: boolean;
  archived?: boolean;
  label?: string;
  description?: string | null;
  price?: string | null;
  pictures?: string[];
  date?: number;
  urls?: UrlsEntity[] | null;
  userTake?: Person[];
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
export interface Person {
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
  from?: Person;
  text: string;
  type?: "PRIVATE" | "PUBLIC" | "OWNER";
}

export enum WishItemState {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED"
}
