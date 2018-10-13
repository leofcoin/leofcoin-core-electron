import define from '../../node_modules/backed/src/utils/define.js';
import merge from '../../node_modules/backed/src/utils/merge.js';
import RenderMixin from '../../node_modules/custom-renderer-mixin/src/render-mixin';
import PropertyMixin from '../../node_modules/backed/src/mixins/property-mixin'

export default define(class ExplorerBlock extends RenderMixin(PropertyMixin(HTMLElement)) {
  static get properties() {
    return merge(super.properties, {
      index: {
        // observer: 'ob'
        value: '__'
      },
      prevHash: {
        // observer: 'ob'
        value: '__'
      },
      hash: {
        // observer: 'ob'
        value: '__'
      },
      time: {
        // observer: 'ob'
        value: '__'
      },
      transactionVolume: {
        // observer: 'ob'
        value: '__'
      },
      outputAmount: {
        // observer: 'ob'
        value: '__'
      },
      nextHash: {
        // observer: 'ob'
        value: '__'
      },
      difficulty: {
        // observer: 'ob'
        value: '__'
      },
      date: {
        value: ''
      },
      blockReward: {
        value: 0
      }
    })
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }
  /**
   * @param {object} block {index, prevHash, hash, transactions, time}
   */
  stamp(block, next) {
    // TODO: block reward
    Object.keys(block).forEach(property => {
      this[property] = block[property]
    });
    if (next) this.nextHash = next.hash;
    else {
      // TODO: improve timeTillNextBlock
      let timeTillNextBlock = 10;
      setInterval(() => {
        timeTillNextBlock--;

        this.nextHash = `approximate time till next block ${timeTillNextBlock}s`;
      }, 1000);
    }
    this.date = new Date(this.time * 1000)
    this.inputs = this.transactions.reduce((inputs, tx) => inputs.concat(tx.inputs), []);

  	// Find all outputs with their tx ids
  	this.outputs = this.transactions.reduce((outputs, tx) =>
  		outputs.concat(tx.outputs.map(output => Object.assign({}, output, {tx: tx.id}))), []);

  	// Figure out which outputs are unspent
  	this.unspent = this.outputs.filter(output =>
  		typeof this.inputs.find(input => input.tx === output.tx && input.index === output.index && input.amount === output.amount) === 'undefined');

    this.outputAmount = this.outputs.reduce((amount, o) => amount + o.amount, 0);
    this.transactionVolume = String(this.outputAmount - this.unspent.reduce((amount, o) => Number(amount) + o.amount, 0));

    const getDifficulty = hash => {
    	return parseInt(hash.substring(0, 8), 16);
    };
    this.difficulty = getDifficulty(block.hash)

    this.blockReward = this.transactions.reduce((p, tx) => {
      if (tx.reward) return tx.outputs[0].amount;
      else return p;
    }, 0)
    // this.totalAmount = this.outputs.reduce((amount, output) => {return amount + output.amount}, 0);
    // console.log(this.totalAmount);
    // console.log(this.transactions);
    // this.render()
    const o = {};
    Object.keys(this.properties).forEach(k => o[k] = this[k] || '')
    this.shadowRoot.innerHTML = this.template(o).template
  }
  get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-y: auto;
          /* color: #555; */
          cursor: default;
        }
        summary {
          line-height: 24px;
          font-family: 'ROBOTO-LIGHT', sans-serif;
          font-size: 15px;
          text-rendering: optimizeLegibility;
          box-shadow: var(--shadow-elevation-2dp);
          margin-bottom: 24px;
          width: 760px;
        }
        .flex {
          flex: 1;
        }
        .flex-2 {
          flex: 2;
        }
        .flex-3 {
          flex: 3;
        }
        .ti {
          display: flex;
          padding: 8px 16px;
          box-sizing: border-box;
        }
        summary .ti:nth-of-type(odd) {
          background: #eee;
        }
        h4, h3, p {
          margin: 0;
        }
        h3, h4 {
          padding: 8px 16px 12px 16px;
          width: 760px;
          box-sizing: border-box;
        }
        ::slotted(header) {
          height: 32px;
        }
        .row, .vertical {
          display: flex;
        }
        .vertical {
          flex-direction: column;
        }
        .row {
          flex-direction: row;
        }
      </style>
      <slot name="toolbar"></slot>
      <h3>block #${'index'}</h3>

      <summary class="info">
        <p class="ti"><strong>time</strong><span class="flex"></span>${'date'}</p>
        ${this.transactions ? `<p class="ti"><strong>transactions</strong><span class="flex"></span>${this.transactions.length}</p>` : ''}
        <p class="ti"><strong>transaction output</strong><span class="flex"></span>${'outputAmount'} LFC</p>
        <p class="ti"><strong>transaction output volume</strong><span class="flex"></span>${'transactionVolume'} LFC</p>
        <p class="ti"><strong>Fees</strong><span class="flex"></span>0 LFC</p>
        <p class="ti"><strong>difficulty</strong><span class="flex"></span>${'difficulty'}</p>
        <p class="ti"><strong>block size</strong><span class="flex"></span>${'blockSize'}</p>
        <p class="ti"><strong>block reward</strong><span class="flex"></span>${'blockReward'} LFC</p>
      </summary>

      <h4>hashes</h4>
      <summary class="hashes">
        <p class="ti"><strong>hash</strong><span class="flex"></span>${'hash'}</p>
        <p class="ti"><strong>previous</strong><span class="flex"></span>${'prevHash'}</p>
        <p class="ti"><strong>next</strong><span class="flex"></span>${'nextHash'}</p>
      </summary>

      <h4>transactions</h4>
      <summary class="transactions">
        ${this.transactions ? this.transactions.map(tx => {
          if (tx.reward) return `

            <span class="ti vertical">
              <span class="row">
                <strong>ID</strong>
                <span class="flex"></span>
                <span class="id">${tx.id}</span>
              </span>
              <span class="row">
                No Inputs(new mined coins)
                <span class="flex-3"></span>
                &#x21E8;
                <span class="flex-3"></span>
                <a>${tx.outputs[0].address}</a>
                <span class="flex"></span>
                <p><strong>${tx.outputs[0].amount}</strong> LFC</p>
              </span>
            </span>`;

          else return `
          <span class="ti vertical">
            <span class="row">
              <strong>ID</strong>
              <span class="flex"></span>
              <span class="id">${tx.id}</span>
            </span>
            <span class="row">
            ${tx.inputs.map(i => `
              <a>${i.address}</a>
            `)}
            <span class="flex-3"></span>
            &#x21E8;
            <span class="flex-3"></span>
              <span class="vertical">
              ${tx.outputs.map(o => `
                <span class="row">
                  <a>${o.address}</a>
                  <span class="flex"></span>
                  <p><strong>${o.amount}</strong> LFC</p>
                </span>
              `)}
              </span>
            </span>
          </span>
          `
        }) : ''}
      </summary>
    `;
  }
});
