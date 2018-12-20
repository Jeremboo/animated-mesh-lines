
import { Color, Vector3 } from 'three';
import { TimelineLite } from 'gsap';

import HandleCameraOrbit from 'decorators/HandleCameraOrbit';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';
import Stars from 'objects/Stars';

import getRandomFloat from 'utils/getRandomFloat';

import app from 'App';
import './style.styl';


/**
 * * *******************
 * * ENGINE
 * * *******************
 */
@FullScreenInBackground
@HandleCameraOrbit({ x: 2, y: 3 }, 0.05)
class CustomEngine extends Engine {}

const engine = new CustomEngine();


/**
 * * *******************
 * * TITLE
 * * *******************
 */
const text = new AnimatedText3D('Shooting Stars', { color: '#dc2c5a', size: app.isMobile ? 0.4 : 0.8 });
text.position.x -= text.basePosition * 0.5;
// text.position.y -= 0.5;
engine.add(text);


/**
 * * *******************
 * * LIGNES
 * * *******************
 */
const STATIC_PROPS = {
  width: 0.05,
  nbrOfPoints: 1,
  turbulence: new Vector3(),
  orientation: new Vector3(-1, -1, 0),
  color: new Color('#e6e0e3'),
};

class CustomLineGenerator extends LineGenerator {
  addLine() {
    super.addLine({
      length: getRandomFloat(5, 10),
      visibleLength: getRandomFloat(0.05, 0.2),
      speed: getRandomFloat(0.01, 0.02),
      position: new Vector3(
        getRandomFloat(-4, 8),
        getRandomFloat(-3, 5),
        getRandomFloat(-2, 5),
      ),
    });
  }
}
const lineGenerator = new CustomLineGenerator({ frequency: 0.1 }, STATIC_PROPS);
engine.add(lineGenerator);


/**
 * * *******************
 * * STARS
 * * *******************
 */
const stars = new Stars();
engine.add(stars);

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
tlShow.to('.overlay', 2, { opacity: 0 });
tlShow.to('.background', 2, { y: -300 }, 0);
tlShow.fromTo(engine.lookAt, 2, { y: -8 }, { y: 0, ease: Power2.easeOut }, 0);
tlShow.add(text.show, '-=1');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
