export const fetcher = url => fetch(url, {
  headers:{
    'Content-Type': 'application/json',
  },
}).then(r => r.json())
