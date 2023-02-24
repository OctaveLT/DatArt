<script setup lang="ts">

import IconX from '../icons/IconX.vue';

const props = defineProps<{
    isShown: boolean,
}>()

const emit = defineEmits(['update:isShown'])

const toggleModal = () => {
    emit('update:isShown', !props.isShown)
}

</script>

<template>
    <transition name="fade" mode="out-in">
        <div class="modal" v-show="isShown">
            <div class="greyBackground" @click="toggleModal">
            </div>
            <div class="information">
                <slot name="content"></slot>
                <IconX class="closeIcon" @click="toggleModal"/>
            </div>
        </div>
    </transition>
</template>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal > .greyBackground {
    background-color: rgba(197, 197, 197, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
}

.modal > .information {
    max-width: 70%;
    padding: 1.8em;
    background-color: #cc998de8;
    border-radius: 1em;
    z-index: 100;
}

.modal > .information > .closeIcon {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
}

.modal > .information > .closeIcon:hover {
    transform: scale(1.3);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
        .informationClickableIcon {
            width: 1.2em;
        }

        .beta {
            right: 1em;
            top: 2.6em;
            font-size: small;
        }
        
        .modal {
            font-size: x-small;
        }

        .modal > .information {
            max-width: 95%;
            padding: 1em;
        }
    }

</style>