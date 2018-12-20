import {
  Color,
} from 'three';

import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';
import getRandomItem from 'utils/getRandomItem';

import HandleCameraOrbit from 'decorators/HandleCameraOrbit';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import app from 'App';

import '../../base.css';
import './style.styl';

/**
 * * *******************
 * * ENGINE
 * * *******************
 */

@FullScreenInBackground
@HandleCameraOrbit({ x: 1, y: 1 }, 0.1)
class CustomEngine extends Engine {}
const engine = new CustomEngine();
engine.camera.position.z = 6;

/**
 * * *******************
 * * TITLE
 * * *******************
 */
const text = new AnimatedText3D('Colors', { color: '#ffffff', size: app.isMobile ? 0.4 : 0.4, wireframe: false, opacity: 1, });
text.position.x = -text.basePosition * (app.isMobile ? 0.5 : 0.55);
text.position.y = (app.isMobile ? -1.2 : -0.9);
text.position.z = 2;
text.rotation.x = -0.1;

/**
 * * *******************
 * * LIGNES
 * * *******************
 */

const RADIUS_START = 0.3;
const RADIUS_START_MIN = 0.1;
const Z_MIN = -1;

const Z_INCREMENT = 0.08;
const ANGLE_INCREMENT = 0.025;
const RADIUS_INCREMENT = 0.02;

const COLORS = ['#dc202e', '#f7ed99', '#2d338b', '#76306b', '#ea8c2d'].map((col) => new Color(col));
const STATIC_PROPS = {
  transformLineMethod: p => p * 1.5,
};

const position = { x: 0, y: 0, z: 0 };
class CustomLineGenerator extends LineGenerator {
  addLine() {
    if (this.lines.length > 400) return;

    let z = Z_MIN;
    let radius = (Math.random() > 0.8) ? RADIUS_START_MIN : RADIUS_START;
    let angle = getRandomFloat(0, Math.PI * 2);

    const points = [];
    while (z < engine.camera.position.z) {
      position.x = Math.cos(angle) * radius;
      position.y = Math.sin(angle) * radius;
      position.z = z;

      // incrementation
      z += Z_INCREMENT;
      angle += ANGLE_INCREMENT;
      radius += RADIUS_INCREMENT;

      // push
      points.push(position.x, position.y, position.z);
    }

    // Low lines
    super.addLine({
      visibleLength: getRandomFloat(0.1, 0.4),
      // visibleLength: 1,
      points,
      // speed: getRandomFloat(0.001, 0.002),
      speed: getRandomFloat(0.001, 0.005),
      color: getRandomItem(COLORS),
      width: getRandomFloat(0.01, 0.06),
    });
  }
}
const lineGenerator = new CustomLineGenerator({
  frequency: 0.9,
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
tlShow.to('.overlay', 5, { autoAlpha: 0 });
tlShow.add(() => {
  engine.add(text);
  text.show();
}, '-=2');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, 0.1);
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
});
