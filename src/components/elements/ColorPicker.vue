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
            <slot class="slot" name="icon"/>
        </div>
        <div class="label">
            {{ label }}
        </div>
        <div class="inputContainer">
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
    align-items: flex-start;
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

.colorPicker > .inputContainer {
    align-self: stretch;
}

.colorPicker > .inputContainer > input {
    margin-top: 0.4em;
    width: 100%;
}

</style>