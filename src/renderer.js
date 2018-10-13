import './../node_modules/custom-pages/src/custom-pages';
import './ux/splash-screen';
import './ux/state-bar';
import './explorer/explorer-block';
import './ui/extended-fab';

import socketRequestClient from '../node_modules/socket-request-client/src/index';

(async () => {
  const client = await socketRequestClient(6000, 'echo-protocol');

  client.request({url: 'accounts'}, response => {
    console.log(response);
  })
})()

const { ipcRenderer } = require('electron');
const query = []
const _write = data => {
  data.forEach(key => {
    writeLines(data[key], key);
    delete data[key];
  });
  return data;
}
const writeLines = (data, key) => {
  let keys;
  if (typeof data === 'object') {
    if (!Array.isArray(data)) keys = Object.keys(data);
    else keys = data;
    keys.forEach(key => {
      writeLines(data[key], key);
    });
  } else {
    if (key) {
      xterm.write(key);
    }
    xterm.writeln(data);
  };
}
ipcRenderer.on('message', (event, data) => {
  if (window.xterm) {
    if (query.length > 0) {
      writeLines(query);
      query.length = 0
    }
    writeLines(data);
  } else {
    if (typeof data === 'object') {
      query.push(JSON.parse(data));
    } else {
      query.push(data);
    }

  }
})

document.addEventListener('custom-copy', detail => {
  clipboard.writeText()
})
