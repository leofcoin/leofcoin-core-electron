import define from '../../node_modules/backed/src/utils/define.js';
import merge from '../../node_modules/backed/src/utils/merge.js';
import PropertyMixin from '../../node_modules/backed/src/mixins/property-mixin'
import RenderMixin from '../../node_modules/custom-renderer-mixin/src/render-mixin';

export default define(class ExtendedFab extends PropertyMixin(RenderMixin(HTMLElement)) {
  static get properties() {
    return merge(super.properties, {
      icon: {
        observer: '_iconChanged',
        value: null
      },
      label: {
        observer: '_labelChanged',
        value: null
      }
    });
  }
  get iconEL() {
    return this.querySelector('custom-svg-icon');
  }
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('mousedown', event => {
      this.classList.add('pressed');
    });
    this.addEventListener('mouseup', event => {
      this.classList.remove('pressed');
    });
  }
  _iconChanged() {
    if (this.icon && !this.iconEl) {
      this.iconEl = document.createElement('custom-svg-icon');
      this.appendChild(this.iconEl);
    }
    if (this.icon) this.iconEl.setAttribute('icon', this.icon);
  }
  _labelChanged() {
    this.render({ label: this.label })
  }
  get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 48px;
          max-height: 48px;
          border-radius: 28px;
          font-weight: 700;
          font-family: 'ROBOTO', sans-serif;
          font-size: 15px;
          text-transform: uppercase;
          box-sizing: border-box;
          padding: 8px 20px 8px 16px;
          cursor: pointer;
          box-shadow: var(--shadow-elevation-6dp);
        }
        :host(.pressed) {
          box-shadow: var(--shadow-elevation-2dp);
        }
        ::slotted(custom-svg-icon) {
          padding-right: 8px;
          --custom-svg-icon-size: 24px;
        }
      </style>
      <slot></slot>
      ${'label'}
    `;
  }
})
