import {
  SphereBufferGeometry, MeshBasicMaterial, Mesh, Object3D,
} from 'three';

import getRandomFloat from 'utils/getRandomFloat';

const starGeometry = new SphereBufferGeometry(0.5, 2, 2);
const starMaterial = new MeshBasicMaterial({ color: 0xECF0F1, transparent: true, opacity: 0.3 });

class Star extends Mesh {
  constructor() {
    super(starGeometry, starMaterial);

    this.t = Math.random() * 10;
    this.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      -Math.random() * 0.5
    ).normalize().multiplyScalar(getRandomFloat(100, 300));

    this.update = this.update.bind(this);
  }

  update() {
    this.t += 0.01;
    this.scale.x = this.scale.y = this.scale.z = Math.sin( this.t ) + 1;
  }
}

/**
 * * *******************
 * * MAIN
 * * *******************
 */
export default class Starts extends Object3D {
  constructor(nbrOfStars = 300) {
    super();

    // TODO make instancied Stars
    for (let i = 0; i < nbrOfStars; i++) {
      const star = new Star();
      this.add(star);
    }
  }
}