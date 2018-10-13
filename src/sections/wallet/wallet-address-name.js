import define from '../../../node_modules/backed/src/utils/define.js';
import merge from '../../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../../node_modules/custom-renderer-mixin/src/render-mixin';
import PropertyMixin from '../../../node_modules/backed/src/mixins/property-mixin';

/**
 *
 */
export default define(class WalletAddressName extends PropertyMixin(RenderMixin(HTMLElement)) {
  static get properties() {
    return merge(super.properties, {
      value: {
        reflect: true,
        value: '',
        observer: 'ob'
      }
    })
  }
  constructor() {
    super();
  }
  ob() {
        this.innerHTML = this.value
  }

  get template() {
    return html`
    <style>
      :host {
        display: block;
        width: 90px;
      }
    </style>
    <slot></slot>
    `
  }
});
