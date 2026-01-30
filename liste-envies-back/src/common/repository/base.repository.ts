import { Datastore, Key } from '@google-cloud/datastore';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BaseRepository<T> {
  protected datastore: Datastore;
  protected kind: string;

  constructor(kind: string) {
    this.datastore = this.initializeDatastore();
    this.kind = kind;
  }

  private initializeDatastore(): Datastore {
    // Try to use service account file first
    const serviceAccountPath = path.join(
      __dirname,
      '../..',
      'firebase-service-account.json',
    );

    if (fs.existsSync(serviceAccountPath)) {
      console.log('Initializing Datastore with service account file');
      return new Datastore({
        projectId: 'test-liste-envies',
        keyFilename: serviceAccountPath,
      });
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Use environment variables
      console.log('Initializing Datastore with environment variables');
      return new Datastore({
        projectId: process.env.FIREBASE_PROJECT_ID,
        credentials: {
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
      });
    } else {
      throw new Error(
        'Datastore credentials not found. Please provide either a firebase-service-account.json file or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.',
      );
    }
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
