export class WishList {
  name: String;

  title: String;
  description?: String;
  isOwner: boolean;
  users?;
  owners?;

  // settings
  picture?: String; // Picture used for background, or for the list info (add thumbs for list info
  type?; // Purpose of the event for this list
  date?: Date; // date of the event
  privacy?; // Option for sharing privacy of the all list.

  state?;
}
