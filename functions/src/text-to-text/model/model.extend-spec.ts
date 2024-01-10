import {FirebaseTestEnvironmentContext} from '../../firebase.extend-spec';

const MODEL_FILES = ['lex.50.50.enru.s2t.bin', 'model.enru.intgemm.alphas.bin', 'vocab.enru.spm'];
const STORAGE_PREFIX = 'models/browsermt/spoken-to-signed/en-ru/';

export function setupModelFiles(testEnvironment: FirebaseTestEnvironmentContext) {
  beforeAll(async () => {
    await testEnvironment.env.withSecurityRulesDisabled(async () => {
      // Upload a model to storage
      for (const file of MODEL_FILES) {
        const localFile = __dirname + `/test-assets/enru/${file}`;
        const destination = STORAGE_PREFIX + file;
        // check if file exists, speeds up tests
        const [exists] = await testEnvironment.bucket.file(destination).exists();
        if (!exists) {
          await testEnvironment.bucket.upload(localFile, {destination});
        }
      }
    });
  });

  return MODEL_FILES.map(f => STORAGE_PREFIX + f);
}
