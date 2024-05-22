const AsyncLock = require('async-lock');
const lock = new AsyncLock();

module.exports = {
  acquireLock: async (key, fn) => {
    try {
      console.log(`Attempting to acquire lock for key: ${key}`);
      // Ensure a function is passed to execute within the lock's scope
      if (typeof fn !== 'function') {
        throw new Error('The second parameter must be a function to execute within the lock.');
      }
      return await lock.acquire(key, () => {
        console.log(`Lock acquired for key: ${key}`);
        return fn();
      });
    } catch (error) {
      console.error(`Error acquiring lock for key: ${key}`, error.message, error.stack);
      throw error; // Rethrow the error after logging
    }
  },
  isLockPresent: (key) => {
    return lock.isBusy(key);
  },
  releaseLock: async (key) => {
    // Since AsyncLock doesn't provide a direct method to release locks manually,
    // this function is a placeholder to illustrate the concept.
    // Locks are automatically released after the async operation completes.
    console.log(`Lock release requested for key: ${key}. Note: AsyncLock handles lock release automatically.`);
  }
};