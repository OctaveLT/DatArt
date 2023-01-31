<script setup lang="ts">

import { ref } from 'vue'
import IconTrash from './icons/IconTrash.vue';

const props = defineProps<{
    height: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void
}>()

const videoSource = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const video = ref<HTMLVideoElement>()
const height = ref<number>(props.height)

const onPickVideo = () => {
    fileInput.value?.click()
}

const deleteVideo = () => {
    videoSource.value = ''
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
        <IconTrash class="iconTrash" :size="20" @click="deleteVideo"/>
    </div>
    <button
        class="noVideo"
        v-show="!videoSource"
        @click="onPickVideo"
    >
        Upload a video to extract its color! (Preferably low quality)
    </button>
</template>

<style>

video {
    border: 1px solid grey;
    border-radius: 1em;
    background-color: rgb(220, 217, 217);
    margin: 1em;
    cursor: pointer;
}

.videoContainer:hover > .iconTrash {
    visibility: visible;
    cursor: pointer;
}

.noVideo {
    margin: 1em;
    align-self: stretch;
    background-color: white;
    border: 1px dashed grey;
    border-radius: 1em;
    font-weight: bold;
}

.noVideo:hover {
    background-color: whitesmoke;
}

#inputVideo {
    display: none;
}

.iconTrash {
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
    transition: transform .2s;
}

.iconTrash:hover {
    transform: scale(1.2);
}

</style>