<template>
    <div class="hero">
      <img :src="image" alt="Banner" />
      <h1>{{ title }}</h1>
    </div>
  </template>
  
  <script setup>
  defineProps(['title', 'image'])
  </script>
  
  <style>
  .hero img {
    width: 100%;
    height: auto;
  }
  </style>
  