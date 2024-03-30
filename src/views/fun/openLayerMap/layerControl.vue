<template>
    <div class="layer-switcher">
      <div v-for="(layer, index) in layers" :key="index" class="layer-switch" @click="toggleLayer(layer)">
        <input type="checkbox" :id="`layer-${index}`" :checked="layer.getVisible" />
        <label :for="`layer-${index}`">{{ layer.get('title') }}</label>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LayerSwitcher',
    props: {
      map: Object,
      layers: Array
    },
    methods: {
      toggleLayer(layer) {
        layer.setVisible(!layer.getVisible());
      }
    }
  };
  </script>
  
  <style scoped>
  .layer-switcher {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .layer-switch {
    margin-bottom: 5px;
  }
  </style>
  