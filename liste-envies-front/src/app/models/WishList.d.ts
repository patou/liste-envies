export interface WishList {
  name?: string;
  title?: string;
  description?: string;
  users?: null;
  owners?: (OwnersEntity)[] | null;
  picture?: string;
  type?: string;
  date?: number | null;
  privacy?: string;
  state?: string;
  owner?: boolean;
}
export interface OwnersEntity {
  email?: string;
  name?: string;
  type?: string;
}
