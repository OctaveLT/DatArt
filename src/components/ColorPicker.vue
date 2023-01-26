<script setup lang="ts">

const props = defineProps<{
    name: String,
    modelValue: number[]
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (index: number, e: Event, ) => {
    props.modelValue[index] = +(e.target as HTMLInputElement).value
    emit('update:modelValue', props.modelValue)
}

</script>

<template>
    <div class="colorPicker">
        <div class="title">{{ name }}</div>
        <div class="colorInput">
            <div>
                R
            </div>
            <input
                type="range"
                @input="(e) => handleInput(0, e)"
                min="0"
                max="255"
                value="255"
            />
        </div>
        <div class="colorInput">
            <div>
                G
            </div>
            <input
                type="range"
                @input="(e) => handleInput(1, e)"
                min="0"
                max="255"
                value="255"
            />
        </div>
        <div class="colorInput">
            <div>
                B
            </div>
            <input
                type="range"
                @input="(e) => handleInput(2, e)"
                min="0"
                max="255"
                value="255"
            />
        </div>
    </div>
</template>

<style>
div {
    display: flex;
    flex-direction: column;
}

div > .title {
    flex: 1;
    text-align: center;
}

.colorInput {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.colorInput > div {
    flex-basis: 20%;
}

.colorInput > input {
    flex-basis: 80%;
    width: 100%;
}

</style>