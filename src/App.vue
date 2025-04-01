<template>
    <div class="wrapper">
      <!-- Hero -->
      <Hero :title="data.Title" :image="data.BannerImageUrl?.Url || fallbackImage" />

  
      <!-- Metadata -->
      <section class="extra-content">
        <h2>Om denne side</h2>
        <p>Oprettet: {{ formatDate(data.Created) }}</p>
        <p>Senest ændret: {{ formatDate(data.Modified) }}</p>
        <p>Status: {{ data.PromotedState === 0 ? 'Udkast' : 'Publiceret' }}</p>
        <p>Version: {{ data.OData__UIVersionString || 'Ukendt' }}</p>
        <p><strong>GUID:</strong> {{ data.GUID }}</p>
      </section>
  
      <!-- Brugere -->
      <section class="rendered-html">
        <h2>Personer med kompetencer</h2>
        <div v-if="users.length">
          <ul class="people">
            <li v-for="(user, i) in users" :key="i">
              <strong>{{ user.preferredName }}</strong> – {{ user.title || 'Ingen titel' }}<br />
              <small>{{ user.email }}</small><br />
              <span v-if="user.skills">🔧 <strong>Kompetencer:</strong> {{ user.skills }}</span><br />
              <span v-if="user.responsibilities">📌 <strong>Ansvar:</strong> {{ user.responsibilities }}</span>
            </li>
          </ul>
        </div>
        <p v-else>Ingen personer fundet</p>
      </section>
    </div>
  </template>
  

  <!-- SCRIPT -->
  <script setup>
  import { ref, onMounted } from 'vue'
  import Hero from './components/Hero.vue'
  
  const data = ref({})
  const users = ref([])
  const fallbackImage = 'https://placehold.co/600x400'
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Ukendt'
    return new Date(dateStr).toLocaleString('da-DK')
  }
  
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
  
  onMounted(async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL)
      const result = await response.json()
      data.value = result
  
      console.log('CanvasContent1:', result.CanvasContent1)
  
      const matches = [...result.CanvasContent1.matchAll(/data-sp-webpartdata="([^"]+)"/g)]
  
      for (const match of matches) {
        try {
          const decoded = decodeHtml(match[1])
          const parsed = JSON.parse(decoded)
  
          if (parsed?.properties?.siteUsersInfo) {
            users.value = parsed.properties.siteUsersInfo
            console.log('👥 Fundne brugere:', users.value)
            break
          }
        } catch (err) {
          console.warn('Fejl ved parse:', err)
        }
      }
    } catch (error) {
      console.error('Kunne ikke hente data:', error)
    }
  })
  </script>
  
  <!-- STYLING -->
  <style scoped>  
  .wrapper {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  
  h1, h2 {
    margin-top: 2rem;
    font-weight: bold;
  }
  
  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  ul {
    list-style: none;
    padding-left: 0;
  }
  
  .extra-content {
    margin-top: 2rem;
    background: #fff3f6;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ffcdd2;
  }
  
  .rendered-html {
    margin-top: 2rem;
    background: #f3faff;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #b3e5fc;
  }

  .people li {
  padding: 1rem 0;
  border-bottom: 1px solid #e0f7fa;
  line-height: 1.6;
}

.people li:last-child {
  border-bottom: none;
}

  </style>
  