<script setup lang="ts">

import IconLines from '../icons/IconLines.vue';
import IconRose from '../icons/IconRose.vue';
import CanvasContainer from './CanvasContainer.vue';

const props = defineProps<{
  colors: string[][],
  backgroundColor: number[],
  height: number,
  width: number,
  outsideRadius: number,
  angle: number
}>()

const drawRose = (colors: string[][], canvasRef: HTMLCanvasElement) => {

    const context = canvasRef && canvasRef.getContext('2d') as CanvasRenderingContext2D

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
        context.moveTo(circularXCoordinate(circleXCenter, props.outsideRadius, angle1), circularYCoordinate(circleYCenter, props.outsideRadius, angle1))
        context.lineTo(circularXCoordinate(circleXCenter, props.outsideRadius, angle2), circularYCoordinate(circleYCenter, props.outsideRadius, angle2))
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
        :drawing="drawRose"
        :updateParameters="[angle, outsideRadius]"
    >
        <template #icon>
            <IconRose/>
        </template>
    </CanvasContainer>
</template>

<style>

</style>