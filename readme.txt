=== Voice Shopping for WooCommerce ===
Contributors:      mspanwa2   
Tags:              WooCommerce, voice shopping, woo commerce, voice assistant, voice forms, voice survey, virtual assistant, voice dialog, voice, voice navigation, AI, natural language processing, speech, api,  
Requires at least: 4.0 
Tested up to:      6.1.1 
Requires PHP:      7.2
Stable tag:        2.0.0 
License:           GPLv2 or later  
License URI:       http://www.gnu.org/licenses/gpl-2.0.html  

Voice Shopping for WooCommerce!
   * Add a voice shopping assistant to your WooCommerce store. -- FREE for one month
   * Allow your customers to shop your WooCommerce store using voice commands
   * Supports Elementor Page Builder integration for perfect design
   * Fuzzy matching of product descriptions
   * Add to cart via Voice Command
   * Checkout via Voice Command
This plugin adds a virtual voice assistant to your WooCommerce shop. The plugin integrates into your WooCommerce store.
Customers can ask the voice assistant to find products on your store, the assistant will browse list of products and categories to locate the product and navigate automatically.
Using this plugin you can provide the first Voice / Web Shopping experience on all modern web browsers and mobile devices.


= ELEMENTOR PAGE BUILDER SUPPORT NOW INCLUDED =

Place a microphone anywhere on your site. Control the icon, color, and other advanced design features when deploying this exciting new feature. 


== Description ==


https://www.youtube.com/watch?v=ru1PLUsisl4

= ELEMENTOR PAGE BUILDER SUPPORT NOW INCLUDED =

Place a microphone anywhere on your site. Control the icon, color, and other advanced design features when deploying this exciting new feature. 

= ETHICAL PRIVACY FOCUSED VOICE ASSISTANCE & SEARCH FOR YOUR WEBSITE =

This plugin adds  a virtual voice assistant to your WooCommerce store.Simply set up a WooCommerce Customer Key (CK) and Customer Secret (CS) in WooCommerce and copy it into the setup page of the WooCommerce Voice Assistant.

Customize the verbal responses to the set of predefined commands and enjoy your voice shopping experience.

The plugin automatically discovers your products and categories defined in WooCommerce and makes them available to your customers via voice commands.

The virtual voice assistant will reply with the pre-configured response in written and verbal form. With our high-quality voices, both male and female this plugin will provide an unmatched shopping experience to your customers.

Once configured, your customers can explore your store using voice commands like:

"Do you sell office supplies?"    --> this would be a category search looking for office supplies

"I am looking for a iPhone XS case."    --> this will trigger a product search for a "iPhone XS case"

"Add the USB Wall Charger to the shopping cart."   --> this command will locate a "USB Wall Charger" product and add it to the shopping cart

"Show me the shopping cart"

"I want to Check out"

"Show me my orders"

"How can I contact you"

"What shipping options do you offer"

"Can I pay with credit card?"

"....." and many more commands (intents) are being recognized and processed.

Our service helps you to stay compliant with privacy regulations because we do not store or retain any user generated content or personally identifying information. As one of the earliest members and contributors to The Open Voice Network, a Community of The Linux Foundation, we have made it our goal to deliver services in voice tech that meet even the most demanding standards and guidelines. 

An active, valid, and recognized SSL Certificate and HTTPS website are required to use our plugin and services. This is only one small part of how we protect privacy of your visitors and security of your website.

[The Pro version available on our website](https://speak2web.com/plugin-2/) adds support for all modern browsers and platforms as well as our full set of language models. Visit our website for current Pro rates, customization services, and to obtain a license key to unlock the full suite of services this amazing plugin has to offer.


Amazon Web Services:
++++++++++++++++++++
speak2web is hosting its cloud services in AWS infrastructure. We are utilizing services such AWS Gateway API, AWS compute Services, AWS storage and AWS database services. We post data to Aamazon Web Services for storing user databases.
[AWS Services:]  (https://aws.amazon.com)
[The AWS privacy terms can be reviewed here:] (https://aws.amazon.com/privacy/) 


== Installation ==

= Manual Installation =

1. Upload the entire `/voice-shopping-for-woocommerce` directory to the `/wp-content/plugins/` directory.
2. Activate Voice Search through the 'Plugins' menu in WordPress.
3. Sign up for a speak2web service plan to access the AI service required to run this plugin
4. Copy the license key you obtained with your subscription into the settings section of the voice dialog-navigation plugin
5. activate your license key --> this step will call the cloud backend to verify your license and provision cloud resources for your plugin to access the AI
6. Create a Customer Key and Customer Secrete for your WooCommerce Store and copy it into the WooCommerce Voice Assistant configuration page
7. Customize your dialogs responses
8. Visit your website and start searching using your voice.

Detailed instructions on how to install and configure the plugin can be found here:
[Support Web Page:] (https://speak2web.com/support/) 
[Installation Guide:] (https://speak2web.com/wp-content/uploads/2019/02/WordPress-Voice-Dialog-Navigation-Plugin-1.pdf) 
[How To Videos:] (https://speak2web.com/video/) 

== Screenshots ==
1. Voice added to page - floating mic symbol to the center right
2. Generic dialog configuration screen
3. Voice Input active - user is speaking
4. Config page for custom dialog 
5. Voice Assistant navigated to new page and plays audio response

== Frequently Asked Questions ==

= How do I get a license key =

You can select a plan that fits your budget right here [Plans] (https://speak2web.com/plugin/#plan)
Get started for free with our one-month free offer or start with a "pay as you go" plan today.


= Why do I need a license key? =

The plugin uses enterprise class AI technology for natural language understanding, speech to text services and more. 
speak2web provides an API service that gives access to a sophisticated virtual assistant that can be used to voice enable your web page.
The first 500 calls per year are free. After that speak2web offers additional API calls for cents per call. 
You can see more details at the speak2web web page [Plugin Details] (https://speak2web.com/plugin/#plan)

= How does the plugin work =
The plugin enables you to have a real spoken dialog with your user. The plugin will add a chat window onto your web page which is used for to record voice commands and display response information.
The plugin then processes the transcript of the voice input and generates verbal response and automatically navigates the page to the most appropriate 
portion of your word press page or external URL.
You can check out this video for more info: 
[youtube https://youtu.be/VqiZ0XA5TFw]

= Do I need a security certificate for my web page? =

It is highly recommended to have a certificate and use a https  URL. Most web browsers do not allow microphone access unless the URL is secure.


== Example Usage ==
1. The microphone button added to the search form by the plugin.
2. You can see a couple of examples right here: [Videos] (https://speak2web.com/video/) 

=== CLOUD SERVICES USED / CLOUD APIs Called ===
This plugin accesses a number of cloud services to perform the voice dialog functionality. In general, the API's accessed are either speak2web cloud services hosted in AWS or IBM Watson Cloud Services. 
The detailed privacy implications can be found below.

== Cloud Calls Issued by the Plugin ==
- During Install / Setup -
The first cloud call will take place when the license key is being entered and activated. This call will invoke a speak2web cloud service to validate the license key and provision cloud resources for the AI 
to be used.

- On loading of the plugin on a page -
Every time the plugin is loaded onto a page, a call is issued to the speak2web service to retrieve a valid token to access IBM cloud services

- when a voice request is being issued -
When the user clicks the microphone to issue a voice command, additional cloud calls are being placed to IBM Watson Cloud STT to transcribe the recorded audio
To process the request the plugin will call a speak2web cloud service to process the natural language request and prepare a response.


=== COMPLIANCE WITH LOCAL LAWS ===
THE USER OF THIS PLUGIN AND THE ASSOCIATED SERVICE IS RESPONSIBLE TO ENSURE COMPLIANCE WITH APPLICABLE LAWS INCLUDING PRIVACY LAWS.
speak2web is making an effort to ensure privacy of the users of this service. As such, this plugin and the associated service DO NOT correlate IP Addresses or other personal data like browser history etc. to 
the transcript of the voice interaction. The speak2web does NOT store voice recordings, but we do retain anonymous transcript of the dialog in logs for a period of time.
More detail about the service utilized and the privacy statements related to these services can be found below.


=== Terms of Use and usage of 3rd Party Services ===
This plugin invokes a number of cloud services to perform the speech to text function (STT), analyses natural language  requests and perform a natural dialog.
The service are all provided through your speak2web subscription service. By using the speak2web voice dialog-navigation service you also agree to the terms of use and privacy terms of the 
following 3rd party services:

Amazon Web Services:
++++++++++++++++++++
speak2web is hosting its cloud services in AWS infrastructure. We are utilizing services such AWS Gateway API, AWS compute Services, AWS storage and AWS database services.
[AWS Services:]  (https://aws.amazon.com)
[The AWS privacy terms can be reviewed here:] (https://aws.amazon.com/privacy/)  

Google Speech to Text Service:
++++++++++++++++++++++++++++++
this plugin utilizes Google Speech to Text service to transcibe verbal input 
[Google STT:] (https://cloud.google.com/speech-to-text)
[Google Privacy Statement] (https://policies.google.com/privacy?hl=en-US)

IBM WATSON Cloud Services:
++++++++++++++++++++++++++
speak2web is utilizing the following IBM Cloud Services as part of this plugin:
[IBM STT:] (https://www.ibm.com/watson/services/speech-to-text/) 
[IBM TTS:] (https://www.ibm.com/cloud/watson-text-to-speech)
[IBM Assistant:] (https://www.ibm.com/cloud/watson-assistant/) 
[IBM Natural Language Understanding:] (https://www.ibm.com/watson/services/natural-language-understanding/) 

[The Terms of IBM Cloud Services]  (https://cloud.ibm.com/docs/overview/terms-of-use?topic=overview-terms#terms_details)  
[IBM Cloud Service Privacy Statement] (https://cloud.ibm.com/docs/overview/terms-of-use?topic=overview-terms#privacy_policy)  

speak2web Voice Shopping for WooCommerce:
++++++++++++++++++++++++++++++++++++++++++
This plugin requires a subscription to the speak2web ["WP Voice Shopping For WooCommerce"]  (https://speak2web.com/voice-shopping-for-woocommerce/)
The subscription give access to the speak2web voice service which is utilizing  the 3rd party services listed above.
By subscribing to this service the user agrees to the privacy terms of speak2web and the 3rd party services listed above.

VOICE RECORDING --- CANNOT BE PERSONALLY IDENTFIED:
+++++++++++++++++++++++++++++++++++++++++++++++++++
The cloud service does stream audio data to the IBM Watson STT service while the recording is active, but we DO NOT keep a copy of the audio recording. 
The transcript of the spoken request is being kept in logs for a period of time but CANNOT BE RELATED to the user it came from. The service DOES NOT track IP addressed or other
personally identifiable data. The transcript remains anonymous in the logs and CAN NOT be associated with the person it came from.

[speak2web terms of use] (https://speak2web.com/voice-dialog-service-terms/)
[speak2web privacy policy] (https://speak2web.com/privacy-policy/)


== Changelog ==

= 1.0.0 =
* Initial version

= 1.1.0 =
* Addressed WordPress.org conerns 

= 1.1.1 =
* Increased WooCommerce API query to 100 products
* addressed wordpress.org concerns

= 1.1.2 =
* Added support for product variations

= 1.1.3 =
* Verified WP 5.7.2

= 1.2.0 =
* improved product search in case the system is unable to locate a close enough match to the search term provided

= 2.0.0 =
* Added support for Elementor integration and improved AI responses