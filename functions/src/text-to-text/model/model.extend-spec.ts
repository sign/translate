import {FirebaseTestEnvironmentContext} from '../../firebase.extend-spec';

const MODEL_FILES = ['lex.50.50.enru.s2t.bin', 'model.enru.intgemm.alphas.bin', 'vocab.enru.spm'];
const STORAGE_PREFIX = 'models/browsermt/spoken-to-signed/en-ru/';

export function setupModelFiles(testEnvironment: FirebaseTestEnvironmentContext) {
  beforeAll(async () => {
    const bucket = testEnvironment.storage.bucket('test');

    // Upload a model to storage
    for (const file of MODEL_FILES) {
      await bucket.upload(__dirname + `/test-assets/enru/${file}`, {destination: STORAGE_PREFIX + file});
    }
  });

  return MODEL_FILES.map(f => STORAGE_PREFIX + f);
}
