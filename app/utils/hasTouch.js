// https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
export default () => 'ontouchstart' in document.documentElement ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0
;