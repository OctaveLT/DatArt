<script setup lang="ts">

import { ref } from 'vue'
import IconArrowRepeat from '../icons/IconArrowRepeat.vue';

const props = defineProps<{
    height: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void,
}>()

const videoSource = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const video = ref<HTMLVideoElement>()
const height = ref<number>(props.height)

const onPickVideo = () => {
    fileInput.value?.click()
}

const chooseNewVideo = () => {
    video.value?.pause()
    onPickVideo()
}

const restartVideo = () => {
    video.value?.load()
}

const onVideoPicked = () => {
    console.log('Trying to upload the video file: %O', fileInput.value)
    if (fileInput.value && 'files' in fileInput.value) {
        if (fileInput.value.files && fileInput.value.files.length > 0) {
            videoSource.value = URL.createObjectURL(fileInput.value.files[0])
            video.value?.addEventListener('loadeddata', () => props.videoProcessing(video.value as HTMLVideoElement, videoSource.value))
        } else {
            alert("Select a file to upload")
        }
    } else {
        console.log('No found "files" property')
    }
}  

</script>

<template>
    <input
        id="inputVideo"
        type="file"
        ref="fileInput"
        accept="video/*"
        @change="onVideoPicked"
    />
    <div v-show="videoSource" class="videoContainer">
        <video 
            id="video" 
            ref="video"
            :width="height" 
            :height="height"
            :src="videoSource" 
            autoplay
            controls
            muted
        >
        </video>
        <div class="pickNewVideo" >
            <button @click="chooseNewVideo">
                New video
            </button>
            <button @click="restartVideo" class="restart">
                <IconArrowRepeat class="iconArrowRepeat"/>
            </button>
        </div>
    </div>
    <button
        class="main noVideo"
        v-show="!videoSource"
        @click="onPickVideo"
    >
        <h1>Upload a video to extract its colors! </h1>
        <br/>     
        <p>(Preferably low quality)</p>   
    </button>
</template>

<style>

video {
    border: 1px solid grey;
    border-radius: 1em;
    background-color: rgba(220, 217, 217, 0.3);
    margin: 1em;
    cursor: pointer;
}

.videoContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.videoContainer:hover > .pickNewVideo {
    visibility: visible;
    cursor: pointer;
}

.noVideo {
    margin: 1em;
    align-self: stretch;
    background-color: white;
    border: 1px dashed grey;
    border-radius: 1em;
    font-size: large;
    font-weight: bold;
}

.noVideo:hover {
    background-color: whitesmoke;
}

#inputVideo {
    display: none;
}

.pickNewVideo {
    visibility: hidden;
    position: absolute;
    bottom: -2em;
    transition: transform .2s;
    align-self: center;
    display: inline;
}

.pickNewVideo:hover {
    transform: scale(1.1);
}

.restart {
    background-color: transparent;
    box-shadow: none;
}

.restart:hover {
    background-color: transparent;
    transform: scale(1.1);
}

.restart .iconArrowRepeat {
    vertical-align: middle;
}

</style>