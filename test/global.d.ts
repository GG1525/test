/// <reference types="./types/**/*" />
/// <reference types="vue/types/umd" />


declare type VueNode = import('vue')
declare type VueConstructor = import('vue').VueConstructor
declare type ReactElement = import('react').ReactElement;



declare module '*.png'
declare module '*.jpg'
declare module '*.svg'
declare module '*.webp'
declare interface Vue {
  $runtime: string
}
declare module '*.vue' {
  import VueOption from 'vue';
  export default VueOption
}



declare module '*.module.less' {
  interface Style {
    [propName: string]: string
  }
  const style: Style
  export default style
}
declare module '*.module.css' {
  interface Style {
    [propName: string]: string
  }
  const style: Style
  export default style
}
declare interface Window {
  __ECIS_PLUGINS: any[]
  __ECIS_PLUGHUB: {
    sdk: any,
    init: (initOption: {
      React?: any,
      Vue?: any,
      ReactDOM: any
    }) => Promise<void>,
    [propName: string]: any
  }
  __ECIS_VUE: VueConstructor
  __ECIS_REACT: any
  WPSOpenApi: {
    ready: () => any
    Application: Promise<{
      ActiveDocument: any // 文字
      ActiveWorkbook: Pany // 表格
      ActivePresentation: any // 演示
      ActivePDF: any // PDF
      [key:string]: any
    }>
  }
  APP: {
    isReadOnly: () => booleans
  } 
}
declare namespace BASE {
  namespace TYPE {
    type VUE = VueConstructor<VueNode>
    type REACT = ReactElement
  }
}