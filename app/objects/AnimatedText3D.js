import { Object3D, ShapeGeometry, MeshBasicMaterial, Mesh, FontLoader } from 'three';
import { TimelineLite, Back } from 'gsap';

import fontFile from 'utils/fontFile';

const fontLoader = new FontLoader();
const font = fontLoader.parse(fontFile);

export default class AnimatedText3D extends Object3D {
  constructor(text, { size = 0.8, letterSpacing = 0.03, color = '#000000', duration = 0.6, opacity = 1, wireframe = false } = {}) {
    super();

    this.basePosition = 0;
    this.size = size;

    const letters = [...text];
    letters.forEach((letter) => {
      if (letter === ' ') {
        this.basePosition += size * 0.5;
      } else {
        const geom = new ShapeGeometry(
          font.generateShapes(letter, size, 1),
        );
        geom.computeBoundingBox();
        const mat = new MeshBasicMaterial({
          color,
          opacity: 0,
          transparent: true,
          wireframe,
        });
        const mesh = new Mesh(geom, mat);

        mesh.position.x = this.basePosition;
        this.basePosition += geom.boundingBox.max.x + letterSpacing;
        this.add(mesh);
      }
    });

    // Timeline
    this.tm = new TimelineLite({ paused: true });
    this.tm.set({}, {}, `+=${duration * 1.1}`)
    this.children.forEach((letter) => {
      const data = {
        opacity: 0,
        position: -0.5,
      };
      this.tm.to(data, duration, {
        opacity,
        position: 0,
        ease: Back.easeOut.config(2),
        onUpdate: () => {
          letter.material.opacity = data.opacity;
          letter.position.y = data.position;
          letter.position.z = data.position * 2;
          letter.rotation.x = data.position * 2;
        }
      }, `-=${duration - 0.03}`);
    });

    // Bind
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show() {
    this.tm.play();
  }

  hide() {
    this.tm.reverse();
  }
}