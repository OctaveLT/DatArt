<script setup lang="ts">

const props = defineProps<{
    name: string,
    label: string,
    value: string,
    modelValue: string[]
}>()

console.log(props.label, props.modelValue)

const emit = defineEmits(['update:modelValue'])

const handleInput = (index: number, e: Event, ) => {
    props.modelValue[index] = (e.target as HTMLInputElement).value
    emit('update:modelValue', props.modelValue)
}

</script>

<template>
    <div class="colorPicker">
        <div class="title">
            <div>{{ name }}</div>
            <slot class="slot" name="icon"/>
        </div>
        <div class="inputContainer">
            <div class="label">
                {{ label }}
            </div>
            <input
                type="color"
                @input="(e) => handleInput(0, e)"
                :value="value"
            />
        </div>
    </div>
</template>

<style>
.colorPicker {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
}

.colorPicker > .title {
    display: flex;
    justify-content: center;
}

.colorPicker > .title > div {
    font-weight: normal;
    font-size: larger;
}

.colorPicker > .title > .slot {
    flex-grow: 1;
    vertical-align: middle;
    vertical-align: baseline;
}

.inputContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 0.3em;
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