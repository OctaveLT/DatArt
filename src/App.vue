<script setup lang="ts">
import Main from './components/Main.vue'
import Provider from './components/Provider.vue'
</script>

<template>
  <Provider>
    <template #default>
      <main>
        <Main />
      </main>
    </template>
  </Provider>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}
</style>
