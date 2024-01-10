import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {RulesTestContext, RulesTestEnvironment} from '@firebase/rules-unit-testing/dist/src/public_types';
import {FirebaseFirestore} from '@firebase/firestore-types';
import {FirebaseDatabase} from '@firebase/database-types';
import {Bucket, Storage} from '@google-cloud/storage';
import fetch from 'node-fetch';
import * as fs from 'fs';

const firestoreRules = `
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

export interface FirebaseTestEnvironmentContext {
  env: RulesTestEnvironment;
  context: RulesTestContext;
  database: FirebaseDatabase;
  firestore: FirebaseFirestore;
  storage: Storage;
  bucket: Bucket;
}

export function setupFirebaseTestEnvironment(clearStorage = true): FirebaseTestEnvironmentContext {
  const testEnvironmentContext: FirebaseTestEnvironmentContext = {} as any;

  beforeAll(async () => {
    testEnvironmentContext.env = await initializeTestEnvironment({
      projectId: 'test',
      firestore: {host: 'localhost', port: 4010, rules: firestoreRules},
      database: {host: 'localhost', port: 4011},
      storage: {host: 'localhost', port: 4012, rules: storageRules},
    });
    const context = testEnvironmentContext.env.unauthenticatedContext();
    testEnvironmentContext.database = context.database();
    testEnvironmentContext.firestore = context.firestore();
    const storage = context.storage(); // Need to mock firebase storage object
    testEnvironmentContext.bucket = {
      upload: async (pathString: string, options: {destination: string}) => {
        const buffer = fs.readFileSync(pathString);
        return storage.ref(options.destination).put(buffer);
      },
      file: (p: string) => {
        const ref = storage.ref(p);
        return {
          exists: async () => {
            return [
              await ref
                .getMetadata()
                .then(() => true)
                .catch(() => false),
            ];
          },
          save: (data: any) => {
            if (typeof data === 'string') {
              return ref.putString(data);
            }
            return ref.put(data);
          },
          getMetadata: async () => {
            const mediaLink = await ref.getDownloadURL();
            return [{mediaLink}, null];
          },
          download: async () => {
            const url = await ref.getDownloadURL();
            const req = await fetch(url);
            const buffer = await req.buffer();
            return [buffer];
          },
          getSignedUrl: () => ref.getDownloadURL().then(url => [url]),
          publicUrl: () => ref.getDownloadURL(),
          delete: () => ref.delete(),
        };
      },
      getFiles: async (options: {prefix: string}) => {
        const res = await storage.ref(options.prefix).listAll();
        return [res.items.map(i => ({metadata: {name: i.fullPath}}))];
      },
    } as any as Bucket;

    testEnvironmentContext.storage = {
      bucket: () => testEnvironmentContext.bucket,
    } as any as Storage;
  });

  beforeEach(async () => {
    await testEnvironmentContext.env.clearDatabase();
    await testEnvironmentContext.env.clearFirestore();
    if (clearStorage) {
      await testEnvironmentContext.env.clearStorage();
    }
  });

  afterAll(async () => {
    await testEnvironmentContext.env.cleanup();
  });

  return testEnvironmentContext;
}
