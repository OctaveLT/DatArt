<script setup lang="ts">

import { ref, watch, reactive } from 'vue'
import { sortColors } from '../utils'

type distribution = {
        [key: string]: number
}

const props = defineProps<{
  colors: string[][],
  backgroundColor: number[],
  height: number | 320
  width: number | 320,
  scale: number | 2,
  isColorsSorted: boolean,
  angle: number
}>()

const linesCanvas = ref()
const colors = reactive(props.colors)

console.log('dd',sortColors([["1", "2", "3"], ["1", "2", "3"], ["12", "2", "3"],["1", "22", "3"]], [1., 1., 1.]))
//console.log(colors)

const drawLines = (colors: string[][]) => {

    const context: CanvasRenderingContext2D = linesCanvas.value && linesCanvas.value.getContext('2d')

    context.clearRect(0, 0, props.width, props.height)
 
    const numberColors: number = props.colors.length
    const step: number = props.height / numberColors

    const circleXCenter: number = props.width / 2
    const circleYCenter: number = props.height / 2 
    const approxDiagonalLength = props.width + props.height

    //const theta = Math.PI / 6

    const degToRad = Math.PI / 180 

    // angle in rad
    const rotateX = (x: number, y: number) => {
        console.log(Math.sin(props.angle * degToRad))
        return x * Math.cos(props.angle * degToRad) - y * Math.sin(props.angle * degToRad) 
    }

    // angle in rad
    const rotateY = (x: number, y: number) => {
        return x * Math.sin(props.angle * degToRad) + y * Math.cos(props.angle * degToRad) 
    }

    const resultsDistribution: distribution = {}

    let sortedColorsResult

    //console.log(colors.length)

    if (props.isColorsSorted && colors.length > 1) {
/*         for (let color of colors) {
            const colorString = color.toString()
            if (resultsDistribution[colorString]) resultsDistribution[colorString]++
            else resultsDistribution[colorString] = 1
        }
        
        colors = Object.keys(resultsDistribution).map(key => [key]) */
        //console.log(colors, resultsDistribution)

        sortedColorsResult =  sortColors(colors, [0.1, 0.1, 0.9])
        //console.log(sortedColorsResult)
        colors = sortedColorsResult[0]
    } 

    let x1: number
    let y1: number
    let x2: number
    let y2: number
    let x1Rot: number
    let y1Rot: number
    let x2Rot: number
    let y2Rot: number
    let k: number = 0
    for (let color of colors) {

        k += 1 //props.isColorsSorted ? 1 : 1 

/*         context.strokeStyle = props.isColorsSorted 
            ? `rgb(${color})`
            : `rgb(${color.toString()})` */

        context.strokeStyle = `rgb(${color.toString()})`

        context.lineWidth = (props.isColorsSorted && sortedColorsResult)
            ? step * 1.1//sortedColorsResult[1][color.toString()]//step * 1.1 //resultsDistribution[color[0]] 
            : step * 1.1

        //console.log(color, sortedColorsResult[1][color.toString()])
        
        //context.lineWidth = step * 1.1

/*         x1 = 0
        y1 = (k - 0.5) * step
        x2 = props.width
        y2 = (k - 0.5) * step */

        x1 = 0 - circleXCenter
        y1 = (k - 0.5) * step - circleYCenter
        x2 = approxDiagonalLength - circleXCenter
        y2 = (k - 0.5) * step - circleYCenter

        x1Rot = rotateX(x1, y1)
        y1Rot = rotateY(x1, y1)
        x2Rot = rotateX(x2, y2)
        y2Rot = rotateY(x2, y2)

        context.beginPath()
        context.moveTo(x1Rot + circleXCenter, y1Rot + circleYCenter)
        context.lineTo(x2Rot + circleXCenter, y2Rot + circleYCenter)
        context.stroke()

/*         context.beginPath()
        context.moveTo(rotateX(x1, y1), rotateY(x1, y1))
        context.lineTo(rotateX(x2, y2), rotateY(x2, y2))
        context.stroke() */
    }
}

watch(colors, (_, second) => {
    if (colors.length > 0) drawLines(second)
})

</script>

<template>
    <canvas 
        ref="linesCanvas" 
        :width="width" 
        :height="height"
        :style="{
            'background-color': `rgb(${backgroundColor.toString()})`,
/*             'height': `${height}px`,
            'width': `${width}px`, */
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