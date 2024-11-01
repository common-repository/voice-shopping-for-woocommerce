// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                             ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

window.onload = (event) => {
(function () {
    'use strict';

    let wcvaMicEventToListen = 'click';
    let wcvaDisableSearchFieldMic = typeof wcva.wcvaDisableSearchMic != 'undefined' && wcva.wcvaDisableSearchMic == '1' ? true : false;
    let wcvaDisableFormsFieldsMic = typeof wcva.wcvaDisableFormsMic != 'undefined' && wcva.wcvaDisableFormsMic == '1' ? true : false;

    /**
     * Function to clear mic reset timeout
     *
     */
    function wcvaClearMicResetTimeout() {
        try {
            if (window.wcvaMicTimeoutIdentifier) {
                clearTimeout(window.wcvaMicTimeoutIdentifier);
                window.wcvaMicTimeoutIdentifier = null;
            }    
        } catch(err) {
            // Do nothing for now
        }
    }

    /**
     * Function to clear mic stop display timeout
     *
     */
    function wcvaClearIosMicStopDisplayTimeout() {
        try {
            if (wcvaClientInfo.ios === false) return false;

            if (window.wcvaIosMicTimeoutIdentifier) {
                clearTimeout(window.wcvaIosMicTimeoutIdentifier);
                window.wcvaIosMicTimeoutIdentifier = null;
            }
        } catch(err) {
            // Do nothing for now
        }
    }

    /**
     * Function to clear floating mic response reset timeout
     *
     */
    function wcvaClearBotResetTimeout() {
        try {
            if (window.wcvaBotTimeoutIdentifier) {
                clearTimeout(window.wcvaBotTimeoutIdentifier);
                window.wcvaBotTimeoutIdentifier = null;
                wcvaWidgetToggleButton.classList.remove('responding');
                wcvaWidgetChatHeader.classList.remove('responding');
            }
        } catch (err) {
            // Do nothing for now
        }
    }

        /**
         * Function to display/hide mic and stop icons
         *
         * @param { micIcon: DOM Object } Mic icon element
         * @param { stopIcon: DOM Object } Stop icon element
         * @param { showStopIcon: Boolean } To display/hide stop button in a place of mic icon
         */
        function wcvaMicButtonImageSwitch(micIcon, stopIcon, showStopIcon = false) {
            try {
                let micIconClasses = micIcon.classList || null;
                let stopIconClasses = stopIcon.classList || null;

            if (!(micIconClasses && stopIconClasses)) return false;

            if (showStopIcon === true) {
                micIconClasses.add('wcva-hide-element');
                stopIconClasses.remove('wcva-hide-element');
            } else {
                micIconClasses.remove('wcva-hide-element');
                stopIconClasses.add('wcva-hide-element');
            }
        } catch(err) {
            // do nothing for now
        }
    }

    // Clear any pre-existing timeouts
    wcvaClearMicResetTimeout();
    wcvaClearIosMicStopDisplayTimeout();    

    // Localized variables
    wcvaTypeOfSearch = (typeof(wcva.wcvaTypeOfSearch) != 'undefined' && wcva.wcvaTypeOfSearch !== null) ? wcva.wcvaTypeOfSearch : 'native';

    let wcvaDefaultSearchableHints = ['Ask about our company', 'Ask for opening hours'];
    wcvaSearchableHints = (typeof(wcvaSearchableHints) != 'undefined' && wcvaSearchableHints !== null) ? wcvaSearchableHints : wcvaDefaultSearchableHints;

    // Ensure wcvaSearchableHints to be array only
    if (wcvaSearchableHints.constructor !== Array) { wcvaSearchableHints = []; }

    // If wcvaSearchableHints an empty array then populate it with default searchable hints
    if (wcvaSearchableHints.length == 0) { wcvaSearchableHints = wcvaDefaultSearchableHints; }

    // Auto timeout duration to stop listening Mic
    let wcvaOtherInputTimeoutDuration = null;
    let wcvaTextareaTimeoutDuration = 20 * 1000;

    let wcvaTimerID = 0;

    if (typeof(wcva.wcvaMicListenTimeoutDuration) != 'undefined' && wcva.wcvaMicListenTimeoutDuration !== null) {
        wcvaOtherInputTimeoutDuration = parseInt(wcva.wcvaMicListenTimeoutDuration);
        wcvaOtherInputTimeoutDuration = isNaN(wcvaOtherInputTimeoutDuration) ? 8 : wcvaOtherInputTimeoutDuration;
    } else {
        wcvaOtherInputTimeoutDuration = 8;
    }


    // Handle mic listening timeout exceptions
    wcvaOtherInputTimeoutDuration = (wcvaOtherInputTimeoutDuration < 8) ? 8 : wcvaOtherInputTimeoutDuration;
    wcvaOtherInputTimeoutDuration = (wcvaOtherInputTimeoutDuration > 20) ? 20 : wcvaOtherInputTimeoutDuration;
    wcvaOtherInputTimeoutDuration = wcvaOtherInputTimeoutDuration * 1000;

    /**
     * Function to clear mic listening timeout interval
     *
     * @param { timerInstance: var } The name of the timer
     */
    function wcvaClearTimer(timerInstance) {
        try {
            if (typeof (timerInstance) != 'undefined' && timerInstance !== null && timerInstance != false) {
                clearInterval(timerInstance);
            }
        } catch (err) {/* do nothing for now*/ }
    }

    /**
     * Function to sanitize alpha-numeric css values to get numeric value
     *
     * @param { number: Any } Any value
     *
     * @returns Number
     */
    function getNumber(number) {
        number = parseInt(number, 10);
        return isNaN(number) || number === null || typeof (number) === 'undefined' ? 0 : number;
    }

    /**
     * Function to check if any of the WCVA mic listening
     *
     * @param { wcvaExceptionBtnId: String } Id of mic which needs to be excluded from check
     * @param { wcvaWidgetMicEl: DOM Object } Widget mic element
     *
     * @returns { wcvaOneOfMicListening: Boolean } 'true' if any mic listening otherwise false
     */
    function wcvaAnyOtherMicListening(wcvaExceptionBtnId = null, wcvaWidgetMicEl = null) {
        let wcvaOneOfMicListening = false;
        try {
            let wcvaAllMicButtons = document.querySelectorAll('button.voice-shopping-for-woocommerce-button');

            if (typeof(wcvaAllMicButtons) == 'undefined' 
                || wcvaAllMicButtons === null 
                || wcvaExceptionBtnId == null) return wcvaOneOfMicListening;

            let wcvaAllMicButtonsLength = wcvaAllMicButtons.length;

            for (let wcvaI = 0; wcvaI < wcvaAllMicButtonsLength; wcvaI++) {
                let wcvaClassNames = wcvaAllMicButtons[wcvaI].className;
                let wcvaBtnId = wcvaAllMicButtons[wcvaI].getAttribute('id');

                if (!(typeof(wcvaClassNames) != 'undefined' && wcvaClassNames.trim() != '')) continue;

                if (wcvaClassNames.indexOf('listening') != -1 && wcvaExceptionBtnId != wcvaBtnId) {
                    wcvaOneOfMicListening = true;
                    break;
                }
            }

            if (wcvaOneOfMicListening == false) {                
                if (wcvaWidgetMicEl === null) {
                    let widgetMicEl = document.querySelector('#wcvaWidgetMic');

                    if (widgetMicEl !== null && widgetMicEl.className.indexOf('listening') != -1) {
                        wcvaOneOfMicListening = true;
                    }
                } 
            }
        } catch (err) {
            wcvaOneOfMicListening = false;
        }

        return wcvaOneOfMicListening;
    }

    /**
     * Function to get random searchable hint text
     *
     * @returns { wcvaHint: String } Random search hint text
     */
    function wcvaGetRandomSearchHint(){
        let wcvaHint = 'Ask about us.';
        try {
            let wcvaTotalHints = wcvaSearchableHints.length;
            let wcvaRandomIndex = Math.floor(Math.random() * wcvaTotalHints); 
            let tempHint = wcvaSearchableHints[wcvaRandomIndex];
            
            if (typeof(tempHint) != 'undefined' && tempHint.trim() != '') { wcvaHint = tempHint;}
        } catch (err) {
            wcvaHint = 'Ask about us.';
        }

        return wcvaHint;
    }

    let recordTimer = null;

    // Add custom identity markup to top search bar and mobile menu search bar
    let topSearchBarInput = document.querySelector('div#search-outer form input[type=text]');
    let mobileSearchBarInput = document.querySelector('div#mobile-menu form input[type=text]');
    
    if (topSearchBarInput !== null) { topSearchBarInput.setAttribute('data-wcva-top-search-bar', 'true');}

    if (mobileSearchBarInput !== null) { mobileSearchBarInput.setAttribute('data-wcva-mobile-search-bar', 'true');}

    let speechInputWrappers = document.querySelectorAll('form');// Get all forms on a page
    let typeOfInputFieldsToSeek = ['text', 'email', 'search'];// For normal forms
    let formElementForWidget = null;
    let formInputElementForWidget = null;

    [].forEach.call(speechInputWrappers, function (speechInputWrapper, index) {
        try {
            // Try to show the form temporarily so we can calculate the sizes
            let speechInputWrapperStyle = speechInputWrapper.getAttribute('style');
            let havingInlineStyle = (typeof(speechInputWrapperStyle) != 'undefined' 
                && speechInputWrapperStyle !== null && speechInputWrapperStyle.trim() != '') ? true : false;
            speechInputWrapperStyle = (havingInlineStyle) ? speechInputWrapperStyle + ';' : '';
            speechInputWrapper.setAttribute('style', speechInputWrapperStyle + 'display: block !important');
            //speechInputWrapper.classList.add('voice-shopping-for-woocommerce-wrapper');
            speechInputWrapper.classList.add('wcva-sanitize-form-wrapper');

            let isSearchForm = false;
            var recognizing = false;
            let roleOfForm = speechInputWrapper.getAttribute('role') || "";
            let classesOfForm = speechInputWrapper.classList || "";
            let allInputElements = speechInputWrapper.querySelectorAll('input:not([type=hidden]):not([id=wcvaWidgetSearch]):not([style*="none"]), button[type=submit], textarea:not([style*="none"]');

            if (roleOfForm.toLowerCase() === 'search' || classesOfForm.contains('searchform') 
                || classesOfForm.contains('search_form') || classesOfForm.contains('search-form') 
                || classesOfForm.contains('searchForm')) {
                isSearchForm = true;
            }

            // Preserve first form on page and it's input element for widget
            if (isSearchForm && !formElementForWidget) {
                formElementForWidget = speechInputWrapper;
            }

            [].forEach.call(allInputElements, function (inputElement, inputIndex) {
                let inputEl = null;
                let inputType = inputElement.getAttribute('type') || "";
                let classesOfInput = inputElement.className || "";
                let idOfInputElement = inputElement.getAttribute('id') || null;
                let tagNameOfInputElement = inputElement.tagName;

                if (idOfInputElement && idOfInputElement !== null) {
                    idOfInputElement = idOfInputElement.toLowerCase();
                }

                if (classesOfInput && classesOfInput !== null) {
                    classesOfInput = classesOfInput.toLowerCase();
                }

                // Check if input marked with keywords related to date
                let isDateField = false;

                // Check for search form
                if (classesOfInput.indexOf('datepicker') !== -1 
                    || classesOfInput.indexOf('date') !== -1 
                    || idOfInputElement === 'datepicker' 
                    || idOfInputElement === 'date') {
                    isDateField = true;
                }

                // check if input field is intented for date picking
                if (classesOfInput.indexOf('datepicker') === -1 
                    && idOfInputElement !== 'datepicker' 
                    && classesOfInput.search(/validat|candidat/ig) !== -1) {
                    isDateField = false;
                }

                // check if text field is intended for email
                if (inputType === 'text' && classesOfInput.search(/email/ig) !== -1) {
                    inputType = 'email';
                }

                // Check textarea/large input box
                let isTextArea = (tagNameOfInputElement.toLowerCase() === 'textarea') ? true : false;

                if ((typeOfInputFieldsToSeek.includes(inputType) && isDateField == false) || isTextArea == true) {                    
                    inputEl = inputElement;
                } else if (inputType.toLowerCase() == 'submit' && (!wcvaDisableSearchFieldMic || !wcvaDisableFormsFieldsMic)) {
                    // Remove any overlapping icon from submit button of search form
                    if (isSearchForm && !wcvaDisableSearchFieldMic) {
                        let submitButtonChildNodes = inputElement.querySelectorAll('img, svg');
                        
                        for (let j = 0; j < submitButtonChildNodes.length; j++) {
                            let submitBtnChildNode = submitButtonChildNodes[j];
                            submitBtnChildNode.classList.add('wcva-hide-element');
                        }
                    }

                    speechInputWrapper.addEventListener('submit', function(evt) {
                        // Restrict form submission if mic is recording
                        if (recognizing == true) {
                            evt.preventDefault();
                            return false;
                        }

                        // Handle submission of search form
                        if (isSearchForm === true && !wcvaDisableSearchFieldMic) {
                            try {
                                // Engage speak2web AI if native search is not configured 
                                if (wcvaTypeOfSearch != 'native') {
                                    // Prevent default text search
                                    evt.preventDefault();

                                    // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                                    if (!(typeof(wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                                        // Play feature unavailable playback
                                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                                        wcvaIntentResponsePlayer.play();

                                        return false;
                                    }

                                    if (!wcvaClientInfo.android) {
                                        // Play basic aknowledgement playback
                                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['basic']);
                                        wcvaIntentResponsePlayer.play();

                                        // Get value of text box in search form's context
                                        let wcvaSearchBox = this.querySelector('input.wcv-assistant-mic-band');
                                        let wcvaSearchBoxValue = wcvaSearchBox ? wcvaSearchBox.value : "";

                                        // Send input to speech.js
                                        wcvaSendDialog(wcvaSearchBoxValue, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                            if (typeof navigationCbAfterAudioPlay !== 'function') {
                                                navigationCbAfterAudioPlay = function() {
                                                    // If dialog for intent is disabled in settings then fire native search
                                                    if (isNativeSearch === true) {
                                                        try { speechInputWrapper.submit(); } 
                                                        catch (err) { console.log('WCVA: Something went wrong while submitting a form for native search.'); }
                                                    }
                                                }
                                            }

                                            // Play intent response playback
                                            wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                            wcvaIntentResponsePlayer.play();
                                        });
                                    }
                                }
                            } catch(err) {
                                console.log('WCVA Exception: Unable to submit the form due to: ' + err.message);
                            }
                        }
                    }, false);
                }

                // If search input field not found then continue
                if (null === inputEl) { return true; }

                // Adding manual mic position on specified input fields
                if(wcvaIsInputFieldMic == false) {
                    var inputFieldPlaceholder = inputEl.placeholder;
                    if(inputFieldPlaceholder.includes("{allow_stt}") == true){
                        inputEl.placeholder = inputFieldPlaceholder.replace("{allow_stt}","");
                    }else if(wcvaDisableSearchFieldMic == false && isSearchForm == true){

                    }else return true;
                } else {
                    var inputFieldPlaceholder = inputEl.placeholder;
                    if (inputFieldPlaceholder.includes("{allow_stt}") == true) {
                        inputEl.placeholder = inputFieldPlaceholder.replace("{allow_stt}", "");
                    }
                }

                // Preserve first form on page and it's input element for widget
                if (isSearchForm) {
                    if (!formInputElementForWidget) {
                        formInputElementForWidget = inputEl;
                    }

                    // Not to attach mic to search fields if disabled from settings
                    if (wcvaDisableSearchFieldMic) {
                        return false;
                    }
                }
                // Not to attach mic to form fields if disabled from settings 
                else if (wcvaDisableFormsFieldsMic) {
                    return false;
                }

                // Add some markup as a button to the search form
                let micBtn = document.createElement('button');
                micBtn.setAttribute('type', 'button');
                micBtn.setAttribute('class', 'voice-shopping-for-woocommerce-button');
                micBtn.setAttribute('id', 'voice-shopping-for-woocommerce-button' + index + '' + inputIndex);

                // Add mic image icon
                let wcvaMicIcon = document.createElement('img');
                wcvaMicIcon.setAttribute('src', wcva.wcvaImagesPath + 'wcva-mic.svg');
                wcvaMicIcon.setAttribute('class', 'wcva-mic-image');
                wcvaMicIcon.setAttribute('id', 'wcva-mic-img' + index + '' + inputIndex);
                micBtn.appendChild(wcvaMicIcon);

                let wcvaMicStopIcon = document.createElement('img');

                if (wcvaClientInfo.ios === true) {
                    wcvaMicStopIcon.setAttribute('src', wcva.wcvaImagesPath + 'wcva-mic-stop.svg');
                    wcvaMicStopIcon.setAttribute('class', 'wcva-stop-alert wcva-hide-element');
                    wcvaMicStopIcon.setAttribute('id', 'wcva-mic-stop' + index + '' + inputIndex);
                    micBtn.appendChild(wcvaMicStopIcon);
                }
                
                let inputHeight = getNumber(inputEl.offsetHeight);// Get search input height

                // Sanitize operands of calculation for search input's with custom identification markup
                let topSearchBarCustomId = inputEl.getAttribute('data-wcva-top-search-bar');
                let mobileSearchBarCustomId = inputEl.getAttribute('data-wcva-mobile-search-bar');
                let isTopSearchBar = false, isMobileSearchBar = false;

                if (typeof(topSearchBarCustomId) != 'undefined' && topSearchBarCustomId !== null && topSearchBarCustomId.trim() != '') {
                    isTopSearchBar = true;

                    if (inputHeight == 0) { inputHeight = 59; } // Manually consider height of search input if not available
                }

                if (typeof(mobileSearchBarCustomId) != 'undefined' 
                    && mobileSearchBarCustomId !== null 
                    && mobileSearchBarCustomId.trim() != '') { isMobileSearchBar = true; }

                let buttonSize = getNumber(0.8 * inputHeight);

                // Set default mic button size to 35px when button size calculated to 0 or unknown
                if (getNumber(buttonSize) == 0) { inputHeight = buttonSize = 35; }

                let micbtnPositionTop = getNumber(0.1 * inputHeight);

                // Calculate position of mic button for search input field with custom identification markup
                if (isMobileSearchBar == true || isTopSearchBar == true) { micbtnPositionTop = micbtnPositionTop + 20; }
                
                // For textarea/large input
                if (isTextArea === true) {
                    micbtnPositionTop = 10;
                    buttonSize = 35;
                }

                // Size and position of complete mic button
                let inlineStyle = 'top: ' + micbtnPositionTop + 'px; ';
                inlineStyle += 'height: ' + buttonSize + 'px !important; ';
                inlineStyle += 'width: ' + buttonSize + 'px !important; ';
                inlineStyle += 'z-index: 999 !important; margin-left: 3px !important; border-radius: 50% !important; border: 2px solid #ffff !important;';
                micBtn.setAttribute('style', inlineStyle);

                // Create Wrapper to wrap around input search field like a elastic band
                let wrapper = document.createElement('div');
                wrapper.setAttribute('style', speechInputWrapperStyle + 'display: inline-block !important');

                let inputCurrentStyle = window.getComputedStyle(inputEl);
                wrapper.setAttribute('class', 'wcv-assistant-mic-band');
                wrapper.setAttribute('onclick', 'return false');
                wrapper.style.width = inputCurrentStyle.width;

                inputEl.insertAdjacentElement('beforebegin', wrapper);// Place wrapper before input search field

                // Set parent element's (parent of inputEl) display stack order higher 
                // To handle overlapped submit button on mic icon
                let parentEl = inputEl.parentNode.nodeName;

                if (typeof(parentEl) != 'undefined' && parentEl !== null && parentEl.length != 0) {
                    parentEl = parentEl.toLowerCase();

                    if (parentEl != 'form') {
                        inputEl.parentNode.style.zIndex = 1;
                    }
                }

                // Append search input field element inside a wrapper band
                wrapper.appendChild(inputEl);

                // Place mic button/icon exact before search input field element
                inputEl.insertAdjacentElement('beforebegin', micBtn);
                inputEl.setAttribute('style', speechInputWrapperStyle + 'width: 100% !important');

                inputEl.classList.add('wcv-assistant-mic-band');

                // Reset form style again
                speechInputWrapper.setAttribute('style', speechInputWrapperStyle);      
                
                // Setup recognition
                let finalTranscript  = '';
                let final_transcript = "";
                let ignore_onend;

                // To By-pass focus out/blur of search input field to cause disappearance of top search bar
                if (isTopSearchBar == true) {
                    micBtn.addEventListener('mousedown', function(evt){
                        evt.preventDefault();
                        return true;
                    }, false);
                }

                if ('webkitSpeechRecognition' in window && wcvaClientInfo['chrome'] === true) {
                    let recognition = new webkitSpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;

                    recognition.onstart = function () {
                        recognizing = true;
                    };

                    recognition.onerror = function (event) {
                        micBtn.classList.remove('listening');
                        recognizing = false;

                        if (event.error == 'no-speech') {
                            inputEl.placeholder = wcvaMessages['unableToHear'];

                            // Play not audible playback
                            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                            wcvaIntentResponsePlayer.play();

                            ignore_onend = true;
                        }
                        if (event.error == 'audio-capture') {
                            inputEl.placeholder = wcvaMessages['micNotAccessible'];
                            ignore_onend = true;
                        }
                        if (event.error == 'not-allowed') {
                            inputEl.placeholder = wcvaMessages['browserDenyMicAccess'];
                            micBtn.style.setProperty("color", "white");
                            ignore_onend = true;
                        }
                    };

                    function processEnd() {
                        recognizing = false;

                        if (ignore_onend) {
                            return;
                        }

                        micBtn.classList.remove('listening');
                        micBtn.style.setProperty("color", "white");

                        function wcvaHandleTextualResponse() {
                            if (typeof(finalTranscript) != 'undefined' && finalTranscript.length != 0) {
                                let transcribedText = finalTranscript;

                                // Sanitize email before putting transcribed text in input field
                                if (inputType === 'email') {
                                    transcribedText = wcvaFormatEmail(transcribedText);
                                }

                                let newChromeTranscribedText = transcribedText && transcribedText !== null ? transcribedText : finalTranscript;

                                if (isTextArea === true) {
                                    // Preserve previous input value for textarea and append new value
                                    inputEl.value += ' ' + newChromeTranscribedText;
                                } else {
                                    inputEl.value = newChromeTranscribedText;
                                }
                                
                                if (isSearchForm === true) {
                                    wcvaSendDialog(finalTranscript, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                        if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                            navigationCbAfterAudioPlay = function(){
                                                // If dialog for intent is disabled in settings then fire native search
                                                if (isNativeSearch === true) {
                                                    try { speechInputWrapper.submit(); } 
                                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                }
                                            };
                                        }

                                        // Play intent response playback
                                        wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                        wcvaIntentResponsePlayer.play();
                                    });
                                }
                            } else {
                                inputEl.placeholder = wcvaMessages['ask'];
                            }
                        }

                        if (isSearchForm === true) {
                            let i = Math.floor(Math.random() * 10);
                            let resp = wcvaAlternativeResponse['randomLib'];

                            // Play random response playback
                            wcvaIntentResponsePlayer.configure(resp[i], function () { wcvaHandleTextualResponse(); });
                            wcvaIntentResponsePlayer.play();
                        } else {
                            wcvaHandleTextualResponse();
                        }
                    };

                    recognition.onend = function () {
                        if (wcvaClientInfo.android) {
                            processEnd();
                        }
                    };

                    recognition.onresult = function (event) {
                        let interim_transcript = '';
                        
                        if (typeof (event.results) == 'undefined') {
                            recognition.onend = null;
                            recognition.stop();
                            inputEl.placeholder = wcvaMessages['unableToHear'];

                            // Play mic connect issue playback
                            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['micConnect']);
                            wcvaIntentResponsePlayer.play();

                            return;
                        }

                        let evtResultsLength = event.results.length;

                        for (let i = event.resultIndex; i < evtResultsLength; ++i) {
                            if (event.results[i].isFinal) {
                                finalTranscript = event.results[i][0].transcript;

                                if (wcvaClientInfo.android == false) {
                                    processEnd();
                                    recognition.stop();
                                }                        
                            } else {
                                if (isTextArea === false) {
                                    interim_transcript += event.results[i][0].transcript;
                                    inputEl.value = interim_transcript;
                                }                                
                            }
                        }
                    };

                    micBtn.addEventListener(wcvaMicEventToListen, function (event) {
                        // micBtn.onclick = function (event) {
                        if (wcvaAnyOtherMicListening(micBtn.getAttribute('id')) === true) return;

                        // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                        if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                            // Play feature unavailable playback
                            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                            wcvaIntentResponsePlayer.play();

                            return;
                        }

                        if (recognizing) {
                            // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                            wcvaClearMicResetTimeout();

                            // Need to stop the recording
                            if (isSearchForm === true) { inputEl.placeholder = wcvaGetRandomSearchHint(); }
                            
                            if (wcvaClientInfo.android == false) {
                                processEnd();
                                recognition.stop();
                            }
                        } else {
                            if (isSearchForm === true) { inputEl.placeholder = wcvaGetRandomSearchHint(); }

                            micBtn.classList.add('listening');
                            event.preventDefault();

                            // Stop ongoing playback if nay
                            if (wcvaIntentResponsePlayer.isPlaying()) {
                                wcvaIntentResponsePlayer.stop();
                            }

                            finalTranscript = '';
                            
                            if (isTextArea === false) {
                                inputEl.value = '';
                            }
                            
                            recognizing = true;
                            recognition.lang = !!wcvaSttLanguageContext['gcp']['stt'] ? wcvaSttLanguageContext['gcp']['langCode'] : 'en-US';
                            recognition.start();
                            ignore_onend = false;

                            // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                            wcvaClearMicResetTimeout();

                            // To set new mic reset timeout. (Based on duration from settings)
                            window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                                let updatedClassList = micBtn.classList;

                                if (updatedClassList && updatedClassList.contains('listening')) {
                                    micBtn.click();
                                }
                            }, inputEl.tagName.toLowerCase() == 'textarea' ? wcvaTextareaTimeoutDuration : wcvaOtherInputTimeoutDuration);
                        }
                    });
                } else {
                    //CODE FOR BROWSERS THAT DO NOT SUPPORT STT NATIVLY
                    // MUST USE THE BUILT IN MICROPHONE
                    micBtn.addEventListener(wcvaMicEventToListen, function (event) {
                        /**
                         * Audio element's play method must be invoked in exact influence of user gesture to avoid auto play restriction
                         * 
                         */
                        if (
                            wcvaClientInfo.ios === true
                            || (wcvaClientInfo.safari && !wcvaClientInfo.chrome && !wcvaClientInfo.firefox && !wcvaClientInfo.edge)
                            || (wcvaClientInfo.windows && wcvaClientInfo.firefox)
                        ) {
                            wcvaIntentResponsePlayer.configure(wcvaSilenceSoundPath);
                            wcvaIntentResponsePlayer.play();
                        }

                        if (wcvaAnyOtherMicListening(micBtn.getAttribute('id')) === true) return;

                        // Deny recording if microphone is not accessible
                        if (!wcvaAudioRecorder || !wcvaAudioContext) {
                            wcvaInitAudio(function (a) {
                                if (!wcvaAudioRecorder || !wcvaAudioContext) {
                                    alert(wcvaMessages['micNotAccessible']);
                                    return false;
                                } else {
                                    listenEvent();
                                }
                            });
                        } else {
                            listenEvent();
                        }

                        function listenEvent() {
                            // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                            if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                                // Play feature unavailable playback
                                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                                wcvaIntentResponsePlayer.play();

                                return false;
                            }

                            // User ending recording by clicking back mic
                            if (recognizing) {
                                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                                wcvaClearMicResetTimeout();

                                // For iOS only
                                if (wcvaClientInfo.ios === true) {
                                    // To clear pre-existing mic stop display timeout if any.
                                    wcvaClearIosMicStopDisplayTimeout();

                                    let micIconClasses = wcvaMicIcon.classList;
                                
                                    if (micIconClasses.contains('wcva-hide-element')) {
                                        // To reset/display mic icon back
                                        wcvaMicButtonImageSwitch(wcvaMicIcon, wcvaMicStopIcon);
                                    }
                                }

                                // Stop recorder
                                wcvaAudioRecorder.stop();

                                // Stop access to audio resource
                                wcvaStopAudio();

                                // Stop ongoing playback if nay
                                if (wcvaIntentResponsePlayer.isPlaying()) {
                                    wcvaIntentResponsePlayer.stop();
                                }

                                //replace recording with mic icon
                                micBtn.classList.remove('listening');

                                micBtn.style.setProperty("color", "white");
                                inputEl.placeholder = wcvaMessages['transcribeText'];

                                wcvaAudioRecorder.getBuffers(function (buffers) {                                
                                    if (!!wcvaSttLanguageContext['gcp']['stt']) {
                                        wcvaAudioRecorder.exportMonoWAV(function (blob) {
                                            wcvaAudioRecorder.convertBlobToBase64(blob).then(function(resultedBase64){
                                                wcvaGcpStt(resultedBase64).then(function(transcriptResult){
                                                    if (typeof(transcriptResult) != 'undefined' && transcriptResult.length != 0) {
                                                        let transcribedText = transcriptResult;

                                                        // Sanitize email before putting transcribed text in input field
                                                        if (inputType === 'email') {
                                                            transcribedText = wcvaFormatEmail(transcribedText);
                                                        }
                                                        
                                                        let newNonChromeTranscribedText = transcribedText && transcribedText !== null ? transcribedText : transcriptResult;

                                                        if (isTextArea === true) {
                                                            // Preserve previous input value for textarea and append new value
                                                            inputEl.value += ' ' + newNonChromeTranscribedText;
                                                        } else {
                                                            inputEl.value = newNonChromeTranscribedText;
                                                        }

                                                        if (isSearchForm === true) {
                                                            wcvaSendDialog(transcriptResult, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                                                if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                                                    navigationCbAfterAudioPlay = function(){
                                                                        // If dialog for intent is disabled in settings then fire native search
                                                                        if (isNativeSearch === true) {
                                                                            try { speechInputWrapper.submit(); } 
                                                                            catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                                        }
                                                                    };
                                                                }
                                                                
                                                                // Play intent response playback
                                                                wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                                                wcvaIntentResponsePlayer.play();
                                                            });
                                                        }
                                                    } else {
                                                        // Play not audible playback
                                                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                                        wcvaIntentResponsePlayer.play();

                                                        inputEl.placeholder = wcvaMessages['ask'];
                                                    }
                                                });
                                            }).catch(function(error){
                                                // Play 'notAudible' playback
                                                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                                wcvaIntentResponsePlayer.play();

                                                inputEl.placeholder = wcvaMessages['ask'];
                                            });
                                        });
                                    }
                                    else{
                                        // Play not audible playback
                                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                        wcvaIntentResponsePlayer.play();

                                        inputEl.placeholder = wcvaMessages['ask']; 
                                    }
                                });

                                recognizing = false;
                                return;
                            } else {// User started recording by clicking mic
                                if (isSearchForm === true) { inputEl.placeholder = wcvaGetRandomSearchHint(); } 

                                micBtn.classList.add('listening');
                                event.preventDefault();

                                // Stop ongoing playback if nay
                                if (wcvaIntentResponsePlayer.isPlaying()) {
                                    wcvaIntentResponsePlayer.stop();
                                }

                                finalTranscript = '';

                                if (isTextArea === false) {
                                    inputEl.value = '';
                                }

                                recognizing = true;
                                wcvaAudioRecorder.clear();
                                wcvaAudioRecorder.record(micBtn, inputEl.tagName);

                                // For iOS only
                                if (wcvaClientInfo.ios === true) {
                                    // To clear pre-existing mic stop display timeout if any.
                                    wcvaClearIosMicStopDisplayTimeout();

                                    let micIconClasses = wcvaMicIcon.classList;

                                    if (!micIconClasses.contains('wcva-hide-element')) {
                                        // To set new mic stop display timeout.
                                        window.wcvaIosMicTimeoutIdentifier = setTimeout(function(){
                                            // To display mic stop icon
                                            wcvaMicButtonImageSwitch(wcvaMicIcon, wcvaMicStopIcon, true);
                                        }, 4000);
                                    }
                                }

                                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                                wcvaClearMicResetTimeout();

                                // To set new mic reset timeout. (Based on duration from settings)
                                window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                                    let updatedClassList = micBtn.classList;

                                    if (updatedClassList && updatedClassList.contains('listening')) {
                                        micBtn.click();
                                    }
                                }, inputEl.tagName.toLowerCase() == 'textarea' ? wcvaTextareaTimeoutDuration : wcvaOtherInputTimeoutDuration);
                            }
                        }
                    }, false); 
                }

                // Attach event of mouse over to mic button
                micBtn.addEventListener('mouseover', function (event) {
                    // Randomize text of mic tool-tip
                    if (isSearchForm === true) { micBtn.title = wcvaGetRandomSearchHint(); }
                });
            });
        } catch(err) {
            // Do nothing for now.
        }
    });

    //############################# Voice Shopping For WooCommerce - Widget ###################################
    //let wcvaDocFragment = document.createDocumentFragment();
    // Create root/widget wrapper
    let wcvaWidgetWrapper = document.createElement('div');
    let wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-middle-right';
    let wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-middle-right';
    let wcvaMicPosition = wcva.wcvaSelectedMicPosition ? wcva.wcvaSelectedMicPosition.toLowerCase() : 'middle right';
    let wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-middle-right-collapse';
    
    switch (wcvaMicPosition) {
        case 'middle left':
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-middle-left';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-middle-left';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-middle-left-collapse';
            break;
        case 'top right':
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-top-right';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-top-right';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-top-right-collapse';
            break;
        case 'top left':
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-top-left';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-top-left';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-top-left-collapse';
            break; 
        case 'bottom right':
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-bottom-right';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-bottom-right';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-bottom-right-collapse';
            break;
        case 'bottom left':
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-bottom-left';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-bottom-left';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-bottom-left-collapse';
            break;
        default:
            wcvaWrapperMicPositionClass = 'wcva-widget-wrapper-middle-right';
            wcvaChatWrapperMicPositionClass = 'wcva-widget-chat-wrapper-middle-right';
            wcvaChatWrapperCollapseClass = 'wcva-widget-chat-wrapper-middle-right-collapse';
    }

    wcvaWidgetWrapper.setAttribute('class', 'wcva-widget-wrapper '+ wcvaWrapperMicPositionClass);

    // Create chat wrapper
    let wcvaWidgetChatWrapper = document.createElement('div');
    wcvaWidgetChatWrapper.setAttribute('class', 'wcva-widget-chat-wrapper '+ wcvaChatWrapperCollapseClass);
    wcvaWidgetChatWrapper.setAttribute('id','wcvaWidgetChatWrapper');

    // ################################## Widget Header ##################################
    // Create widget header
    let wcvaWidgetChatHeader = document.createElement('div');
    wcvaWidgetChatHeader.setAttribute('class', 'wcva-widget-chat-header');
    wcvaWidgetChatHeader.setAttribute('id', 'wcvaWidgetChatHeader');

    // Create widget header options
    let wcvaWidgetChatOption = document.createElement('div');
    let headerVoiceAssitantName = (wcvaVoiceType.female) ? 'Simone' : 'Simon';
    wcvaWidgetChatOption.setAttribute('class', 'wcva-widget-chat-option');
    wcvaWidgetChatOption.innerHTML = '<div>' +
    '<img class="wcva-widget-chat-option-bot-icon" src="' + wcva.wcvaImagesPath + 'Voice Assistant Bot Icon.png"/>'+
    '</div>' + 
    '<span class="wcva-widget-agent-name">' + headerVoiceAssitantName + '</b></span>' + 
    '<br>' +
    '<span class="wcva-widget-agent">Web Virtual Assistant</span>';

    let wcvaExpandCollapseHandle = document.createElement('span');
    wcvaExpandCollapseHandle.setAttribute('class', 'wcva-expand-window wcva-expand-collapse-handle');
    wcvaExpandCollapseHandle.setAttribute('title', 'Click for see all conversions.');

    wcvaExpandCollapseHandle.addEventListener('click', function() {
        wcvaTogggleExpandCollapse();
    }, false)

    let wcvaWidgetHideHandle = document.createElement('span');
    wcvaWidgetHideHandle.setAttribute('class','wcva-widget-hide wcva-expand-collapse-handle');
    wcvaWidgetHideHandle.setAttribute('title','Close chat window');

    wcvaWidgetHideHandle.addEventListener('click', function() {
        wcvaWidgetChatWrapper.classList.remove('wcva-widget-visible');
    }, false)

    wcvaWidgetChatOption.appendChild(wcvaExpandCollapseHandle);
    wcvaWidgetChatOption.appendChild(wcvaWidgetHideHandle);

    // Append widget header options to widget header
    wcvaWidgetChatHeader.appendChild(wcvaWidgetChatOption);

    // ################################ Widget Chat Conversation #########################
    // Create widget chat conversation
    let wcvaWidgetChatConvo = document.createElement('div');
    wcvaWidgetChatConvo.setAttribute('id', 'wcvaWidgetChatConvo');
    wcvaWidgetChatConvo.setAttribute('class', 'wcva-widget-chat-convo wcva-hide-element');

    // Create widget user chat wrapper 
    let wcvaWidgetChatMsgItemUserWrapper = document.createElement('span');
    wcvaWidgetChatMsgItemUserWrapper.setAttribute('class', 'wcva-widget-chat-msg-item wcva-widget-chat-msg-item-user');

    // Create widget user chat avatar
    let wcvaWidgetChatAvatar = document.createElement('div');
    wcvaWidgetChatAvatar.setAttribute('class', 'wcva-widget-chat-avatar');
    wcvaWidgetChatAvatar.innerHTML = "<center><b>" + wcvaWidgetMessages['you'] + "</b></center>";
    wcvaWidgetChatMsgItemUserWrapper.appendChild(wcvaWidgetChatAvatar);

    // Create widget chat - user request msg
    let wcvaWidgetChatMsgItemUser = document.createElement('span');
    wcvaWidgetChatMsgItemUserWrapper.appendChild(wcvaWidgetChatMsgItemUser);

    // Create widget chat - Simon response msg
    let wcvaWidgetChatMsgItemSimon = document.createElement('span');
    wcvaWidgetChatMsgItemSimon.setAttribute('class', 'wcva-widget-chat-msg-item wcva-widget-chat-msg-item-simon');

    let wcvaWidgetChatMsgError = document.createElement('span');
    wcvaWidgetChatMsgError.setAttribute('class', 'wcva-widget-chat-msg-item wcva-widget-chat-msg-error');

    // Create widget chat - Simon intro
    let tempSimonName = (wcvaVoiceType.female) ? wcvaWidgetMessages['simonIntro']['name'] + 'e' : wcvaWidgetMessages['simonIntro']['name'];
    let simonIntroMsg  = tempSimonName + wcvaWidgetMessages['simonIntro']['intro'] + "<br/><br/>";
    let simonGuidlines = wcvaWidgetMessages['simonGuidelines'];
    
    let wcvaWidgetChatIntroMsgItemSimon = document.createElement('span');
    wcvaWidgetChatIntroMsgItemSimon.setAttribute('class', 'wcva-widget-chat-msg-item wcva-widget-chat-msg-item-simon');
    wcvaWidgetChatIntroMsgItemSimon.innerHTML = simonIntroMsg + simonGuidlines;

    // Append user request and Simon response msg to widget chat conversation
    wcvaWidgetChatConvo.appendChild(wcvaWidgetChatIntroMsgItemSimon);

    // ############################ Widget Fields (Input section) ############################
    // Create widget text field and mic (Input Section)
    let wcvaWidgetField = document.createElement('div');
    wcvaWidgetField.setAttribute('class', 'wcva-widget-field');

    // Create mic icon wrapper
    let wcvaWidgetMic = document.createElement('a');
    wcvaWidgetMic.setAttribute('id', 'wcvaWidgetMic');
    wcvaWidgetMic.setAttribute('class', 'wcva-widget-button');

    // Create and append mic icon/image to mic wrapper
    let wcvaWidgetMicImg = document.createElement('img');
    wcvaWidgetMicImg.setAttribute('id', 'wcva-widget-mic-img');
    wcvaWidgetMicImg.setAttribute('src', wcva.wcvaImagesPath + 'wcva-widget-mic-black.svg');
    wcvaWidgetMic.appendChild(wcvaWidgetMicImg);

    let wcvaWidgetMicStopIcon = document.createElement('img');
    
    if (wcvaClientInfo.ios === true) {
        wcvaWidgetMicStopIcon.setAttribute('src', wcva.wcvaImagesPath + 'wcva-mic-stop.svg');
        wcvaWidgetMicStopIcon.setAttribute('class', 'wcva-stop-alert wcva-hide-element');
        wcvaWidgetMicStopIcon.setAttribute('id', 'wcva-mic-stop');
        wcvaWidgetMic.appendChild(wcvaWidgetMicStopIcon);
    }

    // Create button wrapper next to input text field
    let wcvaWidgetSearchBtn = document.createElement('a');
    wcvaWidgetSearchBtn.setAttribute('id', 'wcvaWidgetSearchBtn');

    // Create and append search button to button wrapper
    let wcvaWidgetSearchBtnEl = document.createElement('button');
    wcvaWidgetSearchBtnEl.setAttribute('class', 'wcva-widget-form-submit-btn');
    wcvaWidgetSearchBtnEl.setAttribute('type', 'submit');
    wcvaWidgetSearchBtnEl.setAttribute('alt', 'Go');
    wcvaWidgetSearchBtnEl.setAttribute('title', 'Search');
    wcvaWidgetSearchBtn.appendChild(wcvaWidgetSearchBtnEl);

    // Create form for widget
    let wcvaWidgetForm = document.createElement('form');
    wcvaWidgetForm.setAttribute("class", "wcva-widget-form");

    if (formElementForWidget !== null) {
        wcvaWidgetForm.action = formElementForWidget.action;
        wcvaWidgetForm.method = formElementForWidget.method;
    } else {
        wcvaWidgetForm.action = wcvaGetCurrentHostURL() + '/';
        wcvaWidgetForm.method = "get";
    }

    // Create input text field 
    let wcvaWidgetSearch = document.createElement('input');
    wcvaWidgetSearch.setAttribute('id', 'wcvaWidgetSearch');
    wcvaWidgetSearch.setAttribute('class', 'wcva-widget-search wcva-widget-search-text');
    wcvaWidgetSearch.setAttribute('name', 'wcva-widget-search');
    wcvaWidgetSearch.setAttribute('placeholder', wcvaWidgetMessages['placeholder']);
    wcvaWidgetSearch.setAttribute('name', 's');

    // Widget form submit event listener
    wcvaWidgetForm.addEventListener('submit', function(event){
            try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
            try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
            try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}

            // Engage speak2web AI if native search is not configured 
            if (wcvaTypeOfSearch != 'native') {
                // Prevent default text search
                event.preventDefault();

                // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                if (!(typeof(wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                    // Play feature unavailble playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                    wcvaIntentResponsePlayer.play();

                    return false;
                }

                if (wcvaWidgetSearch.value.length != 0) {
                    // Play basic acknowledgement playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['basic']);
                    wcvaIntentResponsePlayer.play();
                    
                    // Send input to wcva.speech-handler.js
                    wcvaSendDialog(wcvaWidgetSearch.value, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                        if (typeof navigationCbAfterAudioPlay !== 'function') {
                            navigationCbAfterAudioPlay = function() {
                                // If dialog for intent is disabled in settings then fire native search
                                if (isNativeSearch === true) {
                                    try { wcvaWidgetForm.submit(); } 
                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                }
                            }
                        }
                        
                        // Play intent response playback
                        wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                        wcvaIntentResponsePlayer.play();
                    }, wcvaGetWidgetElementsObj());
                }
            }
    }, false);

    wcvaWidgetForm.appendChild(wcvaWidgetSearch);
    wcvaWidgetForm.appendChild(wcvaWidgetSearchBtn);

    // Append mic, button (hidden) and input text elements to widget text field and mic section (input section)
    // wcvaWidgetField.appendChild(wcvaWidgetMic);
    wcvaWidgetField.appendChild(wcvaWidgetForm);

    // Append chat header, chat conversation and input fields to widget chat wrapper
    wcvaWidgetChatWrapper.appendChild(wcvaWidgetChatHeader);
    wcvaWidgetChatWrapper.appendChild(wcvaWidgetChatConvo);
    wcvaWidgetChatWrapper.appendChild(wcvaWidgetField);

    // ################################ Widget Toggle button #########################
    // Create a widget toggle button wrapper
    let wcvaWidgetToggleButton = document.createElement('a');
    wcvaWidgetToggleButton.setAttribute('id', 'wcvaWidgetToggleButton');
    wcvaWidgetToggleButton.setAttribute('class', 'wcva-widget-button wcva-blink-widget-toggle-button');

    // Set css root property for change color for toggle button
    let wcvaBackgroundColor = typeof wcva.wcvaBotBackgroundColor != 'undefined' || wcva.wcvaBotBackgroundColor != null ? wcva.wcvaBotBackgroundColor : '#42a5f5';
    let wcvaPulseColor = typeof wcva.wcvaMicPulseColor != 'undefined' || wcva.wcvaMicPulseColor != null ? wcva.wcvaMicPulseColor : '#dc2626';
    let wcvaResponseColor = typeof wcva.wcvaBotResponseColor != 'undefined' || wcva.wcvaBotResponseColor != null ? wcva.wcvaBotResponseColor : '#218c5e';

    let wcvaRootStyle = document.querySelector(':root');
    wcvaRootStyle.style.setProperty('--wcva-bg-color', `${wcvaBackgroundColor}`);
    wcvaRootStyle.style.setProperty('--wcva-pulse-color', `${wcvaPulseColor}`);
    wcvaRootStyle.style.setProperty('--wcva-bot-response-color', `${wcvaResponseColor}`);

    // Create a pulse effect it's show when user trigger stt
    let wcvaWidgetPulseEffect = document.createElement('span');
    wcvaWidgetPulseEffect.setAttribute('id', 'wcvaWidgetPulseEffect');

    // Create toggle button icon element
    let wcvaToggleButtonIconClass = wcva.wcvaFloatingButtonIcon && wcva.wcvaFloatingButtonIcon == 'robotIcon' ? 'wcva-toggle-btn-robot' : 'wcva-toggle-btn-mic';
    let wcvaWidgetIcon = document.createElement('div');
    wcvaWidgetIcon.setAttribute('class', 'wcva-widget-icon wcva-widget-toggle-button ' + wcvaToggleButtonIconClass);
    wcvaWidgetIcon.setAttribute('id', 'wcvaWidgetIcon');

    // Append toggle button icon to toggle button wrapper
    wcvaWidgetToggleButton.appendChild(wcvaWidgetIcon);

    // Append chat wrapper and toggle button to widget wrapper
    wcvaWidgetWrapper.appendChild(wcvaWidgetChatWrapper);
    wcvaWidgetWrapper.appendChild(wcvaWidgetPulseEffect);
    wcvaWidgetWrapper.appendChild(wcvaWidgetToggleButton);

    // Append widget to html
    //wcvaDocFragment.appendChild(wcvaWidgetWrapper);
    document.body.insertAdjacentElement('afterend', wcvaWidgetWrapper);

    // Attach event of mouse over to mic button
    wcvaWidgetMic.addEventListener('mouseover', function (event) {
        // Randomize text of mic tool-tip
        wcvaWidgetMic.title = wcvaGetRandomSearchHint();
    });

    // Listen event to show/hide widget
    wcvaWidgetToggleButton.addEventListener('click', function(event){
        wcvaToggleWidgetElements('enable');
    });

    document.body.onload = function(){
        let wcvaPreservedWidgetConversation = localStorage.getItem('wcvaWidgetConversation');

        if (wcvaPreservedWidgetConversation !== null) {
            let parsedWidgetConvo = JSON.parse(wcvaPreservedWidgetConversation);
            let userQuery = parsedWidgetConvo.userQuery || null;
            let simonResponse = parsedWidgetConvo.simonResponse || null;
            
            if (userQuery !== null && simonResponse !== null) {
                wcvaWidgetToggleButton.classList.remove('wcva-blink-widget-toggle-button');
                wcvaWidgetChatMsgItemUser.innerHTML = userQuery;
                wcvaWidgetChatMsgItemSimon.innerHTML = simonResponse;
                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemUserWrapper);
                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemSimon);
                
                if (wcvaClientInfo.ios === false) wcvaWidgetToggleButton.click();
            }

            wcvaTogggleExpandCollapse();
        }

        localStorage.removeItem('wcvaWidgetConversation');
    };

    /*############################# Widget mic handling ################################*/

    /**
     * function for handel pulse effect and toggle icons
     *
     * @param { action: String } 'add' to add effect or 'remove' to remove effect
     */
    function wcvaToggleWidgetPulseEffectHandler(action) {
        if (action == 'add'){
            wcvaWidgetToggleButton.classList.add('listening');
            wcvaWidgetPulseEffect.classList.add('listening');
            wcvaWidgetSearch.setAttribute('readonly','');
            wcvaWidgetSearchBtnEl.setAttribute('disabled','');
            wcvaWidgetSearch.setAttribute('title','stop mic listening');
            wcvaWidgetIcon.classList.add('wcva-toggle-btn-mic');
            wcvaWidgetIcon.classList.remove(wcvaToggleButtonIconClass);
        } else if (action == 'remove') {
            wcvaWidgetToggleButton.classList.remove('listening');
            wcvaWidgetPulseEffect.classList.remove('listening');
            wcvaWidgetSearch.removeAttribute('title');
            wcvaWidgetSearch.removeAttribute('readonly');
            wcvaWidgetSearchBtnEl.removeAttribute('disabled');
            wcvaWidgetIcon.classList.remove('wcva-toggle-btn-mic');
            wcvaWidgetIcon.classList.add(wcvaToggleButtonIconClass);
        }
    }

    // Setup recognition
    let widgetFinalTranscript = '';
    let widgetRecognizing     = false;
    let widget_final_transcript = "";
    let widget_ignore_onend;

    if ('webkitSpeechRecognition' in window && wcvaClientInfo['chrome'] === true) {
        let widgetRecognition = new webkitSpeechRecognition();
        widgetRecognition.continuous = true;
        widgetRecognition.interimResults = true;

        widgetRecognition.onstart = function () { 
            widgetRecognizing = true; 
        };

        widgetRecognition.onerror = function (event) {
            wcvaToggleWidgetPulseEffectHandler('remove');
            widgetRecognizing = false;

            if (event.error == 'no-speech') {
                // Play not audible playback
                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                wcvaIntentResponsePlayer.play();

                widget_ignore_onend = true;
                wcvaWidgetChatMsgError.innerHTML = wcvaMessages['unableToHear'];
                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
            }

            if (event.error == 'audio-capture') {
                widget_ignore_onend = true;
                wcvaWidgetChatMsgError.innerHTML = wcvaMessages['micNotAccessible'];
                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
            }

            if (event.error == 'not-allowed') {
                widget_ignore_onend = true;
                wcvaWidgetChatMsgError.innerHTML = wcvaMessages['browserDenyMicAccess'];
                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
            }
        };

        function widgetProcessEnd() {
            widgetRecognizing = false;

            if (widget_ignore_onend) { return; }

            widgetFinalTranscript = widget_final_transcript;
            wcvaToggleWidgetPulseEffectHandler('remove');

            let i = Math.floor(Math.random() * 10);
            let resp = wcvaAlternativeResponse['randomLib'];

            // Play random response playback
            wcvaIntentResponsePlayer.configure(resp[i], function () {
                if (typeof(widgetFinalTranscript) != 'undefined' && widgetFinalTranscript.length != 0) {
                    wcvaWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript;
                    wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemUserWrapper);
                    wcvaWidgetSearch.value = widgetFinalTranscript;
                    
                    wcvaSendDialog(widgetFinalTranscript, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                        if (typeof navigationCbAfterAudioPlay !== 'function') { 
                            navigationCbAfterAudioPlay = function(){
                                // If dialog for intent is disabled in settings then fire native search
                                if (isNativeSearch === true) {
                                    try { wcvaWidgetForm.submit(); } 
                                    catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                }
                            };
                        }

                        // Play intent response playback
                        wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                        wcvaIntentResponsePlayer.play();
                    }, wcvaGetWidgetElementsObj());
                } else {
                    wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                }
            });
            wcvaIntentResponsePlayer.play();
        }

        widgetRecognition.onend = function () {
            if (wcvaClientInfo.android) { widgetProcessEnd(); }
        };

        widgetRecognition.onresult = function (event) {
            let interim_transcript = '';

            if (typeof (event.results) == 'undefined') {
                widgetRecognition.onend = null;
                widgetRecognition.stop();
                wcvaWidgetSearch.placeholder = wcvaMessages['unableToProcess'];

                // Play mic connect issue playback
                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unableToProcess']);
                wcvaIntentResponsePlayer.play();

                return;
            }

            let eventResultsLength = event.results.length;

            for (let i = event.resultIndex; i < eventResultsLength; ++i) {
                if (event.results[i].isFinal) {
                    widget_final_transcript = event.results[i][0].transcript;

                    if (wcvaClientInfo.android == false) {
                        widgetProcessEnd();
                        widgetRecognition.stop();
                    }                        
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        };

        wcvaWidgetToggleButton.addEventListener(wcvaMicEventToListen, function (event) {
            if (wcvaAnyOtherMicListening(wcvaWidgetToggleButton.getAttribute('id'), wcvaWidgetToggleButton) === true) return;

            // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
            if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                // Play feature unavailable playback
                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                wcvaIntentResponsePlayer.play();

                return;
            }

            if (widgetRecognizing) {
                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                wcvaClearMicResetTimeout();

                // Need to stop the recording
                wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();

                if (wcvaClientInfo.android == false) {
                    widgetProcessEnd();
                    widgetRecognition.stop();
                }
            } else {
                try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}

                wcvaClearBotResetTimeout();
                wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();
                event.preventDefault();

                // Stop ongoing playback if nay
                if (wcvaIntentResponsePlayer.isPlaying()) {
                    wcvaIntentResponsePlayer.stop();
                }

                if (wcvaSimonIntroduced() === null) {
                    wcvaOtherInputTimeoutDuration += 5000;
                    setTimeout(() => {
                        wcvaClearBotResetTimeout();
                        wcvaWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript = '';
                        widgetRecognizing = true;
                        widgetRecognition.lang = wcvaSelectedLang;
                        widgetRecognition.start();
                        widget_ignore_onend = false;
                        wcvaToggleWidgetPulseEffectHandler('add');
                    }, 5000);
                } else {
                    wcvaWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript = '';
                    widgetRecognizing = true;
                    widgetRecognition.lang = wcvaSelectedLang;
                    widgetRecognition.start();
                    widget_ignore_onend = false;
                    wcvaToggleWidgetPulseEffectHandler('add');
                }

                // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                wcvaClearMicResetTimeout();

                // To set new mic reset timeout. (Based on duration from settings)
                window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                    let updatedClassList = wcvaWidgetToggleButton.classList;

                    if (updatedClassList && updatedClassList.contains('listening')) {
                        wcvaWidgetToggleButton.click();
                    }
                }, wcvaOtherInputTimeoutDuration);
            }
        });
    } else {
        //CODE FOR BROWSERS THAT DO NOT SUPPORT STT NATIVLY
        // MUST USE THE BUILT IN MICROPHONE
        wcvaWidgetToggleButton.addEventListener(wcvaMicEventToListen, function (event) {
            /**
             * Audio element's play method must be invoked in exact influence of user gesture to avoid auto play restriction
             *
             */
            if (
                wcvaClientInfo.ios === true
                || (wcvaClientInfo.safari && !wcvaClientInfo.chrome && !wcvaClientInfo.firefox && !wcvaClientInfo.edge)
                || (wcvaClientInfo.windows && wcvaClientInfo.firefox)
            ) {
                wcvaIntentResponsePlayer.configure(wcvaSilenceSoundPath);
                wcvaIntentResponsePlayer.play();
            }

            if (wcvaAnyOtherMicListening(wcvaWidgetToggleButton.getAttribute('id'), wcvaWidgetToggleButton) === true) return;

            // Deny recording if microphone is not accessible
            if (!wcvaAudioRecorder || !wcvaAudioContext) {
                
                if (wcvaSimonIntroduced() === null) {
                    wcvaOtherInputTimeoutDuration += 5000;
                    setTimeout(() => {
                        wcvaInitAudio(function (a) {
                            if (!wcvaAudioRecorder || !wcvaAudioContext) {
                                
                                try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}
                                
                                wcvaWidgetChatMsgError.innerHTML = wcvaMessages['micNotAccessible'];
                                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                                return false;
                            } else {
                                widgetListenEvent();
                            }
                        });
                    }, 5000);
                } else {
                    wcvaInitAudio(function (a) {
                        if (!wcvaAudioRecorder || !wcvaAudioContext) {
                            
                            try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}
                            
                            wcvaWidgetChatMsgError.innerHTML = wcvaMessages['micNotAccessible'];
                            wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                            return false;
                        } else {
                            widgetListenEvent();
                        }
                    });
                }
            } else {
                if (wcvaSimonIntroduced() === null) {
                    wcvaOtherInputTimeoutDuration += 5000;
                    setTimeout(() => {
                        widgetListenEvent();
                    }, 5000);
                } else {
                    widgetListenEvent();
                }
            }

            function widgetListenEvent() {
                // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                    // Play feature unavailable playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                    wcvaIntentResponsePlayer.play();

                    return false;
                }

                // User ending recording by clicking back mic
                if (widgetRecognizing) {
                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    wcvaClearMicResetTimeout();

                    // For iOS only
                    if (wcvaClientInfo.ios === true) {
                        // To clear pre-existing mic stop display timeout if any.
                        wcvaClearIosMicStopDisplayTimeout();
                        
                        let widgetMicImgClasses = wcvaWidgetMicImg.classList;
                        
                        if (widgetMicImgClasses.contains('wcva-hide-element')) {
                            // To reset/display mic icon back
                            wcvaMicButtonImageSwitch(wcvaWidgetMicImg, wcvaWidgetMicStopIcon);
                        }
                    }

                    // Stop recorder
                    wcvaAudioRecorder.stop();

                    // Stop access to audio resource
                    wcvaStopAudio();

                    // Stop ongoing playback if nay
                    if (wcvaIntentResponsePlayer.isPlaying()) {
                        wcvaIntentResponsePlayer.stop();
                    }

                    //replace recording with mic icon
                    wcvaToggleWidgetPulseEffectHandler('remove');

                    wcvaWidgetSearch.placeholder = wcvaMessages['transcribeText'];

                    wcvaAudioRecorder.getBuffers(function (buffers) {
                        if (!!wcvaSttLanguageContext['gcp']['stt']) {
                            wcvaAudioRecorder.exportMonoWAV(function (blob) {
                                wcvaAudioRecorder.convertBlobToBase64(blob).then(function(resultedBase64){
                                    wcvaGcpStt(resultedBase64).then(function(transcriptResult){
                                        if (typeof(transcriptResult) != 'undefined' && transcriptResult.length != 0) {
                                            wcvaWidgetChatMsgItemUser.innerHTML = transcriptResult;
                                            wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemUserWrapper);
                                            wcvaWidgetSearch.value = transcriptResult;
                                            
                                            wcvaSendDialog(transcriptResult, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                                if (typeof navigationCbAfterAudioPlay !== 'function') { 
                                                    navigationCbAfterAudioPlay = function(){
                                                        // If dialog for intent is disabled in settings then fire native search
                                                        if (isNativeSearch === true) {
                                                            try { wcvaWidgetForm.submit(); } 
                                                            catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                        }
                                                    };
                                                }

                                                // Play intent response playback
                                                wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                                wcvaIntentResponsePlayer.play();
                                            }, wcvaGetWidgetElementsObj());
                                        } else {
                                            // Play not audible playback
                                            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                            wcvaIntentResponsePlayer.play();

                                            wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                                        }
                                    });
                                }).catch(function(error){
                                    // Play not audible playback
                                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                    wcvaIntentResponsePlayer.play();

                                    wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                                });
                            });
                        }
                        else{
                            // Play not audible playback
                            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                            wcvaIntentResponsePlayer.play();

                            wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                        }
                    });

                    widgetRecognizing = false;
                    return;
                } else {// User started recording by clicking mic
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}

                    wcvaClearBotResetTimeout();
                    wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();
                    wcvaToggleWidgetPulseEffectHandler('add');
                    event.preventDefault();

                    // Stop ongoing playback if nay
                    if (wcvaIntentResponsePlayer.isPlaying()) {
                        wcvaIntentResponsePlayer.stop();
                    }

                    widgetFinalTranscript = '';
                    widgetRecognizing = true;
                    wcvaAudioRecorder.clear();
                    wcvaAudioRecorder.record(wcvaWidgetToggleButton);

                    // For iOS only
                    if (wcvaClientInfo.ios === true) {
                        // To clear pre-existing mic stop display timeout if any.
                        wcvaClearIosMicStopDisplayTimeout();

                        let widgetMicImgClasses = wcvaWidgetMicImg.classList;

                        if (!widgetMicImgClasses.contains('wcva-hide-element')) {
                            // To set new mic stop display timeout.
                            window.wcvaIosMicTimeoutIdentifier = setTimeout(function(){
                                // To display mic stop icon
                                wcvaMicButtonImageSwitch(wcvaWidgetMicImg, wcvaWidgetMicStopIcon, true);
                            }, 4000);
                        }
                    }

                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    wcvaClearMicResetTimeout();

                    // To set new mic reset timeout. (Based on duration from settings)
                    window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                        let updatedClassList = wcvaWidgetToggleButton.classList;

                        if (updatedClassList && updatedClassList.contains('listening')) {
                            wcvaWidgetToggleButton.click();
                        }
                    }, wcvaOtherInputTimeoutDuration);
                }
            }
        }, false); 
    }

        /**
         * Function for add pulse animation in elementor mic
         *
         */
        function wcvaElementorMicPulseAnimation(wcvaElementorMicElement) {
            let size = 0, left = 0;
            if (wcvaElementorMicElement.clientHeight >= 80) {
                size = wcvaElementorMicElement.clientHeight + 15;
                left = -(size / 6);
            } if (wcvaElementorMicElement.clientHeight >= 60) {
                size = wcvaElementorMicElement.clientHeight + 12;
                left = -(size / 5);
            } else if (wcvaElementorMicElement.clientHeight >= 30) {
                size = wcvaElementorMicElement.clientHeight + 10;
                left = -(size / 4);
            } else {
                size = wcvaElementorMicElement.clientHeight + 8;
                left = -(size / 3.5);
            }


            const wcvaPulse = document.createElement('div');
            wcvaPulse.setAttribute('id', 'pulse');
            wcvaPulse.setAttribute('class', 'pulse-color');
            wcvaPulse.style.width = size + 'px';
            wcvaPulse.style.height = size + 'px';
            wcvaPulse.style.left = left + 'px';

            const wcvaPulseRate = document.createElement('div');
            wcvaPulseRate.setAttribute('id', 'pulse-rate');
            wcvaPulseRate.setAttribute('class', 'pulse-color');
            wcvaPulseRate.style.width = size + 'px';
            wcvaPulseRate.style.height = size + 'px';
            wcvaPulseRate.style.left = left + 'px';

            return { wcvaPulse, wcvaPulseRate };
        }

    function enableElementor(){
        const wcvaFloatigMic = document.getElementById('flt-mic')
        if(wcvaFloatigMic != null){
            const wcvaElementorMicColor = wcvaFloatigMic.getElementsByClassName('my-icon-wrapper')[0].getElementsByTagName('i')[0];
            const wcvaPulseItem = wcvaElementorMicPulseAnimation(wcvaElementorMicColor);
        if ('webkitSpeechRecognition' in window && wcvaClientInfo['chrome'] === true) {
            let widgetRecognition = new webkitSpeechRecognition();
            widgetRecognition.continuous = true;
            widgetRecognition.interimResults = true;
    
            widgetRecognition.onstart = function () { 
                widgetRecognizing = true; 
            };
    
            widgetRecognition.onerror = function (event) {
                wcvaFloatigMic.classList.remove('listening');
                widgetRecognizing = false;
                wcvaElementorMicColor.classList.remove('my-icon-animation-wrapper');
                wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulse']);
                wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulseRate']);
    
                if (event.error == 'no-speech') {
                    // Play not audible playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                    wcvaIntentResponsePlayer.play();
    
                    widget_ignore_onend = true;
                    wcvaWidgetChatMsgError.innerHTML = wcvaMessages['unableToHear'];
                    wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                }
    
                if (event.error == 'audio-capture') {
                    widget_ignore_onend = true;
                    wcvaWidgetChatMsgError.innerHTML = wcvaMessages['micNotAccessible'];
                    wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                }
    
                if (event.error == 'not-allowed') {
                    widget_ignore_onend = true;
                    wcvaWidgetChatMsgError.innerHTML = wcvaMessages['browserDenyMicAccess'];
                    wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                }
            };
    
            function widgetProcessEnd() {
                widgetRecognizing = false;
    
                if (widget_ignore_onend) { return; }
    
                widgetFinalTranscript = widget_final_transcript;   
                wcvaFloatigMic.classList.remove('listening');
                wcvaElementorMicColor.classList.remove('my-icon-animation-wrapper');
                wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulse']);
                wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulseRate']);
    
                let i = Math.floor(Math.random() * 10);
                let resp = wcvaAlternativeResponse['randomLib'];
    
                // Play random response playback
                wcvaIntentResponsePlayer.configure(resp[i], function () {
                    if (typeof(widgetFinalTranscript) != 'undefined' && widgetFinalTranscript.length != 0) {
                        wcvaWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript;
                        wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemUserWrapper);
                        wcvaWidgetSearch.value = widgetFinalTranscript;
                        
                        wcvaSendDialog(widgetFinalTranscript, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                            if (typeof navigationCbAfterAudioPlay !== 'function') {
                                navigationCbAfterAudioPlay = function(){
                                    // If dialog for intent is disabled in settings then fire native search
                                    if (isNativeSearch === true) {
                                        try { wcvaWidgetForm.submit(); }
                                        catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                    }
                                };
                            }

                            // Play intent response playback
                            wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                            wcvaIntentResponsePlayer.play();
                        }, wcvaGetWidgetElementsObj());
                    } else {
                        wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                    }
                });
                wcvaIntentResponsePlayer.play();
            }
    
            widgetRecognition.onend = function () { 
                if (wcvaClientInfo.android) { widgetProcessEnd(); }
            };
    
            widgetRecognition.onresult = function (event) {
                let interim_transcript = '';
    
                if (typeof (event.results) == 'undefined') {
                    widgetRecognition.onend = null;
                    widgetRecognition.stop();
                    wcvaWidgetSearch.placeholder = wcvaMessages['unableToProcess'];
    
                    // Play mic connect issue playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unableToProcess']);
                    wcvaIntentResponsePlayer.play();
    
                    return;
                }
    
                let eventResultsLength = event.results.length;
    
                for (let i = event.resultIndex; i < eventResultsLength; ++i) {
                    if (event.results[i].isFinal) {
                        widget_final_transcript = event.results[i][0].transcript;
    
                        if (wcvaClientInfo.android == false) {
                            widgetProcessEnd();
                            widgetRecognition.stop();
                        }                        
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
            };
            wcvaFloatigMic.addEventListener(wcvaMicEventToListen, function (event) {
                if (wcvaAnyOtherMicListening(wcvaFloatigMic.getAttribute('id'), wcvaFloatigMic) === true) return;
    
                // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                    // Play feature unavailable playback
                    wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                    wcvaIntentResponsePlayer.play();
    
                    return;
                }
    
                if (widgetRecognizing) {
                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    wcvaClearMicResetTimeout();
    
                    // Need to stop the recording
                    wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();
    
                    if (wcvaClientInfo.android == false) {
                        widgetProcessEnd();
                        widgetRecognition.stop();
                    }
                } else {
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                    try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}
                    
                    wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();
                    wcvaFloatigMic.classList.add('listening');
                    wcvaElementorMicColor.classList.add('my-icon-animation-wrapper');
                    wcvaElementorMicColor.appendChild(wcvaPulseItem['wcvaPulse']);
                    wcvaElementorMicColor.appendChild(wcvaPulseItem['wcvaPulseRate']);
                    event.preventDefault();
    
                    // Stop ongoing playback if nay
                    if (wcvaIntentResponsePlayer.isPlaying()) {
                        wcvaIntentResponsePlayer.stop();
                    }
    
                    wcvaWidgetChatMsgItemUser.innerHTML = widgetFinalTranscript = '';
                    widgetRecognizing = true;
                    widgetRecognition.lang = wcvaSelectedLang;
                    widgetRecognition.start();
                    widget_ignore_onend = false;
    
                    // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                    wcvaClearMicResetTimeout();
    
                    // To set new mic reset timeout. (Based on duration from settings)
                    window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                        let updatedClassList = wcvaFloatigMic.classList;
    
                        if (updatedClassList && updatedClassList.contains('listening')) {
                            wcvaFloatigMic.click();
                        }
                    }, wcvaOtherInputTimeoutDuration);
                }
            });
        } else {
            //CODE FOR BROWSERS THAT DO NOT SUPPORT STT NATIVLY
            // MUST USE THE BUILT IN MICROPHONE
            wcvaFloatigMic.addEventListener(wcvaMicEventToListen, function (event) {

                /**
                 * Audio element's play method must be invoked in exact influence of user gesture to avoid auto play restriction
                 * 
                 */
                if (
                    wcvaClientInfo.ios === true
                    || (wcvaClientInfo.safari && !wcvaClientInfo.chrome && !wcvaClientInfo.firefox && !wcvaClientInfo.edge)
                    || (wcvaClientInfo.windows && wcvaClientInfo.firefox)
                ) {
                    wcvaIntentResponsePlayer.configure(wcvaSilenceSoundPath);
                    wcvaIntentResponsePlayer.play();
                }
    
                if (wcvaAnyOtherMicListening(wcvaFloatigMic.getAttribute('id'), wcvaFloatigMic) === true) return;
    
                // Deny recording if microphone is not accessible
                if (!wcvaAudioRecorder || !wcvaAudioContext) {
                    wcvaInitAudio(function (a) {
                        if (!wcvaAudioRecorder || !wcvaAudioContext) {
    
                            try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}
                            
                            wcvaWidgetChatMsgError.innerHTML = wcvaMessages['micNotAccessible'];
                            wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgError);
                            return false;
                        } else {
                            widgetListenEvent();
                        }
                    });
                } else {
                    widgetListenEvent();
                }
    
                function widgetListenEvent() {
                    // If API system key is unavailable then acknowledge service unavailability and stop voice navigation.
                    if (!(typeof (wcva.wcvaXApiKey) != 'undefined' && wcva.wcvaXApiKey !== null)) {
                        // Play feature unavailable playback
                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['unavailable']);
                        wcvaIntentResponsePlayer.play();
    
                        return false;
                    }
    
                    // User ending recording by clicking back mic
                    if (widgetRecognizing) {
                        // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                        wcvaClearMicResetTimeout();
    
                        // For iOS only
                        if (wcvaClientInfo.ios === true) {
                            // To clear pre-existing mic stop display timeout if any.
                            wcvaClearIosMicStopDisplayTimeout();
                            
                            let widgetMicImgClasses = wcvaWidgetMicImg.classList;
                            
                            if (widgetMicImgClasses.contains('wcva-hide-element')) {
                                // To reset/display mic icon back
                                wcvaMicButtonImageSwitch(wcvaWidgetMicImg, wcvaWidgetMicStopIcon);
                            }
                        }
    
                        // Stop recorder
                        wcvaAudioRecorder.stop();
    
                        // Stop access to audio resource
                        wcvaStopAudio();
    
                        // Stop ongoing playback if nay
                        if (wcvaIntentResponsePlayer.isPlaying()) {
                            wcvaIntentResponsePlayer.stop();
                        }
    
                        //replace recording with mic icon
                        wcvaFloatigMic.classList.remove('listening');
                        wcvaElementorMicColor.classList.remove('my-icon-animation-wrapper');
                        wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulse']);
                        wcvaElementorMicColor.removeChild(wcvaPulseItem['wcvaPulseRate']);
    
                        wcvaWidgetSearch.placeholder = wcvaMessages['transcribeText'];
    
                        wcvaAudioRecorder.getBuffers(function (buffers) {
                            if (!!wcvaSttLanguageContext['gcp']['stt']) {
                                wcvaAudioRecorder.exportMonoWAV(function (blob) {
                                    wcvaAudioRecorder.convertBlobToBase64(blob).then(function(resultedBase64){
                                        wcvaGcpStt(resultedBase64).then(function(transcriptResult){
                                            if (typeof(transcriptResult) != 'undefined' && transcriptResult.length != 0) {
                                                wcvaWidgetChatMsgItemUser.innerHTML = transcriptResult;
                                                wcvaWidgetChatConvo.appendChild(wcvaWidgetChatMsgItemUserWrapper);
                                                wcvaWidgetSearch.value = transcriptResult;
                                                
                                                wcvaSendDialog(transcriptResult, function (playbackPath, navigationCbAfterAudioPlay = null, isNativeSearch = false) {
                                                    if (typeof navigationCbAfterAudioPlay !== 'function') {
                                                    navigationCbAfterAudioPlay = function(){
                                                        // If dialog for intent is disabled in settings then fire native search
                                                        if (isNativeSearch === true) {
                                                            try { wcvaWidgetForm.submit(); }
                                                            catch (err) { console.log('Something went wrong while submitting a form for native search.'); }
                                                        }
                                                    };
                                                }
                                                    // Play intent response playback
                                                    wcvaIntentResponsePlayer.configure(playbackPath, navigationCbAfterAudioPlay);
                                                    wcvaIntentResponsePlayer.play();
                                                }, wcvaGetWidgetElementsObj());
                                            } else {
                                                // Play not audible playback
                                                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                                wcvaIntentResponsePlayer.play();
    
                                                wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                                            }
                                        });
                                    }).catch(function(error){
                                        // Play not audible playback
                                        wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                        wcvaIntentResponsePlayer.play();
    
                                        wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                                    });
                                });
                            }
                            else{
                                // Play not audible playback
                                wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['notAudible']);
                                wcvaIntentResponsePlayer.play();
    
                                wcvaWidgetSearch.placeholder = wcvaMessages['ask'];
                            }
                        });
    
                        widgetRecognizing = false;
                        return;
                    } else {// User started recording by clicking mic
                        try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemUserWrapper); } catch(err) { /*Do nothing */}
                        try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgItemSimon);} catch(err) { /*Do nothing */}
                        try { wcvaWidgetChatConvo.removeChild(wcvaWidgetChatMsgError);} catch(err) { /*Do nothing */}
    
                        wcvaWidgetSearch.placeholder = wcvaGetRandomSearchHint();
                        wcvaFloatigMic.classList.add('listening');
                        wcvaElementorMicColor.classList.add('my-icon-animation-wrapper');
                        wcvaElementorMicColor.appendChild(wcvaPulseItem['wcvaPulse']);
                        wcvaElementorMicColor.appendChild(wcvaPulseItem['wcvaPulseRate']);
                        event.preventDefault();
    
                        // Stop ongoing playback if nay
                        if (wcvaIntentResponsePlayer.isPlaying()) {
                            wcvaIntentResponsePlayer.stop();
                        }
    
                        widgetFinalTranscript = '';
                        widgetRecognizing = true;
                        wcvaAudioRecorder.clear();
                        wcvaAudioRecorder.record(wcvaFloatigMic);
    
                        // For iOS only
                        if (wcvaClientInfo.ios === true) {
                            // To clear pre-existing mic stop display timeout if any.
                            wcvaClearIosMicStopDisplayTimeout();
    
                            let widgetMicImgClasses = wcvaWidgetMicImg.classList;
    
                            if (!widgetMicImgClasses.contains('wcva-hide-element')) {
                                // To set new mic stop display timeout.
                                window.wcvaIosMicTimeoutIdentifier = setTimeout(function(){
                                    // To display mic stop icon
                                    wcvaMicButtonImageSwitch(wcvaWidgetMicImg, wcvaWidgetMicStopIcon, true);
                                }, 4000);
                            }
                        }
    
                        // To clear pre-existing mic reset timeout if any. (Based on duration from settings)
                        wcvaClearMicResetTimeout();
    
                        // To set new mic reset timeout. (Based on duration from settings)
                        window.wcvaMicTimeoutIdentifier = setTimeout(function(){
                            let updatedClassList = wcvaFloatigMic.classList;
    
                            if (updatedClassList && updatedClassList.contains('listening')) {
                                wcvaFloatigMic.click();
                            }
                        }, wcvaOtherInputTimeoutDuration);
                    }
                }
            }, false); 
        }
    }
    }

    if (wcvaIsElementor == true){
        enableElementor()
    }

    // Attach event of mouse over to mic button
    wcvaWidgetMic.addEventListener('mouseover', function (event) {
        // Randomize text of mic tool-tip
        wcvaWidgetMic.title = wcvaGetRandomSearchHint();
    });
    /*###############################################################################*/

    /**
     * Function to get widget elements in an object
     *
     */
    function wcvaGetWidgetElementsObj() {
        return {
            'chatConvoEl': wcvaWidgetChatConvo, 
            'userMsgElWrapper': wcvaWidgetChatMsgItemUserWrapper,
            'userMsgEl': wcvaWidgetChatMsgItemUser,
            'simonMsgEl': wcvaWidgetChatMsgItemSimon,
            'errorMsgEl': wcvaWidgetChatMsgError,
        };
    }

    /**
     * Function to handle expand and collapse behavior of Chat window
     *
     * @param { action: String } 'expand' to expand or 'hide' to hide
     */
    function wcvaTogggleExpandCollapse(action = null) {
        try {
            if (!wcvaWidgetChatConvo) return false;

            let wcvaWidgetChatConvoClasses = wcvaWidgetChatConvo.classList;
            let wcvaExpandCollapseHandleClasses = wcvaExpandCollapseHandle.classList;
            let wcvaWidgetChatWrapperClasses = wcvaWidgetChatWrapper.classList;

            if (action == 'expand') {
                if (wcvaWidgetChatConvoClasses.contains('wcva-hide-element')) {
                    wcvaWidgetChatConvoClasses.remove('wcva-hide-element');
                }

                if (wcvaExpandCollapseHandleClasses.contains('wcva-expand-window')) {
                    wcvaExpandCollapseHandleClasses.add('wcva-collapse-window');
                    wcvaExpandCollapseHandleClasses.remove('wcva-expand-window');
                }

                if (wcvaWidgetChatWrapperClasses.contains(wcvaChatWrapperCollapseClass)) {
                    wcvaWidgetChatWrapperClasses.remove(wcvaChatWrapperCollapseClass);
                    wcvaWidgetChatWrapperClasses.add(wcvaChatWrapperMicPositionClass);
                }
            } else if (action == 'hide') {
                if (!wcvaWidgetChatConvoClasses.contains('wcva-hide-element')) {
                    wcvaWidgetChatConvoClasses.add('wcva-hide-element');
                }

                if (wcvaExpandCollapseHandleClasses.contains('wcva-collapse-window')) {
                    wcvaExpandCollapseHandleClasses.remove('wcva-collapse-window');
                    wcvaExpandCollapseHandleClasses.add('wcva-expand-window');
                }

                if (wcvaWidgetChatWrapperClasses.contains(wcvaChatWrapperMicPositionClass)) {
                    wcvaWidgetChatWrapperClasses.add(wcvaChatWrapperCollapseClass);
                    wcvaWidgetChatWrapperClasses.remove(wcvaChatWrapperMicPositionClass);
                }
            } else {
                wcvaWidgetChatConvoClasses.toggle('wcva-hide-element');
                wcvaExpandCollapseHandleClasses.toggle('wcva-expand-window');
                wcvaExpandCollapseHandleClasses.toggle('wcva-collapse-window');
                wcvaWidgetChatWrapperClasses.toggle(wcvaChatWrapperMicPositionClass);
                wcvaWidgetChatWrapperClasses.toggle(wcvaChatWrapperCollapseClass);
            }
            wcvaWidgetChatConvo.scrollTop = wcvaWidgetChatConvo.scrollHeight;
            if (wcvaExpandCollapseHandle.classList.contains('wcva-expand-window')) {
                wcvaExpandCollapseHandle.setAttribute('title', 'Click for see all conversions.');
            } else if (wcvaExpandCollapseHandle.classList.contains('wcva-collapse-window')){
                wcvaExpandCollapseHandle.setAttribute('title', 'Click for hide all conversions.');
            }
        } catch(err) {
           console.log('WCVA Error: something went wrong while expanding/collapsing a chat window.');
        }
    }

    /**
     * Function to check simon/simone introduced or not
     * @returns isSimonIntroduced
     */
    function wcvaSimonIntroduced() {
        let isSimonIntroduced = localStorage.getItem('wcvaSimonIntroduced');
        return isSimonIntroduced;
    }

    /**
     * Function to toggle chat and links
     *
     * @param { action: String } 'enable' to show chat wrapper
     */
    function wcvaToggleWidgetElements(action=null) {
        let isSimonIntroduced = wcvaSimonIntroduced();

        if (isSimonIntroduced === null) {
            // Play simon intro playbac
            wcvaIntentResponsePlayer.configure(wcvaAlternativeResponse['simonShortIntro']);
            wcvaIntentResponsePlayer.play();

            setTimeout(() => {
                localStorage.setItem('wcvaSimonIntroduced', true);
            }, 3000);
        } else if(wcvaWidgetIcon.className.indexOf(wcvaToggleButtonIconClass) != -1) {
            wcvaWidgetChatIntroMsgItemSimon.innerHTML = simonGuidlines;

            // Scroll chat convo to the end
            if (typeof(wcvaWidgetChatConvo.scrollTop) != 'undefined' 
                && typeof(wcvaWidgetChatConvo.scrollHeight) != 'undefined') {
                wcvaWidgetChatConvo.scrollTop = wcvaWidgetChatConvo.scrollHeight;
            }
        }

        if (action == 'enable') {
            wcvaTogggleExpandCollapse('hide');
            wcvaWidgetIcon.classList.add('wcva-widget-visible');
            wcvaWidgetToggleButton.classList.add('wcva-widget-float');
            wcvaWidgetChatWrapper.classList.add('wcva-widget-visible');
        } else {
            wcvaWidgetIcon.classList.remove('wcva-widget-visible');
            wcvaWidgetToggleButton.classList.remove('wcva-widget-float');
            wcvaWidgetChatWrapper.classList.remove('wcva-widget-visible');
        }

        // To set the chat history and expand the chat box 
        if (localStorage.getItem('wcvaChatHistory') !== null) {
            document.getElementById('wcvaWidgetChatConvo').innerHTML = localStorage.getItem('wcvaChatHistory');            
        }
    }
})();
};
