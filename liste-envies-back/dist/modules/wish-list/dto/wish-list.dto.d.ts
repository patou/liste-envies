export declare enum SharingPrivacyType {
    PRIVATE = "PRIVATE",
    OPEN = "OPEN",
    PUBLIC = "PUBLIC"
}
export declare enum UserShareType {
    OWNER = "OWNER",
    SHARED = "SHARED"
}
export declare enum WishListStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
export declare enum WishListType {
    CHRISTMAS = "CHRISTMAS",
    BIRTHDAY = "BIRTHDAY",
    BIRTH = "BIRTH",
    WEDDING = "WEDDING",
    LEAVING = "LEAVING",
    SPECIAL_OCCASION = "SPECIAL_OCCASION",
    HOUSE_WARMING = "HOUSE_WARMING",
    RETIREMENT = "RETIREMENT",
    CEREMONY = "CEREMONY",
    OTHER = "OTHER"
}
export declare enum WishState {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    DELETED = "DELETED"
}
export declare enum WishListState {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}
export declare class UserShareDto {
    email: string;
    name?: string;
    type: UserShareType;
}
export declare class WishListDto {
    name?: string;
    title: string;
    description?: string;
    isOwner?: boolean;
    users?: UserShareDto[];
    owners?: UserShareDto[];
    status?: WishListStatus;
    picture?: string;
    type?: WishListType;
    date?: Date;
    privacy?: SharingPrivacyType;
    forceAnonymous?: boolean;
    state?: WishListState;
    canSuggest?: boolean;
    counts?: Record<WishState, number>;
}
