const section = appUtils.newSection('terminal', false);
import { Terminal } from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(winptyCompat);

export const xterm = (() => new Terminal({cursorBlink: true}))();  // Instantiate the terminal

export default (() => {
  xterm.open(section.querySelector('#terminal-container'));
  xterm.winptyCompatInit();
  xterm.webLinksInit();
  xterm.fit();
  xterm.focus();

  xterm.writeln('terminal activated');

  window.xterm = xterm;
})()
