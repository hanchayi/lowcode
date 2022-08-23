const { createApp } = Vue

createApp({
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
  methods: {
    handlePreivew() {
      window.open('simulator.html?uuid=123')
    }
  }
}).mount('#app')
