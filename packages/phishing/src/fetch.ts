// Copyright 2020-2022 @polkadot/phishing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fetch } from '@polkadot/x-fetch';

// a fetch with a 2s timeout
async function fetchWithTimeout (url: string, timeout = 2000): Promise<Response> {
  const controller = new AbortController();
  let isAborted = false;
  const id = setTimeout((): void => {
    console.log(`Timeout on ${url}`);

    isAborted = true;
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(id);

    return response;
  } catch (error) {
    if (!isAborted) {
      clearTimeout(id);
    }

    throw error;
  }
}

export function fetchJson <T> (url: string, timeout = 2000): Promise<T> {
  return fetchWithTimeout(url, timeout).then<T>((r) => r.json());
}

export function fetchText (url: string, timeout = 2000): Promise<string> {
  return fetchWithTimeout(url, timeout).then((r) => r.text());
}
