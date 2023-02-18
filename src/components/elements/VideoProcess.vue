<script setup lang="ts">
import IconRightArrow from '../icons/IconRightArrow.vue'
import Circle from '../canvas/Circle.vue'
import Lines from '../canvas/Lines.vue'
import Rose from '../canvas/Rose.vue'
import VideoUploader from './VideoUploader.vue'
import Slider from './Slider.vue'
import { useIsMobileVersion } from '@/utils'
import { computed, ref } from 'vue'

const props = defineProps<{
    innnerHeight: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void,
    colors: string[][],
    circleValues: number[],
    linesValues: number[],
    roseValues: number[],
    isColorsSorted: boolean,
    backgroundColor: number[],
}>()

const isMobileVersion: boolean = useIsMobileVersion()

const isVideoUploaded = ref<boolean>(false)

const showSlider = () => {
    isVideoUploaded.value = true
}

</script>

<template>
    <div v-if="!isMobileVersion" class="videoProcess">
        <VideoUploader
            :height="innnerHeight"
            :video-processing="videoProcessing"
        />     
        <IconRightArrow id="iconRightArrow"/>
        <Circle 
            :colors="colors"
            :backgroundColor="backgroundColor"
            :height="innnerHeight"
            :width="innnerHeight"
            :outsideRadius="circleValues[0]"
            :insideRadius="circleValues[1]"
        />
        <Lines 
            :colors="colors"
            :backgroundColor="backgroundColor"
            :height="innnerHeight"
            :width="innnerHeight"
            :scale="2"
            :isColorsSorted="isColorsSorted"
            :angle="linesValues[0]"
        />
        <Rose 
            :colors="colors"
            :backgroundColor="backgroundColor"
            :height="innnerHeight"
            :width="innnerHeight"
            :angle="roseValues[0]"
            :outsideRadius="roseValues[1]"
        />  
    </div>
    <div v-else class="videoProcess">
        <VideoUploader
            @is-video-uploaded="showSlider"
            :height="innnerHeight"
            :video-processing="videoProcessing"
        />
        <Slider
            v-show="isVideoUploaded"
        >
            <template #0>
                <Circle 
                    :colors="colors"
                    :backgroundColor="backgroundColor"
                    :height="innnerHeight"
                    :width="innnerHeight"
                    :outsideRadius="circleValues[0]"
                    :insideRadius="circleValues[1]"
                />
            </template>
            <template #1>
                <Lines 
                    :colors="colors"
                    :backgroundColor="backgroundColor"
                    :height="innnerHeight"
                    :width="innnerHeight"
                    :scale="2"
                    :isColorsSorted="isColorsSorted"
                    :angle="linesValues[0]"
                />
            </template>
            <template #2>
                <Rose 
                    :colors="colors"
                    :backgroundColor="backgroundColor"
                    :height="innnerHeight"
                    :width="innnerHeight"
                    :angle="roseValues[0]"
                    :outsideRadius="roseValues[1]"
                /> 
            </template>
        </Slider>
    </div>
    <canvas id="outputCanvas" ></canvas>   
</template>

<style>
.videoProcess {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

#outputCanvas {
    display: none;
}

#iconRightArrow {
    color: #CC998D;
}

@media (max-width: 760px) {
        .videoProcess {
            margin-top: 3em;
            flex-direction: column;
        }
    }
</style>