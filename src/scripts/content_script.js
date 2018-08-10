'use strict';

// connection with background script
let port = chrome.runtime.connect({name: 'ads-cs'});

//
port.onMessage.addListener(function (msg) {
    for (let prop in msg) {
        console.log(prop + ': ' + msg[prop]);
    }
    // port.disconnect();
    window.postMessage({type: 'ads-2', a: 'asdf'}, '*');
});

window.addEventListener('message', function (event) {
        console.log(event.data.type);

        // We only accept messages from ourselves
        if (event.source !== window)
            return;

        if (event.data.type && (event.data.type === 'ads-1')) {
            console.log('Content script received:');
            for(let prop in event.data){
                console.log(prop + ': ' + event.data[prop]);
            }

            port.postMessage(event.data);
        }

        // chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        //     console.log(response.farewell);
        // });

    },
    false
);