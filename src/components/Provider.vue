<script lang="ts">
export const UserSettingsStateSymbol = Symbol('User settings provider state identifier')
export const UserSettingsUpdateSymbol = Symbol('User settings update provider identifier')
</script>

<script setup lang="ts">
import {
    provide,
    reactive,
    readonly,
    toRefs,
} from 'vue'

const state = reactive<{language: string, theme: string, sliderIndex: number}>({
    language: 'en',
    theme: 'light',  
    sliderIndex: 0
});

const update = (property: 'language' | 'theme' | 'sliderIndex', value: string | number) => {
    if (property === 'sliderIndex') state[property] = value as number
    else state[property] = value as string
};

provide(UserSettingsStateSymbol, toRefs(readonly(state)));
provide(UserSettingsUpdateSymbol, update)

</script>

<template>
    <slot></slot>
</template>

