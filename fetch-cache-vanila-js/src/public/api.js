const API_URL = 'http://localhost:3333'

const setResultText = (id, data) => {
  const el = document.getElementById(id)
  if (el) el.innerText = JSON.stringify(data)
}

const fetchRandomItems = async (cache) => {
  const options = {
    cache,
    ...(cache === 'only-if-cached' && { mode: 'same-origin' })
  }

  const response = await fetch(`${API_URL}/random-items`, options)
  const { items } = await response.json()
  return items
}

const createRandomItemsHandler = (id, cache) => async () => {
  const items = await fetchRandomItems(cache)
  setResultText(id, items)
}

const toggleCacheControl = (status) => () => {
  fetch(`${API_URL}/cache-control/${status}`, { method: 'POST' })
}

const bindButton = (id, handler) => {
  document.getElementById(id)?.addEventListener('click', handler)
}

window.addEventListener('load', () => {
  console.log('API script loaded')
  const cacheModes = ['default', 'no-store', 'reload', 'force-cache', 'only-if-cached']

  cacheModes.forEach((cache) => {
    bindButton(`${cache}-btn`, createRandomItemsHandler(`${cache}-rst`, cache))
  })

  bindButton('cache-control-on', toggleCacheControl('on'))
  bindButton('cache-control-off', toggleCacheControl('off'))
})
