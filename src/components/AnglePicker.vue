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
    <div class="anglePicker">
        <div class="title">{{ name }}</div>
        <div class="angleInput">
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
    </div>
</template>

<style>
div {
    display: flex;
    flex-direction: column;
    margin-left: 0.2em;
    margin-right: 0.2em;
}

div > .title {
    flex: 1;
    text-align: center;
}

.angleInput {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.angleInput > div {
    flex-basis: 20%;
}

.angleInput > input {
    flex-basis: 80%;
    width: 100%;
}
</style>