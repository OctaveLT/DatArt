<script setup lang="ts">
import { TITLE } from '../../assets/texts'

</script>

<template>
    <div class="title">
        <h1>{{ TITLE }}</h1>
        <img src="/datArtLogo.svg" class="logo">
    </div>

</template>

<style scoped>

.title {
    position: fixed;
    top: 0.8em;
    left: 1em;
    color: #CC998D;
    display: flex;
    justify-content: center;
}

.logo {
    margin: 0.4em;
    width: 1.1em;
}

</style>