let serviceWorker;

// register worker
function uninstall() {
  serviceWorker.getRegistrations ? serviceWorker.getRegistrations().then(function(sws) {
    sws.forEach(function(sw) {
      sw.unregister();
      console.log('unregister 1 success');
    });
  }) : serviceWorker.getRegistration && serviceWorker.getRegistration().then(function(sw) {
    sw && sw.unregister();
    console.log('unregister 2 success');
  });
}

function install() {
  serviceWorker.register('simulator-worker.js?v=2', { }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

  serviceWorker.onmessage = (event) => {
    if (event.data && event.data.type === 'ACTIVATE') {
      window.location.reload()
    }
  };
}

function startup() {
  // 2. 定义一些路由
  // 每个路由都需要映射到一个组件。
  // 我们后面再讨论嵌套路由。
  const routes = [
    { path: '/', component: () => {
      return  import('./Home.vue')
    } },
    { path: '/about', component: () => {
      return import('./About.vue')
    } },
  ]

  // 3. 创建路由实例并传递 `routes` 配置
  // 你可以在这里输入更多的配置，但我们在这里
  // 暂时保持简单
  const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
  })

  // 5. 创建并挂载根实例
  const app = Vue.createApp({})
  //确保 _use_ 路由实例使
  //整个应用支持路由。
  app.use(router)

  app.mount('#app')

  // 现在，应用已经启动了！
}

function bootstrap() {
  serviceWorker = navigator.serviceWorker;

  if (!serviceWorker) {
    alert('service worker not support')
    return
  }

  install()

  serviceWorker.ready.then((registration) => {
    // At this point, a Service Worker is controlling the current page
    startup()
  });
}

bootstrap()

// uninstall()

