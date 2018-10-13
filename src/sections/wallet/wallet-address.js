import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../../node_modules/custom-renderer-mixin/src/render-mixin';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin';
import CSSMixin from '../../../node_modules/backed/src/mixins/css-mixin';
import './wallet-address-name';
import './wallet-address-balance';
import './../../custom-copy';
/**
 *
 */
export default define(class WalletAddress extends CSSMixin(RenderMixin(PropertyMixin(HTMLElement))) {
  static get properties() {
    return merge(super.properties, {
      value: {
        value: null,
        observer: '__change__'
      },
      name: {
        value: null,
        observer: '__change__'
      }
    })
  }

  get _balanceEl() {
    return this.querySelector('wallet-address-balance');
  }

  get _nameEl() {
    return this.shadowRoot.querySelector('wallet-address-name');
  }

  get _copyEl() {
    return this.shadowRoot.querySelector('custom-copy');
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', 0);
  }

  __change__() {
    if (this.rendered) {
      if (this._balanceEl) this._balanceEl.address = this.value;
      if (this._nameEl) this._nameEl.value = this.name.toString();
      this._copyEl.innerHTML = `<span>${this.value}</span>`;
    } else {
      requestAnimationFrame(() => {
        this.__change__()
      })
    }
  }

  get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          width: 100%;
          height: 48px;
          padding: 8px 16px;
          box-sizing: border-box;
          /* pointer-events: none; */
          user-select: none;
          outline-style: none;
        }
        ::selection {
          background: #eee;
        }
        apply(--css-flex)
        apply(--css-flex-3)
      </style>
      <wallet-address-name></wallet-address-name>
      <span class="flex"></span>
      <custom-copy></custom-copy>
      <span class="flex-3"></span>
      <slot></slot>
    `;
  }
});
