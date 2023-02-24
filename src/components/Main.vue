<script setup lang="ts">

import { rgb2hsl , hex2rgb, color2string, string2color, useBreakpoints, useIsMobileVersion } from '../utils.js'
import { ref, reactive } from 'vue'
import InformationModal from './elements/InformationModal.vue'
import Title from './elements/Title.vue'
import VideoProcess from './elements/VideoProcess.vue'
import Settings from './elements/Settings.vue'

type ColorDistribution = {
        [keys: string]: number
    }

const isMobileVersion: boolean = useIsMobileVersion()

const MAX_COUNT: number = 1000
const DEFAULT_ANGLE_ROSE: number = 120
const DEFAULT_ANGLE: number = 0
const DEFAULT_COLOR_THRESHOLD: number = 25
const DEFAULT_IS_SORTED: boolean = false
const DEFAULT_RGB_COLOR: string = '#ffffff'
const CANVAS_WIDTH_RATIO: number = isMobileVersion ? 0.7 : 0.21
const canvasResponsiveSize = useBreakpoints(CANVAS_WIDTH_RATIO)
const DEFAULT_OUT_RADIUS: number = canvasResponsiveSize.value * 0.45
const DEFAULT_IN_RADIUS: number = canvasResponsiveSize.value * 0.25
const DEFAULT_SQUARE_SIZE: number = canvasResponsiveSize.value * 0.9

const isVideoSource = ref<boolean>(false)

const colorResultsArray = ref<string[][]>([])

const rgbColor = ref<string[]>([DEFAULT_RGB_COLOR])
const colorThreshold = ref<number[]>([DEFAULT_COLOR_THRESHOLD])
const circleAttributes = ref<number[]>([DEFAULT_OUT_RADIUS, DEFAULT_IN_RADIUS])
const roseAttributes = ref<number[]>([DEFAULT_ANGLE_ROSE, DEFAULT_OUT_RADIUS])
const linesAttributes = ref<number[]>([DEFAULT_ANGLE, DEFAULT_SQUARE_SIZE])
const isSorted = ref<boolean>(DEFAULT_IS_SORTED)

const params = reactive({
    general: {
        colorThreshold: colorThreshold,
        rgbColor: rgbColor
    },
    circle: {
        radius: circleAttributes
    },
    lines: {
        angle: linesAttributes
    },
    rose: {
        angle: roseAttributes
    }
})

const videoProcessing = (video: HTMLVideoElement, videoSource: string) => {
    let numberFrameProcessed: number = 0
    colorResultsArray.value.splice(0, colorResultsArray.value.length)
    const currentVideoSource = videoSource
    isVideoSource.value = true

    const vHeight: number = video?.videoHeight || 1
    const vWidth: number = video?.videoWidth || 1

    const outputCanvas = document.getElementById('outputCanvas') as HTMLCanvasElement
    const contextOutputCanvas: CanvasRenderingContext2D = outputCanvas.getContext('2d')!
    const tmpCanvas = document.createElement('canvas') as HTMLCanvasElement
    const contextTmpCanvas: CanvasRenderingContext2D = tmpCanvas.getContext('2d')!

    if (vWidth && vHeight) {
        outputCanvas.style.height = vHeight.toString()
        outputCanvas.style.width = vWidth.toString()
    }

    if (vWidth && vHeight) {
        tmpCanvas.width = vWidth
        tmpCanvas.height = vHeight
    }

    console.log(' --- Process video ---')

    const computeFrame = () => {
        if (video?.paused || video?.ended) {
            return
        }
        let hTot: number = 0
        let lTot: number = 0
        let sTot: number = 0
        let colorDistribution: ColorDistribution = {}

        video && contextTmpCanvas.drawImage(video, 0, 0, vWidth, vHeight)
        let frame = contextTmpCanvas.getImageData(0, 0, vWidth, vHeight)
        contextOutputCanvas.putImageData(frame, 0, 0)
        for (let i = 0; i < frame.data.length / 4; i++) {
            let r = frame.data[i * 4]
            let g = frame.data[i * 4 + 1]
            let b = frame.data[i * 4 + 2]
            if (r > 0 && b > 0 && g > 0) {
                let HSL = rgb2hsl(r, g, b)
                hTot += HSL[0]
                lTot += HSL[1]
                sTot += HSL[2]
                if (colorDistribution[color2string([r, g, b])]) colorDistribution[color2string([r, g, b])] += 1
                else colorDistribution[color2string([r, g, b])] = 1
            }
        }

        let colorKeys = Object.keys(colorDistribution)
        let sortedColors: string[] = colorKeys.sort((color1, color2) => colorDistribution[color1] < colorDistribution[color2] ? 1 : -1)

        numberFrameProcessed++

        let relativeIndex: number = Math.floor(colorThreshold.value[0] * 0.01 * (sortedColors.length - 1))
        let result: string[] = string2color(sortedColors[relativeIndex])
        colorResultsArray.value.push(result)

        if (numberFrameProcessed < MAX_COUNT && currentVideoSource === videoSource) setTimeout(computeFrame, 0)
    }

    video?.addEventListener('play', computeFrame )
}

</script>

<template>
    <Title/>
    <div
        class="container"
    >
        <Settings
            v-show="!isMobileVersion || isVideoSource"
            :canvasSize="canvasResponsiveSize"
            :attributes="params"
        />
        <VideoProcess
            :innnerHeight="canvasResponsiveSize"
            :videoProcessing="videoProcessing"
            :colors="colorResultsArray"
            :circleValues="circleAttributes"
            :linesValues="linesAttributes"
            :roseValues="roseAttributes"
            :isColorsSorted="isSorted"
            :backgroundColor="hex2rgb(rgbColor[0])"
        />
    </div>
    <InformationModal/>
</template>

<style>

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    padding-bottom: 1em;
}

@media (max-width: 760px) {
    .container {
        margin: 0;
        padding: 0;
        padding-top: 3em;
        flex-direction: column-reverse;
    }
}

</style>