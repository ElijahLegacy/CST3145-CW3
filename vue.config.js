const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    "name": "BStore",
    "short_name": "BStore",
    workboxPluginMode: "GenerateSW",
    skipWaiting: true,
    workboxOptions: {
      runtimeCaching: [{
        // Routing via a matchCallback function:
        urlPattern: ({request, url}) =>  request.destination === "image",
        handler: 'StaleWhileRevalidate'
      },
        {
          urlPattern: ({ request, url }) => url.origin === 'http://cst3145-cw2-beanstalk-env.eba-5ezbmp9p.eu-west-2.elasticbeanstalk.com' && url.pathname === '/lessons' ,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache'
          }
        }
      ],
    }}
})
