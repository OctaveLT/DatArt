<script setup lang="ts">

import { ref, watch, reactive } from 'vue'

const props = defineProps<{
  colors: string[][],
  backgroundColor: number[],
  height: number | 320,
  width: number | 320,
  outsideRadius: number,
  insideRadius: number,
}>()

const circleCanvas = ref()
const colors = reactive(props.colors)
/* const outsideRadius = reactive(props.outsideRadius)
const insideRadius = reactive(props.insideRadius) */

// theta in rad
const circularXCoordinate = (x0: number, r: number, theta: number) => {
    return x0 + r * Math.cos(theta)
}

// theta in rad
const circularYCoordinate = (y0: number, r: number, theta: number) => {
    return y0 + r * Math.sin(theta)
}

const drawCircle = (colors: string[][]) => {

    const context: CanvasRenderingContext2D = circleCanvas.value && circleCanvas.value.getContext('2d')

    context.clearRect(0, 0, props.width, props.height)

    const circleXCenter: number = props.width / 2
    const circleYCenter: number = props.height / 2 
    const numberColors: number = props.colors.length
    const step: number = props.height / numberColors * Math.PI // TODO: Ellipses?

    //let color: string[]
    let k: number = 0
    for (let color of colors) {

        //console.log(color)

        context.strokeStyle = `rgb(${color.toString()})`
        context.lineWidth = step
        
        context.beginPath()
        context.moveTo(circularXCoordinate(circleXCenter, props.insideRadius, k * step / props.width * 2), circularYCoordinate(circleYCenter, props.insideRadius, k * step / props.height * 2))
        context.lineTo(circularXCoordinate(circleXCenter, props.outsideRadius, k * step / props.width * 2), circularYCoordinate(circleYCenter, props.outsideRadius, k * step / props.height * 2))
        context.stroke()

        k++
    }
}

const downloadAsImg = () => {
    let canvasImage = circleCanvas.value.toDataURL("image/png")

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
      xhr.open('GET', canvasImage) // This is to download the canvas Image
      xhr.send()
}

/* onMounted(() => {
  console.log(`The initial count is`)
  alert('drax')
  drawCircle()
}) */

/* watch(() => props.colors, (v) => {
    alert('props.colors'+v)
    drawCircle(v)
}) */

watch(colors, (newColors, _) => {  //TODO
    //alert('props.colors'+second)
    if (newColors.length > 0) drawCircle(newColors)
    //console.log('second', second)
})

</script>

<template>
    <div class="canvasContainer">
        <canvas 
            ref="circleCanvas" 
            :height="height"
            :width="width"        
            :style="{
                'background-color': `rgb(${backgroundColor.toString()})`,
    /*             'height': `${height}px`,
                'width': `${width}px`, */
            }"
        ></canvas>
        <div>
            <button
                @click="downloadAsImg"
            >
                Download as png
            </button>
        </div>
    </div>
</template>

<style>
canvas {
    border: 1px solid whitesmoke;
    margin: 1em;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.135);
}

.canvasContainer {
    position: relative
}

.canvasContainer div {
    display: flex;
    justify-content: center;
}

.canvasContainer button {
    visibility: hidden;
    position: absolute;
    bottom: -1.3em;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.135);
}

.canvasContainer:hover button {
    visibility: visible;
    align-self: center;
}

</style>