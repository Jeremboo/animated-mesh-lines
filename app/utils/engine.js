import {
  WebGLRenderer, PerspectiveCamera, Color, Scene,
} from 'three';

export default class Engine {
  constructor(w, h, { backgroundColor, z = 10 } = {}) {
    this.width = w;
    this.height = h;
    this.meshCount = 0;
    this.meshListeners = [];
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(this.devicePixelRatio);
    if (backgroundColor !== undefined) this.renderer.setClearColor(new Color(backgroundColor));
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(50, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, z);

    this.dom = this.renderer.domElement;

    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);

    // Resize
    this.resize(w, h);
  }

  /**
   * * *******************
   * * SCENE MANAGMENT
   * * *******************
   */
  add(mesh) {
    this.scene.add(mesh);
    if (!mesh.update) return;
    this.meshListeners.push(mesh.update);
    this.meshCount++;
  }
  remove(mesh) {
    this.scene.remove(mesh);
    if (!mesh.update) return;
    const index = this.meshListeners.indexOf(mesh.update);
    if (index > -1) this.meshListeners.splice(index, 1);
    this.meshCount--;
  }

  start() {
    this.update();
  }

  /**
   * * *******************
   * * UPDATE
   * * *******************
   */
  update() {
    let i = this.meshCount;
    while (--i >= 0) {
      this.meshListeners[i].apply(this, null);
    }
    this.renderer.render(this.scene, this.camera);

    // Loop
    requestAnimationFrame(this.update);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}