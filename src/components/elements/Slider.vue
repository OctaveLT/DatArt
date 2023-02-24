<script setup lang="ts">
import { inject } from 'vue'
import { UserSettingsStateSymbol, UserSettingsUpdateSymbol } from '../Provider.vue'

const props = defineProps<{
    withArrows: boolean
}>()

const { sliderIndex } = inject<any>(UserSettingsStateSymbol)

const updateUserSettings: any= inject(UserSettingsUpdateSymbol)!
const updateIndex = (value: number) => updateUserSettings('sliderIndex', value)
const MAX = 2

const nextSlide = () => {
    updateIndex(sliderIndex.value >= MAX ? 0 : sliderIndex.value + 1)
    console.log(sliderIndex.value)
}

const previousSlide = () => {
    updateIndex(sliderIndex.value <= 0 ? MAX : sliderIndex.value - 1)
}

</script>

<template>
    <div class="slider">
        <div>
            <slot :name="sliderIndex"></slot>
        </div>     
        <button class="previous" @click="previousSlide" v-show="withArrows">{{ '<' }}</button>
        <button class="next" @click="nextSlide" v-show="withArrows">{{ '>' }}</button>
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
    top: calc(50% - 1em);
}

button:hover {
    background-color: transparent;
}

button.previous {
    left: -3.5em;

}

button.next {
    right: -3.5em;
}

</style>