
// *****************************************************************************************************
// *******              speak2web Voice Shopping For WooCommerce                             ***********
// *******               AI Service requires subcriptions                                    ***********
// *******               Get your subscription at                                            ***********
// *******                    https://speak2web.com/plugin#plans                             ***********
// *******               Need support? https://speak2web.com/support                         ***********
// *******               Licensed GPLv2+                                                     ***********
//******************************************************************************************************

/**
 * General constants 
 *
 */
var wcvaPathUrl = typeof wcva.wcvaPath != 'undefined' ? wcva.wcvaPath : null;
var wcvaSelectedLang = 'en-US'; // For utterance/speech
var wcvaVoiceAndLanguage = (typeof(wcva.wcvaConfiguredVoice) != 'undefined' && wcva.wcvaConfiguredVoice !== null) ? wcva.wcvaConfiguredVoice.trim() : 'male_en_US';// Configured Voice from settings
var wcvaServiceKeys = {
    'iSTT': typeof wcvaIsttT != 'undefined' ? wcvaIsttT : null
};

var wcvaIsSttLangCtx = typeof wcva._wcvaSttLanguageContext != 'undefined' && !!wcva._wcvaSttLanguageContext && wcva._wcvaSttLanguageContext instanceof Object ? true : false;
var wcvaSttLanguageContext = {
    'gcp': {
        'stt': null,
        'langCode': null,
        'endPoint': null,
        'key': null,
        'qs': {'key': null}
    }
}

if (wcvaIsSttLangCtx === true) {
    //###############################
    // GCP
    //###############################
    let gcp = 'gcp' in wcva._wcvaSttLanguageContext && wcva._wcvaSttLanguageContext['gcp'] instanceof Object ? wcva._wcvaSttLanguageContext['gcp'] : {};
    wcvaSttLanguageContext['gcp']['stt'] = 'stt' in gcp && gcp['stt'] == 'Y' ? true : false;

    if (!!wcvaSttLanguageContext['gcp']['stt']) {
        wcvaSttLanguageContext['gcp']['endPoint'] = 'endPoint' in gcp && typeof gcp['endPoint'] != 'undefined' && !!gcp['endPoint'] ? gcp['endPoint'] : null;
        wcvaSttLanguageContext['gcp']['key'] = 'key' in gcp && typeof gcp['key'] != 'undefined' && !!gcp['key'] ? gcp['key'] : null;
        wcvaSttLanguageContext['gcp']['langCode'] = 'langCode' in gcp && typeof gcp['langCode'] != 'undefined' && !!gcp['langCode'] ? gcp['langCode'] : null;

        let qs = 'qs' in gcp && gcp['qs'] instanceof Object ? gcp['qs'] : {};
        wcvaSttLanguageContext['gcp']['qs']['key'] = 'key' in qs && typeof qs['key'] != 'undefined' && !!qs['key'] ? qs['key'] : null;
    }
}

//####################################
// CLIENT INFO
//####################################
let wcvaNavigator = { 'navigatorUserAgent': navigator.userAgent.toLowerCase(), 'navigatorPlatform': navigator.platform };
var wcvaClientInfo = {
    'safari': wcvaNavigator.navigatorUserAgent.indexOf('safari') > -1,
    'chrome': wcvaNavigator.navigatorUserAgent.indexOf('chrome') > -1,
    'firefox': wcvaNavigator.navigatorUserAgent.indexOf('firefox') > -1,
    'edge': wcvaNavigator.navigatorUserAgent.indexOf('edge') > -1 || wcvaNavigator.navigatorUserAgent.indexOf('edg') > -1,
    'ie': wcvaNavigator.navigatorUserAgent.indexOf('msie') > -1 || wcvaNavigator.navigatorUserAgent.indexOf('trident') > -1,
    'opera': wcvaNavigator.navigatorUserAgent.indexOf('opera') > -1 || wcvaNavigator.navigatorUserAgent.indexOf('opr') > -1,

    'ios': !!wcvaNavigator.navigatorPlatform && /iPad|iPhone|iPod/.test(wcvaNavigator.navigatorPlatform),
    'android': wcvaNavigator.navigatorUserAgent.indexOf("android") > -1,
    'windows': wcvaNavigator.navigatorUserAgent.indexOf("windows") > -1,
    'linux': wcvaNavigator.navigatorUserAgent.indexOf("linux") > -1,

    'macSafari': wcvaNavigator.navigatorUserAgent.indexOf('mac') > -1 && wcvaNavigator.navigatorUserAgent.indexOf('safari') > -1 && wcvaNavigator.navigatorUserAgent.indexOf('chrome') === -1,
    'iosSafari': this.ios === true && wcvaNavigator.navigatorUserAgent.indexOf('safari') > -1,
};

if (wcvaClientInfo['chrome'] === true && (wcvaClientInfo['opera'] === true || wcvaClientInfo['edge'] === true)) {
    wcvaClientInfo['chrome'] = false;
}

/**
 * Path map for audio files of short phrases
 *
 */
var wcvaAudioShortPharasesPaths = {
    'root': 'short_phrases/',
    'voice': wcvaVoiceAndLanguage + '/',
    'random': 'random/',
    'general': 'general/',
    'getRandomVoicesPath': function() {
        return this.root + this.voice + this.random + wcvaVoiceAndLanguage + '_random_';
    },
    'getGeneralVoicesPath': function() {
        return this.root + this.voice + this.general + wcvaVoiceAndLanguage;
    }
}

let wcvaRandomShortPhrasePath = wcvaAudioShortPharasesPaths.getRandomVoicesPath();
let wcvaGeneralShortPhrasePath = wcvaAudioShortPharasesPaths.getGeneralVoicesPath();
let wcvaSilenceSoundPath = wcvaAudioShortPharasesPaths.root + 'silence.mp3';

/**
 * Voice validator Object
 *
 */
var wcvaVoiceType = {
    'female': wcvaVoiceAndLanguage.indexOf('female_') !== -1 ? true : false,
    'ukEnglish': wcvaVoiceAndLanguage.indexOf('en_GB') !== -1 ? true : false,
    'usEnglish': wcvaVoiceAndLanguage.indexOf('en_US') !== -1 ? true : false,
    'german': wcvaVoiceAndLanguage.indexOf('de_DE') !== -1 ? true : false
};

/**
 * Alternative response audio files to be played/spoken
 *
 */
var wcvaAlternativeResponse = {
    /**
     * Text in audio file
     * US and UK English: One moment please.
     * German: Einen Moment bitte.
     */
    'basic'  : wcvaGeneralShortPhrasePath + "_basic.mp3",
    /**
     * Text in audio file
     * US and UK English: I am sorry but I am unable to acces your microphone. Please connect a microphone or you can also type your question if needed.
     * German: Es tut mir leid, aber ich kann nicht auf Ihr Mikrofon zugreifen. Bitte schließen Sie ein Mikrofon an oder geben Sie bei Bedarf Ihre Frage ein.
     */
    'micConnect' : wcvaGeneralShortPhrasePath + "_mic_connect.mp3",
    'randomLib' : [
        /**
         * Text in audio file
         * US and UK English: Just a second please.
         * German: Eine Sekunde bitte.
         */
        wcvaRandomShortPhrasePath + "0.mp3",
        /**
         * Text in audio file
         * US and UK English: I am on it.
         * German: Ich bin dabei.
         */
        wcvaRandomShortPhrasePath + "1.mp3",
        /**
         * Text in audio file
         * US and UK English: No problem.
         * German: Kein Problem.
         */
        wcvaRandomShortPhrasePath + "2.mp3",
        /**
         * Text in audio file
         * US and UK English: Just a moment, I need a brief rest.
         * German: Einen Moment, ich brauche eine kurze Pause.
         */
        wcvaRandomShortPhrasePath + "3.mp3",
        /**
         * Text in audio file
         * US and UK English: You seem to work too hard. Get your self a coffee, and I will look it up for you.
         * German: Sie scheinen zu hart zu arbeiten. Holen Sie sich einen Kaffee, und ich werde es für Sie nachschlagen.
         */
        wcvaRandomShortPhrasePath + "4.mp3",
        /**
         * Text in audio file
         * US and UK English: Coming right up.
         * German: Das haben wir gleich.
         */
        wcvaRandomShortPhrasePath + "5.mp3",
        /**
         * Text in audio file
         * US and UK English: I will do my best
         * German: Ich werde mein Bestes geben
         */
        wcvaRandomShortPhrasePath + "6.mp3",
        /**
         * Text in audio file
         * US and UK English: Anything for you. I will get right on it.
         * German: Alles für dich. Ich werde gleich darauf eingehen.
         */
        wcvaRandomShortPhrasePath + "7.mp3",
        /**
         * Text in audio file
         * US and UK English: Working on it. One moment please.
         * German: Ich arbeite daran. Einen Moment bitte.
         */
        wcvaRandomShortPhrasePath + "8.mp3",
        /**
         * Text in audio file
         * US and UK English: Beep - Beep - Beep, just kidding. One moment please
         * German: Beep - Beep - Beep, war nur ein Scherz. Einen Moment bitte.
         */
        wcvaRandomShortPhrasePath + "9.mp3"
    ],
    /**
     * Text in audio file
     * US and UK English: Voice navigation is currently unavailable. Please try again after some time.
     * German: Die Sprachnavigation ist derzeit nicht verfügbar. Bitte versuchen Sie es nach einiger Zeit erneut.
     */
    'unavailable' : wcvaGeneralShortPhrasePath + "_unavailable.mp3",
    /**
     * Text in audio file
     * US and UK English: Let me search for that.
     * German: Lass mich danach suchen.
     */
    'disabledIntentResponse' : wcvaGeneralShortPhrasePath + "_disabled_intent.mp3",
    /**
     * Text in audio file
     * US and UK English: I am unable to hear you
     * German: Ich kann dich nicht hören
     */
    'notAudible': wcvaGeneralShortPhrasePath + "_not_audible.mp3",
    /**
     * Text in audio file
     * US and UK English: Hello, my name is Simon. I am your web virtual assistant.
     * German: Hallo, ich heiße Simon. Ich bin Ihr virtueller Webassistent.
     */
    'simonShortIntro': wcvaGeneralShortPhrasePath + "_simon_intro.mp3",
    /**
     * Text in audio file
     * US and UK English: I am sorry I was unable to process the request. Please try again.
     * German: Es tut mir leid, dass ich die Anfrage nicht bearbeiten konnte. Bitte versuche es erneut.
     */
    'unableToProcess': wcvaGeneralShortPhrasePath + "_unable_to_process.mp3",
    /**
     * Text in audio file
     * US and UK English: Here is what you are looking for.
     * German: Hier ist was Sie suchen.
     */
    'defaultDesc': wcvaGeneralShortPhrasePath + "_default_desc.mp3",
};

/**
 * Static text labels
 * For: UK and US English
 *
 */
var wcvaMessages = {
    'unableToProcess': ' I am sorry I was unable to process the request. Please try again.',
    'unableToSpeak': 'Unable to speak!',
    'callFailed': 'Call to AI failed.',
    'traditionalSearch': 'I have made a traditional native search for you. Please check native search results.',
    'pageUnavailable': 'Page you are looking for is not available.',
    'micNotAccessible': 'I am unable to access the microphone.',
    'browserDenyMicAccess': "Your browser security doesn't allow me to access the mic.",
    'transcribeText': ' Transcribing ....',
    'unableToHear': 'I am unable to hear you.',
    'ask': ' Say it again ....',
};

/**
 * Static text labels for floating widget
 * For: UK and US English
 *
 */
var wcvaWidgetMessages = {
    'you': 'You',
    'simonIntro': {
        'name': `Hello my name is ${wcvaVoiceType.female === true ? 'Simone' : 'Simon'}`,
        'intro': ". I am your web virtual assistant. You can ask me what you are looking for in one of the following way."
    },
    'simonGuidelines': "1. Using a microphone at bottom left side.<br/>2. Or type a query in the text box next to the microphone.<br/><br/>Give it a try by asking 'About us'",
    'placeholder': 'Type a question',
    'botName': wcvaVoiceType.female === true ? 'Simone' : 'Simon'
};

/**
 * Static error messages library
 * For: UK and US English
 *
 */
var wcvaErrorLibrary = {
    'outOfService': wcvaWidgetMessages['botName'] + " is out of service. Please try again after some time."
}

/**
 * FOR GERMAN LANGUAGE
 *
 */
if (wcvaVoiceType.german) {
    wcvaSelectedLang = 'de-DE';

    /**
     * Static text labels
     * For: German
     *
     */
    wcvaMessages = {
        'unableToProcess': ' Es tut mir leid, dass ich die Anfrage nicht bearbeiten konnte. Bitte versuche es erneut.',
        'unableToSpeak': 'Nicht in der Lage zu sprechen!',
        'callFailed': 'Anruf bei AI fehlgeschlagen.',
        'traditionalSearch': 'Ich habe eine traditionelle Suche nach Ihnen durchgeführt. Bitte überprüfen Sie die nativen Suchergebnisse.',
        'pageUnavailable': 'Die von Ihnen gesuchte Seite ist nicht verfügbar.',
        'micNotAccessible': 'Ich kann nicht auf das Mikrofon zugreifen.',
        'browserDenyMicAccess': "Ihre Browsersicherheit erlaubt mir nicht, auf das Mikrofon zuzugreifen.",
        'transcribeText': ' Transkribieren ....',
        'unableToHear': 'Ich kann dich nicht hören.',
        'ask': ' Sage es noch einmal ....',
    }

    /**
     * Static text labels for floating widget
     * For: German
     *
     */
    wcvaWidgetMessages = {
        'you': 'Sie',
        'simonIntro': {
            'name': `Hallo, mein Name ist ${wcvaVoiceType.female === true ? 'Simone' : 'Simon'}`,
            'intro':". Ich bin Ihr virtueller Webassistent. Sie können mich auf eine der folgenden Arten fragen, wonach Sie suchen."
        },
        'simonGuidelines': "1. Mit einem Mikrofon unten links.<br/>2. Oder geben Sie eine Abfrage in das Textfeld neben dem Mikrofon ein.<br/><br/>Probieren Sie es aus, indem Sie nach 'Über uns' fragen.",
        'placeholder': 'Geben Sie eine Frage ein',
        'botName': wcvaVoiceType.female === true ? 'Simone' : 'Simon'
    };

    /**
     * Static error messages library
     * For: German
     *
     */
    wcvaErrorLibrary = {
        'outOfService': wcvaWidgetMessages['botName'] + " ist außer Betrieb. Bitte versuchen Sie es nach einiger Zeit erneut."
    }
}

/**
 * FOR UK ENGLISH LANGUAGE
 *
 */
if (wcvaVoiceType.ukEnglish) {
    wcvaSelectedLang = 'en-GB';
}

var wcvaIsElementor = typeof wcva.wcvaElementorMic != 'undefined' && !! wcva.wcvaElementorMic && wcva.wcvaElementorMic == 'yes' ? true : false;
var wcvaIsInputFieldMic = typeof wcva.wcvaInputFieldMic!= 'undefined' && !! wcva.wcvaInputFieldMic && wcva.wcvaInputFieldMic == 'yes' ? true : false;