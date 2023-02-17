<script setup lang="ts">
import IconRightArrow from '../icons/IconRightArrow.vue'
import Circle from '../canvas/Circle.vue'
import Lines from '../canvas/Lines.vue'
import Rose from '../canvas/Rose.vue'
import VideoUploader from './VideoUploader.vue'
import { useIsMobileVersion } from '@/utils'
import { computed, ref } from 'vue'

const currentIndex = ref<number>(0)
const MAX = 2

const nextSlide = () => {
    currentIndex.value = currentIndex.value >= MAX ? 0 : currentIndex.value + 1
}

const previousSlide = () => {
    currentIndex.value = currentIndex.value <= 0 ? MAX : currentIndex.value - 1
}

</script>

<template>
    <div class="slider">
        <div>
            <slot :name="currentIndex"></slot>
        </div>     
        <button class="previous" @click="previousSlide">{{ '<' }}</button>
        <button class="next" @click="nextSlide">{{ '>' }}</button>
    </div>
</template>

<style scoped>

.slider {
    position: relative;
}

button {
    color:#1C68BF;
    background-color: transparent;
    position: absolute;
    top: 50%
}

button:hover {
    background-color: transparent;
}

button.previous {
    left: 0;

}

button.next {
    right: 0;
}

</style>