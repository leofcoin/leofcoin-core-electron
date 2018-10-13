import define from '../../node_modules/backed/src/utils/define.js';
import merge from '../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../node_modules/custom-renderer-mixin/src/render-mixin';
import PropertyMixin from '../../node_modules/backed/src/mixins/property-mixin'

export default define(class SplashScreen extends PropertyMixin(RenderMixin(HTMLElement)) {
  static get properties() {
    return merge(super.properties, {
      ready: {
        observer: '_readyObserver'
      },
      title: {
        value: 'connecting peers'
      },
      splash: {
        value: null
      },
      connecting: {
        value: true,
        observer: '_observer'
      },
      syncing: {
        value: false,
        observer: '_observer'
      }
    });
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
  connectedCallback() {
    super.connectedCallback();
    this.render({splash: this.splash})
  }
  get connectingAnimation() {
    return `
      <style>
        .searching-peers {
          display: block;
          width: 40px;
          height: 40px;
          margin: 100px auto;
          background-color: #333;

          border-radius: 100%;
          -webkit-animation: scale 1.0s infinite ease-in-out;
          animation: scale 1.0s infinite ease-in-out;
        }

        @-webkit-keyframes scale {
          0% { -webkit-transform: scale(0) }
          100% {
            -webkit-transform: scale(1.0);
            opacity: 0;
          }
        }

        @keyframes scale {
          0% {
            -webkit-transform: scale(0);
            transform: scale(0);
          } 100% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
            opacity: 0;
          }
        }
      </style>
      <span class="searching-peers"></span>
    `;
  }
  get syncingAnimation() {
    return `
    <style>
      .syncing-chain {
        display: block;
        width: 40px;
        height: 40px;
        margin: 100px auto;
      }

      .syncing-chain .block {
        width: 33%;
        height: 33%;
        background-color: #333;
        float: left;
        -webkit-animation: gridScaleDelay 1.3s infinite ease-in-out;
                animation: gridScaleDelay 1.3s infinite ease-in-out;
      }
      .syncing-chain .block1 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .syncing-chain .block2 {
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .syncing-chain .block3 {
        -webkit-animation-delay: 0.4s;
                animation-delay: 0.4s; }
      .syncing-chain .block4 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .syncing-chain .block5 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .syncing-chain .block6 {
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .syncing-chain .block7 {
        -webkit-animation-delay: 0s;
                animation-delay: 0s; }
      .syncing-chain .block8 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .syncing-chain .block9 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }

      @-webkit-keyframes gridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1);
                  opacity: 0;
        }
      }

      @keyframes gridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1);
                  opacity: 0;
        }
      }
    </style>
    <span class="syncing-chain">
      <div class="block block1"></div>
      <div class="block block2"></div>
      <div class="block block3"></div>
      <div class="block block4"></div>
      <div class="block block5"></div>
      <div class="block block6"></div>
      <div class="block block7"></div>
      <div class="block block8"></div>
      <div class="block block9"></div>
    </span>
    `;
  }
  _observer() {
    if (this.connecting) {
      this.splash = this.connectingAnimation;
      this.title = 'connecting peers';
    };
    if (!this.connecting) {
      this.splash = this.syncingAnimation;
      this.title = 'syncing chain';
    }
    this.render({splash: this.splash, title: this.title})
  }
  _readyObserver(oldValue, newValue) {

    if (this.ready) {
      // this.innerHTML = '<strong>Hi!<strong>'
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.setAttribute('ready', '')
          this.style.opacity = 0
          this.style.pointerEvents = 'none'
        });
      }, 800);
    }
  }
  get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          position: absolute;
          background: #FFF;
          top: 0;
          left: 0;
          right: 0;
          bottom: 48px;
          z-index: 1000;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        :host([ready]) {
          opacity: 0;
          pointer-events: none;
        }
      </style>
      <slot>
        ${'splash'}
        <strong>${'title'}</strong>
      </slot>
    `
  }
})
