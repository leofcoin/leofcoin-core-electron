import RenderMixin from '../../node_modules/custom-renderer-mixin/src/render-mixin.js';
import PropertyMixin from '../../node_modules/backed/src/mixins/property-mixin.js';
import merge from '../../node_modules/backed/src/utils/merge.js';
export default customElements.define('state-bar', class StateBar extends RenderMixin(PropertyMixin(HTMLElement)) {

   static get properties() {
    return merge(super.properties, {
      // peers: {
      //   value: '0'
      // }
    })
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.innerHTML = this.template({peers: 0}).template;
    clientSocket.on({type: 'network', name: 'peer-added'}, peer => {
      this.peers++;
      this.shadowRoot.innerHTML = this.template({peers: this.peers}).template;
    });

    clientSocket.on({type: 'network', name: 'peer-removed'}, peer => {
      this.peers--;
      this.shadowRoot.innerHTML = this.template({peers: this.peers}).template;
    });
  }

  get template() {
    return html`
      <style>
        :host {
          display: flex;
          height: 48px;
          width: 100%;
          padding: 6px 12px;
          align-items: baseline;
          box-sizing: border-box;
        }
        .miner-status {
          background: red;
          color: #fff;
          padding: 0.6em 0.8em;
          box-sizing: border-box;
        }
        h4 {
          margin: 0;
        }
      </style>
      <h4>Peers</h4><span>${'peers'}</span>
    `
  }
})
