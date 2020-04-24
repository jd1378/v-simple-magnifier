class MagnifierDirective {
  constructor(el, binding) {
    this.updateBinding(el, binding);
  }

  _setDefaults() {
    this.zoomPosition = {
      x: 0,
      y: 0,
    };
    this.zoomBoxPosition = {
      x: 0,
      y: 0,
    };
    this.maskX = 0;
    this.maskY = 0;
    this.zoomOutTimeoutId = undefined;
    this.zoomInTimeoutId = undefined;
    this.zoomImgWidth = 0;
    this.zoomImgHeight = 0;
  }

  _setOptions(el, binding) {
    this.options = binding.value || {};
    if (!this.options.src) {
      this.options.src = el.src;
    }
    if (!this.options.delayIn) {
      this.options.delayIn = 0;
    }
    if (!this.options.delayOut) {
      this.options.delayOut = 0;
    }
    if (!this.options.maskWidth) {
      this.options.maskWidth = 100;
    }
    if (!this.options.maskHeight) {
      this.options.maskHeight = 100;
    }
    if (!this.options.wrapperId) {
      this.options.wrapperId = 'vue-simple-magnifier';
    }
    if (!this.options.zoomWidth) {
      this.options.zoomWidth = 350;
    }
    if (!this.options.zoomHeight) {
      this.options.zoomHeight = 350;
    }
    if (!this.options.cursor) {
      this.options.cursor = 'crosshair';
    }
    if (!this.options.emptyBackgroundColor) {
      this.options.emptyBackgroundColor = 'white';
    }
  }

  updateBinding(el, binding) {
    this.el = el;
    this._setOptions(el, binding);
    this._setDefaults();
    this.initComponent();
  }

  calculateStyles() {
    // zoom mask style
    this.zoomMask.style.width = `${this.options.maskWidth}px`;
    this.zoomMask.style.height = `${this.options.maskHeight}px`;
    this.zoomMask.style.transform = `translate(${this.maskX}px, ${this.maskY}px)`;

    this.zoomImageWrapper.style.top = `${this.zoomBoxPosition.y}px`;
    this.zoomImageWrapper.style.left = `${this.zoomBoxPosition.x}px`;
    this.zoomImageWrapper.style.width = `${this.options.zoomWidth}px`;
    this.zoomImageWrapper.style.height = `${this.options.zoomHeight}px`;

    this.zoomImage.style.width = `${this.zoomImgWidth}px`;
    this.zoomImage.style.height = `${this.zoomImgHeight}px`;
    this.zoomImage.style.transform = `translate(-${this.zoomPosition.x}px, -${this.zoomPosition.y}px)`;
  }

  unbind() {
    if (this.el) {
      this.el.removeEventListener('mouseenter', this.mouseEnter);
      this.el.removeEventListener('mouseleave', this.mouseLeave);
      this.el.removeEventListener('mousemove', this.mouseMove);
    }
  }

  initComponent() {
    this.zoomWrapper = document.querySelector(`#${this.options.wrapperId}`);
    if (!this.zoomWrapper) {
      this.zoomWrapper = document.createElement('div');
      this.zoomWrapper.id = this.options.wrapperId;
      this.zoomWrapper.style.position = 'fixed';
      this.zoomWrapper.style.display = 'none';

      this.zoomMask = document.createElement('div');
      this.zoomMask.style.position = 'fixed';
      this.zoomMask.style.border = '1px solid #c248489d';
      this.zoomMask.style.left = 0;
      this.zoomMask.style.top = 0;
      this.zoomMask.style.zIndex = 100;
      this.zoomMask.style.pointerEvents = 'none';
      this.zoomWrapper.appendChild(this.zoomMask);

      this.zoomImageWrapper = document.createElement('div');
      this.zoomImageWrapper.style.position = 'fixed';
      this.zoomImageWrapper.style.border = '1px solid #808080';
      this.zoomImageWrapper.style.zIndex = 101;
      this.zoomImageWrapper.style.overflow = 'hidden';
      this.zoomImageWrapper.style.backgroundColor = this.options.emptyBackgroundColor;
      this.zoomImageWrapper.style.boxSizing = 'content-box'; // makes image sharper somehow

      this.zoomImage = document.createElement('img');
      this.zoomImage.style.position = 'absolute';
      this.zoomImage.style.objectFit = 'contain';
      this.zoomImage.style.maxWidth = 'none';
      this.zoomImage.style.top = 0;
      this.zoomImage.style.left = 0;
      this.zoomImage.src = this.options.src;
      this.zoomImage.alt = 'zoom';
      this.zoomImageWrapper.appendChild(this.zoomImage);
      this.zoomWrapper.appendChild(this.zoomImageWrapper);

      document.body.appendChild(this.zoomWrapper);
    } else {
      this.zoomMask = this.zoomWrapper.children[0];
      this.zoomImageWrapper = this.zoomWrapper.children[1];
      this.zoomImage = this.zoomWrapper.children[1].children[0];
      this.zoomImageWrapper.style.backgroundColor = this.options.emptyBackgroundColor;
      this.zoomImage.src = this.options.src;
    }

    this.el.addEventListener('mouseenter', this.mouseEnter.bind(this), {
      passive: true,
    });
    this.el.addEventListener('mouseleave', this.mouseLeave.bind(this), {
      passive: true,
    });
    this.el.addEventListener('mousemove', this.mouseMove.bind(this), {
      passive: true,
    });
    this.el.style.cursor = this.options.cursor;
  }
  mouseEnter() {
    clearTimeout(this.zoomOutTimeoutId);
    this.calcZoomSize();
    if (this.options.delayIn === 0) {
      this.zoomWrapper.style.display = '';
    } else {
      this.zoomInTimeoutId = setTimeout(() => {
        this.zoomWrapper.style.display = '';
      }, this.options.delayIn);
    }
  }
  mouseLeave() {
    clearTimeout(this.zoomInTimeoutId);
    if (this.options.delayOut === 0) {
      this.zoomWrapper.style.display = 'none';
    } else {
      this.zoomOutTimeoutId = setTimeout(() => {
        this.zoomWrapper.style.display = 'none';
      }, this.options.delayOut);
    }
  }
  mouseMove(e) {
    if (!this.imgRect) {
      return;
    }

    const relativeX = this.outXCheck(e.clientX - this.imgRect.left);
    const relativeY = this.outYCheck(e.clientY - this.imgRect.top);

    this.maskX = this.imgRect.left + relativeX;
    this.maskY = this.imgRect.top + relativeY;

    this.zoomPosition.x = relativeX * (this.zoomImgWidth / this.imgRect.width);
    this.zoomPosition.y =
      relativeY * (this.zoomImgHeight / this.imgRect.height);
    this.calculateStyles();
  }

  calcZoomSize() {
    this.imgRect = this.el.getBoundingClientRect();
    if (this.imgRect) {
      this.zoomImgWidth =
        (this.imgRect.width / this.options.maskWidth) * this.options.zoomWidth;
      this.zoomImgHeight =
        (this.imgRect.height / this.options.maskHeight) *
        this.options.zoomHeight;

      const leftIsOccupied = this.imgRect.left < this.options.zoomWidth;
      const rightIsOccupied =
        window.innerWidth - this.imgRect.right < this.options.zoomWidth;
      let x = 0;
      let y = 0;

      if (!leftIsOccupied) {
        x = this.imgRect.left - this.options.zoomWidth;
      } else if (!rightIsOccupied) {
        x = this.imgRect.right;
      } else {
        x = window.innerWidth / 2 - this.options.zoomWidth / 2;
      }

      if (leftIsOccupied && rightIsOccupied) {
        if (
          window.innerHeight - this.imgRect.bottom >
          this.options.zoomHeight
        ) {
          y = this.imgRect.bottom;
        }
      } else if (this.imgRect.top > 0) {
        y = this.imgRect.top;
      }
      this.zoomBoxPosition = {
        x,
        y,
      };
    }
    this.calculateStyles();
  }

  outXCheck(x) {
    x = x - this.options.maskWidth / 2;
    if (x < 0) {
      return 0;
    }
    if (x + this.options.maskWidth > this.imgRect.width) {
      return this.imgRect.width - this.options.maskWidth;
    }
    return x;
  }
  outYCheck(y) {
    y = y - this.options.maskHeight / 2;
    if (y < 0) {
      return 0;
    }
    if (y + this.options.maskHeight > this.imgRect.height) {
      return this.imgRect.height - this.options.maskHeight;
    }
    return y;
  }
}

export default {
  bind(el, binding) {
    el._magnifierDirective = new MagnifierDirective(el, binding);
  },
  /* update(el, binding) {
    if (el._magnifierDirective) {
      el._magnifierDirective.updateBinding(el, binding);
    } else {
      el._magnifierDirective = new MagnifierDirective(el, binding);
    }
  }, */
  unbind(el) {
    if (el._magnifierDirective) {
      el._magnifierDirective.unbind();
      delete el._magnifierDirective;
    }
  },
};
