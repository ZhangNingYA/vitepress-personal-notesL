<script setup>
defineProps({
  title: String,
  desc: String,
  url: String,
  icon: String
})
</script>

<template>
  <a :href="url" download target="_blank" class="download-card">
    <div class="card-icon-box">
      <span class="card-icon">{{ icon }}</span>
    </div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-desc" v-if="desc">{{ desc }}</div>
    </div>
    <div class="card-action">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
  </a>
</template>

<style scoped>
.download-card {
  display: flex;
  align-items: center;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px 16px;
  margin: 0; /* Margin由外部Grid控制 */
  text-decoration: none !important;
  transition: all 0.25s ease;
  cursor: pointer;
  height: 100%; /* 确保高度对齐 */
}

.download-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--vp-c-default-soft);
  border-radius: 8px;
  margin-right: 14px;
  font-size: 20px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0; /* 防止文字溢出 */
}

.card-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.card-action {
  color: var(--vp-c-brand);
  margin-left: 10px;
}
</style>