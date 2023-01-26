<script setup lang="ts">

import { ref, watch, reactive } from 'vue'

type distribution = {
        [key: string]: number
}

const props = defineProps<{
  colors: string[][],
  backgroundColor: number[],
  height: number | 320,
  width: number | 320,
  angle: number
}>()

const roseCanvas = ref()
const colors = reactive(props.colors)

const drawRose = (colors: string[][]) => {

    const context: CanvasRenderingContext2D = roseCanvas.value && roseCanvas.value.getContext('2d')

    context.clearRect(0, 0, props.width, props.height)
 
    const numberColors: number = props.colors.length
    const step: number = props.height / numberColors

    // theta in rad
    const circularXCoordinate = (x0: number, r: number, theta: number) => {
        return x0 + r * Math.cos(theta)
    }

    // theta in rad
    const circularYCoordinate = (y0: number, r: number, theta: number) => {
        return y0 + r * Math.sin(theta)
    }

    const circleXCenter: number = props.width / 2
    const circleYCenter: number = props.height / 2 
    console.log(props.angle)

    const radRatio: number = 2 * Math.PI / props.height
    let angle1: number
    let angle2: number
    let k: number = 0
    for (let color of colors) {

        k += 1

        context.strokeStyle = `rgb(${color.toString()})`

        context.lineWidth = step * 1.1

        angle1 = (k - 0.5) * step * radRatio
        angle2 = (k - 0.5) * step * radRatio + props.angle * Math.PI / 180

        context.beginPath()
        context.moveTo(circularXCoordinate(circleXCenter, circleXCenter, angle1), circularYCoordinate(circleYCenter, circleYCenter, angle1))
        context.lineTo(circularXCoordinate(circleXCenter, circleXCenter, angle2), circularYCoordinate(circleYCenter, circleYCenter, angle2))
        context.stroke()
    }
}

watch(colors, (_, second) => {
    if (colors.length > 0) drawRose(second)
})

</script>

<template>
    <canvas 
        ref="roseCanvas" 
        :width="width" 
        :height="height"
        :style="{
            'background-color': `rgb(${backgroundColor.toString()})`,
        }"
    ></canvas>
</template>

<style>
canvas {
    border: 1px solid whitesmoke;
    margin: 1em;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.135);
}
</style>