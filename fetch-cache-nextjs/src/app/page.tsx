// File: src/app/page.tsx
import React, { JSX } from 'react'

const API_URL = 'http://localhost:3000/api/random-number'

type CacheOption = RequestCache

const cacheOptions: { key: string; cache: CacheOption; extra?: RequestInit }[] = [
  { key: 'default', cache: 'default' },
  { key: 'force-cache', cache: 'force-cache' },
  { key: 'no-store', cache: 'no-store' },
  { key: 'reload', cache: 'reload' },
  {
    key: 'only-if-cached',
    cache: 'only-if-cached',
    extra: { mode: 'same-origin' } // required for only-if-cached
  }
]

async function fetchNumber(cache: CacheOption, extra?: RequestInit) {
  const res = await fetch(API_URL, {
    cache,
    ...extra
  })
  return res.json()
}

export default async function FetchWithAllCachePage() {
  const elements: JSX.Element[] = []

  for (const { key, cache, extra } of cacheOptions) {
    try {
      const data = await fetchNumber(cache, extra)
      const value = data.number ?? data.items ?? 'N/A'
      elements.push(
        <div key={key}>
          {key}: {value}
        </div>
      )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      elements.push(
        <div key={`${key}-error`}>
          {key}: failed to fetch{key === 'only-if-cached' ? ' (not cached)' : ''}
        </div>
      )
    }
  }

  return <div>{elements}</div>
}
