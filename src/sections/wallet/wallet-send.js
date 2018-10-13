import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin';
import CSSMixin from '../../../node_modules/backed/src/mixins/css-mixin';
import RenderMixin from '../../../node_modules/custom-renderer-mixin/src/render-mixin';
import '../../../node_modules/custom-button/custom-button'
import socketRequestClient from '../../../node_modules/socket-request-client/src/index';

export default define(class WalletSend extends RenderMixin(CSSMixin(PropertyMixin(HTMLElement))) {
  static get properties() {
    return merge(super.properties, {})
  }

  set paywith(value) {
    this.shadowRoot.querySelector('#paywith').value = value
  }

  set payto(value) {
    this.shadowRoot.querySelector('#payto').value = value
  }

  set amount(value) {
    this.shadowRoot.querySelector('#amount').value = value
  }

  get paywith() {
    return this.shadowRoot.querySelector('#paywith').value
  }

  get payto() {
    return this.shadowRoot.querySelector('#payto').value
  }

  get amount() {
    return this.shadowRoot.querySelector('#amount').value
  }
  constructor() {
    super();
    this.send = this.send.bind(this)
    this.cancel = this.cancel.bind(this)
    this.attachShadow({mode: 'open'})
  }

  connectedCallback(){
    super.connectedCallback()
    this.shadowRoot.querySelector('.send-button').addEventListener('click', this.send)
    this.shadowRoot.querySelector('.cancel-button').addEventListener('click', this.cancel)
  }

  cancel() {
    this.paywith = null;
    this.payto = null;
    this.amount = null;
  }

  async validate(paywith, payto, amount) {
    if (!paywith || !payto || !amount) throw Error('Are you sure you filled in everything?')
    // when paywith address lenght is lower than or same as 24
    // we assume its an address name
    if (paywith.length < 24) {
      for (const addr of addresses) {
        if (addr[0] === paywith) {
          paywith = addr[1]
        }
      }
    }
    if (paywith.length < 34 || payto.length < 34) throw Error('invalid address')
    return {paywith, payto, amount};
  }

  async send() {
    if (this.paywith && this.payto && this.amount) {
      // TODO: push result to mempool
      try {
        const result = await this.validate(this.paywith, this.payto, this.amount)
        const client = await socketRequestClient(6000, 'echo-protocol');
        const response = await client.request({url: 'send', params: {
          to: this.payto,
          from: this.paywith,
          amount: this.amount,
          message: this.message
        }})
      } catch (e) {
        alert(e.message)
      }
      return;
    }
    alert('Are you sure you filled in everything?');
  }

  get template() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }

      label {
        padding-right: 12px;
        margin: 0;
      }

      .send {
        padding: 2em;
      }

      .cancel-button {
        --custom-button-color: #555;
        background: #ef9a9a;
      }

      .send-button {
        --custom-button-color: #555;
        background: #c5e1a5;
      }
      input {
        /* padding: 0.6em; */
        border: none;
        border-bottom: 1px solid #eee;
        outline: none;
      }
      .item {
        mixin(--css-row)
        align-items: flex-end;
        box-sizing: border-box;
        padding: 8px 16px;
      }

      h3 {
        margin: 0;
      }
      apply(--css-row)
      apply(--css-flex)
      apply(--css-flex-2)
    </style>
    <h3 class="item">Pay</h3>
    <span class="item">
      <label for="paywith">with</label>
      <input id="paywith" type="text" value="main" autocomplete="on"></input>
    </span>
    <span class="item">
      <label for="payto">to</label>
      <input id="payto" type="text" autocomplete="on"></input>
    </span>
    <span class="item">
      <label for="amount">Amount</label>
      <input id="amount" type="number" autocomplete="off"></input>
    </span>
    <span class="flex"></span>
    <span class="item">
      <label for="statement">Statement (optional)</label>
      <input id="statement" type="text"></input>
    </span>
    <span class="flex-2"></span>
    <span class="row">
      <custom-button class="cancel-button">cancel</custom-button>
      <span class="flex"></span>
      <custom-button class="send-button">send</custom-button>
    </span>
    `;
  }
});
