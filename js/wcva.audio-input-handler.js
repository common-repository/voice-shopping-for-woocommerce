// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                             ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let wcvaAudioContext = null;
var wcvaAudioInput   = null,
wcvaRealAudioInput   = null,
wcvaInputPoint       = null,
wcvaAudioRecorder    = null;
var wcvaRecIndex     = 0;
var wcvaInitCB       = null;
let wcvaStream       = null;

/**
 * Function to initialize capture audio resources
 * 
 * @param { cb: function } A callback function
 */
function wcvaInitAudio(cb) {
    wcvaInitCB = cb;

    // Check when last service log was updated
    try {
        let wcvaLastUpdatedAtTimestamp = wcvaServiceLogs.updatedAt || null;

        if (!!wcvaLastUpdatedAtTimestamp) {
            wcvaLastUpdatedAtTimestamp = Number(wcvaLastUpdatedAtTimestamp);
            let currentUtcTimestamp = Math.round(new Date().getTime()/1000);

            // Add 24 hours to last updated timestamp
            wcvaLastUpdatedAtTimestamp = wcvaLastUpdatedAtTimestamp + (24 * 3600);

            // Check if last service call log update was older than 24 hours
            if (currentUtcTimestamp >= wcvaLastUpdatedAtTimestamp) {
                // Log service call count                
                wcvaLogServiceCall(1);
            }
        }
    } catch (err) {
        // do nothing for now
    }

    wcvaAudioContext = new AudioContext();
    navigator.mediaDevices.getUserMedia({ "audio": !0 })
        .then(wcvaGotStream)
        .catch(function (e) {
            //alert('Error getting audio');
            console.log(e);
        }
    );
}

/**
 * A callback function to obtain audio stream
 * 
 * @param { stream: MediaStream } An audio track 
 */
function wcvaGotStream(stream) {
    wcvaInputPoint = wcvaAudioContext.createGain();
    wcvaStream = stream;

    // Create an AudioNode from the stream.
    wcvaRealAudioInput = wcvaAudioContext.createMediaStreamSource(stream);
    wcvaAudioInput     = wcvaRealAudioInput;
    wcvaAudioInput.connect(wcvaInputPoint);
    
    wcvaAudioRecorder = new Recorder(wcvaInputPoint);
    wcvaInitCB(wcvaAudioRecorder);
}

/**
 * A callback function to obtain audio stream
 * 
 * @param { buffers: Blob Object }
 * @param { cb: function } A callback function
 */
function wcvaGotBuffers(buffers, cb) {
    wcvaAudioRecorder.exportWAV(cb);
}

/**
 * Function to stop accessing audio resource
 *
 */
function wcvaStopAudio() {
    try {
        wcvaStream.getTracks().forEach(function (track) {
            track.stop();
        });

        wcvaAudioContext.close();    
        wcvaAudioContext = null;
    } catch(err) {
        console.log('WCVA Exception: Unable to release audio resource due to: ' + err.message);
    }
}