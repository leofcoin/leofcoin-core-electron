import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../../node_modules/custom-renderer-mixin/src/render-mixin.js';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin'
import CSSMixin from '../../../node_modules/backed/src/mixins/css-mixin';

// TODO: dynamic imports ...
import loadWallet from './wallet-loader';
import api from '../../api';
import './wallet-addresses';
import './wallet-transactions';
import './wallet-name-input';
import './wallet-send';
import '../../nav-bar'
import '../../custom-fab';

import socketRequestClient from '../../../node_modules/socket-request-client/src/index';

export default define(class WalletSection extends CSSMixin(RenderMixin(PropertyMixin(HTMLElement))) {
  static get properties() {
    return merge(super.properties, { addresses: {} })
  }

  get _addressesEl() {
    return this.shadowRoot.querySelector('wallet-addresses');
  }

  get pages() {
    return this.shadowRoot.querySelector('custom-pages');
  }

  get fab() {
    return this.shadowRoot.querySelector('custom-fab');
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }

  connectedCallback() {
    super.connectedCallback();
    (async () => {
      const client = await socketRequestClient(6000, 'echo-protocol');

      const accounts = await client.request({url: 'accounts'});
      let call = 0;
      this.addresses = accounts.map(acc => [call++, acc])
      window.addresses = this.addresses
      for (const address of this.addresses) {
        this._addressesEl.add(address);
      }
      document.dispatchEvent(new CustomEvent('wallet-loaded-data', {detail: this.addresses}))
    })()

    // document.addEventListener('wallet-loaded-data')
  }

  newAddress() {
    this._addressesEl.createNewAddress()
  }

  selectedChanged({detail}) {
    this.pages.selected = detail;
  }

  /**
   * @param {object} block {index, prevHash, hash, transactions, time}
   */
  stamp(block, next) {
  }

  get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-y: auto;
          font-size: 16px;
        }

        .title {
          font-weight: lighter;
          color: #5f5f5f;
          font-size: 20px;
        }
        .toolbar {
          display: flex;
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding-top: 2px;
          background: #3a5874;
          color: #eee;
          padding-right: 12px;
        }
        .back {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 24px;
          color: #eee;
          box-shadow: none;
        }


        .hero {
          display: flex;
          max-width: 600px;
          max-height: 340px;
          height: 100%;
          width: 100%;
          box-shadow: 3px 2px 4px 2px rgba(0,0,0, 0.15),
                      -2px 0px 4px 2px rgba(0,0,0, 0.15);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 2px;
        }
        .wallet-navigation .title {
          color: #eee;
          margin: 0;
        }
        strong {
          margin: 0;
        }

        .hidden {
          opacity: 0;
          pointer-events: 0;
          z-index: 0;
        }

        apply(--css-column)
        .flex {
          flex: 1;
        }
      </style>
      <div class="wallet-navigation toolbar">
        <nav-bar
          items='["wallet/addresses", "wallet/send", "wallet/transactions"]'
          attr-for-selected="data-route"
          on-selected="selectedChanged">
        </nav-bar>
        <span class="flex"></span>
        <span class="column">
          <h3 class="title">Total Balance</h3>
          <strong class="balance">0</strong>
        </span>
      </div>
      <custom-pages class="wallet hero" attr-for-selected="data-route">

        <wallet-addresses data-route="addresses" class="hero"></wallet-addresses>

        <wallet-send data-route="send" class="hero"></wallet-send>

        <wallet-transactions data-route="transactions" class="hero"></wallet-transactions>
      </custom-pages>
    `;
  }
});
