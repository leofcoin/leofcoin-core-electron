
const section = appUtils.newSection('miner');
const hashrate = section.querySelector('.hashrate');
const address = section.querySelector('.address');
const intensity = section.querySelector('.intensity');
const afterIntensity = intensity.parentNode.insertBefore(document.createElement('span'), intensity);
const mineButton = section.querySelector('.mine-button');

const newHashrateElement = uid => {
  const el = document.createElement('span')
  el.setAttribute('uid', uid);
  hashrate.appendChild(el);
  return el;
}

const hashrateChange = ({hashrate, uid}) => {
  const hashrateElement = section.querySelector(`[uid="${uid}"]`) || newHashrateElement(uid)
  hashrateElement.innerHTML = `${hashrate} kH/s`;
};

const jobCancelled = uid => {
  const el = section.querySelector(`[uid="${uid}"]`)
  if (el) hashrate.removeChild(el);
}

clientSocket.on({type: 'miner', name: 'hashrate'}, hashrateChange);

clientSocket.on({type: 'miner', name: 'job-cancelled'}, jobCancelled);

// document.addEventListener('hashrate', hashrateChange);
// document.addEventListener('job-cancelled', jobCancelled);

clientSocket.on({type: 'status', name: 'mining'}, mining => {
  if (mining) {
    mineButton.icon = 'stop';
    mineButton.label = 'Stop Mining';
    mineButton.style.background = '#ffa7a7';
    section.setAttribute('mining', '');
  } else {
    mineButton.icon = 'play';
    mineButton.label = 'Start Mining';
    mineButton.style.background = 'transparent';
    section.removeAttribute('mining');
  }
});

clientSocket.send({type: 'status', name: 'mining'});
(async () => {

  const config = await clientSocket.request({type: 'miner', name: 'config'});

  const mine = event => {
    const mining = section.hasAttribute('mining');
    clientSocket.send({type: 'miner', name: 'mine', params: {mining: !mining, intensity: config.intensity, address: config.address}});
  }
  address.innerHTML = config.address;
  intensity.value = config.intensity;
  afterIntensity.innerHTML = intensity.value;
  // TODO: add max intensity so we dont mine duplicate blocks
  intensity.addEventListener('change', event => {
    config.intensity = intensity.value;
    afterIntensity.innerHTML = intensity.value;
    if (section.hasAttribute('mining')) window.clientSocket.send({type: 'miner', name: 'mine', params: {mining: true, intensity: config.intensity, address: config.address}});
  });


  mineButton.addEventListener('click', mine);
})()
