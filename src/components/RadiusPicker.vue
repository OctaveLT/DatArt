<script setup lang="ts">

const props = defineProps<{
    name: String,
    max: number,
    modelValue: number[]
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (index: number, e: Event, ) => {
    props.modelValue[index] = +(e.target as HTMLInputElement).value
    emit('update:modelValue', props.modelValue)
}

</script>

<template>
    <div class="radiusPicker">
        <div class="title">{{ name }}</div>
        <div class="radiusInput">
            <div>
                Out
            </div>
            <input 
                type="range" 
                :min="0" 
                :max="max" 
                @input="(e) => handleInput(0, e)"
                :value="max"
            />
        </div>
        <div class="radiusInput">
            <div>
                In
            </div>
            <input 
                type="range" 
                :min="0" 
                :max="max" 
                @input="(e) => handleInput(1, e)"
                :value="max / 2"
            />
        </div>
    </div>
</template>

<style>
.radiusPicker {
    display: flex;
    flex-direction: column;
    margin-left: 0.2em;
    margin-right: 0.2em;
}

.radiusPicker > .title {
    flex: 1;
    text-align: center;
}

.radiusInput {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.radiusInput > div {
    flex-basis: 20%;
}

.radiusInput > input {
    flex-basis: 80%;
    width: 100%;
}
</style>