import { useEffect, useRef, useState } from 'react';

import { V1beta1Provider } from '@kubev2v/types';
import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';

import {
  getCachedData,
  getInventoryApiUrl,
  hasObjectChangedInGivenFields,
  setCachedData,
} from '../utils/helpers';

import { DEFAULT_FIELDS_TO_COMPARE } from './utils';

/**
 * @typedef {Object} UseProviderInventoryParams
 *
 * @property {V1beta1Provider} provider - The provider from which the inventory is fetched.
 * @property {string} [subPath] - The sub path to be used in the inventory fetch API URL.
 * @property {string[]} [fieldsToCompare] - The fields to compare to check if the inventory has changed.
 * @property {number} [interval] - The polling interval in milliseconds.
 * @property {number} [cacheExpiryDuration] - Duration in milliseconds till the cache remains valid.
 */
interface UseProviderInventoryParams {
  provider: V1beta1Provider;
  subPath?: string;
  fieldsToCompare?: string[];
  interval?: number;
  cacheExpiryDuration?: number;
}

/**
 * @typedef {Object} UseProviderInventoryResult
 *
 * @property {T | null} inventory - The fetched inventory.
 * @property {boolean} loading - Whether the inventory fetch is in progress.
 * @property {Error | null} error - The error occurred during inventory fetch.
 */
interface UseProviderInventoryResult<T> {
  inventory: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * A React hook to fetch and cache inventory data from a provider.
 * It fetches new data on mount and then at the specified interval.
 * If the new data is the same as the old data (compared using the specified fields),
 * it does not update the state to prevent unnecessary re-renders.
 *
 * @param {Object} useProviderInventoryParams Configuration parameters for the hook
 * @param {Object} useProviderInventoryParams.provider Provider object to get inventory data from
 * @param {string} [useProviderInventoryParams.subPath=''] Sub-path to append to the provider API URL
 * @param {Array} [useProviderInventoryParams.fieldsToCompare=DEFAULT_FIELDS_TO_COMPARE] Fields to use for comparing new data with old data
 * @param {number} [useProviderInventoryParams.interval=10000] Interval (in milliseconds) to fetch new data at
 * @param {number} [useProviderInventoryParams.cacheExpiryDuration=60000] Duration (in milliseconds) to keep data in cache, if zero, don't use cache
 *
 * @returns {Object} useProviderInventoryResult Contains the inventory data (or null if loading, not fetched yet, or error),
 * the loading state, and the error state (or null if no errors)
 *
 * @template T Type of the inventory data
 */
export const useProviderInventory = <T>({
  provider,
  subPath = '',
  fieldsToCompare = DEFAULT_FIELDS_TO_COMPARE,
  interval = 10000,
  cacheExpiryDuration = 0, // default cache validity is 0 seconds (don't use cache)
}: UseProviderInventoryParams): UseProviderInventoryResult<T> => {
  const [inventory, setInventory] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const oldDataRef = useRef(null);
  const oldErrorRef = useRef(null);

  const cacheKey =
    provider?.metadata?.uid &&
    `forklift_inventory_${provider.spec.type}_${provider.metadata.uid}${
      subPath ? `_${subPath}` : ''
    }`;

  // Fetch cached data
  useEffect(() => {
    if (cacheExpiryDuration > 0) {
      const fetchCachedData = async () => {
        handleError(null);

        if (!isValidProvider(provider)) {
          const e = new Error('Invalid provider data');
          handleError(e);

          return;
        }

        const cachedData = getCachedData<T>(cacheKey, cacheExpiryDuration);
        if (cachedData) {
          updateInventoryIfChanged(cachedData, fieldsToCompare);
        }
      };

      fetchCachedData();
    }
  }, [provider, subPath, interval, cacheExpiryDuration]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      handleError(null);

      if (!isValidProvider(provider)) {
        const e = new Error('Invalid provider data');
        handleError(e);

        return;
      }

      try {
        const newInventory = await consoleFetchJSON(
          getInventoryApiUrl(
            `providers/${provider.spec.type}/${provider.metadata.uid}${
              subPath ? `/${subPath}` : ''
            }`,
          ),
        );

        updateInventoryIfChanged(newInventory, fieldsToCompare);
        setCachedData<T>(cacheKey, newInventory);
      } catch (e) {
        handleError(e);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [provider, subPath, interval, cacheExpiryDuration]);

  /**
   * Handles any errors thrown when trying to fetch the inventory.
   * If the error is new (compared to the last error),
   * it sets the error state and stops the loading state.
   *
   * @param {Error} e The error object to handle
   * @returns {void}
   */
  function handleError(e: Error): void {
    if (e?.toString() !== oldErrorRef.current?.error) {
      setError(e);
      setLoading(false);

      oldErrorRef.current = { error: e?.toString() };
    }
  }

  /**
   * Checks if provider object is valid.
   * @param {V1beta1Provider} provider - The provider object to be validated.
   * @returns {boolean} - True if the provider object is valid, false otherwise.
   */
  function isValidProvider(provider: V1beta1Provider): boolean {
    return provider?.spec?.type !== undefined && provider?.metadata?.uid !== undefined;
  }

  /**
   * Checks if the inventory data has changed and updates the inventory state if it has.
   * Also updates the loading state.
   * @param {T} newInventory - The new inventory data.
   * @param {string[]} fieldsToCompare - The fields to compare to check if the inventory data has changed.
   */
  function updateInventoryIfChanged(newInventory: T, fieldsToCompare: string[]): void {
    const needReRender = hasObjectChangedInGivenFields({
      oldObject: oldDataRef.current?.inventory,
      newObject: newInventory,
      fieldsToCompare: fieldsToCompare,
    });

    if (needReRender) {
      setInventory(newInventory);
      setLoading(false);

      oldDataRef.current = { inventory: newInventory };
    }
  }

  return { inventory, loading, error };
};

export default useProviderInventory;
