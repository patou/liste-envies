import { Datastore, Key } from '@google-cloud/datastore';
export declare class BaseRepository<T> {
    protected datastore: Datastore;
    protected kind: string;
    constructor(kind: string);
    protected createKey(id?: string | number): Key;
    save(data: T, id?: string | number): Promise<void>;
    get(id: string | number): Promise<T | undefined>;
    delete(id: string | number): Promise<void>;
    getAll(): Promise<T[]>;
}
