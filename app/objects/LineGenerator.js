import { Object3D } from 'three';
import AnimatedMeshLine from './AnimatedMeshLine';

export default class LineGenerator extends Object3D {
  constructor({ frequency = 0.1 } = {}, lineProps) {
    super();

    this.frequency = frequency;
    this.lineStaticProps = lineProps;

    this.isStarted = false;

    this.i = 0;
    this.lines = [];
    this.nbrOfLines = -1;


    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }


  /**
   * * *******************
   * * ANIMATION
   * * *******************
   */
  start() {
    this.isStarted = true;
  }

  stop(callback) {
    this.isStarted = false;
    // TODO callback when all lines are hidden
  }

  /**
   * * *******************
   * * LINES
   * * *******************
   */
  addLine(props) {
    const line = new AnimatedMeshLine(Object.assign({}, this.lineStaticProps, props));
    this.lines.push(line);
    this.add(line);
    this.nbrOfLines++;
    return line;
  }

  removeLine(line) {
    this.remove(line);
    this.nbrOfLines--;
  }


  /**
   * * *******************
   * * UPDATE
   * * *******************
   */
  update() {
    // Add lines randomly
    if (this.isStarted && Math.random() < this.frequency) this.addLine();

    // Update current Lines
    for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
      this.lines[this.i].update();
    }

    // Filter and remove died lines
    const filteredLines = [];
    for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
      if (this.lines[this.i].isDied()) {
        this.removeLine(this.lines[this.i]);
      } else {
        filteredLines.push(this.lines[this.i]);
      }
    }
    this.lines = filteredLines;
  }
}
