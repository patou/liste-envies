import { ID } from "@datorama/akita";
import { UserShare, WishList, WishListType } from "../../models/WishList";

/**
 * A factory function that creates WishesList
 */
export function createWishesList(params: Partial<WishList>) {
  return {
    ...params
  } as WishList;
}
