import { Datastore, Key } from '@google-cloud/datastore';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseRepository<T> {
  protected datastore: Datastore;
  protected kind: string;

  constructor(kind: string) {
    this.datastore = new Datastore();
    this.kind = kind;
  }

  protected createKey(id?: string | number): Key {
    if (id) {
      return this.datastore.key([this.kind, id]);
    }
    return this.datastore.key(this.kind);
  }

  async save(data: T, id?: string | number): Promise<void> {
    const key = this.createKey(id);
    const entity = {
      key: key,
      data: data,
    };
    await this.datastore.save(entity);
  }

  async get(id: string | number): Promise<T | undefined> {
    const key = this.createKey(id);
    const [entity] = await this.datastore.get(key);
    return entity;
  }

  async delete(id: string | number): Promise<void> {
    const key = this.createKey(id);
    await this.datastore.delete(key);
  }

  async getAll(): Promise<T[]> {
    const query = this.datastore.createQuery(this.kind);
    const [entities] = await this.datastore.runQuery(query);
    return entities;
  }

  // Queries can be extended by subclasses
}
