<script setup lang="ts">

type Params = {
        [key: string]: {
            [key: string] : number
        }
}

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
        <template v-for="param in params">
            <div class="inputContainer">
                <div>
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
        </template>
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

</style>