// https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers

// proxy http request

// generate related page code
function generatePageCode({ page, url }) {
  return `export default {
    render() {
      return '<div>Hello6 ${url}</div>'
    }
  }
  `
}

function getUuidByRequest(request) {
  return ''
}

function getPageByUuid(uuid) {
  return {}
}


function proxyRequest(request) {
  const url = request.url;
  console.log('worker fetch1', url)
  if (url.endsWith('.vue')) {
    const uuid = getUuidByRequest();
    const page = getPageByUuid(uuid);
    const code = generatePageCode({
      page,
      url
    });

    return new Promise((resolve) => {
      resolve(new Response(code, {
        headers: { 'Content-Type': 'text/javascript' }
      }))
    })
  }

  return fetch(request)
}


self.addEventListener('install', function(event) {
  console.log('worker install')
  self.skipWaiting();
})

self.addEventListener('activate', function(event) {
  console.log('worker activate2')
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      // Send a response - the clients
      // array is ordered by last focused
      clients[0].postMessage({
        type: 'ACTIVATE',
      });
    }
  });
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    proxyRequest(event.request)
  );
});

console.log('state', self.serviceWorker.state)

