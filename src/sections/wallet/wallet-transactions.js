import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../../node_modules/custom-renderer-mixin/src/render-mixin';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin';
import CSSMixin from '../../../node_modules/backed/src/mixins/css-mixin';
import socketRequestClient from '../../../node_modules/socket-request-client/src/index';

export default define(class WalletTransactions extends CSSMixin(RenderMixin(PropertyMixin(HTMLElement))) {
  static get properties() {
    return merge(super.properties, {})
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }
  connectedCallback() {
    super.connectedCallback();
    // this.client = await socketRequestClient(6000, 'echo-protocol');

    // this.client.on('wallet/transactions', transactions => {
    // // this.render();
    // });
    // this.client.send({ url: 'wallet/transactions' params: {
    //   address:
    // }})

  }
  get template() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }
      apply(--css-row)
      apply(--css-flex)
      apply(--css-flex-2)
    </style>
    `;
  }
});
