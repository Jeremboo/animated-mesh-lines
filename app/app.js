/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */

import './base.css';

class App {
  constructor() {
    this.demos = document.querySelectorAll('.frame__demo');
  }

  onHide(hideMethod) {
    this.demos.forEach((demo) => {
      demo.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('.frame__demo--current')) return;
        hideMethod(() => {
          window.location = e.target.href;
        });
      });
    });
  }
}

export default new App();