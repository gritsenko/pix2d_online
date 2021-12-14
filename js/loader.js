import { BrotliDecode } from './decode.min.js';

const progressText = document.getElementById("progress-text");

Blazor.start({
    loadBootResource: function (type, name, defaultUri, integrity) {
        console.log("### " + name);
        if (progressText !== null) {
            progressText.innerText = `Loading: ${name}`;
        }
        if (type !== 'dotnetjs' && location.hostname !== 'localhost') {
            return (async function () {
                const response = await fetch(defaultUri + '.br', { cache: 'no-cache' });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const originalResponseBuffer = await response.arrayBuffer();
                const originalResponseArray = new Int8Array(originalResponseBuffer);
                const decompressedResponseArray = BrotliDecode(originalResponseArray);
                const contentType = type ===
                    'dotnetwasm' ? 'application/wasm' : 'application/octet-stream';
                return new Response(decompressedResponseArray,
                    { headers: { 'content-type': contentType } });
            })();
        }
    }
}).then(function () {
    console.log("App Loaded");
});

const progressBar = document.getElementById("progress-value");

let progress = 0;
let maxProgress = 100;
const timer = setInterval(() => {
    const d = (maxProgress - progress) / 10;
    progress = Math.ceil(progress + d);

    if (progressBar !== null) {
        progressBar.style.width = progress + "px";
    }
    console.log(progress);
},
    100);

window.hideSplash = () => {

    clearInterval(timer);

    const splash = document.getElementById("splash");
    if (splash !== undefined && splash !== null)
        splash.parentNode.removeChild(splash);
}