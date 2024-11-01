// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                             ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

window.addEventListener('load', function() {
    /**
     * Play any pending playbacks from local stroge and refresh 'context' and 'status'
     *
     */
    let wcvaPendingPlaybackPath = localStorage.getItem('wcvaPendingPlaybackPath');

    if (wcvaPendingPlaybackPath != null) {
        localStorage.setItem('wcvaPendingPlaybackPath', "");

        // Play pending playback
        if (typeof wcvaPendingPlaybackPath != 'undefined' && wcvaPendingPlaybackPath) {
            wcvaIntentResponsePlayer.configure(wcvaPendingPlaybackPath);
            wcvaIntentResponsePlayer.play();
        }
    }

    let wcvaApiCtx = localStorage.getItem('wcvaCtx');

    if (wcvaApiCtx != null) {
        wcvaMyContext = JSON.parse(wcvaApiCtx);
        localStorage.setItem('wcvaCtx', "{}");
    }

    let wcvaStatus = localStorage.getItem('wcvaStat');

    if (wcvaStatus != null) {
        wcvaMyStatus = JSON.parse(wcvaStatus);
        localStorage.setItem('wcvaStat', "{}");
    }
});

// Cross browser 'trim()' function support
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

var wcvaRespTimeOut = false;
var wcvaErrcnt      = 0;
var wcvaMyStatus    = {};
var wcvaMyContext   = {};
var wcvaWin1        = -1;
var wcvaWin2        = -1;
var wcvaIsTalking   = false;

// For Google Analytics configuration detection
var wcvaIsGtmPresent = false;
let wcvaGtagConfigCount = 0;
let wcvaGaConfiguredForGtag = false;
let wcvaGoogleAnalyticsTrackingId = typeof wcva.wcvaGaTrackingId != 'undefined' ? wcva.wcvaGaTrackingId : null;

// Get Google Analytics Tracking id
if (typeof wcva.wcvaGaTrack != 'undefined' && wcva.wcvaGaTrack == 'yes') {
    try {
        // Obtain Google analytics tracking id with 'readycallback'
        if (typeof ga === 'function' && !wcvaGoogleAnalyticsTrackingId) {
            ga(function(){
                wcvaGoogleAnalyticsTrackingId = ga.getAll()[0].get('trackingId');
            });
        }

        if (typeof window.dataLayer != 'undefined') {
            let wcvaDataLayerLength = window.dataLayer.length;

            for (let i = 0; i < wcvaDataLayerLength; i++) {
                let dlValue = window.dataLayer[i];

                // To detect Google Tag Manager being used
                if(typeof dlValue.event != 'undefined' && dlValue.event === "gtm.js") {
                    wcvaIsGtmPresent = true;
                    break;
                }

                if (typeof dlValue !== 'object') continue;

                let valuesArr = Object.values(dlValue);

                // To detect 'gtag' command queue configuration for Google Analytics
                valuesArr.forEach(function(item, index){
                    // Check for number of Google product configurations
                    if (item === 'config') {
                        wcvaGtagConfigCount = wcvaGtagConfigCount + 1;
                    }

                    // check for Google Analytics tracking id
                    if (typeof item.indexOf != 'undefined' && item.indexOf('UA-') !== -1) {
                        wcvaGaConfiguredForGtag = true;
                    }
                });
            }
        }
    } catch(err) {
        console.log('WCVA Google Analytics support detection error: ' + err.message);
        wcvaGtagConfigCount = 0;
        wcvaGaConfiguredForGtag = false;
        wcvaGoogleAnalyticsTrackingId = null;
    }
}

// Auto timeout duration to stop mic response color
var wcvaBotResponseTimeoutDuration = null;

if (typeof (wcva.wcvaBotResponseTimeout) != 'undefined' && wcva.wcvaBotResponseTimeout !== null) {
    wcvaBotResponseTimeoutDuration = parseInt(wcva.wcvaBotResponseTimeout);
    wcvaBotResponseTimeoutDuration = isNaN(wcvaBotResponseTimeoutDuration) ? 5 : wcvaBotResponseTimeoutDuration;
} else {
    wcvaBotResponseTimeoutDuration = 5;
}

// Handle mic response timeout exceptions
wcvaBotResponseTimeoutDuration = (wcvaBotResponseTimeoutDuration < 5) ? 5 : wcvaBotResponseTimeoutDuration;
wcvaBotResponseTimeoutDuration = (wcvaBotResponseTimeoutDuration > 10) ? 10 : wcvaBotResponseTimeoutDuration;
wcvaBotResponseTimeoutDuration = wcvaBotResponseTimeoutDuration * 1000;

/**
 * An audio player handler Object
 *
 */
var wcvaIntentResponsePlayer = {
    'htmlAudioElement': document.createElement('AUDIO'),
    'lastFilePath': null,
    'antiMuteButtonPlaybacks': [wcvaSilenceSoundPath],
    'isAntiMutePlayback': false,
    'configure': function(filePath = null, playbackEndedCallback = null) {
        try {
            let pathOfFile = typeof filePath != 'undefined' && filePath ? filePath : null;

            if (pathOfFile) {
                this.htmlAudioElement.src = wcvaPathUrl + pathOfFile;
                this.htmlAudioElement.preload = 'auto';
                this.lastFilePath = pathOfFile;

                if (this.antiMuteButtonPlaybacks.indexOf(pathOfFile) !== -1) {
                    this.isAntiMutePlayback = true;
                } else {
                    this.isAntiMutePlayback = false;
                }
            } else {
                this.htmlAudioElement.src = '';
                this.isAntiMutePlayback = false;
            }

            /**
             * The play event occurs when the audio has been started or is no longer paused.
             */
            this.htmlAudioElement.onplay = function() {
                wcvaIsTalking = true;

                /**
                 *  Floating mic response color handler base on time (in seconds) provide in setting
                 */
                wcvaWidgetToggleButton.classList.add('responding');
                wcvaWidgetChatHeader.classList.add('responding');
                window.wcvaBotTimeoutIdentifier = setTimeout(() => {
                    wcvaWidgetToggleButton.classList.remove('responding');
                    wcvaWidgetChatHeader.classList.remove('responding');
                }, wcvaBotResponseTimeoutDuration);

            }.bind(this);

            /**
             * The ended event occurs when the audio has reached the end.
             */
            this.htmlAudioElement.onended = function() {
                wcvaIsTalking = false;
                this.htmlAudioElement.src = ''
                this.muteButton('hide');
                this.isAntiMutePlayback = false;

                // Callback to be executed when video playback ends
                if (pathOfFile && (typeof playbackEndedCallback === "function")) {
                    playbackEndedCallback();
                    playbackEndedCallback = null;
                }
            }.bind(this);

            /**
             * The error event occurs when an error occurred during the loading of an audio
             */
            this.htmlAudioElement.onerror = function() {
                wcvaIsTalking = false;
                this.muteButton('hide');
                this.isAntiMutePlayback = false;
            }.bind(this);

            /**
             * The playing event occurs when the audio is playing after having been paused or stopped for buffering.
             */
            this.htmlAudioElement.onplaying = function() {
                wcvaIsTalking = true;
                this.muteButton('show');
            }.bind(this);
        } catch (err) {
            this.clear();
            this.isAntiMutePlayback = false;
        }
    },
    'play': function() {
        try {
            if (this.htmlAudioElement && !!this.htmlAudioElement.src) {
                this.htmlAudioElement.play().catch(function(error){
                    console.log('WCVA Exception: Failed to play audio.');
                });
            }
        } catch (err) {
            this.clear();
        }
    },
    'stop': function() {
        try {
            this.clear();
        } catch (err) {
            this.clear();
        }
    },
    'clear': function() {
        try {
            if (this.htmlAudioElement) {
                let duration = isNaN(this.htmlAudioElement.duration) ? 0 : this.htmlAudioElement.duration;
                this.htmlAudioElement.currentTime = duration;
            }

            this.lastFilePath = null;
        } catch (err) {
            this.lastFilePath = null;
            this.isAntiMutePlayback = false;
        }

        this.muteButton('hide');
    },
    'muteButton': function(action) {
        try {
            if (
                !!this.isAntiMutePlayback
                || typeof wcvaResponseControllerEl == 'undefined'
                || !wcvaResponseControllerEl
                || typeof action == 'undefined') return false;

            if (action == 'show') {
                wcvaResponseControllerEl.classList.remove('wcva-hide-element');
            } else {
                wcvaResponseControllerEl.classList.add('wcva-hide-element');

                if (this.isPlaying()) {
                    this.stop();
                }
            }
        } catch(err) {
            // Do nothing for now
        }
    },
    'isPlaying': function() {
        let currentTime = isNaN(this.htmlAudioElement.currentTime) ? 0 : this.htmlAudioElement.currentTime;
        let duration = isNaN(this.htmlAudioElement.duration) ? 0 : this.htmlAudioElement.duration;

        return currentTime < duration;
    }
};

/**
 * Remove if any of the response controller html elements previously avaialble in DOM
 *
 */
let wcvaResponseControllers = document.querySelectorAll('span.wcva-response-controller');// Get response controller element if any

if (typeof(wcvaResponseControllers) != 'undefined' && wcvaResponseControllers != null && wcvaResponseControllers.length > 0) {
    let wcvaRespCtrlsLength = wcvaResponseControllers.length;

    for (let wcvaI = 0; wcvaI < wcvaRespCtrlsLength; wcvaI++) {
        // remove response controller element
        wcvaResponseControllers[wcvaI].remove();
    }
}

/**
 * Create response controller HTML element and append to body
 *
 */
var wcvaResponseControllerEl = document.createElement('span');
var wcvaResponseControllerPositionClass = 'wcva-response-controller-middle-right';
var wcvaMicPos = wcva.wcvaSelectedMicPosition ? wcva.wcvaSelectedMicPosition.toLowerCase() : 'middle right';

switch (wcvaMicPos) {
    case 'middle left':
        wcvaResponseControllerPositionClass = 'wcva-response-controller-middle-left';
        break;
    case 'top right':
        wcvaResponseControllerPositionClass = 'wcva-response-controller-top-right';
        break;
    case 'top left':
        wcvaResponseControllerPositionClass = 'wcva-response-controller-top-left';
        break;
    case 'bottom right':
        wcvaResponseControllerPositionClass = 'wcva-response-controller-bottom-right';
        break;
    case 'bottom left':
        wcvaResponseControllerPositionClass = 'wcva-response-controller-bottom-left';
        break;
    default:
        wcvaResponseControllerPositionClass = 'wcva-response-controller-middle-right';
}

wcvaResponseControllerEl.setAttribute('class', 'wcva-response-controller wcva-hide-element '+ wcvaResponseControllerPositionClass);

// Create 'mute' button element
let wcvaAudioMuteIcon = document.createElement('button');
wcvaAudioMuteIcon.setAttribute('type', 'button');
wcvaAudioMuteIcon.setAttribute('class', 'wcva-speaker-icon');
wcvaAudioMuteIcon.setAttribute('title', 'Mute Simon');
wcvaAudioMuteIcon.onclick = function() {
    wcvaIntentResponsePlayer.muteButton('hide');
};

// Append 'mute' button element to response controller element
wcvaResponseControllerEl.appendChild(wcvaAudioMuteIcon);

// Append response controller element to body
document.body.appendChild(wcvaResponseControllerEl);

// Configured settings data
let wcvaSettingsData   = typeof(wcva.wcvaConfiguredSetting) != 'undefined' ? wcva.wcvaConfiguredSetting : null;
let wcvaHostName       = typeof(wcva.wcvaCurrentHostName) != 'undefined' ? wcva.wcvaCurrentHostName : null;
let wcvaTypeOfDialog   = (typeof(wcva.wcvaDialogType) != 'undefined' && wcva.wcvaDialogType !== null) ? wcva.wcvaDialogType.trim() : 'generic';
let wcvaCustomEndpoint = (typeof(wcva.wcvaCustomEndpointUrl) != 'undefined' && wcva.wcvaCustomEndpointUrl !== null) ? wcva.wcvaCustomEndpointUrl : null;

// Handle wrongly type casted string from PHP
if (wcvaCustomEndpoint !== null && wcvaCustomEndpoint.constructor === Array && wcvaCustomEndpoint.length == 1) {
    wcvaCustomEndpoint = null;
}

wcvaTypeOfSearch = (typeof(wcva.wcvaTypeOfSearch) != 'undefined' && wcva.wcvaTypeOfSearch !== null) ? wcva.wcvaTypeOfSearch : 'native';
let wcvaMale = wcvaVoiceType.female === false ? true : false;

/**
 * Function to get cookie value
 *
 * @param { cname: String } Name of the cookie
 *
 * @returns string Value of cookie
 */
function wcvaGetCookie(cname = null) {
    try {
        if (typeof(cname) == 'undefined' || cname === null) return "";

        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        let caLength = ca.length;

        for (let i = 0; i < caLength; i++) {
            let c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    } catch (err) {
        console.log('Something went wrong while getting cookie.');
    }
  return "";
}

/**
 * Function to check if customer opted to use custom dialog
 *
 */
function wcvaIsCustomDialogOpted(){
    let isCustomDialog = false;

    try {
        if (wcvaTypeOfDialog == 'custom' && wcvaCustomEndpoint !== null && wcvaCustomEndpoint.length != 0) {
            isCustomDialog = true;
        }
    } catch (err) {
        console.log('Something went wrong while checking preference of dialog type.');
    }

    return isCustomDialog;
}

/**
 * Function to check if intent is configured in settings and get it
 *
 * @param { intent      : string } Intent string
 * @param { description : string } Descriptive text about intent
 * @param { url         : string } URL to redirect user on page against intent
 *
 * @returns { wcvaSettings: object } Intent data from plugin settings/configurations
 */
function wcvaCheckAndGetIntentFromSettings(intent, description = null, url = null){
    let wcvaTempSettings = null;
    let wcvaSettings     = { 'description':  wcvaMessages['unableToProcess'],  'url': '', 'enabled': false };
    wcvaTempSettings     = wcvaSettings;

    try {
        // If description (custom provided or received from API) is provided then prefer it to return
        if (typeof(description) != 'undefined' && description != null) {
            wcvaSettings.description = description;
        }

        // If URL (custom provided or received from API) is provided then prefer it to return
        if (typeof(url) != 'undefined' && url != null && url.length != 0) {
            url = wcvaSettings.url = url.trim();
        }

        // check if intent is available in plugin settings
        if (wcvaIsCustomDialogOpted() == false && typeof(intent) != 'undefined'
            && intent.length != 0 && wcvaSettingsData != null && (intent in wcvaSettingsData)) {
            let wcvaIntentFromSettings   = wcvaSettingsData[intent];
            let wcvaResponseFromSettings = ('response' in wcvaIntentFromSettings) ? wcvaIntentFromSettings['response'] : null;
            let wcvaUrlFromSettings      = ('url' in wcvaIntentFromSettings) ? wcvaIntentFromSettings['url'] : '';

            // If description is available in settings then prioritize it to return over anything else
            if (typeof(wcvaResponseFromSettings) != 'undefined' && wcvaResponseFromSettings != null
                && wcvaResponseFromSettings.length != 0) {
                wcvaSettings.description = wcvaResponseFromSettings;
            }

            // If URL is available in settings then prioritize it to return over anything else
            if (typeof(wcvaUrlFromSettings) != 'undefined' && wcvaUrlFromSettings != null
                && wcvaUrlFromSettings.length != 0) {
                wcvaSettings.url = wcvaUrlFromSettings.trim();
            }

            // If dialog for intent is enabled or disabled
            let wcvaIsDialogEnabled = false;

            if ('enabled' in wcvaIntentFromSettings) {
                let wcvaDialogStatus = wcvaIntentFromSettings['enabled'];
                wcvaIsDialogEnabled  = (typeof(wcvaDialogStatus) == 'undefined' || wcvaDialogStatus === null) ? false : true;
                wcvaIsDialogEnabled  = (wcvaIsDialogEnabled === true && wcvaDialogStatus.trim() == 'enabled') ? true : false;
            }

            wcvaSettings.enabled = wcvaIsDialogEnabled;
        }
        if (wcvaIsCustomDialogOpted() == true) {
            wcvaSettings.enabled = true;
        }
    } catch (err) {
        wcvaSettings = wcvaTempSettings;
        console.log('Something went wrong while checking settings:' + err.message);
    }

    let isAbsolute = new RegExp('^([a-z]+://|//)', 'i');

    // To handle relative URL
    if (!isAbsolute.test(wcvaSettings.url)) {
        if (wcvaSettings.url.indexOf('www.') === 0) {
            wcvaSettings.url = 'http://' + wcvaSettings.url;
        } else {
            wcvaSettings.url = (wcvaSettings.url.charAt(0) == '/') ? wcvaSettings.url : '/' + wcvaSettings.url;
            wcvaSettings.url = wcvaGetCurrentHostURL() + wcvaSettings.url;
        }
    }

    wcvaSettings.description = wcvaSettings.description.trim();
    return wcvaSettings;
}

/**
 * Function to get convert speech into text. (For all non-chrome browsers)
 *
 * @param { blob: Blob Object } Blob/frequency data
 * @param { errorRecovery: Boolean } To determine error recovery
 * @param { cb: function } A callback function
 */
function wcvaStt(blob, errorRecovery, cb) {
    if (errorRecovery == false) {
        let i = Math.floor(Math.random() * 10);
        let respPath = wcvaAlternativeResponse['randomLib'];

        if (wcvaRespTimeOut == false) {
            // Play random audio reponse
            wcvaIntentResponsePlayer.configure(respPath[i]);
            wcvaIntentResponsePlayer.play();

            wcvaRespTimeOut = true;

            setTimeout(function () {
                wcvaRespTimeOut = false;
            }, 6000);
        }
    }

    let wcvaWsURI           = wcvaWebSocketUrl.url + wcvaWebSocketUrl.tokenQs + wcvaServiceKeys['iSTT'] + wcvaWebSocketUrl.otherQs;
    let wcvaWebsocket       = new WebSocket(wcvaWsURI);
    wcvaWebsocket.onopen    = function (evt) { wcvaWsOnOpen(evt) };
    wcvaWebsocket.onclose   = function (evt) { wcvaWsOnClose(evt) };
    wcvaWebsocket.onmessage = function (evt) { wcvaWsOnMessage(evt) };
    wcvaWebsocket.onerror   = function (evt) { wcvaWsOnError(evt) };

    function wcvaWsOnOpen(evt) {
        let wcvaWsMessage = {
            'action': 'start',
            'content-type': 'audio/wav',
            'interim_results': false,
            'max_alternatives': 3,
            'smart_formatting': true,
        };

        wcvaWebsocket.send(JSON.stringify(wcvaWsMessage));
        wcvaWebsocket.send(blob);
        wcvaWebsocket.send(JSON.stringify({ 'action': 'stop' }));

        // Log service call count
        wcvaLogServiceCall();
    }

    function wcvaWsOnClose(evt) { /* do nothing for now*/ }

    function wcvaWsOnMessage(evt) {
        let wcvaWsRes = JSON.parse(evt.data);

        if (wcvaWsRes.results != undefined) {
            let wcvaWsMsg = "";

            // we have a message coming back :-)
            let wcvaWsFoundFinal = false;

            for (let k in wcvaWsRes.results) {
                if (wcvaWsRes.results[k].final == true) {
                    wcvaWsMsg = wcvaWsMsg + wcvaWsRes.results[k].alternatives[0].transcript;
                    wcvaWsFoundFinal = true;
                }
            }

            wcvaErrcnt = 0;

            if (wcvaWsFoundFinal == true || wcvaWsRes.results.length == 0) {
                if (typeof(cb) === 'function') cb(wcvaWsMsg);
                wcvaWebsocket.close();
            }
        }
    }

    function wcvaWsOnError(evt) {
        wcvaErrcnt++;
        wcvaWebsocket.close();

        if (!(typeof(wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) return;

        if (wcvaErrcnt < 2) {
            //$$$$$$$$$$$$$$$ FETCH NEW TOKEN MIGHT HAVE EXPIRED $$$$$$$$$$$$$$$$$$
            wcvaRefreshVoiceServicesKeys().then(function(result) {
                wcvaServiceKeys['iSTT'] = result;
                wcvaStt(blob,true,cb);
            }).catch(function(error) {
                alert(error);
            });
        }
    }
}

/**
 * Function to log query and response conversation of end user & AI to Google Analytics
 *
 * @param { userQuery: String } User query or question or search term.
 * @param { simonResponse: String } An optional parameter as 'response' value
 */
function wcvaLogWithGoogleAnalytics(userQuery, simonResponse) {
    try {
        let wcvaTypeOfGaLibrary = null;
        if (typeof(wcva.wcvaGaTrack) === 'undefined' || wcva.wcvaGaTrack == null) return;

        if (wcva.wcvaGaTrack == 'yes') {
            let wcvaGaEventSent = false;
            let wcvaGaEventCategory = 'Voice Shopping For WooCommerce - Conversation Log';
            let wcvaGaEventAction = '[ USER QUERY:- ' + userQuery + ' ] [ SIMON RESPONSE:- ' + simonResponse + ' ]';

            // Send event to Google Analytics server using Google Tag Manager
            if(wcvaIsGtmPresent) {
                window.dataLayer = window.dataLayer || [];

                // Push event to dataLayer queue to be sent to Google Tag Manager
                window.dataLayer.push({
                    'event': 'VoiceShoppingForWooCommerce-QueryResponse',
                    'wcvaQueryResponse' : wcvaGaEventAction
                });

                wcvaGaEventSent = true;
            }

            // Throw error if Google Analytics tracking id is missing or invalid
            if (!(wcvaGoogleAnalyticsTrackingId && wcvaGoogleAnalyticsTrackingId.indexOf('UA-') !== -1)) {
                throw "Unable to send WCVA conversation log to Google Analytics due to unavaibility of the Google Analytics tracking Id.";
            }

            // Send event to Google Analytics server using 'gtag' latest event queue command
            if (!wcvaGaEventSent && typeof gtag === 'function' && wcvaGtagConfigCount > 0 && wcvaGaConfiguredForGtag === true) {
                let wcvaGaEventCmdParams = { 'event_category': wcvaGaEventCategory };

                // If multiple Google products configured then we need to tell the command queue funciton to whom the event be sent by using 'send_to'.
                if (wcvaGtagConfigCount > 1) {
                    if (wcvaGoogleAnalyticsTrackingId) {
                        wcvaGaEventCmdParams['send_to'] = wcvaGoogleAnalyticsTrackingId;
                    } else {
                        throw 'Multiple "gtag" configurations detected but Google Analytics tracking id is missing.';
                    }
                }

                gtag('event', wcvaGaEventAction, wcvaGaEventCmdParams);
                wcvaGaEventSent = true;
            }

            // Send event to Google Analytics server by legacy 'ga' event queue command
            if (!wcvaGaEventSent && typeof ga === 'function') {
                ga('send', 'event', wcvaGaEventCategory, wcvaGaEventAction);
                wcvaGaEventSent = true;
            }

            // Throw exception if event is not fired with any of the available GA event mechanism or GA event mechanism is not available
            if (!wcvaGaEventSent) {
                throw 'Supported Google Analytics library not available.';
            }
        }
    } catch (err) {
        let errorMessage = typeof err === 'string' ? err : err.message;
        console.log('WCVA Google Analytics Log Process Error: ' + errorMessage);
    }
}

/**
 * Function to send dialog to Simon AI
 *
 * @param { msg: String } Question or query
 * @param { cb: function } A callback function
 * @param { widgetElementsObj: Object } Object with properties containing reference to widget DOM objects
 */
function wcvaSendDialog(msg, cb, widgetElementsObj = null) {
    if (!(typeof(wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) return;

    if (!(typeof(msg) != 'undefined' && msg != null && msg.trim() != '')) return;

    //To support WooCommerce we need to capture the current URL we are on!
    //Lets fetch the entire URL and provide it to Simon AI
    let currentURL = window.location.href;
    console.log("Will send the URL: " + currentURL + " to SimonAI as base URL");
    wcvaMyStatus.cUrl = currentURL;

    let wcvaBody = {
        // This is where you define the body of the request
        'msg': msg,
        'context': wcvaMyContext,
        'status': wcvaMyStatus
    };

    // local function to manipulate widget DOM nodes
    function wcvaHandleWidgetElementsObj (response) {
        try {
            if (widgetElementsObj !== null) {
                let wcvaChatHistory = null;     //to manage chat hidtory
                wcvaChatHistory =  localStorage.getItem('wcvaChatHistory');
                if (wcvaChatHistory != null) {
                    widgetElementsObj.chatConvoEl.innerHTML = "";
                }
                widgetElementsObj.userMsgEl.innerHTML = msg;
                widgetElementsObj.simonMsgEl.innerHTML = response;
                widgetElementsObj.userMsgElWrapper.appendChild(widgetElementsObj.userMsgEl);
                widgetElementsObj.chatConvoEl.appendChild(widgetElementsObj.userMsgElWrapper);
                widgetElementsObj.chatConvoEl.appendChild(widgetElementsObj.simonMsgEl);

                if (wcvaChatHistory == null) {
                    localStorage.setItem('wcvaChatHistory', widgetElementsObj.chatConvoEl.innerHTML);
                }
                else {
                    wcvaChatHistory = wcvaChatHistory+" "+widgetElementsObj.chatConvoEl.innerHTML;
                    localStorage.setItem('wcvaChatHistory', wcvaChatHistory);
                    widgetElementsObj.chatConvoEl.innerHTML = wcvaChatHistory;
                }

                // Scroll chat convo to the end
                if (typeof(widgetElementsObj.chatConvoEl.scrollTop) != 'undefined'
                    && typeof(widgetElementsObj.chatConvoEl.scrollHeight) != 'undefined') {
                    widgetElementsObj.chatConvoEl.scrollTop = widgetElementsObj.chatConvoEl.scrollHeight;
                }

                widgetElementsObj.expandCollapseHandle();
            }
        } catch (err) { /* Do nothing */ }
    }

    let wcvaDataStr = JSON.stringify(wcvaBody, null, true);
    let wcvaXhttpForSendDialog = new XMLHttpRequest();
    let wcvaCurrentDate = new Date();
    let wcvaCurrentTimestamp = wcvaCurrentDate.getTime();
    let wcvaWidgetConversation = {'userQuery': "", 'simonResponse': ''};

    wcvaXhttpForSendDialog.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var wcvaConversationResult = JSON.parse(this.responseText);

            // handle unexpected search request
            if (!(typeof wcvaConversationResult != 'undefined' && !!wcvaConversationResult)) {
                cb(wcvaAlternativeResponse['unableToProcess']);
                return;
            }

            wcvaConversationResult['description'] = wcvaConversationResult.description != 'undefined' ? wcvaConversationResult.description : "";
            wcvaConversationResult['url'] = wcvaConversationResult.url != 'undefined' ? wcvaConversationResult.url : "";

            // Log user query and AI response to Google Analytics
            wcvaLogWithGoogleAnalytics(msg, wcvaConversationResult.description);

            // take status object which contians 'intent'
            if (typeof wcvaConversationResult.status != undefined) {
                wcvaMyStatus = wcvaConversationResult.status;
            }

            if (typeof wcvaConversationResult.context != undefined) {
                wcvaMyContext = wcvaConversationResult.context;
            }

            let intentOfUser = typeof wcvaMyStatus.intent != 'undefined' ? wcvaMyStatus.intent : '';
            let productString = typeof wcvaMyStatus.prodStr != 'undefined' ? wcvaMyStatus.prodStr : null;
            let productCategoryString = typeof wcvaMyStatus.prodCategoryStr != 'undefined' ? wcvaMyStatus.prodCategoryStr : null;

            //################################################################################################
            //
            // For fuzzy search and dynamic audio synthesis
            //
            //################################################################################################
            if (intentOfUser == 'productSearch' || intentOfUser == "productCategory" || intentOfUser == "AddToCart" || intentOfUser == "ProductGroups") {
                try {
                    let wcvaXhrForFuzzySeach = new XMLHttpRequest();
                    wcvaXhrForFuzzySeach.onreadystatechange = function () {

                        if (this.readyState == 4 && this.status == 200) {
                            let wcvaResultFuzzySearch = JSON.parse(this.responseText)
                            wcvaResultFuzzySearch = wcvaResultFuzzySearch.data;

                            if (wcvaResultFuzzySearch.code != undefined) {
                                console.log(wcvaResultFuzzySearch.error);
                                return;
                            }

                            if (intentOfUser == "ProductGroups" && wcvaSettingsData[intentOfUser] != undefined) {
                                if (wcvaSettingsData[intentOfUser].enabled == false) {
                                    wcvaConversationResult.description = wcvaResultFuzzySearch.voice_response;
                                    wcvaConversationResult.url = wcvaResultFuzzySearch.redirect_url;
                                    wcvaSettingsData[intentOfUser] = {enabled: "enabled", response: wcvaConversationResult.description , intent_name: "intent", intent_audio_response: {path:wcvaResultFuzzySearch.path, voice:wcvaResultFuzzySearch.voice}, delete_audio_response: "0", option_name: "wcva_product_search", url: wcvaConversationResult.url};
                                }
                                else {
                                    if (wcvaSettingsData[intentOfUser].response == "" ) {
                                        wcvaConversationResult.description = wcvaResultFuzzySearch.voice_response;
                                        wcvaSettingsData[intentOfUser].response = wcvaResultFuzzySearch.voice_response;
                                    }

                                    if (wcvaSettingsData[intentOfUser].url == "" ) {
                                        wcvaConversationResult.url = wcvaResultFuzzySearch.redirect_url;
                                        wcvaSettingsData[intentOfUser].url = wcvaResultFuzzySearch.redirect_url;
                                    }

                                }

                            }
                            else {
                                wcvaConversationResult.description = wcvaResultFuzzySearch.voice_response;
                                wcvaConversationResult.url = wcvaResultFuzzySearch.redirect_url;
                                wcvaSettingsData[intentOfUser] = {enabled: "enabled", response: wcvaConversationResult.description , intent_name: "intent", intent_audio_response: {path:wcvaResultFuzzySearch.path, voice:wcvaResultFuzzySearch.voice}, delete_audio_response: "0", option_name: "wcva_product_search", url: wcvaConversationResult.url};
                            }

                        }
                    };

                    wcvaXhrForFuzzySeach.open("POST", wcvaAjaxObjForFuzzySearch.ajax_url , false);
                    wcvaXhrForFuzzySeach.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    wcvaXhrForFuzzySeach.send("action=wcva_fuzzy_search&_ajax_nonce=" + wcvaAjaxObjForFuzzySearch.nonce + "&intent_of_user=" + intentOfUser + "&prodStr=" + productString + "&prodCategoryStr=" + productCategoryString + "&address_bar_url=" + document.location.href);

                } catch (err) {
                    console.log('We had an error. Error:' + err.message);
                    return;
                }

            }

            // Prefer configured intent from settings page if available
            let wcvaJustifiedResult = wcvaCheckAndGetIntentFromSettings(
                intentOfUser,
                wcvaConversationResult.description,
                wcvaConversationResult.url.toLowerCase()
            );

            wcvaConversationResult.description = wcvaJustifiedResult.description;
            wcvaConversationResult.url = wcvaJustifiedResult.url;

            // If dialog for intent has been disabled from settings then stop AI search process.
            if (wcvaJustifiedResult.enabled == false) {
                cb(wcvaAlternativeResponse['disabledIntentResponse'], null, true);

                // For widget
                let resp = wcvaMessages['traditionalSearch'];
                wcvaHandleWidgetElementsObj(resp);

                wcvaWidgetConversation.userQuery = msg;
                wcvaWidgetConversation.simonResponse = resp;
                localStorage.setItem('wcvaWidgetConversation', JSON.stringify(wcvaWidgetConversation, null, true));

                return;
            }

            if (!!wcvaConversationResult.description) {
                // For audio file path
                let wcvaIntentResponseAudioPath = wcvaAlternativeResponse['defaultDesc'];

                //################################################################################################
                //
                // FOR CUSTOM DIALOGS
                //
                //################################################################################################
                if (wcvaIsCustomDialogOpted()) {
                    let wcvaExistingCdReponse = wcvaGetExistingCustomDialogResponse(wcvaVoiceAndLanguage, wcvaConversationResult.description);

                    if (!!wcvaExistingCdReponse) {
                        wcvaIntentResponseAudioPath = typeof wcvaExistingCdReponse['path'] != 'undefined' && !!wcvaExistingCdReponse['path'] ? wcvaExistingCdReponse['path'] : wcvaAlternativeResponse['defaultDesc'];

                        wcvaResAndNavHandler();
                    } else {
                        // Generate new custom dialog response
                        wcvaCustomDialogTtsOnTheFly(wcvaConversationResult.description).then(function(wcvaNewCdReponse) {
                            if (!!wcvaNewCdReponse) {
                                wcvaIntentResponseAudioPath = typeof wcvaNewCdReponse['path'] != 'undefined' && !!wcvaNewCdReponse['path'] ? wcvaNewCdReponse['path'] : wcvaAlternativeResponse['defaultDesc'];
                            }

                            wcvaResAndNavHandler();
                        }).catch(function(err){
                            console.log('WCVA Error: Something went wrong while TTS process for custom dialog.');

                            wcvaResAndNavHandler();
                        });
                    }
                } else {
                    //################################################################################################
                    //
                    // FOR GENERIC DIALOGS (Active/enabled Generic dialogs)
                    //
                    //################################################################################################
                    let tempDialogData  = wcvaGetGenericDialog(wcvaVoiceAndLanguage, intentOfUser);
                    let dialog = tempDialogData['dialog'];
                    let generateAudio = tempDialogData['generateAudio'];

                    if (!!dialog && generateAudio === true) {
                        //############################################################################################
                        // Generic dialog exist but audio data is invalid (Audio file is missing or language mismatch)
                        //############################################################################################
                        let dbOpName = 'option_name' in dialog && !!dialog['option_name'] ? dialog['option_name'] : null;
                        let dialogText = 'response' in dialog && !!dialog['response'] ? dialog['response'] : null;

                        if (!!dialogText && !!dbOpName) {
                            wcvaGenericDialogTtsOnTheFly(dialogText, dbOpName).then(function(result){
                                wcvaIntentResponseAudioPath = typeof result != 'undefined' && typeof result['path'] != 'undefined' ? result['path'] : wcvaAlternativeResponse['defaultDesc'];
                                wcvaResAndNavHandler();
                            }).catch(function(err){
                                console.log('WCVA Error: Something went wrong while TTS process for generic dialog.');
                                wcvaResAndNavHandler();
                            });
                        }
                    } else {
                        //################################################################################
                        // Generic dialog exist with valid (File exist with matching language) audio data
                        //################################################################################
                        let audioData = !!dialog && typeof dialog['intent_audio_response'] != 'undefined' ? dialog['intent_audio_response'] : {};
                        let audioPath = 'path' in audioData && !!audioData['path'] ? audioData['path'] : null;

                        if (!!audioPath) wcvaIntentResponseAudioPath = audioPath;

                        wcvaResAndNavHandler();
                    }
                }

                //#######################################################################
                // Function to handle response and navigation URL from conversation API
                //#######################################################################
                function wcvaResAndNavHandler(){
                    wcvaHandleWidgetElementsObj(wcvaConversationResult.description);

                    wcvaWidgetConversation.userQuery = msg;
                    wcvaWidgetConversation.simonResponse = wcvaConversationResult.description;
                    localStorage.setItem('wcvaWidgetConversation', JSON.stringify(wcvaWidgetConversation, null, true));

                    /**
                     *
                     * All of the three conditions prime intention to overcome issues with 'mic access' and 'audio play' due to browser's 'auto play' security policy
                     *
                     * # NAVIGATION FLOW
                     * This if block represents slightly different 'navigation' flow than the plugin's prime navigation flow.
                     * Navigtion flow imposed: Read/speak out the response first and then navigate. (Plugin's prime navigation flow does exactly opposite of it)
                     *
                     * # TARGET PLATFORMS
                     * 1st Condition: iOS Safari (Till now Feb 2020 Chrome and Firefox on iOS unable to acquire mic accesss, hence they are obsolete from support for this plugin)
                     * 2nd Condition: Firefox on Android phone to overcome issues caused by browser's 'auto play' security policy
                     * 3rd Condition: Safari on Mac to overcome issues caused by browser's 'auto play' security policy.
                     * 4th Condition: Firefox on Widnows to overcome issues caused by browser's 'auto play' security policy.
                     *
                     */
                    if (
                        wcvaClientInfo.ios // For iOS Safari (Till now Feb 2020 Chrome and Firefox unable gain mic access on iOS)
                        || (wcvaClientInfo.android && wcvaClientInfo.firefox)
                        || (wcvaClientInfo.safari && !wcvaClientInfo.chrome && !wcvaClientInfo.firefox && !wcvaClientInfo.edge)
                        || (wcvaClientInfo.windows && wcvaClientInfo.firefox)
                        ) {
                        cb(wcvaIntentResponseAudioPath, function() {
                            if (wcvaConversationResult.url != undefined && wcvaConversationResult.url != ""
                                && !wcvaUrlPointsToCurrentPage(wcvaConversationResult.url)) {
                                // If intent result points to current page/url then do not open new window
                                location.assign(wcvaConversationResult.url);
                            } else {
                                localStorage.removeItem('wcvaWidgetConversation');
                            }
                        });
                    } else {
                        if (wcvaConversationResult.url != undefined && wcvaConversationResult.url != "") {
                            let wcvaUrlBlongsToCurrentDomain = wcvaUrlIsPartOfCurrentDomain(wcvaConversationResult.url.toLowerCase());

                            // handle invalid URL
                            if (wcvaUrlBlongsToCurrentDomain == null) {
                                cb(wcvaIntentResponseAudioPath);
                                localStorage.removeItem('wcvaWidgetConversation');
                                alert(wcvaMessages['pageUnavailable']);
                                return;
                            }

                            // URL pointing to third party URL
                            if (wcvaUrlBlongsToCurrentDomain == false) {
                                try {
                                    if (wcvaWin1 != -1) {
                                        wcvaWin1.close();
                                    }
                                } catch (err) {
                                    console.log("We had an error. Error " + err.message);
                                }

                                wcvaWin1 = window.open(wcvaConversationResult.url, wcvaConversationResult.url);
                                cb(wcvaIntentResponseAudioPath);
                                localStorage.removeItem('wcvaWidgetConversation');
                            } else {
                                // URL is associted with current domain
                                let wcvaApiRespDesc = wcvaConversationResult.description;

                                function wcvaChangeURL(wcvaUrl) {
                                    var wcvaChangeUrlTimer = null;

                                    let wcvaRootUrl   = wcvaUrl;
                                    let wcvaPos       = wcvaRootUrl.indexOf('#');
                                    let wcvaIsNewPage = false;

                                    if (wcvaPos > -1) {
                                        wcvaRootUrl = wcvaRootUrl.substring(0, wcvaPos);

                                        if (wcvaUrlPointsToCurrentPage(wcvaRootUrl)) {
                                            console.log("We need to navigate within the same page");
                                        } else {
                                            wcvaIsNewPage = true;
                                        }
                                    }

                                    if (wcvaUrl.indexOf('#') == -1 || wcvaIsNewPage == true) {
                                        if (wcvaIsTalking === true) {
                                            var wcvaChangeUrlTimer = setTimeout(function () {
                                                wcvaChangeURL(wcvaUrl);
                                                clearInterval(wcvaChangeUrlTimer);
                                            }, 500);
                                            return;
                                        }

                                        wcvaMyStatus.intent = '';
                                        wcvaMyStatus.prodStr = null;
                                        wcvaMyStatus.prodCategoryStr = null;
                                        localStorage.setItem('wcvaPendingPlaybackPath', wcvaIntentResponseAudioPath);
                                        localStorage.setItem('wcvaCtx', JSON.stringify(wcvaMyContext, null, true));
                                        localStorage.setItem("wcvaStat", JSON.stringify(wcvaMyStatus, null, true));

                                        if (typeof(wcvaChangeUrlTimer) != 'undefined' && wcvaChangeUrlTimer != null) {
                                            clearInterval(wcvaChangeUrlTimer);
                                        }
                                    } else {
                                        cb(wcvaIntentResponseAudioPath);
                                        localStorage.removeItem('wcvaWidgetConversation');
                                    }

                                    location.assign(wcvaUrl);
                                }

                                wcvaChangeURL(wcvaConversationResult.url.trim());
                            }
                        } else {
                            cb(wcvaIntentResponseAudioPath);
                            localStorage.removeItem('wcvaWidgetConversation');
                        }
                    }

                    if (wcvaConversationResult.url2 != undefined && wcvaConversationResult.url2 != "") {
                        try {
                            if (wcvaWin2 != -1) {
                                wcvaWin2.close();
                            }
                        } catch (err) {
                            console.log("We had an error. Error " + err.message);
                        }

                        wcvaWin2 = window.open(wcvaConversationResult.url2, wcvaConversationResult.url2);
                        localStorage.removeItem('wcvaWidgetConversation');
                    }
                }
            }
        } else if (this.readyState == 4 && this.status != 200) {
            // Log AJAX request exception to Google Analytics
            wcvaLogWithGoogleAnalytics(msg, wcvaMessages['callFailed']);
        }
    };

    try {
        var apiUrl = wcva.wcvaSendDialogApiUrl;

        // Check if custom prefered to use custom dialog
        if (wcvaIsCustomDialogOpted()) {
            apiUrl = wcvaCustomEndpoint
        }

        wcvaXhttpForSendDialog.open("POST", apiUrl, true);
        wcvaXhttpForSendDialog.setRequestHeader("Accept", "application/json");
        wcvaXhttpForSendDialog.setRequestHeader("Content-type", "application/json");
        wcvaXhttpForSendDialog.setRequestHeader("Access-Control-Allow-Origin", "*");
        wcvaXhttpForSendDialog.setRequestHeader("x-api-key", wcva.wcvaXApiKey);
        wcvaXhttpForSendDialog.send(wcvaDataStr);
    } catch (err) {
        console.log('We had an error. Error:' + err.message);
        localStorage.removeItem('wcvaWidgetConversation');
        return;
    }
}

/**
 * Function to get current host/domain full URL
 *
 */
function wcvaGetCurrentHostURL() {
    var currentHostUrl = null;
    try {
        if (!(typeof(window.location) != 'undefined'
            && typeof(window.location.hostname) != 'undefined'
            && typeof(window.location.protocol) != 'undefined')) {
            return wcvaGetHostName();
        }

        var thisProtocol = window.location.protocol;
        var thisHostname = window.location.hostname;

        currentHostUrl = thisProtocol + '//' + thisHostname;
    } catch (err) {
        currentHostUrl = wcvaGetHostName();
        console.log('Something went wrong while discovering current domain.');
    }

    return currentHostUrl;
}

/**
 * Function to get current host name from backend.
 */
function wcvaGetHostName() {
    return wcvaHostName;
}

/**
 * Function to check whether provided URL is associted with current domain/host
 *
 * @param { url:  String } URL to check
 *
 * @returns { wcvaUrlAssociated: Boolean } 'true' if 'url' is within same domain/host otherwise 'false'
 */
function wcvaUrlIsPartOfCurrentDomain(url) {
    let wcvaUrlAssociated = false;
    try {
        // handle exception
        if (typeof(url) ==  'undefined' || url === null) {
            return null;
        }

        let wcvaUrlProtocol = '';

        // get protocol
        if (url.indexOf('http://') === 0) {
            wcvaUrlProtocol = 'http://';
        } else if (url.indexOf('https://') === 0) {
            wcvaUrlProtocol = 'https://';
        }

        let wcvaStart = (wcvaUrlProtocol.length == 0) ? 0 : wcvaUrlProtocol.length;
        let wcvaDomainNameWithoutProtocol = url.substring(wcvaStart);// Removing protocol
        let wcvaFirstDomainSuffixTrailingSlashPos = wcvaDomainNameWithoutProtocol.indexOf('/');
        let wcvaDomainName = wcvaDomainNameWithoutProtocol;

        if (wcvaFirstDomainSuffixTrailingSlashPos != -1) {
            wcvaDomainName = wcvaDomainNameWithoutProtocol.substring(0, wcvaFirstDomainSuffixTrailingSlashPos);
        }

        wcvaDomainName = wcvaUrlProtocol + wcvaDomainName;

        if (wcvaDomainName.indexOf(wcvaGetCurrentHostURL()) === 0) {
            wcvaUrlAssociated = true;
        }
    } catch (err) {
        wcvaUrlAssociated = null;
        console.log('Something went wrong while checking URL.');
    }

    return wcvaUrlAssociated;
}

/**
 * Function to check whether response URL pointing to current page/URL
 *
 * @param { wcvaUrl: String } URL to check
 *
 * @returns { wcvaUrlPointingToCurrentPage: Boolean } 'true' if 'wcvaUrl' is same as current url/page otherwise 'false'
 */
function wcvaUrlPointsToCurrentPage(wcvaUrl = null) {
    var wcvaUrlPointingToCurrentPage = false;
    try {
        if (!(typeof(wcvaUrl) != 'undefined' && wcvaUrl !== null)) return true;

        var wcvaCurrentUrl = window.location.href;
        wcvaUrl = wcvaUrl.trim();
        var wcvaCurrentUrlLastChar = wcvaCurrentUrl[wcvaCurrentUrl.length - 1];
        wcvaCurrentUrlLastChar = (wcvaCurrentUrlLastChar == '/') ? wcvaCurrentUrlLastChar : null;

        if (wcvaUrl.length != 0 && wcvaUrl.indexOf('/') == (wcvaUrl.length - 1)
            && typeof(wcvaCurrentUrlLastChar) != 'undefined' && wcvaCurrentUrlLastChar != '/') {
            wcvaCurrentUrl += '/';
        }

        // check if given url pointing to current page
        if (wcvaCurrentUrl == wcvaUrl) {
            wcvaUrlPointingToCurrentPage = true;
        }
    } catch (err) {
        wcvaUrlPointingToCurrentPage = true;
        console.log('Something went wrong while getting current full URL.');
    }

    return wcvaUrlPointingToCurrentPage;
}

/**
 * Function to log STT service call
 *
 * @param {wcvaUpdateLastValue - Number} : 0 to not to update last value or 1 to update last value
 */
function wcvaLogServiceCall(wcvaUpdateLastValue = 0) {
    try {
        let wcvaXhr = new XMLHttpRequest();

        wcvaXhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let res = JSON.parse(this.responseText);

                // Update localized variables of service log
                wcvaServiceLogs.updatedAt    = res.updatedAt || wcvaServiceLogs.updatedAt;
                wcvaServiceLogs.currentValue = res.currentValue || wcvaServiceLogs.currentValue;
                wcvaServiceLogs.lastValue    = res.lastValue || wcvaServiceLogs.lastValue;
            }
        };

        wcvaXhr.open("POST", wcvaAjaxObj.ajax_url , true);
        wcvaXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        wcvaXhr.send("action=wcva_log_service_call&_ajax_nonce=" + wcvaAjaxObj.nonce + "&updateLastValue=" + wcvaUpdateLastValue);
    } catch (err) {
        // Do nothing for now
    }
}

/**
 * Function to obtain voice services token and keys
 *
 */
function wcvaRefreshVoiceServicesKeys() {
    return new Promise(function(resolve, reject){
        let wcvaXhr = new XMLHttpRequest();

        wcvaXhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let refreshedToken = typeof(res.token) != 'undefined' ? res.token : null;

                    if (!!refreshedToken) {
                        resolve(refreshedToken);
                    } else {
                        if (!!wcvaSttLanguageContext['gcp']['stt'] && 'gStt' in res && !!res['gStt']) {
                            resolve(res['gStt']);
                            return;
                        }
                        reject(wcvaErrorLibrary['outOfService']);
                    }
                } else {
                    // Handle response errors
                    reject(wcvaErrorLibrary['outOfService']);
                }
            }
        };

        let queryString = "?action=wcva_refresh_access_keys&_ajax_nonce=" + wcvaAjaxObj.keys_nonce;
        wcvaXhr.open("GET", wcvaAjaxObj.ajax_url + queryString , true);

        // Handle parsing or transmission errors
        wcvaXhr.onerror = function(error) { reject(wcvaErrorLibrary['outOfService']); }
        wcvaXhr.send(null);
    });
}

/**
 * Function to convert speech to tect using google stt
 *
 * @param {base64AudioStr - String} : Base 64 audio string
 */
function wcvaGcpStt(base64AudioStr) {
    return new Promise(function(resolve, reject){
        if (!(
            !!wcvaSttLanguageContext['gcp']['endPoint'] &&
            !!wcvaSttLanguageContext['gcp']['key'] &&
            !!wcvaSttLanguageContext['gcp']['langCode'] &&
            typeof base64AudioStr != 'undefined' &&
            !!base64AudioStr
            ))
        {
            reject(null);
            return;
        }

        if (wcvaErrcnt == 0) {
            let i = Math.floor(Math.random() * 10);
            let resp = wcvaAlternativeResponse['randomLib'];

            // Play 'random' playback
            wcvaIntentResponsePlayer.configure(resp[i]);
            wcvaIntentResponsePlayer.play();
        }

        let wcvaXhr = new XMLHttpRequest();

        wcvaXhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                try {
                    let res = JSON.parse(this.response);

                    if (this.status === 200) {
                        wcvaErrcnt = 0;
                        let results = typeof res != 'undefined' && res instanceof Object && 'results' in res ? res['results'] : [];
                        let efficientResult = !!results && results.length > 0 && results[0] instanceof Object ? results[0] : {};
                        let alternatives = 'alternatives' in efficientResult && !!efficientResult['alternatives'] ? efficientResult['alternatives'] : [];
                        let alternativeObj = alternatives.length > 0 && alternatives[0] instanceof Object ? alternatives[0] : {};
                        let transcript = 'transcript' in alternativeObj && !!alternativeObj['transcript'] ? alternativeObj['transcript'] : null;

                        if (typeof transcript != 'undefined' && !!transcript) {
                            resolve(transcript);
                        } else {
                            reject(null);
                        }
                    } else {
                        // Handle response errors
                        let error = 'error' in res ? res['error'] : {};
                        let message = 'message' in error && !!error['message'] ? error['message'].toLowerCase() : '';

                        if (wcvaErrcnt < 1 && !!message && message.indexOf('api key') !== -1) {
                            wcvaErrcnt++;

                            //$$$$$$$$$$$$$$$ FETCH NEW TOKEN MIGHT HAVE EXPIRED $$$$$$$$$$$$$$$$$$
                            wcvaRefreshVoiceServicesKeys().then(function(result) {
                                wcvaSttLanguageContext['gcp']['key'] = result;

                                // Try to transcript again with updated key
                                wcvaGcpStt().then(function(res){
                                    if (!!res) {
                                        resolve(res);
                                    } else {
                                        wcvaErrcnt = 0;
                                        reject(null);
                                    }
                                }).catch(function(err){
                                    wcvaErrcnt = 0;
                                    reject(null);
                                })
                            }).catch(function(error) {
                                alert(error);
                                wcvaErrcnt = 0;
                                reject(null);
                            });
                        } else {
                            wcvaErrcnt = 0;
                            reject(null);
                        }
                    }
                } catch(err) {
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        wcvaXhr.onerror = function(error) { reject(null); }

        wcvaXhr.open("POST", wcvaSttLanguageContext['gcp']['endPoint'] + wcvaSttLanguageContext['gcp']['qs']['key'] + wcvaSttLanguageContext['gcp']['key'], true);
        wcvaXhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        let recognitionConfig = {
            'config': {
                'encoding': 'ENCODING_UNSPECIFIED',
                'languageCode': wcvaSttLanguageContext['gcp']['langCode'],
                'enableWordTimeOffsets': false,
            },
            'audio': {
                'content': base64AudioStr
            },
        };

        wcvaXhr.send(JSON.stringify(recognitionConfig, null, true));
    });
}

/**
 * Function to sanitize/smartly format email to avoid text in a place of anticipated symbols
 *
 * @param { emailString: String } Email string to be formatted
 *
 * @returns { formattedEmail: String } Smartly formatted/sanitized email.
 */
function wcvaFormatEmail(emailString = null) {
    let formattedEmail = emailString;
    try {
        if (emailString && emailString !== null) {
            let vfEmail = emailString.toLowerCase();
            vfEmail = vfEmail.replace(/dot/gi, ".")
            .replace(/at/gi, "@")
            .replace(/underscore/gi, "_")
            .replace(/dotcom/gi, ".com")
            .replace(/dotorg/gi, ".org")
            .replace(/dotnet/gi, ".net")
            .replace(/dotint/gi, ".int")
            .replace(/dotedu/gi, ".edu")
            .replace(/ /g, "");

            formattedEmail = vfEmail;
        }
    } catch(err) {
        formattedEmail = emailString;
    }

    return formattedEmail;
}

/**
 * Function to get existing custom dialog response.function
 *
 * @param String selectedVoice  voice to check
 * @param String responseText  Speech text to check
 *
 * @return any If found returns object otherwise null
 *
 */
function wcvaGetExistingCustomDialogResponse(selectedVoice, responseText) {
    let existingCustomResponse = null;

    try {
        if (typeof wcva.wcvaCustomResponses != 'undefined' && !!wcva.wcvaCustomResponses && typeof selectedVoice != 'undefined' && !!selectedVoice) {
            let totalRes  = wcva.wcvaCustomResponses.length;
            selectedVoice = selectedVoice.trim();
            responseText  = responseText.trim();

            for (let wa = 0; wa < totalRes; wa++) {
                let res = wcva.wcvaCustomResponses[wa];
                let existingSpeechText = typeof res['response'] != 'undefined' && res['response'] ? res['response'].trim() : null;
                let existingSpeechVoice = typeof res['voice'] != 'undefined' && res['voice'] ? res['voice'].trim() : null;

                if (!(!!existingSpeechText && !!existingSpeechVoice)) continue;

                if (existingSpeechText === responseText && selectedVoice === existingSpeechVoice) {
                    existingCustomResponse = JSON.parse(JSON.stringify(res));
                    break;
                }
            }
        }
    } catch(err) {
        existingCustomResponse = null;
    }

    return existingCustomResponse;
}

/**
 * Function to get Generic dialog based on given intent name and get validation flag to determine need of audio generation.
 *
 * @param String selectedVoice  Currently selected voice of plugin
 * @param String intentName  Name of the intent/dialog
 *
 * @return Object existingDialog  Containing generic dialog object and a boolean flag to denote need of audio generation
 *
 */
function wcvaGetGenericDialog(selectedVoice, intentName) {
    this.existingDialog = { 'dialog': {}, 'generateAudio': false };

    try {
        if (
            !(typeof wcvaSettingsData != 'undefined' && !!wcvaSettingsData &&
            typeof selectedVoice != 'undefined' && !!selectedVoice &&
            typeof intentName != 'undefined' && !!intentName)
        ) {
            throw 'WCVA Error: Settings data or parameters are missing while checking generic dialog existence.';
        }

        this.selectedVoice = selectedVoice.trim();
        this.intentName = intentName.trim();
        this.dialog = this.intentName in wcvaSettingsData ? wcvaSettingsData[this.intentName] : {};

        if (!(!!this.dialog && Object.keys(this.dialog).length > 0)) {
            throw 'WCVA Error: Dialog is missing while checking generic dialog existence.';
        }

        this.existingDialog['dialog'] = JSON.parse(JSON.stringify(this.dialog));

        let dialogText = 'response' in this.dialog && !!this.dialog['response'] ? this.dialog['response'].trim() : null;
        let dialogActive = 'enabled' in this.dialog && !!this.dialog['enabled'] ? this.dialog['enabled'].trim() : null;

        let audioData = 'intent_audio_response' in this.dialog && !!this.dialog['intent_audio_response'] ? this.dialog['intent_audio_response'] : {};
        let audioVoice = 'voice' in audioData && !!audioData['voice'] ? audioData['voice'].trim() : null;
        let audioPath = 'path' in audioData && !!audioData['path'] ? audioData['path'].trim() : null;

        if (
            typeof dialogText != 'undefined' && !!dialogText &&
            typeof dialogActive != 'undefined' && !!dialogActive && dialogActive === 'enabled' &&
            (!(typeof audioPath != 'undefined' && !!audioPath) ||
            !(typeof audioVoice != 'undefined' && !!audioVoice &&
            audioVoice === this.selectedVoice))
        ){
            this.existingDialog['generateAudio'] = true;
        }
    } catch(err) {
        this.existingDialog = { 'dialog': {}, 'generateAudio': false };
    }

    return this.existingDialog;
}

/**
 * Function to make AJAX call for generating custom dialog response
 *
 * @param String cdResponseText Spech text
 *
 * @return Promise
 */
function wcvaCustomDialogTtsOnTheFly(cdResponseText) {
    return new Promise(function(resolve, reject) {
        if (!(typeof cdResponseText != 'undefined' && !!cdResponseText)) {
            reject(null);
            return;
        }

        let formData = new FormData();
        formData.append("response_text", cdResponseText);
        formData.append("action", "wcva_custom_dialog_text_to_speech");
        formData.append("_ajax_nonce", wcvaAjaxObj.custom_dialog_nonce);

        let wcvaXhr = new XMLHttpRequest();

        wcvaXhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res['success'] != 'undefined' && res.success === true ? true : false;
                    let data = typeof res['data'] != 'undefined' ? res['data'] : null;

                    if (!!data && success) {
                        let updatedCollection = typeof data['updated_collection'] != 'undefined' ? data['updated_collection'] : null;
                        let customResponse = typeof data['custom_response'] != 'undefined' ? data['custom_response'] : null;

                        if (!!updatedCollection && !!customResponse) {
                            wcva.wcvaCustomResponses = updatedCollection;
                            resolve(customResponse);
                        } else {
                            reject(null);
                        }
                    } else {
                        reject(null);
                    }
                } else {
                    // Handle response errors
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        wcvaXhr.onerror = function(error) { reject(wcvaErrorLibrary['outOfService']); }
        
        let queryString = "?action=wcva_custom_dialog_text_to_speech&_ajax_nonce=" + wcvaAjaxObj.custom_dialog_nonce;
        wcvaXhr.open("POST", wcvaAjaxObj.ajax_url, true); 
        wcvaXhr.send(formData);
    });
}

/**
 * Function to make AJAX call for generating generic dialog response
 *
 * @param String gdResponseText Spech text
 *
 * @return Promise
 */
function wcvaGenericDialogTtsOnTheFly(gdResponseText, dbOptionName) {    
    return new Promise(function(resolve, reject) {
        if (!(typeof gdResponseText != 'undefined' && !!gdResponseText && typeof dbOptionName != 'undefined' && !!dbOptionName)) {
            reject(null);
            return;
        }        

        let formData = new FormData();
        formData.append("dialog_text", gdResponseText);
        formData.append("dialog_op_name", dbOptionName);
        formData.append("user", "tts");
        formData.append("action", "wcva_generic_dialog_tts_on_the_fly");
        formData.append("_ajax_nonce", wcvaAjaxObj.generic_dialog_nonce);
        
        let wcvaXhr = new XMLHttpRequest();

        wcvaXhr.onreadystatechange = function () {
            if (this.readyState == 4) { 
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res['success'] != 'undefined' && res.success === true ? true : false; 
                    let data = typeof res['data'] != 'undefined' ? res['data'] : null;
                    
                    if (!!data && success) {
                        if (typeof data['path'] != 'undefined' && data['path']) {
                            let updatedGenericDialogs = typeof data['updated_generic_dialogs'] != 'undefined' ? data['updated_generic_dialogs'] : null;
                            
                            if (!!updatedGenericDialogs && Object.keys(updatedGenericDialogs).length > 0) wcvaSettingsData = updatedGenericDialogs;
                            
                            resolve(data);
                        } else {
                            reject(null);
                        }
                    } else {
                        reject(null);
                    }
                } else {
                    // Handle response errors
                    reject(null);
                }
            }
        }

        // Handle parsing or transmission errors
        wcvaXhr.onerror = function(error) { reject(wcvaErrorLibrary['outOfService']); }
        
        wcvaXhr.open("POST", wcvaAjaxObj.ajax_url, true); 
        wcvaXhr.send(formData);
    });
}

