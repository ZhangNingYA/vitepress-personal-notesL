<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'


const props = defineProps<{
  formula: string
  block?: boolean
}>()

const html = computed(() => {
  try {
    return katex.renderToString(props.formula, {
      throwOnError: false,
      displayMode: props.block || false,
      strict: false
    })
  } catch (e) {
    console.error('KaTeX rendering error:', e)
    return props.formula
  }
})
</script>

<template>
  <span v-if="!block" v-html="html" class="math-inline"></span>
  <div v-else v-html="html" class="math-block"></div>
</template>

<style>
.math-inline .katex { font-size: 1.1em; }
.math-block { overflow-x: auto; margin: 1rem 0; }
</style>