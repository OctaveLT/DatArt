<script setup lang="ts">

import { ref, watch, reactive } from 'vue'
import { sortColors } from '../utils'
import CanvasContainer from './CanvasContainer.vue';

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

const colors = reactive(props.colors)

const drawLines = (colors: string[][], canvasRef: HTMLCanvasElement) => {

    const context = canvasRef && canvasRef.getContext('2d') as CanvasRenderingContext2D

    context.clearRect(0, 0, props.width, props.height)
 
    const numberColors: number = props.colors.length
    const step: number = props.height / numberColors

    const circleXCenter: number = props.width / 2
    const circleYCenter: number = props.height / 2 

    const degToRad = Math.PI / 180 

    // angle in rad
    const rotateX = (x: number, y: number) => {
        return x * Math.cos(props.angle * degToRad) - y * Math.sin(props.angle * degToRad) 
    }

    // angle in rad
    const rotateY = (x: number, y: number) => {
        return x * Math.sin(props.angle * degToRad) + y * Math.cos(props.angle * degToRad) 
    }

    const resultsDistribution: distribution = {}

    let sortedColorsResult

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
        x2 = props.width - circleXCenter
        y2 = (k - 0.5) * step - circleYCenter

        x1Rot = rotateX(x1, y1)
        y1Rot = rotateY(x1, y1)
        x2Rot = rotateX(x2, y2)
        y2Rot = rotateY(x2, y2)

        context.beginPath()
        context.moveTo(x1Rot + circleXCenter, y1Rot + circleYCenter)
        context.lineTo(x2Rot + circleXCenter, y2Rot + circleYCenter)
        context.stroke()
    }
}

</script>

<template>
    <CanvasContainer
        :colors="colors"
        :width="width" 
        :height="height"
        :backgroundColor="backgroundColor"
        :drawing="drawLines"
        :updateParameters="[angle]"
    />
</template>

<style>

</style>