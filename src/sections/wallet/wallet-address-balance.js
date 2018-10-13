import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin';
import api from '../../api';
import '../../animations/busy';

export default define(class WalletAddressBalance extends PropertyMixin(HTMLElement) {

  static get properties() {
    return merge(super.properties, {
        address: {
          reflect: true,
          observer: '__addressChange__'
        },
        balance: {
          value: '0'
        }
      })
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: flex-end;
          width: 78px;
          height: 20px;
        }
        p {
          margin: 0;
        }
      </style>
      <busy-animation></busy-animation>
    `;
  }

  async __addressChange__() {
    console.log(this.address);
    if (this.address) {
      this.balance = await api().getBalance(this.address);
      const p = document.createElement('p');
      p.innerHTML = this.balance.toString();
      this.shadowRoot.appendChild(p)
      this.shadowRoot.removeChild(this.shadowRoot.querySelector('busy-animation'))

    }
  }


})
