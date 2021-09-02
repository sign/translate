export function promiseRaf<T>(callback?: CallableFunction): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(async () => {
      if (callback) {
        resolve(await callback());
      } else {
        resolve(undefined as any);
      }
    });
  });
}
