<script setup lang="ts">

import IconCircle from '../icons/IconCircle.vue';
import CanvasContainer from './CanvasContainer.vue';

const props = defineProps<{
  colors: string[][],
  backgroundColor: number[],
  height: number | 320,
  width: number | 320,
  outsideRadius: number,
  insideRadius: number,
}>()

// theta in rad
const circularXCoordinate = (x0: number, r: number, theta: number) => {
    return x0 + r * Math.cos(theta)
}

// theta in rad
const circularYCoordinate = (y0: number, r: number, theta: number) => {
    return y0 + r * Math.sin(theta)
}

const drawCircle = (colors: string[][], canvasRef: HTMLCanvasElement) => {

    const context = canvasRef && canvasRef.getContext('2d') as CanvasRenderingContext2D

    context.clearRect(0, 0, props.width, props.height)

    const circleXCenter: number = props.width / 2
    const circleYCenter: number = props.height / 2 
    const numberColors: number = props.colors.length
    const step: number = props.height / numberColors * Math.PI // TODO: Ellipses?

    //let color: string[]
    let k: number = 0
    for (let color of props.colors) {

        context.strokeStyle = `rgb(${color.toString()})`
        context.lineWidth = step
        
        context.beginPath()
        context.moveTo(circularXCoordinate(circleXCenter, props.insideRadius, k * step / props.width * 2), circularYCoordinate(circleYCenter, props.insideRadius, k * step / props.height * 2))
        context.lineTo(circularXCoordinate(circleXCenter, props.outsideRadius, k * step / props.width * 2), circularYCoordinate(circleYCenter, props.outsideRadius, k * step / props.height * 2))
        context.stroke()

        k++
    }
}

</script>

<template>
    <CanvasContainer
        :colors="colors"
        :width="width" 
        :height="height"
        :backgroundColor="backgroundColor"
        :drawing="drawCircle"
        :updateParameters="[outsideRadius, insideRadius]"
    >
        <template #icon>
            <IconCircle/>
        </template>
    </CanvasContainer>
</template>