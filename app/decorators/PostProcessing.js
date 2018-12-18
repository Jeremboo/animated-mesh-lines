import { Clock } from 'three';
import {
  BloomEffect, EffectComposer, EffectPass, RenderPass,
} from 'postprocessing';


export default (Target) => class PostProcessing extends Target {
  constructor(props) {
    super(props);

    this.clock = new Clock();

    this.currentPass = false;
    this.effects = {};
    this.passes = [];
    this.composer = new EffectComposer(this.renderer, {
      // stencilBuffer: true,
      // depthTexture: true,
    });

    this.effects.render = new RenderPass(this.scene, this.camera);
    this.addPass(this.effects.render);
  }

  /**
   * * *******************
   * * ADD EFFECTS
   * * *******************
   */
  addBloomEffect(props, opacity) {
    this.effects.bloom = new BloomEffect(props);
    this.effects.bloom.blendMode.opacity.value = opacity;
    this.addPass(new EffectPass(this.camera, this.effects.bloom));
  }

  /**
   * * *******************
   * * GLOBAL
   * * *******************
   */

  addPass(passe) {
    if (this.passes.length) this.passes[this.passes.length - 1].renderToScreen = false;
    this.passes.push(passe);
    this.composer.addPass(passe);
    this.passes[this.passes.length - 1].renderToScreen = true;
  }

  /**
   * * *******************
   * * OVERWRITED FUNCTIONS
   * * *******************
   */
  render() {
    this.composer.render(this.clock.getDelta());
  }
  resizeRender() {
    if (this.composer) this.composer.setSize(this.width, this.height);
  }
};
