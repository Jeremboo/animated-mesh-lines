import {
  Color, Vector3, SphereBufferGeometry,
  Mesh, Raycaster, MeshBasicMaterial,
} from 'three';

import Engine from 'utils/engine';
import Stars from 'objects/Stars';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';
import getRandomItem from 'utils/getRandomItem';

import HandleCameraOrbit from 'decorators/HandleCameraOrbit';
import FullScreenInBackground from 'decorators/FullScreenInBackground';
import PostProcessing from 'decorators/PostProcessing';

import app from 'App';

import '../../base.css';
import './style.styl';

/**
 * * *******************
 * * ENGINE
 * * *******************
 */

@FullScreenInBackground
@PostProcessing
@HandleCameraOrbit({ x: 1, y: 1 }, 0.1)
class CustomEngine extends Engine {}

const engine = new CustomEngine();
engine.camera.position.z = 2;
engine.addBloomEffect({
  resolutionScale: 0.5,
  kernelSize: 4,
  distinction: 0.01,
}, 1);



/**
 * * *******************
 * * TITLE
 * * *******************
 */
const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
text.position.x -= text.basePosition * 0.5;
engine.add(text);

/**
 * * *******************
 * * STARS
 * * *******************
 */
const stars = new Stars();
stars.update = () => {
  stars.rotation.y -= 0.0004;
  stars.rotation.x -= 0.0002;
};
engine.add(stars);

/**
 * * *******************
 * * LIGNES
 * * *******************
 */

const radius = 4;
const origin = new Vector3();
const direction = new Vector3();
const raycaster = new Raycaster();
const geometry = new SphereBufferGeometry(radius, 32, 32, 0, 3.2, 4, 2.1);
const material = new MeshBasicMaterial({ wireframe: true, visible: false });
const sphere = new Mesh(geometry, material);
engine.add(sphere);
sphere.position.z = 2;

const COLORS = ['#FFFAFF', '#0A2463', '#3E92CC', '#723bb7', '#efd28e', '#3f9d8c'].map((col) => new Color(col));
const STATIC_PROPS = {
  transformLineMethod: p => p,
};

class CustomLineGenerator extends LineGenerator {
  addLine() {
    // V1 Regular and symetric lines ---------------------------------------------
    // i += 0.1;
    // let a = i;
    // let y = 12;
    // let incrementation = 0.1;
    // V2 ---------------------------------------------
    let incrementation = 0.1;
    let y = getRandomFloat(-radius * 0.6, radius * 1.8);
    let a = Math.PI * (-25) / 180;
    let aMax = Math.PI * (200) / 180;

    const points = [];
    while (a < aMax) {
      a += 0.2;
      y -= incrementation;
      origin.set(radius * Math.cos(a), y, radius * Math.sin(a));
      direction.set(-origin.x, 0, -origin.z);
      direction.normalize();
      raycaster.set(origin, direction);

      // save the points
      const intersect = raycaster.intersectObject(sphere, true);
      if (intersect.length) {
        points.push(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z);
      }
    }

    if (points.length === 0) return;

    if (Math.random() > 0.5) {
      // Low lines
      super.addLine({
        visibleLength: getRandomFloat(0.01, 0.2),
        points,
        speed: getRandomFloat(0.003, 0.008),
        color: getRandomItem(COLORS),
        width: getRandomFloat(0.01, 0.1),
      });
    } else {
      // Fast lines
      super.addLine({
        visibleLength: getRandomFloat(0.05, 0.2),
        points,
        speed: getRandomFloat(0.01, 0.1),
        color: COLORS[0],
        width: getRandomFloat(0.01, 0.01),
      });
    }
  }
}
const lineGenerator = new CustomLineGenerator({
  frequency: 0.99,
}, STATIC_PROPS);
engine.add(lineGenerator);


/**
 * * *******************
 * * START
 * * *******************
 */
// Show
engine.start();
const tlShow = new TimelineLite({ delay: 0.2, onStart: () => {
  lineGenerator.start();
}});
tlShow.to('.overlay', 2, { autoAlpha: 0 });
tlShow.fromTo(engine.lookAt, 3, { y: -4 }, { y: 0, ease: Power3.easeOut }, '-=2');
tlShow.add(text.show, '-=2');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
