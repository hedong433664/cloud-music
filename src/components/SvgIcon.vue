<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SvgIcon',
})

defineProps<{
  /**
   * 图标名称
   */
  name: string
}>()
</script>

<style lang="scss" scoped>
.icon {
  fill: var(--color, currentColor) !important;
  overflow: hidden;
}
</style>
