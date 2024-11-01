<?php
defined( 'WPINC' ) or die;

require( dirname( __FILE__ ) . '/rest-api/vendor/autoload.php' );
use Automattic\WooCommerce\Client;

class Voice_Shopping_For_WooCommerce_Plugin extends WP_Stack_Plugin2 {

    /**
     * @var self
     */
    public static $wcva_ios                         = false;
    public static $wcva_url                         = "";
    public static $is_chrome                        = false;
    public static $wcva_type_of_search_flag         = 'ai';
    public static $wcva_license_key                 = "";
    public static $wcva_voice                       = "male_en_US";
    public static $wcva_floating_mic_position       = "Middle Right";
    public static $wcva_api_access_key              = null;

    public static $wcva_admin_notice_logo           = "";
    public static $wcva_admin_notice_white_logo     = "";

    public static $configured_intent_count          = 0;
    public static $configured_settings_from_db      = array();
    public static $wcva_dialog_type                 = 'generic';
    public static $wcva_file_type                   = '';
    
    // For Free Trial
    public static $wcva_trial_days_left             = null;
    public static $wcva_trial_valid_until           = "";
    public static $wcva_trial_notice_msg_ctx        = "";
    public static $wcva_trial_active                = false;
    public static $wcva_trial_over                  = false;
    public static $wcva_site_name                   = "";
    public static $wcva_settings_updated_ts         = null;

    public static $WCVA_PLUGIN                      = null;
    public static $BASIC_CONFIG_OPTION_NAMES        = null;
    public static $WCVA_LANGUAGE_LIBRARY            = null;
    public static $WCVA_DEFAULT_INTENTS_META_DATA        = null;
    public static $wcv_assistant_consumer_key       = null;
    public static $wcv_assistant_consumer_secret    = null;

    // For access keys
    public static $wcva_voice_services_access_keys = array(
        'api_url' => "https://yjonpgjqs9.execute-api.us-east-1.amazonaws.com/V2",
        'db_col_name' => 'wcv_assistant_voice_services_access_keys',
        'value' => array(
            'g_stt_key'     => null,
            'g_tts_key'     => null,
            'synched_at'    => null
        )
    );

    // For custom dialog response collection
    public static $wcva_custom_dialog_responses = array(
        'db_col_name' => 'wcv_assistant_custom_dialog_responses',
        'collection' => array()
    );

    /**
     * Note: This map of language name as value (Eg: 'en_US') maps to value being saved to DB for plugin language option on settings page
     *
     * The keys of map (eg: en_US) are taken into account as of Wordpress version 5.3.2
     */
    public static $wcva_auto_detect_lang_map =  array(
        'en_US' => 'male_en_US',
        'en_GB' => 'female_en_GB',
        'de_DE' => 'male_de_DE'
    );

    /**
     * This is map of voices available at Google Text to Speech service, we are mapping language code we stored in DB  to available voice at Google's TTS service
     *
     * Mapping has been taken into consideration as of 22nd Jan 2020
     */
    public static $wcva_tts_voice_map =  array(
        'male_en_US'   => 'en-US_MichaelV3Voice',
        'female_en_US' => 'en-US_AllisonV3Voice',
        'female_en_GB' => 'en-GB_KateV3Voice',
        'male_de_DE'   => 'de-DE_DieterV3Voice',
        'female_de_DE' => 'de-DE_BirgitV3Voice'
    );

    // For text to speech using Ajax
    public static $wcva_tts_nonce = null;

    // Generic dialog DB option name to intent name map
    public static $wcva_generic_dialog_dboptionname_to_intentname_map = array();

    /**
     * Plugin version.
     */
    const VERSION = '2.0.0';

    /**
     * Constructs the object, hooks in to `plugins_loaded`.
     */
    protected function __construct()
    { 
        self::$WCVA_DEFAULT_INTENTS_META_DATA = unserialize(WCVA_DEFAULT_INTENTS_META_DATA);
        self::$WCVA_LANGUAGE_LIBRARY = unserialize(WCVA_LANGUAGE_LIBRARY);
        self::$BASIC_CONFIG_OPTION_NAMES = unserialize(WCVA_BASIC_CONFIG_OPTION_NAMES);
        self::$WCVA_PLUGIN = unserialize(WCVA_PLUGIN);

        self::$wcva_admin_notice_logo = "<img style='margin-left: -7px;vertical-align:middle;width:110px; height: 36px;' src='".self::$WCVA_PLUGIN['ABS_URL']."images/speak2web_logo.png'/>|<b> Voice Shopping For WooCommerce</b>";
        self::$wcva_admin_notice_white_logo = "<img style='margin-left: -7px;vertical-align:middle;width:140px; height: 50px;' src='".self::$WCVA_PLUGIN['ABS_URL']."images/speak2web_white_logo.svg'/>|<b> Voice Shopping For WooCommerce</b>";

        // Get database values
        self::$wcva_license_key = get_option(self::$BASIC_CONFIG_OPTION_NAMES['license_key'], null);
        self::$wcva_license_key = self::wcva_sanitize_variable_for_local_script(self::$wcva_license_key);

        self::$wcva_voice = get_option(self::$BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');
        self::$wcva_voice = self::wcva_sanitize_variable_for_local_script(self::$wcva_voice);

        // Evaluate the status of Free Trial
        self::wcva_evaluate_trial_status();

        // Get API access key.
        self::$wcva_api_access_key = get_option('wcv_assistant_api_system_key', null);
        self::$wcva_api_access_key = self::wcva_sanitize_variable_for_local_script(self::$wcva_api_access_key);

        // Get type of search flag config value from DB
        self::$wcva_type_of_search_flag = get_option(self::$BASIC_CONFIG_OPTION_NAMES['type_of_search'], 'ai');
        self::$wcva_type_of_search_flag = stripslashes(strip_tags(trim(self::$wcva_type_of_search_flag)));
        self::$wcva_type_of_search_flag = self::wcva_sanitize_variable_for_local_script(self::$wcva_type_of_search_flag);
        self::$wcva_type_of_search_flag = self::$wcva_type_of_search_flag == null ? 'ai' : self::$wcva_type_of_search_flag;

        // Get type of dialog from DB
        self::$wcva_dialog_type = get_option(self::$BASIC_CONFIG_OPTION_NAMES['dialog_type'], 'generic');
        self::$wcva_dialog_type = self::wcva_sanitize_variable_for_local_script(self::$wcva_dialog_type);

        self::$wcva_site_name = sanitize_text_field(isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME']);

        // Detect OS by user agent
        $iPod   = sanitize_text_field(stripos($_SERVER['HTTP_USER_AGENT'],"iPod"));
        $iPhone = sanitize_text_field(stripos($_SERVER['HTTP_USER_AGENT'],"iPhone"));
        $iPad   = sanitize_text_field(stripos($_SERVER['HTTP_USER_AGENT'],"iPad"));
        $chrome_browser = sanitize_text_field(stripos($_SERVER['HTTP_USER_AGENT'],"Chrome"));

        if (!($iPod == false && $iPhone == false && $iPad == false)) { /*self::$wcva_ios = true;*/ }

        if ($chrome_browser != false) { self::$is_chrome = true; }

        $this->hook( 'plugins_loaded', 'add_hooks' );
    }

    /**
     * Static method to get third party voice services access keys
     *
     */
    public static function wcva_get_access_keys_from_db()
    {
        $temp_access_keys_from_db = get_option(self::$wcva_voice_services_access_keys['db_col_name'], null);

        if (!!$temp_access_keys_from_db && is_array($temp_access_keys_from_db)) {

            if (array_key_exists('g_stt_key', $temp_access_keys_from_db)) {
                self::$wcva_voice_services_access_keys['value']['g_stt_key'] = $temp_access_keys_from_db['g_stt_key'];
            }

            if (array_key_exists('g_tts_key', $temp_access_keys_from_db)) {
                self::$wcva_voice_services_access_keys['value']['g_tts_key'] = $temp_access_keys_from_db['g_tts_key'];
            }

            if (array_key_exists('synched_at', $temp_access_keys_from_db)) {
                self::$wcva_voice_services_access_keys['value']['synched_at'] = $temp_access_keys_from_db['synched_at'];
            }

            unset($temp_access_keys_from_db);
        }
    }

    /**
     * Static method to evaluate status of trial period 
     *
     */
    public static function wcva_evaluate_trial_status() {
        try {
            if (!(empty(self::$wcva_license_key) === false && trim(self::$wcva_license_key == 'trial'))) {
                self::$wcva_trial_days_left      = null;
                self::$wcva_trial_valid_until    = "";
                self::$wcva_trial_notice_msg_ctx = "";
                self::$wcva_trial_active         = false;
                self::$wcva_trial_over           = false;
                return null;
            };
            
            self::$wcva_trial_valid_until = get_option('wcv_assistant_trial_valid_until', "");
            
            if (empty(self::$wcva_trial_valid_until)) {
                self::$wcva_trial_days_left      = null;
                self::$wcva_trial_valid_until    = "";
                self::$wcva_trial_notice_msg_ctx = "";
                self::$wcva_trial_active         = false;
                self::$wcva_trial_over           = false;
                return null;
            }

            // Creates DateTime objects 
            $wcva_valid_until_date = date_create(self::$wcva_trial_valid_until);
            $wcva_current_date = date_create(date('Y/m/d')); 

            // Calculates the difference between DateTime objects 
            $wcva_interval = date_diff($wcva_valid_until_date, $wcva_current_date); 

            // Number of days left
            self::$wcva_trial_days_left = (int) $wcva_interval->format('%a'); // Difference (in days) without sign
            $wcva_trial_days_left       = $wcva_interval->format('%R%a'); // Difference (in days) with sign (+ or -)
            
            $wcva_trial_notices = self::$WCVA_LANGUAGE_LIBRARY['other']['trialNotice'];
            $wcva_other_common  = self::$WCVA_LANGUAGE_LIBRARY['other']['common'];
            
            $wcva_trailing_msg_ctx  = " ".$wcva_other_common['str1']." <a target='blank' href='https://speak2web.com/plugin/#plan'>".
            $wcva_other_common['str2']."</a> ".$wcva_trial_notices['common']['fullLicense'];

            $wcva_trailing_msg_ctx1 = " ".$wcva_other_common['str1']." <a target='blank' href='https://speak2web.com/plugin/#plan'>".
            $wcva_other_common['str2']."</a> ".$wcva_trial_notices['common']['mailUs']." <span style='color:#03C;font-style:italic;'>sales@speak2web.com</span> ".$wcva_trial_notices['common']['fullLicense'];


            if ($wcva_trial_days_left > 0) {
                // Expired and exceeded free trial
                self::$wcva_trial_notice_msg_ctx = "<b>".$wcva_trial_notices['common']['str1']."</b> ".$wcva_trial_notices['expired']['str1']." <span style='color:#FF0000'>".$wcva_trial_notices['expired']['str2']."</span>.".$wcva_trailing_msg_ctx1;
                self::$wcva_trial_over = true;
            } else if ($wcva_trial_days_left < 0) {
                // Under trial
                self::$wcva_trial_notice_msg_ctx = "<b>".$wcva_trial_notices['common']['str1']."</b> ".$wcva_trial_notices['underTrial']['str1']." ".self::$wcva_trial_valid_until. " (<span style='color:#FF0000'>".self::$wcva_trial_days_left."</span> ".$wcva_trial_notices['underTrial']['str2'].").".$wcva_trailing_msg_ctx;
            } else if ($wcva_trial_days_left == 0) {//
                // Last day
                self::$wcva_trial_notice_msg_ctx = "<b>".$wcva_trial_notices['common']['str1']."</b> ".$wcva_trial_notices['lastDay']['str1']." <span style='color:#FF0000'>".$wcva_trial_notices['lastDay']['str2']."</span>.".$wcva_trailing_msg_ctx;
            }
        } catch (\Exception $err) {
            self::$wcva_trial_days_left      = null;
            self::$wcva_trial_valid_until    = "";
            self::$wcva_trial_notice_msg_ctx = "";
            self::$wcva_trial_active         = false;
            self::$wcva_trial_over           = false;
        }
    }

    /**
     * Adds hooks.
     */
    public function add_hooks()
    {
        $this->hook( 'init' );

        //For fuzzy Search
        add_action ( 'wp_ajax_nopriv_'.'wcva_fuzzy_search', array($this, 'wcva_fuzzy_search'));
        add_action ( 'wp_ajax_'.'wcva_fuzzy_search', array($this, 'wcva_fuzzy_search'));

        // Register the STT service call action     
        add_action ( 'wp_ajax_nopriv_'.'wcva_log_service_call', array($this, 'wcva_log_service_call'));
        add_action ( 'wp_ajax_'.'wcva_log_service_call', array($this, 'wcva_log_service_call'));

        // Register the action to refresh voice services token and keys
        add_action ( 'wp_ajax_nopriv_'.'wcva_refresh_access_keys', array($this, 'wcva_refresh_access_keys'));
        add_action ( 'wp_ajax_'.'wcva_refresh_access_keys', array($this, 'wcva_refresh_access_keys'));

        self::$wcva_tts_nonce = wp_create_nonce('js_ajax_tts');

        // Register the action to handle ajax request for text synthesis
        add_action ( 'wp_ajax_'.'wcva_synthesize', array($this, 'wcva_synthsize_text') );
        
        self::$wcva_settings_updated_ts = voice_shopping_for_woocommerce_settings_page::wcva_settings_modified_timestamp('get');

        if (self::$wcva_dialog_type !== 'generic') {
            // Register the action to perform TTS process on custom dialog phrase
            add_action ( 'wp_ajax_nopriv_'.'wcva_custom_dialog_text_to_speech', array($this, 'wcva_custom_dialog_text_to_speech'));
            add_action ( 'wp_ajax_'.'wcva_custom_dialog_text_to_speech', array($this, 'wcva_custom_dialog_text_to_speech'));
            
            self::wcva_get_custom_responses_from_db();
        } else {
            // Register the action to perform TTS process of generic dialog by end user
            add_action ( 'wp_ajax_nopriv_'.'wcva_generic_dialog_tts_on_the_fly', array($this, 'wcva_synthsize_text'));
            add_action ( 'wp_ajax_'.'wcva_generic_dialog_tts_on_the_fly', array($this, 'wcva_synthsize_text'));
        }
        
        $this->hook( 'admin_enqueue_scripts', 'enqueue_admin_scripts' );

        // Register action to hook into admin_notices to display dashboard notice for non-HTTPS site
        if (is_ssl() == false) {
            add_action( 'admin_notices', function(){
    ?>
                <div class="notice notice-error is-dismissible">
                    <p> <?php echo wp_kses_post(self::$wcva_admin_notice_logo); ?>
                        <br/> <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['nonHttpsNotice']); ?>
                    </p>        
                </div>
    <?php
            });
        }

        // Here we are calling this method to get configured intents from DB to determine total number of intents been configured
        $wcva_temp_intents_data = self::get_configured_intents_from_DB();
        self::$configured_settings_from_db = array_key_exists('intents', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents'] : array();

        if (!empty(self::$wcva_license_key) && !empty(self::$wcva_api_access_key)) {
            if (self::$wcva_license_key != 'trial' || (self::$wcva_license_key == 'trial' && self::$wcva_trial_over === false)) {
                $this->hook( 'wp_enqueue_scripts', 'enqueue_frontend_scripts' );
            }
        } else {
            // Notify when license key is missing or invalid
            // Register action to hook into admin_notices to display dahsboard notice
            add_action( 'admin_notices', array($this, 'invalid_or_expired_license_key_notice'));

            // Register action to hook into 'after_plugin_row_' for displaying inline notice when license key is missing or activation is invalid
            add_action("after_plugin_row_voice-shopping-for-woocommerce/voice-shopping-for-woocommerce.php", function( $plugin_file, $plugin_data, $status ) {
                echo wp_kses_post('<tr class="active">
                    <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                        <td colspan="2" style="background-color:#FFF8E5;">'.self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['yourLicenseKeyInvalid'].'<a target="blank" href="https://speak2web.com/plugin/#plan">'.self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['here'].'</a> '.self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['toBuyOrRenew'].'
                        </td>
                    </tr>');
            }, 10, 3 );
        }

        // Notify when no intents has been configured
        if (self::$wcva_dialog_type === 'generic') {
            if (self::$configured_intent_count === 0) {
                // Register action to hook into admin_notices to display dashboard notice when no intents been configured
                add_action( 'admin_notices', array($this, 'configure_intent_notice'));

                // Register action to hook into 'after_plugin_row_' for displaying inline notice when there no intents been configured
                add_action("after_plugin_row_voice-shopping-for-woocommerce/voice-shopping-for-woocommerce.php", function( $plugin_file, $plugin_data, $status ) {
                    echo wp_kses_post('<tr class="active">
                            <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                            <td colspan="2" style="background-color:#FFF8E5;">'.Voice_Shopping_For_WooCommerce_Plugin::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['notConfigure'].'<a href="options-general.php?page=wcv-assistant-settings">'.Voice_Shopping_For_WooCommerce_Plugin::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['here'].'</a> '.Voice_Shopping_For_WooCommerce_Plugin::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['desiredResponse'].'
                            </td>
                        </tr>');
                }, 10, 3 );
            }

            $wcva_dialogs_for_audio_regeneration = array_key_exists('intents_for_audio_regeneration', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents_for_audio_regeneration'] : array();
            
            if (count($wcva_dialogs_for_audio_regeneration) > 0) {
                add_action( 'admin_notices', function() use ($wcva_dialogs_for_audio_regeneration) {
                    ?>
                    <div class="notice notice-info" style="overflow:hidden;position:relative;padding: 15px;background-color: #555555;color: white;border-radius: 5px;">
                        <p style="font-weight: 500"> <?php echo wp_kses_post(self::$wcva_admin_notice_white_logo); ?>
                        <br/>
                        <div style="margin:5px 0px"><strong style="border:1px solid #FFFFFF; padding:5px 10px; margin:10px 5px;"><?php echo wp_kses_post(count($wcva_dialogs_for_audio_regeneration)); ?></strong><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['audioRegenerateNotice']['noticeText']);?>
                            <a href="<?php echo wp_kses_post(admin_url( 'options-general.php?page=wcv-assistant-settings' ));?>" style="display:inline-block;text-decoration:none;border: none;border-radius:5px;margin:10px 0px 0px 5px;padding: 12px 30px;background-color: #00a0d2;color:#FFFFFF;cursor: pointer;" type="button"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['audioRegenerateNotice']['buttonText']);?></a>
                        </div>
                        <img style="position: absolute;opacity: 0.18;transform: translate(10%,-15%);right:0%;top:50%;" src="<?php echo wp_kses_post(self::$WCVA_PLUGIN['ABS_URL']);?>images/Voice Assistant Bot Icon.png"/>
                    </div>
                    <?php
                });
            }
        }

        // Check if Free trial is active
        self::$wcva_trial_active = false;

        if (!empty(self::$wcva_license_key) && trim(self::$wcva_license_key) == 'trial' && !empty(self::$wcva_trial_valid_until) 
            && is_int(self::$wcva_trial_days_left)) {
            self::$wcva_trial_active = true;
        }     

        // Notify trial license status
        if (self::$wcva_trial_active === true) {
            // Register action to hook into admin_notices to display dashboard notice
            add_action( 'admin_notices', function(){
                ?>
                <div class="notice notice-warning is-dismissible">
                    <p> <?php echo wp_kses_post(self::$wcva_admin_notice_logo); ?>
                        <br/><?php echo wp_kses_post(self::$wcva_trial_notice_msg_ctx);?>
                    </p>
                </div>
                <?php
            });

            // Register action to hook into 'after_plugin_row_' for displaying inline notice
            add_action("after_plugin_row_voice-shopping-for-woocommerce/voice-shopping-for-woocommerce.php", function( $plugin_file, $plugin_data, $status ) {
                echo wp_kses_post('<tr class="active">
                        <th style="border-left: 4px solid #FFB908; background-color:#FFF8E5;">&nbsp;</th>
                        <td colspan="2" style="background-color:#FFF8E5;">'.self::$wcva_trial_notice_msg_ctx.'
                        </td>
                    </tr>');
            }, 10, 3 );
        }
    }

    /**
     * Method as action to invoke when license key is invalid or expired
     */
    public function invalid_or_expired_license_key_notice() {
    ?>
        <div class="notice notice-warning is-dismissible">
            <p> <?php echo wp_kses_post(self::$wcva_admin_notice_logo); ?>
                <br/>  <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['yourLicenseKeyInvalid']); ?> <a target="blank" href="https://speak2web.com/plugin/#plan"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['here']); ?></a> <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['licenseKeyInvalid']['toBuyOrRenew']); ?>
            </p>
        </div>
    <?php
    }

    /**
     * Method as action to invoke when license key is invalid or expired
     */
    public function configure_intent_notice() {
    ?>
        <div class="notice notice-warning is-dismissible" data-wcva-notice="true">
            <p> <?php echo wp_kses_post(self::$wcva_admin_notice_logo); ?>
                <br/> <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['notConfigure']); ?> <a href="options-general.php?page=wcv-assistant-settings"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['here']); ?></a><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['notConfigureAnyDialog']['desiredResponse']); ?>
            </p>
        </div>
    <?php
    }

    /**
     * Initializes the plugin, registers textdomain, etc.
     * Most of WP is loaded at this stage, and the user is authenticated
     */
    public function init()
    {
        self::$wcva_url = self::$WCVA_PLUGIN['ABS_URL'];

        if ( isset($GLOBALS['pagenow']) && $GLOBALS['pagenow'] == 'plugins.php' ) {
            add_filter( 'plugin_row_meta', array(&$this, 'custom_plugin_row_meta'), 10, 2);
        }        
        
        $this->load_textdomain( 'voice-shopping-for-woocommerce', '/languages' );

        // Get mic position from DB
        self::$wcva_floating_mic_position = get_option(self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position']);

        // Check mic position exist in DB , if not then store default as 'Middle Right'
        if (self::$wcva_floating_mic_position === false) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position'], 'Middle Right');
            self::$wcva_floating_mic_position = 'Middle Right';
        }

        // load access keys of third party voice services from local DB
        self::wcva_get_access_keys_from_db();

        // Obtain third party voice services token and keys from api
        self::wcva_synch_voice_access_keys();

        foreach (self::$WCVA_DEFAULT_INTENTS_META_DATA as $index => $intent) {
            self::$wcva_generic_dialog_dboptionname_to_intentname_map[$intent[WCVA_INTENT_OPTION_NAME_KEY]] = $intent[WCVA_INTENT_KEY];
        }
    }

    /**
     * Class method to retrieve and get configured intents from DB
     * 
     * @param Boolean $wcva_voice_changed  Flag to denote plugin voice changed when true otherwise false
     *
     * @return Array $configured_settings  A multidimentional array with two sets of intents data,
     * set 'intents' for all intents data from DB and 
     * set 'intents_for_audio_regeneration' for those intents which needs creation or recreation of audio files
     *
     */
    public static function get_configured_intents_from_DB($wcva_voice_changed = false)
    {
        $configured_settings = array(
            'intents' => array(),
            'intents_for_audio_regeneration' => array(),
            'intents_with_audios' => array()
        );
        $wcva_voice_changed_by_admin = !empty($wcva_voice_changed) && $wcva_voice_changed === true ? true : false;
        
        self::$configured_intent_count = 0;
        $wcva_voice = get_option(self::$BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');

        foreach (self::$WCVA_DEFAULT_INTENTS_META_DATA as $key => $intent_meta_data) {
            $intent_from_db = get_option($intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY], array());

            if (!is_array($intent_from_db)) {
                $intent_from_db = (array) $intent_from_db;
            }

            // ###############################################
            // Skip the iteration as intent data unavailable
            // ###############################################
            if (empty($intent_from_db)) continue;

            $intent_data_exist = false;

            $intent_response_text = array_key_exists('response', $intent_from_db) ? trim($intent_from_db['response']) : null;
            $intent_have_response_text = !empty($intent_response_text) ? true : false;

            // #####################################
            // Check if response/dialog text exist
            // #####################################
            if ($intent_have_response_text === true) {
                $intent_data_exist = true;
            }

            if ($intent_data_exist === false) {
                $intent_url = array_key_exists('url', $intent_from_db) ? trim($intent_from_db['url']) : null;
                $intent_have_url = !empty($intent_url) ? true : false;

                // ################################
                // Check if url for intent exist
                // ################################
                if ($intent_have_url === true) {
                    $intent_data_exist = true;
                }
            }

            // #################################################################################################################
            // If any of the data exist for intent and 'enabled' key never exist then override intent data to enable the intent
            // This block of code intended to enable intents while upgrading plugin to have 'enabled'feature.
            // #################################################################################################################
            if ($intent_data_exist === true) {
                self::$configured_intent_count += 1;

                if (!array_key_exists('enabled', $intent_from_db)) {
                    $intent_from_db['enabled'] = 'enabled';
                    update_option($intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY], $intent_from_db);
                }
            }

            // ##########################################################
            // Append DB option name and a intent name for the intent.
            // ##########################################################
            $intent_from_db['option_name'] = $intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY];
            $intent_from_db['intent_name'] = $intent_meta_data[WCVA_INTENT_KEY];

            // Intent audio response data
            $intent_audio_response = array_key_exists('intent_audio_response', $intent_from_db) ? $intent_from_db['intent_audio_response'] : array();

            if (!is_array($intent_audio_response)) {
                $intent_audio_response = (array) $intent_audio_response;
            }        

            // ####################################################################
            // Setting this flag to true indicates need of audio file generation
            // ####################################################################
            $wcva_generate_audio = false;

            if (empty($intent_audio_response)) {
                // #########################################################################
                // Intent/dialog data available but 'intent_audio_response' data is missing
                // #########################################################################
                $wcva_generate_audio = true;
            } else {
                $intent_audio_path = array_key_exists('path', $intent_audio_response) ? trim($intent_audio_response['path']) : null;
                $intent_audio_voice = array_key_exists('voice', $intent_audio_response) ? trim($intent_audio_response['voice']) : null;
                $intent_audio_have_path = !empty($intent_audio_path) ? true : false;

                if ($intent_audio_have_path === true) {
                    //##########################################################################
                    // Set audio generation flag to true for below listed scenarios
                    //
                    // 1. Path exist in DB but audio file physically not exist
                    //##########################################################################
                    if (!file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$intent_audio_path) || $intent_have_response_text === false) {
                        $intent_from_db['intent_audio_response']['path'] = null;
                        $intent_from_db['intent_audio_response']['voice'] = null;
                        update_option($intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY], $intent_from_db);
                        $wcva_generate_audio = true;
                    }

                    // ##########################################################################
                    // Get intents which having path (To generate audio while changing language)
                    // ##########################################################################
                    if ($intent_have_response_text === true && $intent_from_db['enabled'] === 'enabled') {
                        array_push($configured_settings['intents_with_audios'], $intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY]);
                    }
                } else {
                    // ######################################
                    // Response text exist but path is empty
                    // ######################################
                    $wcva_generate_audio = true;
                }
            }

            if ($intent_have_response_text === true && $wcva_generate_audio === true && $intent_from_db['enabled'] === 'enabled') {
                array_push($configured_settings['intents_for_audio_regeneration'], $intent_meta_data[WCVA_INTENT_OPTION_NAME_KEY]);
            }

            $configured_settings['intents'][$intent_meta_data[WCVA_INTENT_KEY]] = $intent_from_db;
        }

        return $configured_settings;
    }

    /**
     * Method to enqueue JS scripts and CSS of Admin for loading 
     */
    public function enqueue_admin_scripts()
    {
        // Enqueue JS: wcva.settings.js
        wp_enqueue_script(
            'wcva.settings',
            self::wcva_get_file_meta_data('url', 'js/settings/wcva.settings', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/settings/wcva.settings', 'js'),
            true
        );

        wp_localize_script( 'wcva.settings', 'wcvaAjaxObj', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'synthesize_nonce' => self::$wcva_tts_nonce
        ));

        // Enqueue CSS: wcva.settings.css
        wp_enqueue_style(
            'wcv_assistant_settings_css',
            self::wcva_get_file_meta_data('url', 'css/settings/wcva.settings', 'css'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'css/settings/wcva.settings', 'css'),
            'screen'
        );
    }

    /**
     * Static method to get data related to file
     *
     * @param $intent - string : 'url' or 'timestamp'
     * @param $partial_file_path - string : Path of file (Partial and mostly relative path)
     * @param $file_extension - string : 'js' or 'css'
     *
     * $returns $wcva_file_data - string : Time as a Unix timestamp or absolute url to the file
     */
    public static function wcva_get_file_meta_data($intent = "", $partial_file_path = "", $file_extension = "")
    {
        $wcva_file_data = "";

        try {
            if (empty($file_extension) || empty($partial_file_path) || empty($intent)) throw new Exception("WCVA: Error while getting file data.", 1);

            $intent = strtolower(trim($intent));
            $file_ext = '.' . str_replace(".", "", trim($file_extension));
            $partial_file_path = trim($partial_file_path);

            if ($intent == 'timestamp') {
                if (!empty(self::$wcva_settings_updated_ts)) {
                    $wcva_file_data = self::$wcva_settings_updated_ts;
                } else {
                    $wcva_file_data = filemtime(self::$WCVA_PLUGIN['ABS_PATH'] . $partial_file_path . self::$wcva_file_type . $file_ext);
                }
            } else if ($intent == 'url') {
                $wcva_file_data = self::$WCVA_PLUGIN['ABS_URL'] . $partial_file_path . self::$wcva_file_type . $file_ext;
            }
        } catch (\Exception $ex) {
            $wcva_file_data = "";
        }

        return $wcva_file_data;
    }

    /**
     * Method to enqueue JS scripts and CSS for loading at Front end
     */
    public function enqueue_frontend_scripts()
    {
        //################################################################################
        //
        // Enqueue 'voice-shopping-for-woocommerce' CSS file to load at front end
        //
        //################################################################################
        wp_enqueue_style(
            'voice-shopping-for-woocommerce',
            self::wcva_get_file_meta_data('url', 'css/voice-shopping-for-woocommerce', 'css'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'css/voice-shopping-for-woocommerce', 'css'),
            'screen'
        );

        //################################################################################
        //
        // Enqueue 'wcva.text-library' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'wcva.text-library',
            self::wcva_get_file_meta_data('url', 'js/wcva.text-library', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/wcva.text-library', 'js'),
            true
        );

        //##################################################################################################################
        // Determine STT language context for plugin
        //##################################################################################################################
        $wcva_stt_language_context = array(
            'gcp' => array(
                'stt' => 'N',
                'langCode' => null,
                'endPoint' => null,
                'key' => null,
                'qs' => array('key' => null)
            )
        );

        $wcva_langauge_replace = array('female_', 'male_');
        // Remove other strings and get the language code
        $wcva_language_code = !empty(self::$wcva_voice) ? str_replace($wcva_langauge_replace, "", self::$wcva_voice) : "en-US";
        $wcva_language_code = str_replace('_', "-", $wcva_language_code);
        $wcva_gcp_supported = WcvaLanguage::gcp_supported($wcva_language_code);
        $wcva_lang_not_supported_by_vendors = false;

        if (WCVA_CLIENT['chrome'] === true) {
            if ($wcva_gcp_supported === true) {
                $wcva_stt_language_context['gcp']['stt'] = 'Y';
            } 
            else {
                $wcva_stt_language_context['gcp']['stt'] = 'Y';
                $wcva_lang_not_supported_by_vendors = true;
            }
        } else {
            if ($wcva_gcp_supported === true) {
                $wcva_stt_language_context['gcp']['stt'] = 'Y';
            }
        }
        
        if ($wcva_stt_language_context['gcp']['stt'] == 'Y') {

            $wcva_gcp_lang_code = WcvaLanguage::$gcp_language_set[$wcva_language_code][WcvaLanguage::LANG_CODE];
            $wcva_gcp_key = self::$wcva_voice_services_access_keys['value']['g_stt_key'];
            
            $wcva_stt_language_context['gcp']['endPoint'] = 'https://speech.googleapis.com/v1/speech:recognize';
            $wcva_stt_language_context['gcp']['langCode'] = $wcva_gcp_lang_code;
            $wcva_stt_language_context['gcp']['key'] = $wcva_gcp_key;
            $wcva_stt_language_context['gcp']['qs']['key'] = '?key=';
        }
        
        $wcva_count_nonce = wp_create_nonce( 'service_call_count' );
        $wcva_keys_refresh_nonce = wp_create_nonce( 'keys_refresh' );
        $wcva_custom_dialog_nonce = wp_create_nonce( 'custom_dialog' );

        wp_localize_script( 'wcva.text-library', 'wcvaAjaxObj', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce' => $wcva_count_nonce,
            'keys_nonce' => $wcva_keys_refresh_nonce,
            'custom_dialog_nonce' => $wcva_custom_dialog_nonce,
            'generic_dialog_nonce' => self::$wcva_tts_nonce
        ));

        $wcva_fuzzy_search_nonce = wp_create_nonce('fuzzy_search');

        //for fuzzy search
        wp_localize_script( 'wcva.text-library', 'wcvaAjaxObjForFuzzySearch', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce' => $wcva_fuzzy_search_nonce
        ));

        // Localizes a registered script with JS variable for custom endpoint URL       
        $custom_endpoint_url = get_option(self::$BASIC_CONFIG_OPTION_NAMES['custom_endpoint'], null);
        $custom_endpoint_url = self::wcva_sanitize_variable_for_local_script($custom_endpoint_url);

        // Localizes a registered script with JS variable for Google Analytics Track
        $wcva_google_analytics_track = get_option(self::$BASIC_CONFIG_OPTION_NAMES['google_analytics_track'], null);
        $wcva_google_analytics_track = self::wcva_sanitize_variable_for_local_script($wcva_google_analytics_track);

        // Localizes a registered script with JS variable for Google Analytics Track
        $wcva_ga_tracking_id = get_option(self::$BASIC_CONFIG_OPTION_NAMES['ga_tracking_id'], null);
        $wcva_ga_tracking_id = self::wcva_sanitize_variable_for_local_script($wcva_ga_tracking_id);

        // Localizes a registered script with JS variable for Floating Mic Background Color
        $wcv_bot_background_color = get_option(self::$BASIC_CONFIG_OPTION_NAMES['bot_background_color'], '#42a5f5');
        $wcv_bot_background_color = self::wcva_sanitize_variable_for_local_script($wcv_bot_background_color);

        // Localizes a registered script with JS variable for Floating Mic Pulse Color
        $wcv_mic_pulse_color = get_option(self::$BASIC_CONFIG_OPTION_NAMES['mic_pulse_color'], '#dc2626');
        $wcv_mic_pulse_color = self::wcva_sanitize_variable_for_local_script($wcv_mic_pulse_color);

        // Localizes a registered script with JS variable for Floating Mic Response Color
        $wcv_bot_response_color = get_option(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_color'], '#218c5e');
        $wcv_bot_response_color = self::wcva_sanitize_variable_for_local_script($wcv_bot_response_color);

        // Localizes a registered script with JS variable for Floating Mic Response Color Timeout
        $wcv_bot_response_timeout = get_option(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout'], 5);
        $wcv_bot_response_timeout = self::wcva_sanitize_variable_for_local_script($wcv_bot_response_timeout);

        // Localizes a registered script with JS variable for elementor mic
        $wcv_elementor_mic= get_option(self::$BASIC_CONFIG_OPTION_NAMES['elementor_mic'], null);
        $wcv_elementor_mic = self::wcva_sanitize_variable_for_local_script($wcv_elementor_mic);

        // Localizes a registered script with JS variable for mic on all input fields
        $wcv_input_field_mic= get_option(self::$BASIC_CONFIG_OPTION_NAMES['input_field_mic'], null);
        $wcv_input_field_mic = self::wcva_sanitize_variable_for_local_script($wcv_input_field_mic);

        // Make host name available to 'wcva.speech-handler.js'
        $protocol =sanitize_text_field((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
            || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://");
        $domainName = sanitize_text_field($_SERVER['SERVER_NAME']);

        $stt_model = '&model=en-US_BroadbandModel';
        $send_dialog_api_url = 'https://rch6ltoyj6.execute-api.us-east-1.amazonaws.com/V1';

        switch (self::$wcva_voice) {
            case 'male_de_DE':
            case 'female_de_DE':
                $stt_model = '&model=de-DE_BroadbandModel';
                $send_dialog_api_url = 'https://tm7k4xniwg.execute-api.us-east-1.amazonaws.com/V1';
                break;
                
            case 'female_en_GB':
                $stt_model = '&model=en-GB_BroadbandModel';
                break;

            default:
                $stt_model = '&model=en-US_BroadbandModel';
        }

        $web_socket_url = array(
            'url'     => 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize',
            'tokenQs' => '?access_token=',
            'otherQs' =>  $stt_model
        );
        wp_localize_script( 'wcva.text-library', 'wcvaWebSocketUrl', $web_socket_url);

        wp_add_inline_script( 'wcva.text-library', 'wcvaWorkerPath ='.json_encode(self::$WCVA_PLUGIN['ABS_URL']. 'js/recorderjs/wcva.audio-recorder-worker'.self::$wcva_file_type.'.js'));

        wp_localize_script( 'wcva.text-library', 'voice_shopping_for_woocommerce', array(
            'button_message' => __( 'Speech Input', 'voice-shopping-for-woocommerce' ),
            'talk_message'   => __( 'Start Talking…', 'voice-shopping-for-woocommerce' ),
        ));

        // Make disable search mic value to 'voice-shopping-for-woocommerce.js'
        $wcva_disable_search_mic = get_option(self::$BASIC_CONFIG_OPTION_NAMES['disable_search_mic'], '0');
        $wcva_disable_search_mic = self::wcva_sanitize_variable_for_local_script($wcva_disable_search_mic);
        
        // Make disable forms mic value to 'voice-shopping-for-woocommerce.js'
        $wcva_disable_forms_mic = get_option(self::$BASIC_CONFIG_OPTION_NAMES['disable_forms_mic'], '0');
        $wcva_disable_forms_mic = self::wcva_sanitize_variable_for_local_script($wcva_disable_forms_mic);

        // Localizes a registered script with JS variable for User Searchable hints
        $searchable_hints_str = get_option(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '');

        if (empty($searchable_hints_str)) {
            $searchable_hints_str = voice_shopping_for_woocommerce_settings_page::DEFAULT_SEARCHABLE_HINTS;
        }

        $searchable_hints_str = str_replace(array("\n", "\t", "\r"), '', $searchable_hints_str);
        $searchable_hints_arr = array_filter(explode(';', $searchable_hints_str));
        $searchable_hints_arr = array_map('trim', $searchable_hints_arr);
        wp_localize_script( 'wcva.text-library', 'wcvaSearchableHints', $searchable_hints_arr);

        $wcv_assistant_mic_listening_timeout = get_option(self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], null);
        $wcv_assistant_mic_listening_timeout = self::wcva_sanitize_variable_for_local_script($wcv_assistant_mic_listening_timeout);

        if (is_null($wcv_assistant_mic_listening_timeout)) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], '8');
            $wcv_assistant_mic_listening_timeout = '8';
        }

        $wcva_floating_btn_icon = get_option(self::$BASIC_CONFIG_OPTION_NAMES['floating_button_icon'], 'micIcon');

        $wcva_current_value = get_option('wcva_current_value', "0");
        $wcva_last_value    = get_option('wcva_last_value', "0");
        $wcva_last_value_updated_at = get_option('wcva_last_value_updated_at', null);
        $wcva_last_value_updated_at = self::wcva_sanitize_variable_for_local_script($wcva_last_value_updated_at);

        $wcva_service_logs = array(
            'updatedAt' => $wcva_last_value_updated_at,
            'currentValue' => $wcva_current_value,
            'lastValue' => $wcva_last_value,
        );

        wp_localize_script( 'wcva.text-library', 'wcvaServiceLogs', $wcva_service_logs);
        
        $wcva_localize = array(
            'wcvaCustomResponses'=> self::$wcva_custom_dialog_responses['collection'],
            'wcvaFloatingButtonIcon' => $wcva_floating_btn_icon,
            'wcvaMicListenTimeoutDuration' => $wcv_assistant_mic_listening_timeout,
            'wcvaXApiKey' => self::$wcva_api_access_key,
            'wcvaSelectedMicPosition' =>self::$wcva_floating_mic_position,
            'wcvaDisableFormsMic' => $wcva_disable_forms_mic,
            'wcvaDisableSearchMic' => $wcva_disable_search_mic,
            'wcvaSendDialogApiUrl' => $send_dialog_api_url,
            'wcvaCurrentHostName' => $protocol.$domainName,
            'wcvaConfiguredSetting' => self::$configured_settings_from_db,
            'wcvaDialogType' => self::$wcva_dialog_type,
            'wcvaCustomEndpointUrl' => $custom_endpoint_url,
            'wcvaTypeOfSearch' => self::$wcva_type_of_search_flag,
            'wcvaGaTrack' => $wcva_google_analytics_track,
            'wcvaGaTrackingId' => $wcva_ga_tracking_id,
            '_wcvaSttLanguageContext' => $wcva_stt_language_context,
            'wcvaImagesPath' => self::$wcva_url . 'images/',
            'wcvaElementorMic' => $wcv_elementor_mic,
            'wcvaConfiguredVoice' => self::$wcva_voice,
            'wcvaPath' => self::$wcva_url,
            'wcvaInputFieldMic' => $wcv_input_field_mic,
            'wcvaBotBackgroundColor' => $wcv_bot_background_color,
            'wcvaMicPulseColor' => $wcv_mic_pulse_color,
            'wcvaBotResponseColor' => $wcv_bot_response_color,
            'wcvaBotResponseTimeout' => $wcv_bot_response_timeout,
        );

        wp_localize_script( 'wcva.text-library', 'wcva', $wcva_localize);

        //################################################################################
        //
        // Enqueue 'wcva.speech-handler' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'wcva.speech-handler',
            self::wcva_get_file_meta_data('url', 'js/wcva.speech-handler', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/wcva.speech-handler', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'wcva.audio-input-handler' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'wcva.audio-input-handler',
            self::wcva_get_file_meta_data('url', 'js/wcva.audio-input-handler', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/wcva.audio-input-handler', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'wcva.audio-recorder' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'wcva.audio-recorder',
            self::wcva_get_file_meta_data('url', 'js/recorderjs/wcva.audio-recorder', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/recorderjs/wcva.audio-recorder', 'js'),
            true
        );

        //################################################################################
        //
        // Enqueue 'voice-shopping-for-woocommerce' javasctipt file to load at front end
        //
        //################################################################################
        wp_enqueue_script(
            'voice-shopping-for-woocommerce',
            self::wcva_get_file_meta_data('url', 'js/voice-shopping-for-woocommerce', 'js'),
            array(),
            self::wcva_get_file_meta_data('timestamp', 'js/voice-shopping-for-woocommerce', 'js'),
            true
        );
    }

    function custom_plugin_row_meta( $links, $file )
    {

        if ( strpos( $file, 'voice-shopping-for-woocommerce.php' ) !== false ) {
            $new_links = array(
                    'settings' => '<a href="' . site_url() . '/wp-admin/admin.php?page=wcv-assistant-settings" title="Voice Shopping For WooCommerce">Settings</a>'
                    );

            $links = array_merge( $links, $new_links );
        }

        return $links;
    }

    /**
     * Function to get REST API access key ('x-api-key') against license key instate to avail plugin (Voice Shopping For WooCommerce) service
     *
     * @param $convertable_license_key - String : License key customer posses
     */
    public static function wcva_get_api_key_from_license_key($convertable_license_key = null, $license_key_field_changed = false)
    {
        $result = array();

        try {
            // Throw exception when license key is blank or unavailable
            if (!(isset($convertable_license_key) && is_null($convertable_license_key) == false 
                && trim($convertable_license_key) != '')) {
                update_option( 'wcv_assistant_api_system_key', '');
                throw new Exception("Error: License key is unavailable or invalid.");
            }

            $wcva_api_system_key = get_option('wcv_assistant_api_system_key', null);
            $wcva_api_system_key = isset($wcva_api_system_key) ? trim($wcva_api_system_key) : null;

            if (!empty($wcva_api_system_key) && $license_key_field_changed == false) {
                self::$wcva_api_access_key = $wcva_api_system_key;
            } else {
                if ($license_key_field_changed === true && strtolower(trim($convertable_license_key)) == 'trial') {
                    // Obtain trial license (Re-gain)
                    self::wcva_get_trial_license(true);
                } else {
                    $body = array( 'license' => trim($convertable_license_key) );
                    $args = array(
                        'body'        => json_encode($body),
                        'timeout'     => '60',
                        'headers'     => array(
                            'Content-Type' => 'application/json',
                            'Accept'       => 'application/json',
                            'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                        )
                    );

                    $response = wp_remote_post( 'https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V1', $args );

                    // Check the response code
                    $response_code = wp_remote_retrieve_response_code( $response );

                    if ($response_code == 200) {
                        $response_body = wp_remote_retrieve_body($response);
                        $result = @json_decode($response_body, true);

                        if (!empty($result) && is_array($result)) {
                            if (array_key_exists('errorMessage', $result)) {
                                update_option( 'wcv_assistant_api_system_key', '');
                            } else {
                                $conversion_status_code = !empty($result['statusCode']) ? trim($result['statusCode']) : null;;
                                $conversion_status      = !empty($result['status']) ? trim($result['status']) : null;

                                if (!is_null($conversion_status_code) && !is_null($conversion_status) 
                                    && (int)$conversion_status_code == 200 && strtolower(trim($conversion_status)) == 'success') {
                                    self::$wcva_api_access_key = !empty($result['key']) ? trim($result['key']) : null;
                                    
                                    if (self::$wcva_api_access_key !== null) {
                                        update_option( 'wcv_assistant_api_system_key', self::$wcva_api_access_key);
                                    } else {
                                        update_option( 'wcv_assistant_api_system_key', '');
                                    }
                                } else {
                                    update_option( 'wcv_assistant_api_system_key', '');
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            self::$wcva_api_access_key = null;
        }

        self::$wcva_api_access_key = self::wcva_sanitize_variable_for_local_script(self::$wcva_api_access_key);
    }

    /**
     * Static method to obtain trial license key
     *
     * @param $retrieve_trial_license Boolean 
     */
    public static function wcva_get_trial_license($retrieve_trial_license = false) {
        $wcva_db_field_names = array(
            'license'          => 'wcv_assistant_license_key', 
            'aws_key'          => 'wcv_assistant_api_system_key', 
            'valid_until'      => 'wcv_assistant_trial_valid_until', 
            'first_activation' => 'wcv_assistant_first_activation',
            'trial_uuid'       => 'wcv_assistant_uuid'
        );

        // Get plugin first activation status and license key from DB 
        $wcva_first_activation = get_option($wcva_db_field_names['first_activation'], null); 
        $wcva_license_key = get_option($wcva_db_field_names['license'], null);

        // Store plugin first activation data in DB
        $is_this_first_activation = false;
        $wcva_license_key = trim($wcva_license_key);
        if (empty($wcva_first_activation) && empty($wcva_license_key)) {
            // Mark first activation activity flag in local DB 
            update_option($wcva_db_field_names['first_activation'], true);// Store first activation flag in DB

            // Detect site language and set the plugin language
            $wcva_site_language_code = get_locale();

            if (!empty($wcva_site_language_code) && array_key_exists($wcva_site_language_code, self::$wcva_auto_detect_lang_map)) {
                update_option(
                    self::$BASIC_CONFIG_OPTION_NAMES['voice'],
                    self::$wcva_auto_detect_lang_map[$wcva_site_language_code]
                );
            }

            // Generate UUID and store in DB
            $wcva_new_uuid = wp_generate_uuid4();

            if (!empty($wcva_new_uuid)) {
                update_option($wcva_db_field_names['trial_uuid'], $wcva_new_uuid);
            }

            $is_this_first_activation = true;
        }

        // Trial license key can be gained in one of the following ways:
        //      1. [Fresh Trial as first activation] -- Plugin is being installed first time.
        //      2. [Retrieve on demand while plugin active] -- License key field at 'settings' changed to 'trial'
        //      3. [Retrieve on each WP plugin activation] -- Plugin is being activated (Activation cycle after first activation) while license key field having value 'trial' at 'settings'
        if ($is_this_first_activation === true || $retrieve_trial_license === true || strtolower(trim($wcva_license_key)) == 'trial') {
            $wcva_uuid = get_option($wcva_db_field_names['trial_uuid'], null);

            // To handle uuid version upgrade
            if (empty($wcva_uuid) && strtolower(trim($wcva_license_key)) === 'trial' && !empty($wcva_first_activation)) {
                // Generate UUID and store in DB
                $wcva_uuid = wp_generate_uuid4();

                if (!empty($wcva_uuid)) {
                    update_option($wcva_db_field_names['trial_uuid'], $wcva_uuid);
                }
            }

            try {
                $body = array(
                    'url'    => !empty($wcva_uuid) ? self::$wcva_site_name.'_'.$wcva_uuid : self::$wcva_site_name,
                    'action' => 'trial',
                    'type'   => 'wcva' 
                );

                $args = array(
                    'body'        => json_encode($body),
                    'timeout'     => '60',
                    'headers'     => array(
                        'Content-Type' => 'application/json',
                        'Accept'       => 'application/json',
                        'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                    )
                );
                
                $response = wp_remote_post('https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V2/', $args);

                // Check the response code
                $response_code = wp_remote_retrieve_response_code($response);

                if ((int)$response_code === 200) {
                    $response_body = wp_remote_retrieve_body($response);
                    $result = @json_decode($response_body, true);

                    if (!empty($result) && is_array($result)) {
                        if (array_key_exists('errorMessage', $result)) {
                            update_option($wcva_db_field_names['license'], '');
                            update_option($wcva_db_field_names['aws_key'], '');
                            update_option($wcva_db_field_names['valid_until'], '');
                        } else {
                            $wcva_status_code          = !empty($result['statusCode']) ? trim($result['statusCode']) : null;;
                            $wcva_status               = !empty($result['status']) ? trim($result['status']) : null;
                            $wcva_trial_api_access_key = '';
                            $wcva_trial                = '';
                            $wcva_trial_valid_until    = '';

                            if (!is_null($wcva_status_code) && !is_null($wcva_status) && (int)$wcva_status_code == 200 && strtolower($wcva_status) == 'success') {
                                $wcva_trial_api_access_key = array_key_exists('key', $result) && !empty($result['key']) ? trim($result['key']) : '';
                                $wcva_trial_valid_until = array_key_exists('vaild_until', $result) && !empty($result['vaild_until']) ? trim($result['vaild_until']) : '';

                                if (!empty($wcva_trial_api_access_key)) {
                                    $wcva_trial = 'trial';
                                } 
                            } 

                            // Store plugin trial version data to DB
                            update_option($wcva_db_field_names['license'], $wcva_trial);
                            update_option($wcva_db_field_names['aws_key'], $wcva_trial_api_access_key);
                            update_option($wcva_db_field_names['valid_until'], $wcva_trial_valid_until);
                        }
                    }
                }
            } catch (\Exception $ex) {
                // In case of any exception clear DB fields
                update_option($wcva_db_field_names['license'], '');
                update_option($wcva_db_field_names['aws_key'], '');
                update_option($wcva_db_field_names['valid_until'], '');
            }
        }
    }

    /**
     * Function to sanitize empty variables
     *
     * @param $wcva_var - String : Variable to sanitize
     * @return 
     */
    public static function wcva_sanitize_variable_for_local_script($wcva_var = null)
    {
        if (empty($wcva_var)) {
            return null;
        } else {
            return $wcva_var;
        }
    }

    /**
     * Method to log STT service call count to local DB and Cloud
     *
     * @return JSON response obj
     */
    public function wcva_log_service_call()
    {
        check_ajax_referer('service_call_count');

        // Get license key and API key from database
        $wcva_license_key    = get_option('wcv_assistant_license_key', null);
        $wcva_api_system_key = get_option('wcv_assistant_api_system_key', null);
        $wcva_api_system_key = isset($wcva_api_system_key) ? trim($wcva_api_system_key) : null;
        
        // Get data from DB
        $wcva_uuid = get_option('wcv_assistant_uuid', null);
        $wcva_temp_last_value = get_option('wcva_last_value', null); // To check if we are making initial service log call

        // Flag to mark valid license key been detected after trial
        $wcva_valid_license_provided = get_option('wcva_valid_license_provided', false);
        
        // Reset counters if valid license key encountered first time after trial
        if (empty($wcva_valid_license_provided) && $wcva_license_key !== 'trial' && !empty($wcva_api_system_key)) {
            update_option('wcva_valid_license_provided', true);
            update_option('wcva_current_value', 0);
            update_option('wcva_last_value', 0);
        }

        // Get values from database, HTTP request
        $wcva_do_update_last_value  = isset($_REQUEST['updateLastValue']) ? (int) $_REQUEST['updateLastValue'] : 0;
        $wcva_current_value         = (int) get_option('wcva_current_value', 0);
        $wcva_last_value            = (int) get_option('wcva_last_value', 0);
        $wcva_last_value_updated_at = get_option('wcva_last_value_updated_at', null);
        $wcva_current_value_to_log  = ($wcva_do_update_last_value == 1) ? $wcva_current_value : $wcva_current_value + 1;
        
        $wcva_log_result = array(
            'updatedAt'    => $wcva_last_value_updated_at,
            'currentValue' => $wcva_current_value,
            'lastValue'    => $wcva_last_value
        );

        try {
            // We need to reset current value count to 0 if current count log exceeds 25000
            if ($wcva_current_value_to_log > 25000) { update_option('wcva_current_value', 0); }

            // Log service count by calling cloud API if last update was before 24 hours or current count is +50 of last count
            if (is_null($wcva_temp_last_value) || $wcva_do_update_last_value === 1 || ($wcva_current_value_to_log > ($wcva_last_value + 50))) {
                $wcva_log_license_key = $wcva_license_key == "trial" ? 'trial_'.self::$wcva_site_name.'_'.$wcva_uuid : trim($wcva_license_key); 
                
                $wcva_body = array(
                    'license'      => $wcva_log_license_key,
                    'action'       => "logCalls",
                    'currentValue' => $wcva_current_value_to_log,
                    'lastValue'    => $wcva_last_value,
                );

                $wcva_args = array(
                    'body'         => json_encode($wcva_body),
                    'timeout'      => '60',
                    'headers'      => array(
                        'Content-Type' => 'application/json',
                        'Accept'       => 'application/json',
                        'x-api-key'    => 'jEODHPKy2z7GEIuerFBWk7a0LqVRJ7ER3aDExmbK'
                    )
                );

                $wcva_response = wp_remote_post( 'https://1kosjp937k.execute-api.us-east-1.amazonaws.com/V2', $wcva_args );

                // Check the response code
                $wcva_response_code = wp_remote_retrieve_response_code($wcva_response);             

                if ($wcva_response_code == 200) {
                    $wcva_response_body = wp_remote_retrieve_body($wcva_response);
                    $wcva_result = @json_decode($wcva_response_body, true);

                    if (!empty($wcva_result) && is_array($wcva_result)) {
                        $log_status = array_key_exists("status",$wcva_result) ? strtolower($wcva_result['status']) : 'failed';
                        $actual_current_value = array_key_exists("current Value",$wcva_result) ? strtolower($wcva_result['current Value']) : null;
                        $wcva_error = array_key_exists("errorMessage",$wcva_result) ? true : false;

                        if ($log_status == 'success' && is_null($actual_current_value) === false && $wcva_error === false) {
                            // Store updated values to database
                            $wcva_current_timestamp = time(); // epoc 
                            update_option('wcva_current_value', $actual_current_value);
                            update_option('wcva_last_value', $actual_current_value);
                            update_option('wcva_last_value_updated_at', $wcva_current_timestamp);

                            // Prepare response 
                            $wcva_log_result['updatedAt']    = $wcva_current_timestamp;
                            $wcva_log_result['currentValue'] = $actual_current_value;
                            $wcva_log_result['lastValue']    = $actual_current_value;
                        }
                    }
                } 
            } else {
                // Icrease current count locally
                update_option('wcva_current_value', $wcva_current_value_to_log);

                // Prepare response
                $wcva_log_result['currentValue'] = $wcva_current_value_to_log;
            }
        } catch (\Exception $ex) {
            // Do nothing for now
        }

        wp_send_json($wcva_log_result);
    }

    /**
     * Method to obtain audio file using IBM Watson TTS service
     *
     * @param string $wcva_intent_name Name of the intent 
     * @param string $wcva_response_text Response text for intent
     * @param string $wcva_voice Language/voice to be used to generate audio with
     *
     * @return Array $wcva_intent_response_audio Containing audio file related information
     */
    public static function wcva_text_to_speech( $wcva_intent_name = 'response', $wcva_response_text = "", $wcva_voice = "male_en_US", $for_custom_dialog = false)
    {
        $wcva_intent_response_audio = array(
            'path' => null,
            'voice' => null,
            'failed' => false
        );
        
        $wcva_response_text = trim($wcva_response_text);

        // Return default intent audio response for blank response text 
        if (empty($wcva_response_text)) {
            return $wcva_intent_response_audio;
        }

        $temp_audio_dir_name = self::$WCVA_PLUGIN['INTENT_AUDIO_DIR_NAME'];
        
        if ($for_custom_dialog === true) {
            $temp_audio_dir_name = self::$WCVA_PLUGIN['CUSTOM_DIALOG_AUDIO_DIR_NAME'];
            $wcva_intent_name = md5($wcva_response_text, false);
        }
        
        // Create file path and name
        $wcva_audio_dir_path  = self::$WCVA_PLUGIN['ABS_PATH'].$temp_audio_dir_name;
        $wcva_audio_file_name = $wcva_intent_name."_".time().".mp3";
        $wcva_audio_response_file_name_with_path = $wcva_audio_dir_path.$wcva_audio_file_name;

        // Set voice
        $tts_voice = self::$wcva_tts_voice_map["male_en_US"];

        try {
            $tts_voice = self::$wcva_tts_voice_map[$wcva_voice];
        } catch (\Exception $er) {
            $tts_voice = "en-US_MichaelV3Voice";
        }
        
        try {                        
            $wcva_body = array(
                'text' => $wcva_response_text
            );

            $wcva_args = array(
                'body'    => json_encode($wcva_body),
                'timeout' => '90',
                'headers' => array(
                    'Content-Type'  => 'application/json',
                    'Accept'        => 'audio/mp3',
                    'Authorization' => 'Basic '. base64_encode("apikey:".self::$wcva_voice_services_access_keys['value']['g_tts_key'])
                )
            );

            $wcva_response = wp_remote_post( 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/9b97d47c-0e0f-4694-926f-d61a5efa4569/v1/synthesize?voice='.$tts_voice, $wcva_args );

            // Check the response code
            $wcva_response_code = wp_remote_retrieve_response_code($wcva_response);             

            if ($wcva_response_code == 200) {
                $wcva_response_body = wp_remote_retrieve_body($wcva_response);

                /**
                 * Delete existing file(s) for the intent
                 *
                 */
                try {
                    // For PHP 4 and above
                    $wcva_mask = $wcva_intent_name."_*";
                    $wcva_existing_files_of_same_intent = glob($wcva_audio_dir_path.$wcva_mask);
                    
                    if (count($wcva_existing_files_of_same_intent) > 0) {
                        array_map('unlink', $wcva_existing_files_of_same_intent);
                    }

                    unset($wcva_existing_files_of_same_intent);
                } catch (\Exception $ex) {
                    // Do nothing for now
                }

                // Create and open file for writing contents
                $wcva_response_file = fopen($wcva_audio_response_file_name_with_path, "w");

                if ($wcva_response_file) {
                    // Write contents to the file
                    fwrite($wcva_response_file, $wcva_response_body);

                    // Close the file
                    fclose($wcva_response_file);

                    // Returning data 
                    $wcva_intent_response_audio['path'] = trim($temp_audio_dir_name.$wcva_audio_file_name); // Preserve relative path
                    $wcva_intent_response_audio['voice'] = trim($wcva_voice);                    

                    // set permissions of the file
                    chmod($wcva_audio_response_file_name_with_path , 0777);
                } else {
                    throw new Exception("Unable to create file");
                }
            } else {
                $wcva_intent_response_audio['failed'] = true;
            }
        } catch (\Exception $ex) {
            //  Reset returning data
            $wcva_intent_response_audio['path'] = null;
            $wcva_intent_response_audio['voice'] = null;

            // Delere if file created before exception
            if (file_exists($wcva_audio_response_file_name_with_path)) {
                unlink($wcva_audio_response_file_name_with_path);
            }
        }

        return $wcva_intent_response_audio;
    }

    /**
     * Method as HTTP request handler to obtain refreshed voice services token and keys
     *
     * @return JSON $wcva_refreshed_keys Containing IBM Watson STT token for now.
     *
     */
    public function wcva_refresh_access_keys()
    {
        check_ajax_referer('keys_refresh');

        self::wcva_synch_voice_access_keys(true);

        $wcva_refreshed_keys = array(
            'gStt' => self::$wcva_voice_services_access_keys['value']['g_stt_key']
        );

        wp_send_json($wcva_refreshed_keys);
    }

    /**
     * Static method to obtain access keys for Google STT & TTS and IBN Watson token
     *
     * @param boolean $forced_synch To by-pass validation to obtain token and keys from API
     *
     */
    public static function wcva_synch_voice_access_keys($forced_synch = false)
    {
        try {
            $wcva_do_synch = false;
            
            $wcva_synched_at    = self::$wcva_voice_services_access_keys['value']['synched_at'];
            $wcva_g_stt_key     = self::$wcva_voice_services_access_keys['value']['g_stt_key'];
            $wcva_g_tts_key     = self::$wcva_voice_services_access_keys['value']['g_tts_key'];

            if (
                empty($wcva_synched_at) ||
                empty($wcva_g_stt_key) ||
                empty($wcva_g_tts_key) ||
                $forced_synch === true
            ) {
                $wcva_do_synch = true;
            }

            if (!!$wcva_synched_at && $wcva_do_synch === false) {
                $wcva_synched_at_threshold = $wcva_synched_at + (60 * 60 * 6); //Add 6 hours (as epoc) to last synched at time
                $wcva_current_time = time();

                if ($wcva_current_time > $wcva_synched_at_threshold) {
                    $wcva_do_synch = true;
                }
            }

            if ($wcva_do_synch === false) return;

            $wcva_args = array(
                'timeout' => '90',
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'x-api-key' => self::$wcva_api_access_key
                )
            );

            $wcva_response = wp_remote_get( self::$wcva_voice_services_access_keys['api_url'], $wcva_args );

            // Check the response code
            $wcva_response_code = wp_remote_retrieve_response_code($wcva_response);

            if ($wcva_response_code == 200) {
                $wcva_response_body = wp_remote_retrieve_body($wcva_response);
                $wcva_result = @json_decode($wcva_response_body, true);

                if (!empty($wcva_result) && is_array($wcva_result)) {
                    $wcva_google_stt_key = array_key_exists('gSTT', $wcva_result) ? $wcva_result['gSTT'] : null;
                    $wcva_google_tts_key = array_key_exists('TTS', $wcva_result) ? $wcva_result['TTS'] : null;

                    /**
                     * Deliberate separation of if blocks, do not merge them for optimization as 
                     * it would ruin the flexibility and independency of response values (none of them depend on each other anyway).
                     *
                     */
                    $wcva_synchable_local_keys = 0;


                    if (!!$wcva_google_stt_key) {
                        self::$wcva_voice_services_access_keys['value']['g_stt_key'] = $wcva_google_stt_key;
                        $wcva_synchable_local_keys += 1;
                    }

                    if (!!$wcva_google_tts_key) {
                        self::$wcva_voice_services_access_keys['value']['g_tts_key'] = $wcva_google_tts_key;
                        $wcva_synchable_local_keys += 1;
                    }

                    if ($wcva_synchable_local_keys > 0) {
                        self::$wcva_voice_services_access_keys['value']['synched_at'] = time(); //epoc
                        
                        update_option(
                            self::$wcva_voice_services_access_keys['db_col_name'],
                            self::$wcva_voice_services_access_keys['value']
                        );
                    }
                }
            }
        } catch (\Exception $ex) {
            // Nullify keys
            self::$wcva_voice_services_access_keys['value']['g_stt_key'] = null;
            self::$wcva_voice_services_access_keys['value']['g_tts_key'] = null;
            self::$wcva_voice_services_access_keys['value']['synched_at'] = null;
        }
    }

    /**
     * Static method to get custom dialog response metadata from DB
     *
     */
    public static function wcva_get_custom_responses_from_db() {
        $wcva_custom_dialog_collection = get_option(self::$wcva_custom_dialog_responses['db_col_name'], null);

        if (!!$wcva_custom_dialog_collection) {
            //#############################################################################
            // Delete custom response records missing audio file
            //#############################################################################            
            $wcva_filtered_collection = array_filter($wcva_custom_dialog_collection, function($res_obj) {
                $wcva_valid_res_obj = true;
                $wcva_res_path = array_key_exists('path', $res_obj) ? trim($res_obj['path']) : null;
                
                if (isset($wcva_res_path) && !empty($wcva_res_path) && !file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_res_path)) {
                    $wcva_valid_res_obj = false;
                }

                return $wcva_valid_res_obj;
            });
            
            self::$wcva_custom_dialog_responses['collection'] = array_values($wcva_filtered_collection);
            
            // Update database if filtered collection is diverse in length
            if (count($wcva_custom_dialog_collection) !== count(self::$wcva_custom_dialog_responses['collection'])) {
                update_option(self::$wcva_custom_dialog_responses['db_col_name'], self::$wcva_custom_dialog_responses['collection']);
            }

            unset($wcva_custom_dialog_collection, $wcva_filtered_collection);
        }
    }

    /**
     * Method as HTTP request handler to make TTS process for custom dialog phrase
     *
     * @return JSON $wcva_custom_dialog_response_collection
     *
     */
    public function wcva_custom_dialog_text_to_speech()
    {
        $wcva_ajx_response = array(
            'updated_collection' => array(),
            'custom_response' => array('response' => null , 'path' => null, 'voice' => null),
            'status' => false
        );
        
        check_ajax_referer('custom_dialog');

        try {
            $wcva_speech_text = isset($_REQUEST['response_text']) ? sanitize_text_field($_REQUEST['response_text']) : null;

            if (empty($wcva_speech_text)) {
                wp_send_json_error($wcva_ajx_response);
            }

            $wcva_tts_response = self::wcva_text_to_speech('customDialog', $wcva_speech_text, self::$wcva_voice, true);

            if (array_key_exists('failed', $wcva_tts_response) && $wcva_tts_response['failed'] === true) {
                unset($wcva_tts_response['failed']);
                wp_send_json_error($wcva_ajx_response);
            }

            $wcva_tts_response['path'] = trim($wcva_tts_response['path']);

            if (
                array_key_exists('path', $wcva_tts_response) &&
                isset($wcva_tts_response['path']) &&
                !empty($wcva_tts_response['path'])
            ) {
                $wcva_ajx_response['custom_response']['response'] = $wcva_speech_text;
                $wcva_ajx_response['custom_response']['path'] = trim($wcva_tts_response['path']);
                $wcva_ajx_response['custom_response']['voice'] = $wcva_tts_response['voice'];
                $wcva_ajx_response['status'] = true;

                //#############################################################################
                // Delete old custom response record with the same phrase
                //#############################################################################
                $wcva_filtered_collection = array_filter(self::$wcva_custom_dialog_responses['collection'], function($res_arr) use ($wcva_speech_text) {
                    $wcva_valid_res_arr = true;
                    $wcva_existing_res = array_key_exists('response', $res_arr) ? trim($res_arr['response']) : null;

                    if ($wcva_existing_res == $wcva_speech_text) {
                        $wcva_valid_res_arr = false;
                        $wcva_res_path = array_key_exists('path', $res_arr) ? trim($res_arr['path']) : null;

                        // If audio file exist for it then delete
                        if (!empty($wcva_res_path) && file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_res_path)) {
                            unlink(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_res_path);
                        }
                    }

                    return $wcva_valid_res_arr;
                });

                self::$wcva_custom_dialog_responses['collection'] = array_values($wcva_filtered_collection);

                //################################################################################################################
                // If max slots limit of cache/collection is already reached.
                // ..then delete least used/accessed/played existing custom response to make space for new phrase/custom response
                //################################################################################################################
                if (count(self::$wcva_custom_dialog_responses['collection']) === self::$WCVA_PLUGIN['CUSTOM_DIALOG_SLOTS_LIMIT']) {
                    $wcva_older_timestamp = null;
                    $wcva_least_accessed_record_index = null;                    

                    foreach (self::$wcva_custom_dialog_responses['collection'] as $record_index => $res_arr) {
                        $wcva_existing_path = array_key_exists('path', $res_arr) ? self::$WCVA_PLUGIN['ABS_PATH'].trim($res_arr['path']) : null;
                        $wcva_file_last_accessed = !empty($wcva_existing_path) ? fileatime($wcva_existing_path) : null;
                        
                        if (
                            $wcva_file_last_accessed !== false &&
                            (empty($wcva_older_timestamp) || ($wcva_file_last_accessed < $wcva_older_timestamp))
                        ) {
                            $wcva_older_timestamp = $wcva_file_last_accessed;
                            $wcva_least_accessed_record_index = $record_index;
                        }
                    }

                    //#############################################################################################
                    // NOTE: 
                    // Case 1: Due to performance issue some platforms like unix do disable 'fileatime' function
                    // Case 2: On windows server 'fileatime' function might return 0 always
                    // 
                    // So file access time would not be always in place.
                    // In such situation we have to make space in collection for new custom response by removing
                    // first record.
                    //#############################################################################################
                    if (empty($wcva_least_accessed_record_index)) {
                        $wcva_least_accessed_record_index = 0;
                    }

                    $wcva_potentially_least_used_record = self::$wcva_custom_dialog_responses['collection'][$wcva_least_accessed_record_index];
                    $wcva_res_path = array_key_exists('path', $wcva_potentially_least_used_record) ? trim($wcva_potentially_least_used_record['path']) : null;

                    // Delete audio file
                    if (!empty($wcva_res_path) && file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_res_path)) {
                        unlink(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_res_path);
                    }

                    // Remove record from collection
                    array_splice(self::$wcva_custom_dialog_responses['collection'], $wcva_least_accessed_record_index, 1);
                    unset($wcva_older_timestamp, $wcva_least_accessed_record_index, $wcva_potentially_least_used_record, $wcva_res_path);
                }

                // Push new custom dialog into existing collection
                array_push(self::$wcva_custom_dialog_responses['collection'], $wcva_ajx_response['custom_response']);
                
                // Prepare updated collection to be sent back to client
                $wcva_ajx_response['updated_collection'] = self::$wcva_custom_dialog_responses['collection'];

                // update database
                update_option(self::$wcva_custom_dialog_responses['db_col_name'], self::$wcva_custom_dialog_responses['collection']);
                
                unset($wcva_tts_response, $wcva_filtered_collection);
            }
        } catch(\Exception $ex) {
            $wcva_ajx_response = array(
                'updated_collection' => array(),
                'custom_response' => array('response' => null , 'path' => null, 'voice' => null),
                'status' => false
            );

            wp_send_json_error($wcva_ajx_response);
        }

        wp_send_json_success($wcva_ajx_response);
    }

    /**
     * Method as HTTP request handler to perform TTS process
     *
     * @return JSON response
     *
     */
    public function wcva_synthsize_text()
    {
        check_ajax_referer('js_ajax_tts');

        // For dialog response change
        $wcva_is_end_user = isset($_REQUEST['user']) ? sanitize_text_field($_REQUEST['user']) : null;
        $wcva_dialog_text = isset($_REQUEST['dialog_text']) ? sanitize_text_field($_REQUEST['dialog_text']) : null;
        $wcva_dialog_option_db_name = isset($_REQUEST['dialog_op_name']) ? sanitize_text_field($_REQUEST['dialog_op_name']) : null;
        $wcva_new_voice = isset($_REQUEST['voice_for_synth']) ? sanitize_text_field($_REQUEST['voice_for_synth']) : null;
        
        if (empty($wcva_dialog_text) || empty($wcva_dialog_option_db_name)) {
            wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'Required parameters are missing.'));
        }

        $wcva_is_valid_option_name = array_key_exists($wcva_dialog_option_db_name, self::$wcva_generic_dialog_dboptionname_to_intentname_map);

        if (!$wcva_is_valid_option_name) {
            wp_send_json_error(array('code'=> 'WCVA_ERROR_2', 'error'=> 'You are trying to configure dialog which does not exist.'));
        }

        $wcva_intent_name = self::$wcva_generic_dialog_dboptionname_to_intentname_map[$wcva_dialog_option_db_name];
        
        $wcva_intent_audio_response_data = self::wcva_text_to_speech(
            $wcva_intent_name,
            $wcva_dialog_text,
            isset($wcva_new_voice) && !empty($wcva_new_voice) ? $wcva_new_voice : self::$wcva_voice
        );

        // ##################################################################################################
        // If TTS service failed might be due to expired 'key' then we are going to re-obtain it here.
        // 
        // NOTES:
        // * By means of use case this will not generate new audio responses.
        // * Also not going to save new value to DB as we are breaking up the flow.
        // ##################################################################################################
        if (array_key_exists('failed', $wcva_intent_audio_response_data) && $wcva_intent_audio_response_data['failed'] === true) {
            self::wcva_synch_voice_access_keys(true);
            unset($wcva_intent_audio_response_data['failed']);
            wp_send_json_error(array('code'=> 'WCVA_ERROR_3', 'error'=> 'Something went wrong. Please try again after the page reload.'));
        }

        $wcva_audio_path = array_key_exists('path', $wcva_intent_audio_response_data) ? trim($wcva_intent_audio_response_data['path']) : null;

        if (!empty($wcva_audio_path) && file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_audio_path)) {
            $wcva_dialog_old_data = get_option($wcva_dialog_option_db_name, array());

            // Store updated dialog data to DB
            $wcva_dialog_old_data['intent_audio_response'] = $wcva_intent_audio_response_data;
            update_option($wcva_dialog_option_db_name, $wcva_dialog_old_data);

            // #########################################################################################################################################
            // To send updated generic dialogs and generic dialog against which new audio been generated in response to end user request from front end
            // #########################################################################################################################################
            if (!empty($wcva_is_end_user)) {
                $wcva_temp_intents_data = self::get_configured_intents_from_DB();
                $wcva_updated_generic_dialogs = array_key_exists('intents', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents'] : array();
                
                $wcva_intent_audio_response_data['updated_generic_dialogs'] = $wcva_updated_generic_dialogs;

                unset($wcva_temp_intents_data, $wcva_updated_generic_dialogs);
            }

            unset(
                $wcva_dialog_text,
                $wcva_dialog_option_db_name,
                $wcva_intent_name,
                $wcva_audio_path
            );

            wp_send_json_success($wcva_intent_audio_response_data);   
        } else {
            unset(
                $wcva_dialog_text,
                $wcva_dialog_option_db_name,
                $wcva_intent_name,
                $wcva_intent_audio_response_data,
                $wcva_audio_path
            );

            wp_send_json_error(array('code'=> 'WCVA_ERROR_4', 'error'=> 'Please try again later.'));
        }
    }

    /**
     * Method as HTTP request handler to perform Fuzzy Search and Dynamic Audio synthesis to search the product * and category from REST API
     *
     */
    public function wcva_fuzzy_search()
    {
        check_ajax_referer('fuzzy_search');
        $intent_of_user = isset($_REQUEST['intent_of_user']) ? sanitize_text_field($_REQUEST['intent_of_user']) : '';
        $product_string = isset($_REQUEST['prodStr']) ? sanitize_text_field($_REQUEST['prodStr']) : '';
        $product_category_string = isset($_REQUEST['prodCategoryStr']) ? sanitize_text_field($_REQUEST['prodCategoryStr']) : '';
        $search_percent = null;
        $wcva_product_list = array();
        $voice_response = "";
        $redirect_url = "";
        $wcva_matched_obj = null;
        $product_id = "";
        $product_name = "";
        $product_permalink = get_option('woocommerce_permalinks', '')['product_base'];
        $product_permalink = str_replace("%product_cat%", "", $product_permalink);
        $product_permalink = str_replace('/', '', $product_permalink);

        // #####################################################################################
        // To get the Consumer key and secret from database for Rest API
        // #####################################################################################
        self::$wcv_assistant_consumer_key = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['consumer_key'], '')));

        self::$wcv_assistant_consumer_secret = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['consumer_secret'], '')));

        if (empty(self::$wcv_assistant_consumer_key) || empty(self::$wcv_assistant_consumer_secret)) {
            wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'Required parameters are missing i.e Consumer Key And Consumer Secret'));
        }

        // #####################################################################################
        // WooCommerce REST API to get products, category , ...
        // #####################################################################################
        $woocommerce_api = new Client(
            site_url(), // Your store URL
            self::$wcv_assistant_consumer_key, // Your consumer key
            self::$wcv_assistant_consumer_secret, // Your consumer secret
            [
                'wp_api' => true, // Enable the WP REST API integration
                'version' => 'wc/v3',// WooCommerce WP REST API version
                'query_string_auth' => true //  Force Basic Authentication as query string true and using under HTTPS
            ]
        );

        // ######################################################################################
        // To Add product in cart
        // ######################################################################################
		
        if ($intent_of_user == "AddToCart") {
            global $woocommerce;
			$page = 1;
			$products = [];
			$product_list = [];
			do{
				try {
					$products = $woocommerce_api->get('products', array('per_page'=>100, 'page' => $page));
				}
				catch (\Exception $err) {
					wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'There was some issue to get product data from WC REST API for fuzzy search '.$err));
				}
			$product_list = array_merge($product_list,$products);
		    $page++;
			} while (count($products) > 0 && $page < 3);
			
            $address_bar_url = isset($_REQUEST['address_bar_url']) ? sanitize_text_field($_REQUEST['address_bar_url']) : '';

            try {
                if (is_user_logged_in()){
                    if ($product_string != null || $product_string != '') {
                        $wcva_matched_obj = self::wcva_fuzzy_item($product_list, $product_string, $search_percent, $wcva_product_list);
    
                        if ($wcva_matched_obj != null || $search_percent >= 75) {
                            if(count($wcva_matched_obj->variations) > 0){
                                $redirect_url = $wcva_matched_obj->permalink;
                                $voice_response = "I have found $wcva_matched_obj->name The product has multiple variations. Please select the options and then press the add to cart button.";
                            }
                            else {
                                $product_cart_id = WC()->cart->generate_cart_id( $wcva_matched_obj->id );
                                if(!WC()->cart->find_product_in_cart( $product_cart_id )) {
                                    $redirect_url = "$wcva_matched_obj->permalink?add-to-cart=$wcva_matched_obj->id";
                                    $voice_response = "I have added $wcva_matched_obj->name to the shopping cart.";
                                } else {
                                    $redirect_url = "$wcva_matched_obj->permalink?add-to-cart=$wcva_matched_obj->id";
                                    $voice_response = "I have increase quantity of $wcva_matched_obj->name to the shopping cart.";
                                }
                            }
                        }
                        else {
                            if (count($wcva_product_list) > 2){
                                $voice_response = "There are some products that are related to $product_string Please select the options and then press the add to cart button";
                                $redirect_url = "/?s=". preg_replace('/\p{P}/', '', $product_string) ."&post_type=product";
                            }
                            else {
                                throw new Exception('Product not found');
                            }
                        }
                    }
                    else {
                        throw new Exception('address url not found');
                    }
                } else {
                    $voice_response = "In order to add products to your cart, you'll need to login first ";
                    $redirect_url = $address_bar_url;
                }
            } catch(Exception $e) {
                if (str_contains($address_bar_url, $product_permalink)) {
                    $product_id = 0;
                    $product_name = "";
                    $has_variations = False;
                    $product_attributes = [];
                    foreach ($product_list as $product ) {
                        if (str_contains($address_bar_url, $product->permalink)) {
                            $product_id = $product->id;
                            $product_name = $product->name;
                            if(count($product->variations) > 0){
                                $has_variations = True;
                                $product_attributes = $product->attributes;
                            }
                            break;
                        }
                    }
                    if($has_variations){
                        $redirect_url=$product->permalink;
                        $voice_response = "Please specify which variation you would like to purchase. Please select an option for ";
                        foreach($product_attributes as $prod_attribute){
                            $voice_response .= $prod_attribute->name .", ";
                        }
                        $voice_response .= " and then press the add to cart button";
                    }
                    else if ($product_id != 0){
                        $product_cart_id = WC()->cart->generate_cart_id( $product_id );
                            if(!WC()->cart->find_product_in_cart( $product_cart_id )) {
                                $redirect_url = "$product->permalink?add-to-cart=$product_id";
                                $voice_response = "I have added $product_name to the shopping cart.";
                            } else {
                                $redirect_url = "$product->permalink?add-to-cart=$product_id";
                                $voice_response = "I have increase quantity of $product_name to the shopping cart.";
                            }
                    }
                    else {
                        $voice_response = "I am sorry but I didn't understand which product
                                    you wanted me to add to the cart. Please select product or name
                                    product you want me to add to the cart";

                    $redirect_url = "/shop/";
                    }
                }
                else {
                    $voice_response = "I am sorry but I didn't understand which product
                                    you wanted me to add to the cart. Please select product or name
                                    product you want me to add to the cart";

                    $redirect_url = "/shop/";
                }
            }
        }

        // #####################################################################################
        // To search the product using REST API
        // #####################################################################################
        if ($intent_of_user == "productSearch") {
			$page = 1;
			$products = [];
			$product_list = [];
			do{
				try {
					$products = $woocommerce_api->get('products', array('per_page'=>100, 'page' => $page));
				}
				catch (\Exception $err) {
					wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'There was some issue to get product data from WC REST API for fuzzy search '.$err));
				}
			$product_list = array_merge($product_list,$products);
		    $page++;
			} while (count($products) > 0 && $page < 3);

            $wcva_matched_obj = self::wcva_fuzzy_item($product_list, $product_string, $search_percent, $wcva_product_list);
            if ($wcva_matched_obj != null || $search_percent >= 75) {
                $voice_response = "I found a $wcva_matched_obj->name The price is $wcva_matched_obj->price The item is $wcva_matched_obj->stock_status I will show the product details now.";
                $redirect_url = $wcva_matched_obj->permalink;
            }
            else { //Fuzzy search for product synonyms/tags
                $temp_search_percent = 0;
                $temp_product = array();
                $temp = null;

                // Foreach works when product carry any tags
                foreach ($product_list as $product) {
                    $product_tags = $product->tags;
                    if (!empty($product_tags)) { 
                        $temp = self::wcva_fuzzy_item($product_tags, $product_string, $search_percent, $wcva_product_list);
                        if ($temp != null) {
                            $temp_search_percent = $search_percent;
                            array_push($temp_product, $product);
                        }
                    }
                }
                if (count($temp_product) == 1){
                    $temp_product = $temp_product[0];
                }

                if ($temp_search_percent >= 75 && count($temp_product) == 1) {
                    $voice_response = "I found a $temp_product->name The price is $temp_product->price The item is $temp_product->stock_status I will show the product details now.";
                    $redirect_url = $temp_product->permalink;
                }
                elseif (count($temp_product) >= 2) {
                    $voice_response = "There are some products that are related to $product_string";
                    $redirect_url = "/?" ."&product_tag=".preg_replace('/\p{P}/', '', $product_string);
                }
                elseif (count($wcva_product_list) >= 2) {
                    $voice_response = "There are some products that are related to $product_string";
                    $redirect_url = "/?s=". preg_replace('/\p{P}/', '', $product_string) ."&post_type=product";
                }
                else {
                    $voice_response = "I was unable to find a perfect match. Let me search the products for $product_string";
                    $redirect_url = "/?s=". preg_replace('/\p{P}/', '', $product_string) ."&post_type=product";
                }
            }
        }
        
        // #################################################################################
        // To search the Product Category
        // #################################################################################
        if ($intent_of_user == "productCategory") {
			
			
			$page = 1;
			$categories = [];
			$category_list = [];
			do{
				try {
					$categories = $woocommerce_api->get('products/categories', array('per_page'=>100, 'page' => $page));
				}
				catch (\Exception $err) {
					wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'There was some issue to get product data from WC REST API for fuzzy search '.$err));
				}
			$category_list = array_merge($category_list,$categories);
		    $page++;
			} while (count($categories) > 0 && $page < 3);           

            $wcva_matched_obj = self::wcva_fuzzy_item($category_list, $product_category_string, $search_percent, $wcva_product_list);

            if ($wcva_matched_obj != null || $search_percent >= 75) {
                $voice_response = "Let me show products related to the category $wcva_matched_obj->name";
                $redirect_url = "/?&product_cat=$wcva_matched_obj->slug";
            } elseif (count($wcva_product_list) > 1) {
                $voice_response = "Let me show products related to the category $product_category_string";
                $redirect_url = "/?&product_cat=$product_category_string";
            } else {
                $voice_response = "Let me search for $product_category_string";
                $redirect_url = "?s=$product_category_string&post_type=product";
            }
        }

        // #################################################################################
        // To get the List Product Categories for static intents
        //################################################################################## 
        if ($intent_of_user == "ProductGroups") {
            
			$page = 1;
			$categories = [];
			$category_list = [];
			do{
				try {
					$categories = $woocommerce_api->get('products/categories', array('per_page'=>100, 'page' => $page));
				}
				catch (\Exception $err) {
					wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'There was some issue to get product data from WC REST API for fuzzy search '.$err));
				}
			$category_list = array_merge($category_list,$categories);
		    $page++;
			} while (count($categories) > 0 && $page < 3);           

            $category_string = "";
            $break_after = 5;
            foreach ($category_list as $category_key => $category) {
                if (str_contains($category_string, $category->name) || $category->name == "Uncategorized") {
                    $break_after += 1;
                    continue;
                }
                $category_string .= " ". $category->name .",";
                if ($category_key == $break_after) {
                    break;
                }
            }
            
            $voice_response = "We sell a variety of products. We offer ". trim($category_string, ',') ." and more";
            $redirect_url = "/shop/";

        }

        // #################################################################################
        // Dynamic Audio Synthesis
        // #################################################################################
        $wcva_dialog_text = $voice_response;
        $wcva_dialog_option_db_name = "wcva_product_search";
        $wcva_new_voice =  null;

        self::wcva_dynamic_audio_synthesys(null, $wcva_dialog_text, $wcva_dialog_option_db_name, $wcva_new_voice, $voice_response, $redirect_url);  
    }

    /**
     * Method to perform Fuzzy Search to match a string in product or category list using Cosine Similarity Algorithm
     *
     */
    public static function wcva_get_cosine_similarity($string1, $string2) {
        // Convert strings to arrays of words

        $words1 = explode(' ', $string1);
        $words2 = explode(' ', $string2);

        // Create a list of unique words
        $unique_words = array_unique(array_merge($words1, $words2));

        // Initialize vectors with zeros
        $vector1 = array_fill_keys($unique_words, 0);
        $vector2 = array_fill_keys($unique_words, 0);

        // Count word occurrences in each vector
        foreach ($words1 as $word) {
            $vector1[$word]++;
        }
        foreach ($words2 as $word) {
            $vector2[$word]++;
        }

        // Calculate the cosine similarity
        $dot_product = 0;
        $magnitude1 = 0;
        $magnitude2 = 0;
        foreach ($unique_words as $word) {
            $dot_product += ($vector1[$word] * $vector2[$word]);
            $magnitude1 += pow($vector1[$word], 2);
            $magnitude2 += pow($vector2[$word], 2);
        }
        $magnitude1 = sqrt($magnitude1);
        $magnitude2 = sqrt($magnitude2);
        if ($magnitude1 > 0 && $magnitude2 > 0) {
            return $dot_product / ($magnitude1 * $magnitude2);
        } else {
            return 0;
        }
    }

    /**
     * Method for get all product who have best and average case similarity
     *
     */
    public static function wcva_fuzzy_item($wcva_list, $wcva_item_string, &$search_percent = null, &$wcva_product_list = array()){
        // Initializing for match product array or list of heigher similarity products
        $wcva_product = null;
        $wcva_high_percent_product_list = array();

        // Check all product name with given prodStr
        foreach ($wcva_list as $product){
            $product_name = trim(strtolower($product->name));
            $wcva_item_string = trim(strtolower(preg_replace('/\p{P}/', '', $wcva_item_string)));

            $temp_search_percent = self::wcva_get_cosine_similarity($product_name, $wcva_item_string);
            $temp_search_percent = round($temp_search_percent * 100, 2);

            // Add product in best case when 75% similarity with prodStr
            if ($temp_search_percent >= 75) {
                array_push($wcva_high_percent_product_list, $product);
            }

            // Add product in average case when 55% similarity with prodStr
            if ($temp_search_percent >= 55) {
                array_push($wcva_product_list, $product);
            }
        }

        // If Single product available in array we add into $wcva_product
        if (count($wcva_high_percent_product_list) == 1){
            $wcva_product = $wcva_high_percent_product_list[0];
            $search_percent = 80;
        } elseif (count($wcva_product_list) == 1){
            $wcva_product = $wcva_product_list[0];
            $search_percent = 80;
        } else {
            $search_percent = 0;
        }
        return $wcva_product;
    }


    /**
     * Method to dynamic audio synthesis of voice response for search
     *
     */
    public static function wcva_dynamic_audio_synthesys($wcva_is_end_user, $wcva_dialog_text, $wcva_dialog_option_db_name, $wcva_new_voice, $voice_response, $redirect_url)
    {
        if (empty($wcva_dialog_text) || empty($wcva_dialog_option_db_name)) {
            wp_send_json_error(array('code'=> 'WCVA_ERROR_1', 'error'=> 'Required parameters are missing.'));
        }
        
        $wcva_intent_name = "dynamic_search";
        $wcva_intent_audio_response_data = self::wcva_text_to_speech(
            $wcva_intent_name,
            $wcva_dialog_text,
            isset($wcva_new_voice) && !empty($wcva_new_voice) ? $wcva_new_voice : self::$wcva_voice
        );

        // ##################################################################################################
        // If TTS service failed might be due to expired 'key' then we are going to re-obtain it here.
        // 
        // NOTES:
        // * By means of use case this will not generate new audio responses.
        // * Also not going to save new value to DB as we are breaking up the flow.
        // ##################################################################################################
        
        if (array_key_exists('failed', $wcva_intent_audio_response_data) && $wcva_intent_audio_response_data['failed'] === true) {
            self::wcva_synch_voice_access_keys(true);
            unset($wcva_intent_audio_response_data['failed']);
            wp_send_json_error(array('code'=> 'WCVA_ERROR_3', 'error'=> 'Something went wrong. Please try again after the page reload.'));
        }

        $wcva_audio_path = array_key_exists('path', $wcva_intent_audio_response_data) ? trim($wcva_intent_audio_response_data['path']) : null;

        if (!empty($wcva_audio_path) && file_exists(self::$WCVA_PLUGIN['ABS_PATH'].$wcva_audio_path)) {

            $wcva_dialog_old_data = get_option($wcva_dialog_option_db_name, array());

            // Store updated dialog data to DB
            $wcva_dialog_old_data['intent_audio_response'] = $wcva_intent_audio_response_data;
            update_option($wcva_dialog_option_db_name, $wcva_dialog_old_data);

            // ################################################################################
            // To send updated generic dialogs and generic dialog against which new audio been generated in response to end user request from front end
            // ################################################################################
            if (!empty($wcva_is_end_user)) {
                $wcva_temp_intents_data = self::get_configured_intents_from_DB();
                $wcva_updated_generic_dialogs = array_key_exists('intents', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents'] : array();
                
                $wcva_intent_audio_response_data['updated_generic_dialogs'] = $wcva_updated_generic_dialogs;

                unset($wcva_temp_intents_data, $wcva_updated_generic_dialogs);
            }

            unset(
                $wcva_dialog_text,
                $wcva_dialog_option_db_name,
                $wcva_intent_name,
                $wcva_audio_path
            );
            $wcva_intent_audio_response_data['voice_response'] = $voice_response;
            $wcva_intent_audio_response_data['redirect_url'] = $redirect_url;
            
            wp_send_json_success($wcva_intent_audio_response_data);   
        } else {
            unset(
                $wcva_dialog_text,
                $wcva_dialog_option_db_name,
                $wcva_intent_name,
                $wcva_intent_audio_response_data,
                $wcva_audio_path
            );

            wp_send_json_error(array('code'=> 'WCVA_ERROR_4', 'error'=> 'Please try again later.'));
        }
    }

}
