<template>
    <div id="popup" class="ol-popup" ref="popup">
      <a
        href="#"
        id="popup-closer"
        class="ol-popup-closer"
        ref="closer"
        @click="closePopup"
      ></a>
      <div id="popup-content" ref="content"></div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, watch } from "vue";
  import axios from "axios";
  import { getForViewAndSize } from "ol/extent";
  import "ol/ol.css";
  import Overlay from "ol/Overlay";
  
  export default defineComponent({
    props: ["map", "popupsLayers"],
    setup(props) {
      const flag = ref(false);
      const popup = ref(Overlay);
  
      const closePopup = () => {
        popup.value.setPosition(undefined);
        // Avoid duplicate popups
        flag.value = true;
      };
  
      const addPopup = () => {
        popup.value = new Overlay({
          element: popup,
          autoPan: true,
          positioning: "bottom-center",
          stopEvent: false,
          autoPanAnimation: {
            duration: 250,
          },
        });
        props.map.addOverlay(popup.value);
      };
  
      const isInDiv = (event, popup) => {
        const div = document.getElementById("popup");
        // ... (the rest of the isInDiv method remains the same)
        var x = event.clientX;
      var y = event.clientY;
      var divx1 = div.offsetLeft;
      var divy1 = div.offsetTop;
      var divx2 = div.offsetLeft + div.offsetWidth;
      var divy2 = div.offsetTop + div.offsetHeight;
      console.log(x < divx1 || x > divx2 || y < divy1 || y > divy2);
      return x < divx1 || x > divx2 || y < divy1 || y > divy2;
    
      };
  
      addPopup();
  
      // watch(
      //   () => props.map,
      //   () => {
      //     addPopup();
      //   }
      // );
  
      return {
        flag,
        popup,
        closePopup,
        addPopup,
        isInDiv,
      };
    },
  });
  </script>
  
  <style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;

  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "×";
  height: 15px;
  width: 15px;
}

/* #popup-content {
  font-size: 14px;
  font-family: "微软雅黑";
}

#popup-content.markerInfo {
  font-weight: bold;
} */

table.featureInfo,
table.featureInfo td,
table.featureInfo th {
  border: 1px solid #ddd;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  font-size: 90%;
  padding: 0.2em 0.1em;
}

table.featureInfo th {
  padding: 0.2em 0.2em;
  font-weight: bold;
  background: #eee;
}

table.featureInfo td {
  background: #fff;
}

table.featureInfo tr.odd td {
  background: #eee;
}

table.featureInfo caption {
  text-align: left;
  font-size: 100%;
  font-weight: bold;
  padding: 0.2em 0.2em;
}
  </style>
  