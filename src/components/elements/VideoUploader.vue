<script setup lang="ts">

import { ref } from 'vue'
import IconArrowRepeat from '../icons/IconArrowRepeat.vue';
import { VIDEO_UPLOADER } from '../../assets/texts'
import { useIsMobileVersion } from '@/utils';
import IconPlay from '../icons/IconPlay.vue';
import IconPause from '../icons/IconPause.vue';

const props = defineProps<{
    height: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void,
}>()

const isMobileVersion = useIsMobileVersion()

const videoSource = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const video = ref<HTMLVideoElement>()
const height = ref<number>(props.height)
const isVideoPause = ref<boolean>(false)

const emits = defineEmits(['isVideoUploaded'])

const onPickVideo = () => {
    fileInput.value?.click()
}

const pauseVideo = () => {
    //isVideoPause.value = true
    video.value?.pause()
}

const playVideo = () => {
    //isVideoPause.value = false
    video.value?.play()
}

const restartVideo = () => {
    video.value?.load()
}

const chooseNewVideo = () => {
    pauseVideo()
    onPickVideo()
}

const loadVideo = (e: Event) => {
    e.preventDefault()
    videoSource.value = VIDEO_UPLOADER.defaultVideo
    video.value?.addEventListener('loadeddata', () => props.videoProcessing(video.value as HTMLVideoElement, videoSource.value))    
}

const onVideoPicked = () => {
    console.log('Trying to upload the video file: %O', fileInput.value)
    if (fileInput.value && 'files' in fileInput.value) {
        if (fileInput.value.files && fileInput.value.files.length > 0) {
            videoSource.value = URL.createObjectURL(fileInput.value.files[0])
            video.value?.addEventListener('loadeddata', () => {
                emits('isVideoUploaded')
                props.videoProcessing(video.value as HTMLVideoElement, videoSource.value)
            })
            video.value?.addEventListener('pause', () => {
                isVideoPause.value = true
            })
            video.value?.addEventListener('play', () => {
                isVideoPause.value = false
            })
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
    <div class="videoContainer">
        <video 
            v-show="videoSource && !isMobileVersion"
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
        <div class="pickNewVideo" v-show="videoSource">
            <button @click="chooseNewVideo">
                {{ VIDEO_UPLOADER.newVideo }}
            </button>
            <button @click="restartVideo" class="control restart">
                <IconArrowRepeat class="icon"/>
            </button>
            <button 
                @click="pauseVideo" 
                class="control pause"
                v-show="!isVideoPause"
            >
                <IconPause class="icon"/>
            </button>
            <button 
                @click="playVideo" 
                class="control play"
                v-show="isVideoPause"
            >
                <IconPlay class="icon"/>
            </button>
        </div>
    </div>
    <button
        class="main noVideo"
        v-show="!videoSource"
        @click="onPickVideo"
    >
        <h1>{{ VIDEO_UPLOADER.uploadVideo }}</h1>
        <br/>     
        <p>{{ VIDEO_UPLOADER.lowQualityPreference }}</p> 
    </button>
    <button 
        @click="loadVideo" 
        class="tryOut" 
        v-show="!videoSource" 
        :title="VIDEO_UPLOADER.creditTitle">
        {{ VIDEO_UPLOADER.tryOut }}
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
    position: relative;
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

.control  {
    background-color: transparent;
    box-shadow: none;
}

.control:hover {
    background-color: transparent;
    transform: scale(1.1);
}

.control .icon {
    vertical-align: middle;
}

.tryOut {
    position: absolute;
    top: -2em;
    left: 1em;
}

@media (max-width: 900px) {
    .pickNewVideo {
        visibility: visible;
        position: relative;
        bottom: 0;
    }
}


</style>