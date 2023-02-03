<script setup lang="ts">

type Params = {
                id : number,
                label: string,
                min: number,
                max: number,
                value: number
            }[]

const props = defineProps<{
    name: string,
    params: Params,
    modelValue: number[]
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (index: number, e: Event, ) => {
    props.modelValue[index] = +(e.target as HTMLInputElement).value
    emit('update:modelValue', props.modelValue)
}

</script>

<template>
    <div class="sliderPicker">
        <div class="title">
            <slot class="slot" name="icon"></slot>
        </div>
        <div class="inputsContainer" v-for="param in params">
            <div class="label">
                    {{ param.label }}
                </div>
            <div class="inputContainer">
                <input
                    type="range"
                    @input="(e) => handleInput(param.id, e)"
                    :min="param.min"
                    :max="param.max"
                    :value="param.value"
                />
            </div>
        </div>
    </div>
</template>

<style>
.sliderPicker {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
}

.sliderPicker > .title {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
}

.sliderPicker > .title > div {
    font-weight: normal;
    font-size: larger;
}

.sliderPicker > .inputsContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.sliderPicker > .inputsContainer > .label {
    font-size: medium;
}

.sliderPicker > .inputContainer > input {
    outline: none;
}




</style>