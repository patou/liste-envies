export interface WishItem {
  id: number;
  listId: string;
  listTitle?: null;
  owner: Owner;
  suggest: boolean;
  deleted: boolean;
  archived: boolean;
  label: string;
  description?: string | null;
  price?: string | null;
  pictures?: (string)[] | null;
  date: number;
  urls?: (UrlsEntity)[] | null;
  userTake?: null;
  given: boolean;
  userGiven: boolean;
  allreadyGiven: boolean;
  canEdit: boolean;
  canParticipate: boolean;
  canSuggest: boolean;
  comments?: (null)[] | null;
  rating: number;
}
export interface Owner {
  email: string;
  name: string;
}
export interface UrlsEntity {
  url: string;
  name: string;
}
