import '../../base.css';
import './style.styl';

import { Color, Vector3 } from 'three';
import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';
import getRandomItem from 'utils/getRandomItem';

import CameraPositionHandlerWithMouse from 'decorators/CameraPositionHandlerWithMouse';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import app from 'App';


/**
 * * *******************
 * * ENGINE
 * * *******************
 */

@FullScreenInBackground
@CameraPositionHandlerWithMouse({ x: 4, y: 4 })
class CustomEngine extends Engine {}

const engine = new CustomEngine();


/**
 * * *******************
 * * TITLE
 * * *******************
 */

const text = new AnimatedText3D('Shooting Stars', { color: '#dc2c5a' });
text.position.x -= text.basePosition * 0.5;
// text.position.y -= 0.5;
engine.add(text);


/**
 * * *******************
 * * LIGNES
 * * *******************
 */

// const COLORS = ['#333333', '#ffffff'].map((col) => new Color(col));
const STATIC_PROPS = {
  width: 0.05,
  frequency: 0.5,
  nbrOfPoints: 1,
  turbulence: new Vector3(),
  orientation: new Vector3(-1, -1, 0),
  color: new Color('#e6e0e3'),
};

class CustomLineGenerator extends LineGenerator {
  // start() {
  //   const currentFreq = this.frequency;
  //   this.frequency = 1;
  //   setTimeout(() => {
  //     this.frequency = currentFreq;
  //   }, 1000);
  //   super.start();
  // }

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
      // color: getRandomItem(COLORS),
    });
  }
}

const lineGenerator = new CustomLineGenerator(STATIC_PROPS);
engine.add(lineGenerator);


/**
 * * *******************
 * * START
 * * *******************
 */

// Show
const tlShow = new TimelineLite({ onStart: () => {
  engine.start();
}});
tlShow.to('._overlay', 0.6, { autoAlpha: 0 });
tlShow.fromTo(engine.lookAt, 3, { y: -4 }, { y: 0, ease: Power3.easeOut }, '-=0.4');
tlShow.add(lineGenerator.start, 0);
tlShow.add(text.show, '-=2');

const tlHide = new TimelineLite({ paused: true });
tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
tlHide.add(text.hide, 0);
tlHide.add(lineGenerator.stop);
tlHide.to('._overlay', 0.5, { autoAlpha: 1 }, '-=1.5');


app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('._overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
