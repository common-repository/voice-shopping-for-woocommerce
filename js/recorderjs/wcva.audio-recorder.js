// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                                ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

(function (window) {
    var WCVA_WORKER_PATH = wcvaWorkerPath;

    var wcvaRecorder  = function (source, cfg) {
        var config    = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context  = source.context;

        // Create AnalyserNode to get real time frequencies
        var wcvaAnalyserNode = source.context.createAnalyser();
        source.connect(wcvaAnalyserNode);
        wcvaAnalyserNode.fftSize = 2048; 

        let lastLowFilterValue  = null;
        let lowFilterValue      = null;
        let minFilterValue      = null;
        let maxFilterValue      = null;
        let reachedHigh         = false;
        let highFreqCount       = 0;
        let lowFreqCount        = 0;
        let wcvaMicButtonElInCtx = null;
        let wcvaMicInputTagName = '';
        let wcvaLowFreqCnt = 17;

        
        if (!this.context.createScriptProcessor) {
            this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        } else {
            this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

        var worker = new Worker(config.workerPath || WCVA_WORKER_PATH);
        worker.postMessage({ 'command': 'wcvaInit', 'config': { 'sampleRate': this.context.sampleRate }});
        
        var recording = false,
        currCallback;

        // A reducer function to get sum of array elements/set
        function wcvaAdd(accumulator, a) { return accumulator + a; }
        
        // A function to calculate low pass filter value
        function wcvaLowPassFilter (lastFilterValue, rawFreqValue){
            if(lastFilterValue == null) { return rawFreqValue; }

            let x = (lastFilterValue * 4 + rawFreqValue) / 5;
            return x;
        }

        // A click handler to dispatch click on mic button being used to record an audio. 
        function wcvaMicButtonClickHandler() { 
            try {
                if (typeof(wcvaMicButtonElInCtx) != 'undefined' && wcvaMicButtonElInCtx !== null) {
                    var wcvaMicClassList = wcvaMicButtonElInCtx.className || '';

                    if (wcvaMicClassList.indexOf('listening') != -1) {
                        wcvaMicButtonElInCtx.click(); 
                    }
                }
            } catch (err) {
                console.log('WCVA Error: Unable to reset Mic button.')
            }
        }

        this.node.onaudioprocess = function (e) {
            if (!recording) { return; }

            if (wcvaMicInputTagName.toLowerCase() == 'textarea') {
                wcvaLowFreqCnt = 40;
            }

            var wcvaAudioData = new Uint8Array(wcvaAnalyserNode.frequencyBinCount);
            wcvaAnalyserNode.getByteFrequencyData(wcvaAudioData);

            //FIRST WE NEED TO ADD UP ALL FREQUENCIES TO GET THE TOTAL VOLUME
            var currentVol = 0;
            let wcvaAudioDataLength = wcvaAudioData.length;

            for (let i = 0; i < wcvaAudioDataLength; i++) {
                currentVol = currentVol + wcvaAudioData[i];
            }

            lowFilterValue = wcvaLowPassFilter(lowFilterValue, currentVol);
            lowFilterValue = parseInt(lowFilterValue);

            // Hold on minimum filter value
            if (minFilterValue == null) {
                minFilterValue = lowFilterValue;
            } else if (lowFilterValue < minFilterValue) {
                minFilterValue = lowFilterValue;
            }

            // Hold on maximum filter value
            if (maxFilterValue == null) {
                maxFilterValue = lowFilterValue;
            } else if (lowFilterValue > maxFilterValue) {
                maxFilterValue = lowFilterValue;

                if (maxFilterValue > 2 * minFilterValue) { reachedHigh = true; }
            }

            // Count consectuive count's up and down
            if ((lastLowFilterValue + 10) < lowFilterValue) {
                lowFreqCount = 0;
                highFreqCount = highFreqCount + 1;
            }

            if ((lastLowFilterValue - 10) > lowFilterValue) {
                highFreqCount = 0;
                lowFreqCount = lowFreqCount + 1;
            }

            lastLowFilterValue = lowFilterValue;

            // End mic recording 
            if (lowFreqCount > wcvaLowFreqCnt && reachedHigh ) { wcvaMicButtonClickHandler(); }

            worker.postMessage({
                'command': 'wcvaRecord',
                'buffer': [
                    e.inputBuffer.getChannelData(0),
                    e.inputBuffer.getChannelData(1)
                ]
            });
        }

        this.configure = function (cfg) {
            for (var prop in cfg) {
                if (cfg.hasOwnProperty(prop)) {
                    config[prop] = cfg[prop];
                }
            }
        }

        this.record = function (micButtonEl = null, micTagName = '') {           
            recording = true;
            wcvaMicButtonElInCtx = micButtonEl;
            wcvaMicInputTagName = micTagName;
        }

        this.stop = function () {
            recording          = false;
            lastLowFilterValue = null;
            highFreqCount      = 0;
            lowFreqCount       = 0;
            lowFilterValue     = null;
            minFilterValue     = null;
            maxFilterValue     = null;
            reachedHigh        = false;
        }

        this.clear = function () {
            wcvaMicButtonInCtx = null;
            wcvaMicInputTagName = null;
            worker.postMessage({ 'command': 'wcvaClear' });
        }

        this.getBuffers = function (cb) {
            //  alert("getBuffers");
            currCallback = cb || config.callback;
            worker.postMessage({ 'command': 'wcvaGetBuffers' })
        }

        this.exportWAV = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';

            if (!currCallback) throw new Error('Callback not set');

            worker.postMessage({
                'command': 'wcvaExportWAV',
                'type': type
            });
        }

        this.exportMonoWAV = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';

            if (!currCallback) throw new Error('Callback not set');

            worker.postMessage({
                'command': 'wcvaExportMonoWAV',
                'type': type
            });
        }

        this.convertBlobToBase64 = function(blobObj) {
            return new Promise(function(resolve, reject){
                if (!(typeof blobObj != 'undefined' && !!blobObj && blobObj instanceof Blob)) {
                    reject(null);
                    return;
                }

                let reader = new FileReader();
                reader.readAsDataURL(blobObj); 
                
                reader.onload = function() {
                    let base64data = reader.result;

                    if (typeof base64data != 'undefined' && !!base64data && base64data.indexOf(',') !== -1) {
                        resolve(base64data.split(',')[1]);
                    } else {
                        reject(null);
                    }
                }

                reader.onerror = function(event) {
                    reader.abort();
                };

                reader.onabort = function() {
                    reject(null);
                }
            });
        }


        worker.onmessage = function (e) {
            var blob = e.data;
            currCallback(blob);
        }

        wcvaAnalyserNode.connect(this.node);

        // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
        this.node.connect(this.context.destination);
    };
  
    window.Recorder = wcvaRecorder;
})(window);
