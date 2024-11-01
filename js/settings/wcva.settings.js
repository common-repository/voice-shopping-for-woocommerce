// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                                ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

var wcvaSynthErrorCount = 0;

// ########################################################################
//
// For toggling HTML elements visibility on UI
//
// ########################################################################

/**
 * Function to toggle visibility of intent configuration section
 *
 * @param dialogType - string : Selected dialog type
 */
function toggleWcvaDialogType(dialogType = 'generic') {
    try {
        let wcvaHideClass = 'wcv-assistant-hide';
        let dashboardNoIntentNoticeEl = document.querySelector('div[data-wcva-notice]');

        if (dialogType == 'generic') {
            document.getElementById('wcvAssistantDialogConfigFormSection').classList.remove(wcvaHideClass);
            document.getElementById('wcvAssistantCustomEndpointRow').classList.add(wcvaHideClass);
            
            // To display (if hidden) 'No Intent Configured' dashboard notice on settings page.
            if (dashboardNoIntentNoticeEl && dashboardNoIntentNoticeEl !== null) {
                dashboardNoIntentNoticeEl.classList.remove(wcvaHideClass);
            }
        } else {
            document.getElementById('wcvAssistantDialogConfigFormSection').classList.add(wcvaHideClass);
            document.getElementById('wcvAssistantCustomEndpointRow').classList.remove(wcvaHideClass);
            
            // To hide 'No Intent Configured' dashboard notice on settings page.
            if (dashboardNoIntentNoticeEl && dashboardNoIntentNoticeEl !== null) {
                dashboardNoIntentNoticeEl.classList.add(wcvaHideClass);
            }
        }
    } catch(err) {
        // Do nothing for now
    }
}

/**
 * Function to enable/disable intent input behaviour
 * 
 * @param { el: HTML Dom Object } Checkbox been interacted
 */
function toggleIntentAccessiblity(el) {
    try {
        if (el && el !== null) {
            let wcvaIntentInputAttributeNames = ['data-response-name', 'data-url-name', 'data-save-button-name'];
            let wcvaIntentEnabled = el.checked && el.checked === true ? true : false;
            let wcvaAttribNamesLength = wcvaIntentInputAttributeNames.length;
            
            for (let i = 0; i < wcvaAttribNamesLength; i++) {
                let wcvaIntentInputAttributeName = wcvaIntentInputAttributeNames[i];
                let wcvaIntentInputSelector = el.getAttribute(wcvaIntentInputAttributeName);

                if (!(wcvaIntentInputSelector && wcvaIntentInputSelector !== null)) continue;

                let wcvaIntentInput = document.querySelector(wcvaIntentInputSelector);

                if (!(wcvaIntentInput && wcvaIntentInput !== null)) continue;

                // To enable intent save button
                if (wcvaIntentInput.type && wcvaIntentInput.type === 'submit') {
                    if (wcvaIntentEnabled === true) {
                        wcvaIntentInput.removeAttribute('disabled');
                    } 

                    continue;
                } 

                // To enable/disable intent response and URL
                if (wcvaIntentEnabled === true) {
                    wcvaIntentInput.removeAttribute('readonly');
                } else {
                    wcvaIntentInput.setAttribute('readonly', wcvaIntentEnabled);
                }
            }
        }
    } catch (err) {
        // Do nothing for now
    }
}

/**
 * Function to toggle visibility of 'Google Analytics Tracking ID' input field
 *
 * @param { checkboxObj: DOM Object } Checkbox as DOM Object
 */
function wcvaToggleGaTrackingIdField(checkboxObj = null) {
    try {
        if (typeof checkboxObj == 'undefined' || !checkboxObj) return false;

        let wcvaGaTrackingIdObj = document.querySelector('div[id=wcvaGaTrackingIdWrapper]');
        
        if (wcvaGaTrackingIdObj) {
            let wcvaGaTrackingIdClasses = wcvaGaTrackingIdObj.classList;
            wcvaGaTrackingIdClasses.toggle('wcva-hide-element');
        }
    } catch(err) {
        // Do nothing for now
    }
}

// ########################################################################
//
// For handling validation of input elements on UI
//
// ########################################################################
/**
 * Function to reset auto end mic listening timeout
 *
 * @param this- DOMElement Object
 * @param evt - Event 
 */
function wcvaResetTimeoutDefaultValue(el, evt) {
    if (typeof(el) == 'undefined') return;
    
    if (el.value.length == 0) {
        el.value = "8";
    } else if (parseInt(el.value) > 20) {
        el.value = "20";
    } else if (parseInt(el.value) < 8) {
        el.value = "8";
    }
}

/**
 * Function to validate length of timeout value
 *
 * @param this- DOMElement Object
 * @param evt - Event 
 */
function wcvaValidateTimeoutValue(el, evt) {
    if (typeof(el) == 'undefined') return;

    if (el.value.length == 2 && parseInt(el.value) > 20) {
        evt.preventDefault();
    }
}

// ########################################################################
//
// For handling change events of input elements on UI
//
// ########################################################################
/**
 * Function to handle change event of select voice element/dropdown
 * 
 * @param selectEl - DOMElement Object Select voice element
 *
 */
function wcvaVoiceChange(selectEl) {
    let newValue = selectEl.value;
    let oldValue = selectEl.getAttribute('data-old-value');
    let doSynthesize = selectEl.getAttribute('data-do-synthesize');

    if (!!newValue && !!oldValue && oldValue !== newValue) {
        selectEl.setAttribute('data-do-synthesize', true);
    } else if (!!doSynthesize && doSynthesize === "true") {
        selectEl.setAttribute('data-do-synthesize', false);
    }
}

/**
 * Function to handle input text of Google Analytics tracking id
 *
 * @param inputEl - DOMElement Object Google analytics Id input field
 */
function wcvaGaIdChange(inputEl) {
    if (!!inputEl) {
        let value = inputEl.value;
        let errorState = inputEl.getAttribute('data-error');

        function wcvaToggleError(action = null) {
            if (!action || !(action == 'show' || action == 'hide')) return false;
            
            let wcvaGaIdError = document.getElementById('wcvaGaIdError');
            let wcvaBasicConfSaveButton = document.getElementById('wcvAssistantBasicConfigSettingsSave');
            let outline = "";
            let color = "";
            let dataErrorAttr = "";
            let errorDisplay = "";
            
            if (action == 'show') {
                outline = "2px solid #FF0000";
                color = "#FF0000";
                dataErrorAttr = "1";
                errorDisplay = "block";

                if (!!wcvaBasicConfSaveButton) {
                    wcvaBasicConfSaveButton.setAttribute('disabled', 'disabled');
                }
            } else {
                outline = "";
                color = "#000000";
                dataErrorAttr = "0";
                errorDisplay = "none";

                if (!!wcvaBasicConfSaveButton) {
                    wcvaBasicConfSaveButton.removeAttribute('disabled');
                }
            }

            inputEl.style.outline = outline;
            inputEl.style.color = color;
            inputEl.setAttribute('data-error', dataErrorAttr);

            if (!!wcvaGaIdError) {
                wcvaGaIdError.style.display = errorDisplay;
            }
        }

        if (!!value) {
            let val = value.toLowerCase();

            if (((val.length == 1 && val == 'u')
                || (val.length == 2 && val == 'ua')
                || (val.length > 2 && val.substring(0, 3) == 'ua-'))
                && errorState == '1') {
                wcvaToggleError('hide');
            }

            if (((val.length == 1 && val != 'u')
                || (val.length == 2 && val != 'ua')
                || (val.length > 2 && val.substring(0, 3) != 'ua-'))
                && errorState == '0') {                
                wcvaToggleError('show');
            }
        } else if (errorState == '1') {
            wcvaToggleError('hide');
        }
    }
}

// ########################################################################
//
// For Window and Document load and Unload Events
//
// ########################################################################
window.addEventListener('load', function() {
    let data = wcvaGetSynthesizableIntents(false);

    // While plugin being activated (Even while upgrade)
    if (!!data && data.length > 0) {
        wcvaSynthesizeProcPopup('show', true);
        wcvaSynthesizeRecursively(data, null, data.length, null);
    }
});

// To restrict user from navigating away while synthesizing process is on
document.body.addEventListener('load', function() {
    document.body.style.pointerEvents = 'auto';
})

// ########################################################################
//
// For Text Synthsis processs
//
// ########################################################################

/**
 * Function to read option name array of intents (Which require audio file generation) from HTML
 *
 * @param Boolean forVoiceChange  'true' to read array of intents db option names intended for voice/language change
 *
 * @return Array data  Array of intents DB option names based on @param forVoiceChange.
 *
 */
function wcvaGetSynthesizableIntents(forVoiceChange) {
    let voiceChanged = typeof forVoiceChange != 'undefined' && forVoiceChange == true ? true : false;
    let attrName = !!forVoiceChange ? 'data-intents-with-audios' : 'data-intents-for-audio-regeneration';
    
    let dialogConfigWrapperEl = document.getElementById('wcvAssistantDialogConfigFormSection');
    let wcvaIntentsForAudioRegeneration = !!dialogConfigWrapperEl ? dialogConfigWrapperEl.getAttribute(attrName) : null;
    let data = !!wcvaIntentsForAudioRegeneration ? JSON.parse(wcvaIntentsForAudioRegeneration) : null;

    return data;
}

/**
 * Function to synthesize text of more than one dialogs recursively
 *
 * @param Array intentDbOptionNames  Array of database option name for dialogs/intents
 * @param String voice  Voice/language to be used to synthesize text
 * @param Number totalDialogs  Total number of dialogs to synthesize
 * @param Function cb  Callback function
 *
 */
function wcvaSynthesizeRecursively(intentDbOptionNames, voice, totalDialogs, cb) {
    let dbOpNames = typeof intentDbOptionNames != 'undefined' && !!intentDbOptionNames ? intentDbOptionNames : null;
    let changedVoice = typeof voice != 'undefined' && !!voice ? voice : null;
    let totalDialogsCount = typeof totalDialogs != 'undefined' && !!totalDialogs ? totalDialogs : null;

    // ################################################################################
    // Here we are done with text synthesis recursive process as soon as db name options array gets empty
    // Handle the post process complete stuff here
    // ################################################################################
    if (!(!!dbOpNames && dbOpNames.length > 0) || wcvaSynthErrorCount > 0) {
        let errCount = wcvaSynthErrorCount;
        wcvaSynthErrorCount = 0;
        wcvaSynthesizeProcPopup('hide', true);

        if (typeof cb == 'function') {
            cb(errCount > 0 ? true : false);
        } else if (errCount == 0) {
            window.location.reload();
        }

        return;
    };

    let dbOptionName = dbOpNames.shift();
    let form = document.querySelector('form[data-intent-option-key='+ dbOptionName +']');
    let inputs = !!form ? form.elements : null;

    if (!(!!inputs)) return;

    let textareaEl = inputs[dbOptionName + '[response]'];
    let textareaText = !!textareaEl ? textareaEl.getAttribute('data-old-value') : null;

    if (!(!!textareaText)) return;

    // Update dialog systhesis counter
    wcvaUpdateSynthCounter(totalDialogsCount, (parseInt(totalDialogsCount) - parseInt(dbOpNames.length)))

    // Make AJAX call to local server for text synthesis
    wcvaSynthesize(textareaText, dbOptionName, null, changedVoice).then(function(){
        wcvaSynthesizeRecursively(dbOpNames, changedVoice, totalDialogsCount, cb);
    }).catch(function(error) {
        let errorObj = typeof error != 'undefined' && !!error ? error : {};
        let errorCode = 'code' in errorObj ? errorObj['code'] : null;
        let errorMsg = 'error' in errorObj ? errorObj['error'] : null;

        if (!!errorMsg) alert(errorMsg);
        
        wcvaSynthErrorCount += 1;
        wcvaSynthesizeRecursively(dbOpNames, changedVoice, totalDialogsCount, cb);
    });
}

/**
 * Function to synthesize text using AJAX
 *
 * @param String dialogText  Dialog/response text to be synthesized
 * @param String dialogOpName  Database option name for dialog
 * @param HTMLElement form  Form DOM object
 * @param String paramVoice  Voice to be used for synthesizing
 *
 * @return Promise.
 *
 */
function wcvaSynthesize(dialogText, dialogOpName, form, paramVoice) {
    let isMulti = typeof isLanguageChange != 'undefined' && !!isLanguageChange && isLanguageChange === true ? true : false;
    let text = typeof dialogText != 'undefined' && !!dialogText ? dialogText : null;
    let optionName = typeof dialogOpName != 'undefined' && !!dialogOpName ? dialogOpName : null;
    let errPrefix = 'Unable to synthesize the dialog. ';

    return new Promise(function(resolve, reject){        
        let formData = new FormData();

        if (!!text && !!optionName) {
            formData.append('dialog_text', text);
            formData.append('dialog_op_name', optionName);

            if (typeof paramVoice != 'undefined' && !!paramVoice) formData.append('voice_for_synth', paramVoice);
        } else {
            reject({'code': 'WCVA_ERROR_5', 'error': errPrefix + 'Required parameters are missing.'});
            return;
        }
        
        formData.append("action", "wcva_synthesize");
        formData.append("_ajax_nonce", wcvaAjaxObj.synthesize_nonce);

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {                
                if (this.status === 200) {
                    let res = JSON.parse(this.response);
                    let success = typeof res != 'undefined' && 'success' in res ? res['success'] : null;
                    let data = typeof res != 'undefined' && 'data' in res ? res['data'] : null;
                    
                    if (!!success) {
                        // #####################################################################################################################
                        // On front end hidden fields are used while form submission to store dialog audio data to DB.
                        // To avoid overriding of updated data at DB (Updated by this ajax call) by old data from hidden fields form submission
                        // Here we are updating hidden fields.
                        // #####################################################################################################################
                        if (!!data && typeof form != 'undefined' && !!form) { 
                            let voice = 'voice' in data ? data['voice'] : null;
                            let path = 'path' in data ? data['path'] : null;
                            let inputs = form.elements;

                            if (!!voice && !!path && typeof inputs != 'undefined' && !!inputs) {
                                let audioVoiceHiddenEl = inputs[optionName + "[intent_audio_response][voice]"];
                                let audioPathHiddenEl = inputs[optionName + "[intent_audio_response][path]"];
                                
                                audioVoiceHiddenEl.value = voice;
                                audioPathHiddenEl.value = path;
                            }
                        }

                        resolve();
                    } else {
                        let errorObj = !!data ? data : {};
                        let errorCode = 'code' in data ? data['code'] : null;
                        let errorMsg = 'error' in data ? data['error'] : null;
                        let msg = !!errorMsg ? errPrefix + errorMsg : errPrefix;
                        reject({'code': 'WCVA_ERROR_6', 'error': msg});
                    }
                } else {
                    reject({'code': 'WCVA_ERROR_7', 'error': errPrefix + 'Technically improper request to the server.'});
                }
            }
        }

        xhr.open("POST", wcvaAjaxObj.ajax_url, true); 
        xhr.send(formData);
    });
}

// ########################################################################
//
// For Basic and Dialog Form submission
//
// ########################################################################
/**
 * Function to intercept basic form submission process
 *
 * @param HTMLElement formObj  Form DOM object
 * @param Event evt  Form submission synthetic event object
 *
 */
function wcvaBasicFormSubmitHandler(formObj, evt) {
    if (typeof formObj != 'undefined' && !!formObj) {
        let doSynthesize = false;
        let selectVoiceEl = formObj.querySelector('select[data-synth-decider=voice]');
        let synthFlagFromVoice = !!selectVoiceEl ? selectVoiceEl.getAttribute('data-do-synthesize') : null;
        doSynthesize = !!synthFlagFromVoice && synthFlagFromVoice === 'true' ? true : false;

        if (!!doSynthesize) {
            evt.preventDefault();
            let newVoice = selectVoiceEl.value.trim();
            let oldVoice = selectVoiceEl.getAttribute('data-old-value');

            let data = wcvaGetSynthesizableIntents(true);

            if (!!data && data.length > 0) {
                wcvaSynthesizeProcPopup('show', true);
                wcvaSynthesizeRecursively(data, newVoice, data.length, function(errorOccured) {
                    let hadError = typeof errorOccured != 'undefined' && errorOccured === true ? true : false;
                    formObj.submit();
                });
            } else {
                formObj.submit();
            }
        }
    }
}

/**
 * Function to intercept dialog form submission process
 *
 * @param HTMLElement formObj  Form DOM object
 * @param Event evt  Form submission synthetic event object
 *
 */
function wcvaDialogFormSubmitHandler(formObj, evt) {
    if (!!formObj) {
        let doSynthesize = false;
        let inputs = formObj.elements;
        let dialogOptionDbName = formObj.getAttribute('data-intent-option-key');
        
        let textarea = inputs[dialogOptionDbName + "[response]"];
        let textareaOldValue = !!textarea ? textarea.getAttribute('data-old-value').trim() : null;
        let textareaNewValue = !!textarea ? textarea.value.trim() : null;

        let checkbox = inputs[dialogOptionDbName + "[enabled]"];
        let checkboxOldValue = !!checkbox ? checkbox.getAttribute('data-old-value').trim() : null;
        let checkboxNewValue = !!checkbox ? checkbox.value.trim() : null;

        if (!!textareaNewValue && textareaOldValue !== textareaNewValue) {
            doSynthesize = true;
        }
        
        let audioVoiceEl = inputs[dialogOptionDbName + "[intent_audio_response][voice]"];
        let audioVoice = !!audioVoiceEl ? audioVoiceEl.value : null;
        let pluginCurrentVoice = formObj.getAttribute('data-current-voice');

        if (
            doSynthesize === false &&
            !!checkboxNewValue &&
            checkboxNewValue == 'enabled' &&
            !!audioVoice &&
            !!pluginCurrentVoice &&
            (audioVoice !== pluginCurrentVoice)
        ) {
            doSynthesize = true;
        }

        if (!!doSynthesize && !!textareaNewValue) {
            evt.preventDefault();
            wcvaSynthesizeProcPopup('show', false);
            
            wcvaSynthesize(textareaNewValue, dialogOptionDbName, formObj, null).then(function(result) {
                wcvaSynthesizeProcPopup('hide', false);
                formObj.submit();
            }).catch(function(error) {
                let errorObj = typeof error != 'undefined' && !!error ? error : {};
                let errorCode = 'code' in errorObj ? errorObj['code'] : null;
                let errorMsg = 'error' in errorObj ? errorObj['error'] : null;

                wcvaSynthesizeProcPopup('hide', false);

                if (!!errorMsg) alert(errorMsg);

                formObj.submit();
            });
        }
    }
}

// ########################################################################
//
// For Text synthesis process popup
//
// ########################################################################

/**
 * Function to control visibility of synthesizing process popup
 *
 * @param String action  'show' or 'hide'
 * @param Boolean paramForMulti  Indicating whether the popup being displayed for sythesizing process for more than one dialogs.
 *
 */
function wcvaSynthesizeProcPopup(action, paramForMulti) {
    if (typeof action != 'undefined' && !(action == 'show' || action == 'hide')) return;

    let wcvaModal = document.getElementById('wcvaLoaderModal');

    try {
        if (!wcvaModal) return;

        let display = 'none';
        let pointerEvent = 'auto';

        if (action == 'show') {
            display = 'block';
            pointerEvent = 'none';

            let wcvaTotalSynthResponseSection = document.getElementById('wcvaTotalSynthResponseSection');

            if (!!wcvaTotalSynthResponseSection) {
                let forMulti = typeof paramForMulti != 'undefined' && paramForMulti === true ? true : false;
                wcvaTotalSynthResponseSection.style.display = (forMulti) ? 'block' : 'none';                            
            }
        }

        wcvaModal.style.display = display;
        document.body.style.pointerEvents = pointerEvent;
    } catch(err) {
        if (!!wcvaModal) wcvaModal.style.display = 'none';

        document.body.style.pointerEvents = 'auto';
    }
}

/**
 * Functiont to update counter information in UI of synthesize process dialog
 * 
 * @param totalDialogs Number  Total number of dialogs to be synthesized
 * @param currentDialog Number  Current dialog being synthesized
 *
 */
function wcvaUpdateSynthCounter(totalDialogs, currentDialog) {
    let wcvaTotalSynthResponseSection = document.getElementById('wcvaTotalSynthResponseSection');
    
    try {
        if (!!wcvaTotalSynthResponseSection && wcvaTotalSynthResponseSection.style.display == 'block') {
            let current = wcvaTotalSynthResponseSection.querySelector('span[id=wcvaCurrentDialog]');
            let total = wcvaTotalSynthResponseSection.querySelector('span[id=wcvaTotalSynthesizableDialogs]');

            if (!!current && !!total) {
                total.innerText = totalDialogs;
                current.innerText = currentDialog;
            }
        }
    } catch(err) {
        if (!!wcvaTotalSynthResponseSection) wcvaTotalSynthResponseSection.style.display = 'none';
    }
}