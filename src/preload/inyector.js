// inyector.js
// Get the ipcRenderer of electron
const { ipcRenderer } = require('electron');
const customcrypto = require('./customcrypto');

// Do something according to a request of your mainview
ipcRenderer.on('request', function(){
    ipcRenderer.sendToHost(getScripts());
});

// Example of alert
ipcRenderer.on("alert-something",function(event,data){
    alert(data);
});

// Example to change element value
ipcRenderer.on("change-text-element",function(event,data){
    // the document references to the document of the <webview>
    document.getElementById(data.id).innerHTML = data.text;
});

ipcRenderer.on("run-proc", async function(event, data) {
  // Write Procedure
  let procArr = customcrypto.decrypt(data);

  for(let proc of procArr){
    console.log(`proc: ${proc.type}`);
    let event = events[proc.type];
    await event(proc);
  }
});

/**
 * Procedure Events
 */
const events = {
  async write (proc){
    let obj = document.querySelector(proc.selector);
    if(!obj) {
      console.log('Error in write proc: Element not found');
      return;
    }
    obj.value = proc.content;
    return;
  },
  timeout(proc){
    return new Promise(resolve => setTimeout(resolve, parseInt(proc.content)));
  },
  async click(proc){
    let obj = document.querySelector(proc.selector);
    if(!obj) {
      console.log('Error in write proc: Element not found');
      return;
    }
    obj.click();
    return;
  }
}

/**
 * Simple function to return the source path of all the scripts in the document
 * of the <webview>
 *
 *@returns {String}
 **/
function getScripts(){
  var items = [];

  for(var i = 0;i < document.scripts.length;i++){
      items.push(document.scripts[i].src);
  }

  return JSON.stringify(items);
}