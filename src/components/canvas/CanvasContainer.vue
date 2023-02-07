<script setup lang="ts">

import { ref, watch } from 'vue'
import { CANVAS_CONTAINER } from '@/assets/texts';

const props = defineProps<{
    drawing: (colors: string[][], canvasRef: HTMLCanvasElement) => void,
    colors: string[][],
    backgroundColor: number[],
    height: number,
    width: number,
    updateParameters: number[],
}>()

const canvas = ref()

watch(props.colors, (_, second) => {
    if (props.colors.length > 0) props.drawing(second, canvas.value)
    else {
        const context = canvas.value && canvas.value.getContext('2d') as CanvasRenderingContext2D
        context.clearRect(0, 0, props.width, props.height)
    }
})

watch(() => props.updateParameters, () => {
    if (props.colors.length > 0) props.drawing(props.colors, canvas.value)
})

const downloadAsImg = () => {
    let canvasImage = canvas.value.toDataURL("image/png")

    let xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = function () {
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(xhr.response)
        a.download = 'DatArt.png'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      xhr.open('GET', canvasImage)
      xhr.send()
}

</script>

<template>
    <div class="canvasContainer">
        <div class="slotWrapper">
            <slot class="slot" name="icon"/>
        </div>
        <canvas 
            ref="canvas" 
            :height="height"
            :width="width"        
            :style="{
                'background-color': `rgb(${backgroundColor.toString()})`,
            }"
        ></canvas>
        <div>
            <button
                @click="downloadAsImg"
            >
                {{ CANVAS_CONTAINER.downloadBUtton }}
            </button>
        </div>
    </div>
</template>

<style>
canvas {
    border: 1px solid whitesmoke;
    margin: 0em 1em 1em 1em;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.135);
}

.canvasContainer {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.slotWrapper {
    align-self: center;
}

.canvasContainer div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.canvasContainer button {
    visibility: hidden;
    position: absolute;
    bottom: -2em;
}

.canvasContainer:hover button {
    visibility: visible;
    
}

</style>