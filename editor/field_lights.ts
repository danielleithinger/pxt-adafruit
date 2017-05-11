/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

namespace pxt.editor {

  export class FieldLights extends Blockly.Field implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    private params: any;

    private boardElement: SVGSVGElement;
    private paletteElement_: SVGGElement;
    private neopixels_: SVGElement[];
    private paletteButtons: SVGElement[];

    static NUM_PIXELS = 10;
    static imageWidth = 200;
    static imageHeight = 200;

    constructor(text: string, params: any, validator?: Function) {
      super(text, validator);
      this.params = params;
    }

    /**
     * Show the inline free-text editor on top of the text.
     * @private
     */
    showEditor_() {

    }

    initRing() {
      const BOARD_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" id="field-neopixels" viewBox="0 0 180.09375 179.22874">
  <g id="g28">
    <g id="g30" clip-path="url(#clipPath32)" transform="matrix(1.25 0 0 -1.25 0 179.23)">
      <g id="g36">
        <path id="path38" d="M143.3829 81.9373c-4.429 31.921-29.524 57.016-61.445 61.445h-19.8c-39.403-5.467-66.913-41.842-61.446-81.244 5.468-39.404 41.843-66.913 81.246-61.446 39.402 5.467 66.912 41.842 61.445 81.245"/>
      </g>
    </g>
  </g>
  <g id="g428" transform="matrix(1.25 0 0 -1.25 98.02 176.23)" filter="url(#filter5965)">
    <path id="path430" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0h-12.756" stroke-linecap="round"/>
  </g>
  <g id="g432" transform="matrix(1.25 0 0 -1.25 75.87 163.83)" filter="url(#filter5969)">
    <path id="path434" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0v11.339" stroke-linecap="round"/>
  </g>
  <g id="g436" transform="matrix(1.25 0 0 -1.25 75.87 149.66)" filter="url(#filter5973)">
    <path id="path438" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0h2.409" stroke-linecap="round"/>
  </g>
  <g id="g440" transform="matrix(1.25 0 0 -1.25 78.89 149.66)" filter="url(#filter5977)">
    <path id="path442" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0v-7.086" stroke-linecap="round"/>
  </g>
  <g id="g444" transform="matrix(1.25 0 0 -1.25 78.89 158.51)" filter="url(#filter5981)">
    <path id="path446" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0h3.969" stroke-linecap="round"/>
  </g>
  <g id="g448" transform="matrix(1.25 0 0 -1.25 96.25 158.51)" filter="url(#filter5985)">
    <path id="path450" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0h3.969" stroke-linecap="round"/>
  </g>
  <g id="g452" transform="matrix(1.25 0 0 -1.25 101.21 158.51)" filter="url(#filter5989)">
    <path id="path454" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0v7.086" stroke-linecap="round"/>
  </g>
  <g id="g456" transform="matrix(1.25 0 0 -1.25 101.21 149.66)" filter="url(#filter5993)">
    <path id="path458" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0h2.409" stroke-linecap="round"/>
  </g>
  <g id="g460" transform="matrix(1.25 0 0 -1.25 104.22 149.66)" filter="url(#filter5997)">
    <path id="path462" fill="none" stroke="#fff" stroke-width=".57599998" d="M0 0v-11.339" stroke-linecap="round"/>
  </g>
  <g id="g632">
    <g id="g634" clip-path="url(#clipPath636)" transform="matrix(1.25 0 0 -1.25 0 179.23)">
      <path id="path1930" fill="#4d4d4d" d="M67.785 7.785H64.95v8.504h2.835V7.785zm11.34 0H76.29v8.504h2.835V7.785zm1.4165-3.5434h2.835v14.882h-22.677V4.2416h2.834v-2.126h17.008v2.126z" opacity=".65"/>
      <g id="g2022" opacity=".797">
        <path id="path2024" fill="#ececec" d="M66.2271 136.5842h-1.418l-.283 4.252h1.984l-.283-4.252zm13.039 0h-1.417l-.284 4.252h1.984l-.283-4.252zm-10.6299-4.394v.709h1.417v-2.552h3.969v2.552h1.417v-.709h2.268v-2.126h5.102v13.606h-21.543v-13.606h5.102v2.126h2.268z"/>
      </g>
      <g id="g7289" opacity=".58300003">
        <g id="g1916" opacity=".92000002">
          <path id="PWR_1" fill="#9a916c" d="M13.0444 72.1024c0 4.305-3.49 7.795-7.795 7.795H.7154c-.276-2.562-.427-5.16-.427-7.795s.151-5.233.427-7.795h4.534c4.305 0 7.795 3.49 7.795 7.795m-6.662-4.677c-2.583 0-4.677 2.094-4.677 4.677 0 2.583 2.094 4.677 4.677 4.677 2.583 0 4.677-2.094 4.677-4.677 0-2.583-2.093-4.677-4.677-4.677"/>
        </g>
        <g id="g1920" opacity=".92000002">
          <path id="PWR_2" fill="#9a916c" d="M101.4439 123.3422c3.729-2.152 8.496-.875 10.648 2.853l2.267 3.927c-2.08 1.52-4.255 2.949-6.537 4.267-2.282 1.317-4.607 2.486-6.964 3.528l-2.267-3.927c-2.153-3.728-.876-8.496 2.853-10.648m-.72 8.108c1.292 2.237 4.153 3.003 6.39 1.712 2.236-1.292 3.003-4.152 1.712-6.389-1.292-2.237-4.153-3.003-6.39-1.712-2.236 1.292-3.004 4.151-1.712 6.389"/>
        </g>
        <g id="g2070" opacity=".92000002">
          <path id="PIN_1" fill="#9a916c" d="M127.5689 51.9447c-1.473-4.046.613-8.519 4.658-9.991l4.261-1.551c1.136 2.313 2.166 4.703 3.067 7.179.902 2.476 1.649 4.969 2.265 7.471l-4.261 1.55c-4.045 1.473-8.518-.613-9.99-4.658m7.859 2.116c2.428-.884 3.679-3.567 2.796-5.994-.884-2.428-3.567-3.679-5.995-2.796-2.427.884-3.679 3.568-2.795 5.995.883 2.427 3.567 3.679 5.994 2.795"/>
        </g>
        <g id="g2080" opacity=".92000002">
          <path id="GND_0" fill="#9a916c" d="M42.4507 123.1615c3.728 2.153 5.005 6.92 2.853 10.648l-2.267 3.927c-2.357-1.042-4.682-2.21-6.964-3.528s-4.456-2.747-6.538-4.267l2.268-3.927c2.152-3.728 6.919-5.005 10.648-2.853m-7.382 3.431c-1.291 2.237-.525 5.097 1.712 6.389 2.237 1.291 5.098.525 6.389-1.712 1.292-2.237.525-5.097-1.712-6.389-2.236-1.291-5.096-.526-6.389 1.712"/>
        </g>
        <g id="g2084" opacity=".92000002">
          <path id="GND_2" fill="#9a916c" d="M131.0318 72.1034c0-4.305 3.49-7.795 7.795-7.795h4.534c.275 2.562.427 5.16.427 7.795s-.152 5.233-.427 7.795h-4.534c-4.305 0-7.795-3.49-7.795-7.795m6.662 4.677c2.583 0 4.677-2.094 4.677-4.677 0-2.583-2.094-4.677-4.677-4.677-2.583 0-4.677 2.094-4.677 4.677 0 2.583 2.093 4.677 4.677 4.677"/>
        </g>
        <g id="g2088" opacity=".92000002">
          <path id="path2090" fill="#9a916c" d="M42.6314 20.8636c-3.728 2.152-8.496.875-10.648-2.853l-2.267-3.926c2.081-1.521 4.255-2.95 6.537-4.268 2.282-1.317 4.607-2.485 6.964-3.527l2.267 3.926c2.153 3.728.876 8.496-2.853 10.648m.719-8.107c-1.291-2.238-4.152-3.004-6.388-1.712-2.237 1.291-3.004 4.151-1.712 6.388 1.291 2.238 4.152 3.003 6.388 1.712 2.238-1.292 3.004-4.151 1.712-6.388"/>
        </g>
        <g id="g2114" opacity=".92000002">
          <path id="PIN_2" fill="#9a916c" d="M127.5679 92.2621c1.473-4.045 5.946-6.131 9.991-4.659l4.261 1.551c-.617 2.502-1.363 4.995-2.265 7.471-.901 2.476-1.931 4.866-3.067 7.179l-4.261-1.551c-4.045-1.472-6.131-5.946-4.659-9.991m4.661 6.673c2.427.884 5.111-.368 5.994-2.795.884-2.427-.368-5.111-2.795-5.995-2.427-.883-5.111.368-5.995 2.796-.883 2.427.367 5.111 2.796 5.994"/>
        </g>
        <g id="g2118" opacity=".92000002">
          <path id="PIN_3" fill="#9a916c" d="M117.3228 110.118c2.768-3.298 7.685-3.728 10.982-.961l3.473 2.915c-1.435 2.14-2.989 4.227-4.684 6.245-1.693 2.019-3.479 3.912-5.336 5.697l-3.474-2.914c-3.298-2.768-3.728-7.684-.961-10.982m2.098 7.865c1.978 1.66 4.928 1.402 6.589-.576 1.66-1.979 1.402-4.929-.578-6.59-1.978-1.66-4.928-1.402-6.588.577-1.661 1.978-1.403 4.928.577 6.589"/>
        </g>
        <g id="g2122" opacity=".92000002">
          <path id="PIN_0" fill="#9a916c" d="M117.3237 34.0882c-2.768-3.298-2.337-8.215.961-10.981l3.473-2.915c1.858 1.785 3.644 3.678 5.337 5.697 1.694 2.018 3.249 4.105 4.684 6.246l-3.474 2.914c-3.297 2.768-8.214 2.337-10.981-.961m8.109-.699c1.979-1.66 2.238-4.611.577-6.589-1.661-1.98-4.611-2.237-6.589-.577-1.979 1.661-2.237 4.61-.576 6.59 1.66 1.978 4.609 2.237 6.588.576"/>
        </g>
        <g id="g2418" opacity=".92000002">
          <path id="RX" fill="#9a916c" d="M16.687 51.224c-1.473 4.045-5.946 6.131-9.991 4.658l-4.26-1.551c.616-2.502 1.363-4.994 2.264-7.47.902-2.477 1.932-4.866 3.068-7.179l4.26 1.551c4.045 1.472 6.131 5.945 4.659 9.991m-4.661-6.674c-2.427-.884-5.111.368-5.994 2.795-.884 2.428.368 5.111 2.795 5.995 2.427.883 5.111-.368 5.995-2.796.883-2.426-.367-5.11-2.796-5.994"/>
        </g>
        <g id="g2422" opacity=".92000002">
          <path id="SCL" fill="#9a916c" d="M26.752 109.9374c2.767 3.298 2.337 8.214-.961 10.981l-3.473 2.915c-1.858-1.785-3.644-3.678-5.338-5.697-1.693-2.018-3.248-4.106-4.683-6.245l3.473-2.915c3.298-2.767 8.215-2.337 10.982.961m-8.11.699c-1.978 1.66-2.237 4.611-.576 6.59 1.66 1.978 4.61 2.236 6.589.576 1.978-1.66 2.237-4.611.576-6.589-1.66-1.979-4.609-2.238-6.589-.577"/>
        </g>
        <g id="g2426" opacity=".92000002">
          <path id="SDA" fill="#9a916c" d="M16.5064 92.2611c1.473 4.045-.613 8.519-4.659 9.991l-4.26 1.551c-1.136-2.313-2.166-4.703-3.068-7.179-.901-2.476-1.647-4.969-2.264-7.471l4.26-1.551c4.046-1.472 8.519.614 9.991 4.659m-7.86-2.116c-2.427.883-3.679 3.567-2.795 5.994.884 2.427 3.567 3.679 5.994 2.795 2.428-.883 3.679-3.567 2.796-5.994-.884-2.428-3.567-3.679-5.995-2.795"/>
        </g>
        <g id="g2510" opacity=".92000002">
          <path id="TX" fill="#9a916c" d="M27.4727 33.3675c-2.768 3.298-7.684 3.728-10.982.961l-3.473-2.914c1.435-2.141 2.99-4.228 4.683-6.246 1.694-2.019 3.48-3.912 5.338-5.697l3.473 2.915c3.298 2.766 3.728 7.683.961 10.981m-2.097-7.865c-1.979-1.66-4.929-1.403-6.59.577-1.66 1.978-1.401 4.929.577 6.589 1.979 1.66 4.929 1.402 6.589-.577 1.661-1.979 1.403-4.928-.576-6.589"/>
        </g>
        <g id="g2580" opacity=".92000002">
          <path id="VBATT" fill="#9a916c" d="M101.4448 20.8646c-3.729-2.152-5.006-6.92-2.854-10.648l2.268-3.927c2.357 1.042 4.682 2.21 6.964 3.528s4.457 2.747 6.537 4.267l-2.267 3.926c-2.152 3.729-6.919 5.006-10.648 2.854m7.382-3.432c1.291-2.236.524-5.096-1.712-6.388-2.237-1.291-5.098-.525-6.39 1.712-1.291 2.237-.524 5.097 1.712 6.388 2.237 1.292 5.098.527 6.39-1.712"/>
        </g>
      </g>
    </g>
  </g>
  <g id="g2144" stroke="#fff">
    <path id="LED6" fill="#c8c8c8" stroke-width="2.0995" d="M135.80661 113.44216c2.464813-4.2682835 7.923513-5.731635 12.193896-3.266822 4.270383 2.464813 5.731635 7.9256125 3.266822 12.193896-2.464813 4.270383-7.923513 5.731635-12.193896 3.2689215-4.270383-2.464813-5.7337345-7.9256125-3.266822-12.1959955"/>
  </g>
  <g id="g2164" stroke="#fff">
    <path id="LED5" fill="#c8c8c8" stroke-width="2.0995" d="M116.12733 134.02221c4.2682835-2.464813 9.729083-1.003561 12.1959955 3.2689215 2.4627135 4.2682835.999362 9.7269835-3.2689215 12.1917965-4.270383 2.4669125-9.7311825 1.003561-12.1959955-3.2647225-2.4627135-4.2724825-1.0014615-9.7311825 3.2689215-12.1959955"/>
  </g>
  <g id="g2182" stroke="#fff">
    <path id="LED7" fill="#c8c8c8" stroke-width="2.0995" d="M141.80896 90.01029c0-4.9317255 3.997448-8.927074 8.927074-8.927074 4.9317255 0 8.927074 3.9953485 8.927074 8.927074 0 4.929626-3.9953485 8.927074-8.927074 8.927074-4.929626 0-8.927074-3.997448-8.927074-8.927074"/>
  </g>
  <g id="g2200" stroke="#fff">
    <path id="LED8" fill="#c8c8c8" stroke-width="2.0995" d="M135.35415 64.328085c-2.464813-4.270383-1.0014615-9.729083 3.2689215-12.1959955 4.270383-2.4627135 9.729083-1.0014615 12.193896 3.2689215 2.464813 4.270383 1.003561 9.729083-3.266822 12.193896-4.270383 2.464813-9.729083 1.003561-12.1959955-3.266822"/>
  </g>
  <g id="g2220" stroke="#fff">
    <path id="LED9" fill="#c8c8c8" stroke-width="2.0995" d="M115.67529 44.198715c-4.2682835-2.464813-5.731635-7.923513-3.266822-12.193896 2.464813-4.270383 7.9256125-5.7337345 12.193896-3.2689215 4.270383 2.4669125 5.731635 7.9256125 3.2689215 12.1959955-2.464813 4.270383-7.9256125 5.731635-12.1959955 3.266822"/>
  </g>
  <g id="g2240" stroke="#fff">
    <path id="LED0" fill="#c8c8c8" stroke-width="2.0995" d="M63.411329 43.749603c-4.270383 2.464813-9.729083 1.0014615-12.1959955-3.2689215-2.4627135-4.2682835-1.0014615-9.7269835 3.2689215-12.193896 4.270383-2.464813 9.729083-1.0014615 12.193896 3.266822 2.464813 4.270383 1.003561 9.7311825-3.266822 12.1959955"/>
  </g>
  <g id="g2260" stroke="#fff">
    <path id="LED1" fill="#c8c8c8" stroke-width="2.0995" d="M45.081844 63.428953c-2.464813 4.270383-7.923513 5.731635-12.193896 3.266822-4.270383-2.464813-5.7337345-7.923513-3.2689215-12.193896 2.4669125-4.270383 7.9256125-5.731635 12.1959955-3.266822 4.270383 2.464813 5.731635 7.923513 3.266822 12.193896"/>
  </g>
  <g id="g2278" stroke="#fff">
    <path id="LED2" fill="#c8c8c8" stroke-width="2.0995" d="M38.179238 89.11129c0 4.929626-3.997448 8.927074-8.927074 8.927074-4.929626 0-8.927074-3.997448-8.927074-8.927074 0-4.929626 3.997448-8.927074 8.927074-8.927074 4.929626 0 8.927074 3.997448 8.927074 8.927074"/>
  </g>
  <g id="g2296" stroke="#fff">
    <path id="LED3" fill="#c8c8c8" stroke-width="2.0995" d="M45.082482 116.14375c2.464813 4.270383 1.003561 9.729083-3.266822 12.1959955-4.270383 2.4627135-9.729083 1.0014615-12.1959955-3.2689215-2.464813-4.2682835-1.0014615-9.729083 3.2689215-12.1959955 4.270383-2.4627135 9.729083-1.0014615 12.193896 3.2689215"/>
  </g>
  <g id="g2316" stroke="#fff">
    <path id="LED4" fill="#c8c8c8" stroke-width="2.0995" d="M65.662206 134.92329c4.270383 2.464813 5.731635 7.923513 3.266822 12.1959955-2.464813 4.2682835-7.923513 5.731635-12.193896 3.2647225-4.270383-2.464813-5.731635-7.923513-3.266822-12.193896 2.464813-4.270383 7.923513-5.7337345 12.193896-3.266822"/>
  </g>
  <g id="palette">
  <circle id="paletteback" cx="90.046875" cy="89.614372" r="45.914173" fill="#999" stroke="#969696" stroke-opacity="0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice0" data-color="white" fill="white" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M87.789062 46.578125a43.153011 43.153011 0 0 0-26.574218 11.011719l19.052734 19.050781a16.268755 16.268755 0 0 1 7.521484-3.126953V46.578125z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice1" data-color="red" fill="red" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M92.304688 46.558594v26.96875a16.268755 16.268755 0 0 1 7.523437 3.113281l19.058595-19.058594a43.153011 43.153011 0 0 0-26.582032-11.023437z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice2" data-color="orange" fill="#FF8C00" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M122.08203 60.773438l-19.05664 19.05664a16.268755 16.268755 0 0 1 3.125 7.527344h26.93164a43.153011 43.153011 0 0 0-11-26.583984z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice3" data-color="yellow" fill="yellow" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M106.13867 91.873047a16.268755 16.268755 0 0 1-3.11719 7.523437l19.04688 19.044926a43.153011 43.153011 0 0 0 11.05078-26.568363h-26.98047z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice4" data-color="green" fill="green" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M99.826172 102.58789a16.268755 16.268755 0 0 1-7.521484 3.12695v26.93555a43.153011 43.153011 0 0 0 26.574222-11.01172l-19.052738-19.05078z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice5" data-color="blue" fill="blue" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M80.265625 102.58789l-19.058594 19.05859a43.153011 43.153011 0 0 0 26.582031 11.02344v-26.96875a16.268755 16.268755 0 0 1-7.523437-3.11328z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice6" data-color="purple" fill="purple" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M47.011719 91.873047a43.153011 43.153011 0 0 0 11 26.582033l19.05664-19.056642a16.268755 16.268755 0 0 1-3.125-7.525391h-26.93164z" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="paletteslice7" data-color="pink" fill="#FF1493" stroke="#781927" stroke-opacity="0" stroke-width="1.61524105" d="M58.025391 60.787109a43.153011 43.153011 0 0 0-11.050782 26.570313h26.980469a16.268755 16.268755 0 0 1 3.117188-7.523438L58.025391 60.787109z" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse id="palettecenter" data-color="black" cx="90.046875" cy="89.614372" fill="#c8c8c8" stroke="#969696" stroke-opacity="0" stroke-width=".42138419" ry="10.992458" rx="11.529466" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

      this.boardElement = pxsim.svg.parseString(BOARD_SVG);
      pxsim.svg.hydrate(this.boardElement, {
        'height': FieldLights.imageHeight,
        'width': FieldLights.imageWidth,
        'padding': '2px'
      })

      this.paletteElement_ = this.boardElement.getElementById("palette") as SVGGElement;

      this.neopixels_ = [];
      for (let i = 0; i < FieldLights.NUM_PIXELS; i++) {
        let neopixel = this.boardElement.getElementById("LED" + i) as SVGGElement;
        pxsim.svg.addClass(neopixel, 'neopixel');
        pxsim.svg.onClick(neopixel, ev => this.onPixelClicked(neopixel, i));
        this.neopixels_.push(neopixel);
      }

      this.paletteButtons = [];
      ['paletteslice0', 'paletteslice1', 'paletteslice2', 'paletteslice3',
        'paletteslice4', 'paletteslice5', 'paletteslice6', 'paletteslice7', 'palettecenter']
        .forEach((id, i) => {
          let btn = this.boardElement.getElementById(id) as SVGGElement;
          pxsim.svg.addClass(btn, 'colorbutton');
          if (i == 1) pxsim.svg.addClass(btn, 'active');
          pxsim.svg.onClick(btn, ev => this.onColorClicked(btn));
          this.paletteButtons.push(btn);
        })

      this.fieldGroup_.appendChild(this.boardElement);
    }

    render_() {
      if (!this.visible_) {
        this.size_.width = 0;
        return;
      }

      if (!this.neopixels_) this.initRing();

      const colors = this.getValue().replace(/\"`'/g, "").split(' ') || [];
      for (let i = 0; i < FieldLights.NUM_PIXELS; i++) {
        const neopixel = this.neopixels_[i];
        let c = colors[i] || "0xff";
        if (c == 'black' || c == '0')
          c = 'grey';
        pxsim.svg.fill(neopixel, c)
        neopixel.setAttribute("data-color", colors[i] || "0xff");
      }

      this.size_.height = Number(FieldLights.imageHeight) + 19;
      this.size_.width = Number(FieldLights.imageWidth);      
    }

    onColorClicked(btn: SVGElement) {
      let previous = this.paletteButtons.filter(btn => pxsim.svg.hasClass(btn, 'active'))[0];
      if (previous) pxsim.svg.removeClass(previous, 'active');

      pxsim.svg.addClass(btn, 'active');
    }

    onPixelClicked(neopixel: SVGElement, id: number) {
      let btn = this.paletteButtons.filter(btn => pxsim.svg.hasClass(btn, 'active'))[0];
      if (btn) {
        neopixel.setAttribute("data-color", btn.getAttribute("data-color"));
        this.setValue(this.getValueArray())
      }
    };

    getValue() {
      return this.getText() || '`red red red red red red red red red red`';
    }

    getValueArray(): string {
      return '`' + this.neopixels_.map(neo => neo.getAttribute("data-color")).join(' ') + '`';
    }
  }
}