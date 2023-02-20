<script lang="ts">
// We use symbols as a unique identifiers.
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

const state = reactive({
    language: 'en',
    theme: 'light',  
    sliderIndex: '0'
});

const update = (property: 'language' | 'theme' | 'sliderIndex', value: string) => {
    state[property] = value;
};

provide(UserSettingsStateSymbol, toRefs(readonly(state)));
provide(UserSettingsUpdateSymbol, update)

</script>

<template>
    <slot></slot>
</template>

