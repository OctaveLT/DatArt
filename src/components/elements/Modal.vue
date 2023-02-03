<script setup lang="ts">
import { ref } from 'vue';
import IconTrash from '../icons/IconTrash.vue';

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
            <div class="information" @click="(e: Event) => e.preventDefault()">
                dededdedde
                <IconTrash/>
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
    background-color: rgba(197, 197, 197, 0.3);
    position: absolute;
    width: 100%;
    height: 100%;
}

.modal > .information {
    padding: 1em;
    background-color: #CC998D;
    border-radius: 1em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>