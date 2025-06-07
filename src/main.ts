import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Stagewise toolbar integration - only in development mode
if (import.meta.env.DEV) {
  import('@stagewise/toolbar-vue').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = {
      plugins: [],
    }

    // Create a separate Vue app instance for the toolbar
    const toolbarApp = createApp(StagewiseToolbar, { config: stagewiseConfig })

    // Create a container for the toolbar
    const toolbarContainer = document.createElement('div')
    toolbarContainer.id = 'stagewise-toolbar'
    document.body.appendChild(toolbarContainer)

    // Mount the toolbar
    toolbarApp.mount('#stagewise-toolbar')

    console.log('Stagewise toolbar initialized in development mode')
  })
}
