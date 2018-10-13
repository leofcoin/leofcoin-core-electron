const section = appUtils.newSection('explorer');
const lastBlocks = section.$('.last-blocks');

export const explore = blockHeight => {
  console.log(window.chain[blockHeight].hash);
  location.hash = `explorer/block/${blockHeight}`;
}
window.explore = explore;

const newLastBlock = index => {
  const span = document.createElement('span');
  span.classList.add('last-blocks-item');
  span.setAttribute('index', index);
  lastBlocks.appendChild(span)
  return span;
}
export const renderLastBlocks = blocks => {
  for (const block of blocks) {
    const blockEl = lastBlocks.querySelector(`[index="${block.index}"]`) || newLastBlock();
    const age = block.time;
    blockEl.classList.add('last-block')
    blockEl.style = "padding: 8px 16px;box-sizing: border-box;";
    blockEl.innerHTML = `
      <span class="index" onclick="explore(${block.index})" style="color: rgba(28, 167, 191, 0.92);cursor: pointer;padding: 8px;box-sizing: border-box;">${block.index}</span>
      <span class="flex"></span>
      <span>${age}</span>
      <span class="flex"></span>
      <span>${block.transactions.length}</span>`;

  }
}


// window.clientSocket.on('chain.last', blocks => renderLastBlocks(blocks))
// clientSocket.send('chain.last', {count: 10})
export const getChain = async () => {
  let response;
  try {
    // response = await fetch('http://localhost:5555/core/dagchain');
    // const dagchain = await response.json();
    response = await fetch('http://localhost:5005/core/chain');
    window.chain = await response.json();
    const lastBlocks = [];
    for (var i = window.chain.length - 1; i >= 0; --i) {
      // get last 10 blocks
      if (i > (window.chain.length - 1) - 10) {
        console.log(chain[i]);
        lastBlocks.push(chain[i]);
      }
    }

    renderLastBlocks(lastBlocks);

  } catch (error) {
    console.error(error);
  }
}

getChain();
