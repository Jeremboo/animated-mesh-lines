import '../../base.css';
import './style.styl';

import { Color, Vector3 } from 'three';
import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';
import getRandomItem from 'utils/getRandomItem';

import HandleCameraOrbit from 'decorators/HandleCameraOrbit';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import app from 'App';


/**
 * * *******************
 * * ENGINE
 * * *******************
 */

@FullScreenInBackground
@HandleCameraOrbit({ x: 8, y: 8 }, 0.15)
class CustomEngine extends Engine {}

const engine = new CustomEngine();


/**
 * * *******************
 * * TITLE
 * * *******************
 */
class CustomAnimatedText3D extends AnimatedText3D {
  constructor(...props) {
    super(...props);
    this.t = 0;
    this.update = this.update.bind(this);
  }

  update() {
    this.t += 0.05;
    this.position.y += (Math.sin(this.t)) * 0.0025;
  }
}
const text = new CustomAnimatedText3D('Energy', { color: '#0f070a', size: app.isMobile ? 0.6 : 0.8 });
text.position.x -= text.basePosition * 0.5;
text.position.y += 0.15;


/**
 * * *******************
 * * LIGNES
 * * *******************
 */
const COLORS = ['#FDFFFC', '#FDFFFC', '#FDFFFC', '#FDFFFC', '#EA526F', '#71b9f2'].map((col) => new Color(col));
const STATIC_PROPS = {
  nbrOfPoints: 4,
  speed: 0.03,
  turbulence: new Vector3(1, 0.8, 1),
  orientation: new Vector3(1, 0, 0),
  transformLineMethod: p => {
    const a = ((0.5 - Math.abs(0.5 - p)) * 3);
    return a;
  }
};

const POSITION_X = app.isMobile ? -1.8 : -3.2;

const LENGTH_MIN = app.isMobile ? 3.25 : 5;
const LENGTH_MAX = app.isMobile ? 3.7 : 7;
class CustomLineGenerator extends LineGenerator {
  start() {
    const currentFreq = this.frequency;
    this.frequency = 1;
    setTimeout(() => {
      this.frequency = currentFreq;
    }, 500);
    super.start();
  }

  addLine() {
    const line = super.addLine({
      width: getRandomFloat(0.1, 0.3),
      length: getRandomFloat(LENGTH_MIN, LENGTH_MAX),
      visibleLength: getRandomFloat(0.05, 0.8),
      position: new Vector3(
        POSITION_X,
        0.3,
        getRandomFloat(-1, 1),
      ),
      color: getRandomItem(COLORS),
    });
    line.rotation.x = getRandomFloat(0, Math.PI * 2);

    if (Math.random() > 0.1) {
      const line = super.addLine({
        width: getRandomFloat(0.05, 0.1),
        length: getRandomFloat(5, 10),
        visibleLength: getRandomFloat(0.05, 0.5),
        speed: 0.05,
        position: new Vector3(
          getRandomFloat(-9, 5),
          getRandomFloat(-5, 5),
          getRandomFloat(-10, 6),
        ),
        color: getRandomItem(COLORS),
      });
      line.rotation.x = getRandomFloat(0, Math.PI * 2);
    }
  }
}
const lineGenerator = new CustomLineGenerator({
  frequency: 0.1,
}, STATIC_PROPS);
engine.add(lineGenerator);

/**
 * * *******************
 * * START
 * * *******************
 */
// Show
engine.start();
const tlShow = new TimelineLite({ delay: 0.2 });
tlShow.to('.overlay', 0.6, { autoAlpha: 0 });
tlShow.fromTo(engine.lookAt, 3, { y: -4 }, { y: 0, ease: Power3.easeOut }, 0);
tlShow.add(lineGenerator.start, '-=2.5');
tlShow.add(() => {
  engine.add(text);
  text.show();
}, '-=1.6');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
