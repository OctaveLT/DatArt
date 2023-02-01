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
    <div class="picker">
        <div class="title">{{ name }}</div>
        <div class="inputsContainer" v-for="param in params">
            <div class="inputContainer">
                <div class="label">
                    {{ param.label }}
                </div>
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
div {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
}

div > .title {
    text-align: center;
    font-weight: bold;
}

.inputsContainer {
    flex: 1;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.inputContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.inputContainer > div {
    flex-basis: 20%;
}

.inputContainer > input {
    flex-basis: 80%;
    width: 100%;
}

.inputContainer > .label {
    margin-right: 0.5em;
    vertical-align: middle;
}

</style>