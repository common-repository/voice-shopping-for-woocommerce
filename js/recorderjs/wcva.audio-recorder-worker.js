// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                                ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

var wcvaRecLength = 0,
wcvaRecBuffersL   = [],
wcvaRecBuffersR   = [],
wcvaSampleRate;

this.onmessage = function (e) {
    switch (e.data.command) {
        case 'wcvaInit':
            wcvaInit(e.data.config);
            break;
        case 'wcvaRecord':
            wcvaRecord(e.data.buffer);
            break;
        case 'wcvaExportWAV':
            wcvaExportWAV(e.data.type);
            break;
        case 'wcvaExportMonoWAV':
            wcvaExportMonoWAV(e.data.type);
            break;
        case 'wcvaGetBuffers':
            wcvaGetBuffers();
            break;
        case 'wcvaClear':
            wcvaClear();
            break;
    }
};

function wcvaInit(config) {
    wcvaSampleRate = config.sampleRate;
}

function wcvaRecord(inputBuffer) {
    wcvaRecBuffersL.push(inputBuffer[0]);
    wcvaRecBuffersR.push(inputBuffer[1]);
    wcvaRecLength += inputBuffer[0].length;
}

function wcvaExportWAV(type) {
    let wcvaBufferL     = wcvaMergeBuffers(wcvaRecBuffersL, wcvaRecLength);
    let wcvaBufferR     = wcvaMergeBuffers(wcvaRecBuffersR, wcvaRecLength);
    let wcvaInterleaved = wcvaInterleave(wcvaBufferL, wcvaBufferR);
    let wcvaDataview    = wcvaEncodeWAV(wcvaInterleaved);
    let wcvaAudioBlob   = new Blob([wcvaDataview], { 'type': type });

    this.postMessage(wcvaAudioBlob);
}

function wcvaExportMonoWAV(type) {
    let wcvaBufferL   = wcvaMergeBuffers(wcvaRecBuffersL, wcvaRecLength);
    let wcvaDataview  = wcvaEncodeWAV(wcvaBufferL, true);
    let wcvaAudioBlob = new Blob([wcvaDataview], { 'type': type });

    this.postMessage(wcvaAudioBlob);
}

function wcvaGetBuffers() {
    let wcvaBuffers = [];
    wcvaBuffers.push(wcvaMergeBuffers(wcvaRecBuffersL, wcvaRecLength));
    wcvaBuffers.push(wcvaMergeBuffers(wcvaRecBuffersR, wcvaRecLength));
    this.postMessage(wcvaBuffers);
}

function wcvaClear() {
    wcvaRecLength   = 0;
    wcvaRecBuffersL = [];
    wcvaRecBuffersR = [];
}

function wcvaMergeBuffers(recBuffers, recLength) {
    let wcvaResult = new Float32Array(recLength);
    let wcvaOffset = 0;
    let wcvaRecBuffersLength = recBuffers.length;

    for (var i = 0; i < wcvaRecBuffersLength; i++) {
        wcvaResult.set(recBuffers[i], wcvaOffset);
        wcvaOffset += recBuffers[i].length;
    }
    return wcvaResult;
}

function wcvaInterleave(inputL, inputR) {
    var wcvaLength = inputL.length + inputR.length;
    var wcvaResult = new Float32Array(wcvaLength);

    var wcvaIndex = 0,
        wcvaInputIndex = 0;

    while (wcvaIndex < wcvaLength) {
        wcvaResult[wcvaIndex++] = inputL[wcvaInputIndex];
        wcvaResult[wcvaIndex++] = inputR[wcvaInputIndex];
        wcvaInputIndex++;
    }
    return wcvaResult;
}

function wcvaFloatTo16BitPCM(output, offset, input) {
    let wcvaInputLength = input.length;

    for (let i = 0; i < wcvaInputLength; i++ , offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function wcvaWriteString(view, offset, string) {
    let wcvaStringLength = string.length;
    
    for (var i = 0; i < wcvaStringLength; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function wcvaEncodeWAV(samples, mono) {
    let wcvaBuffer = new ArrayBuffer(44 + samples.length * 2);
    let wcvaView   = new DataView(wcvaBuffer);

    /* RIFF identifier */
    wcvaWriteString(wcvaView, 0, 'RIFF');
    /* file length */
    wcvaView.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    wcvaWriteString(wcvaView, 8, 'WAVE');
    /* format chunk identifier */
    wcvaWriteString(wcvaView, 12, 'fmt ');
    /* format chunk length */
    wcvaView.setUint32(16, 16, true);
    /* sample format (raw) */
    wcvaView.setUint16(20, 1, true);
    /* channel count */
    wcvaView.setUint16(22, mono ? 1 : 2, true);
    /* sample rate */
    wcvaView.setUint32(24, wcvaSampleRate, true);
    /* byte rate (sample rate * block align) */
    wcvaView.setUint32(28, wcvaSampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    wcvaView.setUint16(32, 4, true);
    /* bits per sample */
    wcvaView.setUint16(34, 16, true);
    /* data chunk identifier */
    wcvaWriteString(wcvaView, 36, 'data');
    /* data chunk length */
    wcvaView.setUint32(40, samples.length * 2, true);

    wcvaFloatTo16BitPCM(wcvaView, 44, samples);

    return wcvaView;
}
