
export default (Target) => class FullScreenInBackground extends Target {
  constructor(props) {
    super(window.innerWidth, window.innerHeight, props);

    // Put automaticaly the canvas in background
    this.dom.style.position = 'absolute';
    this.dom.style.top = '0';
    this.dom.style.left = '0';
    this.dom.style.zIndex = '-1';
    document.body.appendChild(this.dom);

    this.resize = this.resize.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationchange', this.resize);
    this.resize();
  }

  resize() {
    super.resize(window.innerWidth, window.innerHeight);
  }
};
