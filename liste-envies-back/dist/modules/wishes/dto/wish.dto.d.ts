import { WishState } from '../../wish-list/dto/wish-list.dto';
export declare class LinkDto {
    url: string;
}
export declare class PersonDto {
    id?: string;
    email?: string;
    name?: string;
}
export declare class PersonParticipantDto {
    email: string;
    name?: string;
    anonymous?: boolean;
}
export declare class CommentDto {
    text: string;
    date?: Date;
    author: PersonDto;
}
export declare class WishDto {
    id?: number;
    listId?: string;
    listTitle?: string;
    owner?: PersonDto;
    suggest?: boolean;
    state?: WishState;
    label: string;
    description?: string;
    price?: string;
    pictures?: string[];
    date?: Date;
    urls?: LinkDto[];
    userTake?: PersonParticipantDto[];
    given?: boolean;
    userGiven?: boolean;
    allreadyGiven?: boolean;
    canEdit?: boolean;
    canParticipate?: boolean;
    canSuggest?: boolean;
    comments?: CommentDto[];
    rating?: number;
}
