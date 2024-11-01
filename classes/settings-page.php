<?php
if ( !defined('ABSPATH') ) exit;

define('WCVA_BASIC_CONFIG_OPTION_NAMES' , serialize(array(
        /*'subscription'    => 'wcv_assistant_dialog_subscription',*/
        'license_key'            => 'wcv_assistant_license_key',
        'dialog_type'            => 'wcv_assistant_dialog_type',
        'custom_endpoint'        => 'wcv_assistant_custom_endpoint',
        'type_of_search'         => 'wcv_assistant_type_of_search',
        'disable_search_mic'     => 'wcv_assistant_disable_search_mic',
        'disable_forms_mic'      => 'wcv_assistant_disable_forms_mic',
        'searchable_hints'       => 'wcv_assistant_searchable_hints',
        'google_analytics_track' => 'wcv_assistant_google_analytics_track',
        'ga_tracking_id'         => 'wcv_assistant_ga_tracking_id',
        'mic_listening_timeout'  => 'wcv_assistant_mic_listening_timeout',
        'voice'                  => 'wcv_assistant_voice',
        'floating_mic_position'  => 'wcv_assistant_floating_mic_position',
        'floating_button_icon'   => 'wcv_assistant_floating_button_icon',
        'consumer_key'           => 'wcv_assistant_consumer_key',
        'consumer_secret'        => 'wcv_assistant_consumer_secret',
        'elementor_mic'          => 'wcv_assistant_elementor_mic',
        'input_field_mic'        => 'wcv_assistant_input_field_mic',
        'bot_background_color'   => 'wcv_assistant_bot_background_color',
        'mic_pulse_color'        => 'wcv_assistant_mic_pulse_color',
        'bot_response_color'     => 'wcv_assistant_bot_response_color',
        'bot_response_timeout'   => 'wcv_assistant_bot_respons_timeout',
    )));

$WCVA_LANGUAGE_LIBRARY = unserialize(WCVA_LANGUAGE_LIBRARY);
define('WCVA_INTENT_LABEL_KEY', 'intent_label');
define('WCVA_INTENT_URL_PLACEHOLDER_KEY', 'intent_url_placeholder');
define('WCVA_INTENT_OPTION_NAME_KEY','option_name');
define('WCVA_INTENT_KEY','intent');

define('WCVA_DEFAULT_INTENTS_META_DATA', serialize(array(
        array(
            WCVA_INTENT_KEY                 => 'about',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['aboutYourCompany'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/about-us', 
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_about_your_company',
        ),
        array(
            WCVA_INTENT_KEY                 => 'contact',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['contactUs'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/contact',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_contact_us',
        ),
        array(
            WCVA_INTENT_KEY                 => 'hours',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['openingHours'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/contact',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_opening_hours',
        ),
        array(
            WCVA_INTENT_KEY                 => 'blog',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['blog'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/blog',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_blog',
        ),
        array(
            WCVA_INTENT_KEY                 => 'news',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['news'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/news',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_news',
        ),
        array(
            WCVA_INTENT_KEY                 => 'service',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['services'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/service',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_services',
        ),
        array(
            WCVA_INTENT_KEY                 => 'overview',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['overview'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_overview',
        ),
        array(
            WCVA_INTENT_KEY                 => 'gallery',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['gallery'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/gallery',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_gallery',

        ),
        array(
            WCVA_INTENT_KEY                 => 'address',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['address'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/contact',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_address',
        ),
        array(
            WCVA_INTENT_KEY                 => 'products',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['products'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/shop',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_products',
        ),
        array(
            WCVA_INTENT_KEY                 => 'solutions',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['solutions'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/solutions',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_solutions',
        ),
        array(
            WCVA_INTENT_KEY                 => 'team',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['team'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/team',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_team',
        ),
        array(
            WCVA_INTENT_KEY                 => 'plans',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['plans'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/plans',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_plans',
        ),
        array(
            WCVA_INTENT_KEY                 => 'price',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['pricesCost'], 
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/pricing',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_prices_cost',
        ),
        array(
            WCVA_INTENT_KEY                 => 'reseller',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['whereToBuy'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/partners',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_where_to_buy',
        ),
        array(
            WCVA_INTENT_KEY                 => 'account',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['myAccount'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/myAccount',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_my_account',
        ),
        array(
            WCVA_INTENT_KEY                 => 'payment_options',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['howToPay'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/terms',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_how_to_buy',
        ),
        array(
            WCVA_INTENT_KEY                 => 'returns',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['returns'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/terms',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_returns',
        ),
        array(
            WCVA_INTENT_KEY                 => 'support',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['support'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/support',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_support',
        ),
        array(
            WCVA_INTENT_KEY                 => 'downloads',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['downloads'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/downloads',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_downloads',
        ),
        array(
            WCVA_INTENT_KEY                 => 'reference',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['referencesCustomers'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/clients',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_references_customers',
        ),
        array(
            WCVA_INTENT_KEY                 => 'videos',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['videos'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/videos',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_videos',
        ),
        array(
            WCVA_INTENT_KEY                 => 'docu',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['productDocumentation'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/documentation',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_product_documentation',
        ),
        array(
            WCVA_INTENT_KEY                 => 'appointment',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['scheduleAppointment'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/schedule',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_schedule_appointment',
        ),
        array(
            WCVA_INTENT_KEY                 => 'demo',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['requestDemo'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/demo',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_request_demo',
        ),
        array(
            WCVA_INTENT_KEY                 => 'how_it_works',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['howDoesTtWork'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/overview',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_how_does_it_work',
        ),
        array(
            WCVA_INTENT_KEY                 => 'press',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['pressCoverage'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/press',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_press',
        ),
        array(
            WCVA_INTENT_KEY                 => 'cancel',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['cancelMyAccount'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/support',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_cancel_my_account',
        ),
        array(
            WCVA_INTENT_KEY                 => 'orders',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['orderHistory'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Order History',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_order_histry',
        ),

        array(
            WCVA_INTENT_KEY                 => 'orderStatus',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['orderStatus'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Order Status',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_order_status',
        ),

        array(
            WCVA_INTENT_KEY                 => 'checkOut',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['checkOut'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Check Out',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_check_out',
        ),
        array(
            WCVA_INTENT_KEY                 => 'CustomerService',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['contactCustomerService'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Contact Customer Service',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_contact_customer_service',
        ),
        array(
            WCVA_INTENT_KEY                 => 'PaymentOptions',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['availablePaymentOptions'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Available Payment Options',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_available_payment_options',
        ),
        array(
            WCVA_INTENT_KEY                 => 'Shipping',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['shippingOptions'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Shipping Options and Terms',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_shiping_options',
        ),
        array(
            WCVA_INTENT_KEY                 => 'ShowCart',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['showShoppingCart'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/Cart',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_shoping_cart',
        ),
        array(
            WCVA_INTENT_KEY                 => 'ProductGroups',
            WCVA_INTENT_LABEL_KEY           => $WCVA_LANGUAGE_LIBRARY['dialogConfig']['productGroups'],
            WCVA_INTENT_URL_PLACEHOLDER_KEY => '/shop',
            WCVA_INTENT_OPTION_NAME_KEY     => 'wcv_assistant_product_groups',
        )
    )));


define('WCVA_INTENT_RESPONSE_PLACEHOLDER_TEXT',$WCVA_LANGUAGE_LIBRARY['dialogConfig']['enterYourResponseHere']);

class voice_shopping_for_woocommerce_settings_page 
{
    // Constants for defining default intents
    const INTENT_URL_LABEL_TEXT = 'URL';
    
    // Holds the values to be used in the fields callbacks
    const DEFAULT_SEARCHABLE_HINTS = 'Ask about our company;Ask for opening hours;';

    private $wcv_assistant_subscription    = false;
    private $wcv_assistant_license_key            = '';
    private $wcv_assistant_dialog_type            = 'generic';
    private $wcv_assistant_custom_endpoint        = '';
    private $wcv_assistant_type_of_search         = 'ai';
    private $wcv_assistant_disable_search_mic     = '0';
    private $wcv_assistant_disable_forms_mic      = '0';
    private $wcv_assistant_searchable_hints       = '';
    private $wcv_assistant_google_analytics_track = null;
    private $wcv_assistant_ga_tracking_id         = '';
    private $wcv_assistant_mic_listening_timeout  = null;
    private $wcv_assistant_uuid                   = null;
    private $wcv_assistant_voice                  = 'male_en_US';
    private $wcv_assistant_floating_mic_position  = 'Middle Right';
    private $wcv_assistant_floating_button_icon   = 'micIcon';
    private $wcv_assistant_consumer_key           = '';
    private $wcv_assistant_consumer_secret        = '';
    private $wcv_assistant_elementor_mic          = null;
    private $wcv_assistant_input_field_mic        = null;
    private $wcv_assistant_bot_background_color   = '#42a5f5';
    private $wcv_assistant_mic_pulse_color        = '#dc2626';
    private $wcv_assistant_bot_response_color     = '#218c5e';
    private $wcv_assistant_bot_response_timeout   = 5;

    public static $wcv_assistant_intent_name_map = array();

    public static $BASIC_CONFIG_OPTION_NAMES = array();
    public static $WCVA_LANGUAGE_LIBRARY     = array();
    public static $WCVA_DEFAULT_INTENTS_META_DATA = array();
    public static $WCVA_PLUGIN               = array();
    
    // ##################################################################################################################################
    // Static property to hold all the intents DB option names which needs to regenerate audios (Specifically at plugin activation time)
    // ##################################################################################################################################
    public static $wcv_assistant_regenerate_audio_for_intents = array();
    
    // #####################################################################################################################################
    // Static property to hold all the intents DB option names which having audio files (Not deleted and having path to file or file exist)
    // #####################################################################################################################################
    public static $wcv_assistant_intents_with_audios = array();

    /**
     * Start up
     */
    public function __construct()
    {
        self::$BASIC_CONFIG_OPTION_NAMES = unserialize(WCVA_BASIC_CONFIG_OPTION_NAMES);
        self::$WCVA_LANGUAGE_LIBRARY = unserialize(WCVA_LANGUAGE_LIBRARY);
        self::$WCVA_DEFAULT_INTENTS_META_DATA = unserialize(WCVA_DEFAULT_INTENTS_META_DATA);
        self::$WCVA_PLUGIN = unserialize(WCVA_PLUGIN);

        add_action( 'admin_menu', array( $this, 'wcv_assistant_add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'wcv_assistant_page_init' ) );

        //### THIS FILTERS HOOK INTO A PROCESS BEFORE OPTION GETTING STORED TO DB
        // Register filters for basic config options
        foreach (self::$BASIC_CONFIG_OPTION_NAMES as $key => $option) {
            add_filter( 'pre_update_option_'.$option, array($this, 'wcva_pre_update_basic_config'), 10, 3 );
        }
        
        // Register filters for dialog config options
        foreach (self::$WCVA_DEFAULT_INTENTS_META_DATA as $index => $intent) {
            add_filter( 'pre_update_option_'.$intent[WCVA_INTENT_OPTION_NAME_KEY], array($this, 'wcva_pre_update_intent_box'), 10, 3 );
            self::$wcv_assistant_intent_name_map[$intent[WCVA_INTENT_OPTION_NAME_KEY]] = $intent[WCVA_INTENT_KEY];
        }

        //### THIS ACTIONS GETS FIRED AFTER STORING DATA TO DB
        // Register actions for basic config options
        add_action( 'add_option_'.self::$BASIC_CONFIG_OPTION_NAMES['license_key'], array( $this, 'wcva_post_adding_license_key'), 10, 2 );
        add_action( 'update_option_'.self::$BASIC_CONFIG_OPTION_NAMES['license_key'], array( $this, 'wcva_post_update_license_key'), 10, 2 );
    }

    /**
     * Static method to get timestamp from and set timestamp to DB (Timestamp of setting option update)
     *
     * @param $action - string : 'get' or 'set'
     * 
     * $returns wcva_modified_timestamp - string : Time as a Unix timestamp
     */
    public static function wcva_settings_modified_timestamp($action = null)
    {
        $wcva_modified_timestamp = null;

        try {
            if (empty($action)) return $wcva_modified_timestamp;

            if ($action == 'get') {
                $wcva_modified_timestamp = get_option('wcv_assistant_settings_updated_timestamp', null);
            } else if ($action == 'set') {
                $wcva_timestamp = time();
                update_option('wcv_assistant_settings_updated_timestamp', $wcva_timestamp);
                $wcva_modified_timestamp = $wcva_timestamp;
            }
        } catch (\Exception $ex) {
            $wcva_modified_timestamp = null;
        }

        return $wcva_modified_timestamp;
    }

    /**
     * Method as callback to handle basic config options data before storing to DB
     *
     * @param $old_value - string : Existing Option value from database
     * @param $new_value - string : New Option value to be stored in database
     * @param $option_name - string : Name of the option
     */
    public function wcva_pre_update_basic_config($new_value, $old_value, $option_name) {
        /**
         * Comparing two string values to check if option data modified.
         *
         * Preserve settings updated timestamp 
         */
        if ($old_value != $new_value && get_transient( 'wcva_basic_config_option_updated' ) === false) {
            set_transient( 'wcva_basic_config_option_updated', 1, 5 );
            $wcva_setting_update_ts = self::wcva_settings_modified_timestamp('set');
            unset($wcva_setting_update_ts);
        }

        return $new_value;
    }

    /**
     * Method as callback to handle dialog config options before storing to DB
     *
     * @param $old_value - string : Option value before update
     * @param $new_value - string : Updated Option value
     * @param $option_name - string : Name of the option
     */
    public function wcva_pre_update_intent_box($new_value, $old_value, $option_name)
    {
        /**
         * When $old_value is completely blank/empty it denotes the intent is being stored to DB first time.
         * $old_value later on never becomes completely empty.
         *
         * We are considering completely empty fact to use this filter to serve first time adding option scenario for generating audio for this intent.
         */
        $wcva_intent_adding_first_time = empty($old_value) ? true : false;

        $intent_new_data = is_array($new_value) ? $new_value : (array) $new_value;
        $intent_new_data['intent_name'] = self::$wcv_assistant_intent_name_map[$option_name];
        $intent_old_data = is_array($old_value) ? $old_value : (array) $old_value;
        
        if (!array_key_exists('enabled', $intent_new_data)) {
            $new_value['enabled'] = '';
        } else if (trim($intent_new_data['enabled']) != 'enabled') {
            $new_value['enabled'] = '';
        }

        /**
         * Comparing two arrays to check if option data modified
         *
         * Preserve settings updated timestamp 
         */
        if ($old_value != $new_value) {
            $wcva_setting_update_ts = self::wcva_settings_modified_timestamp('set');
            unset($wcva_setting_update_ts);
        }

        return $new_value;
    }

    /**
     * Method as callback post to license key option creation in DB
     *
     * @param $option_name - string : Option name
     * @param $option_value - string : Option value
     */
    public function wcva_post_adding_license_key( $option_name, $option_value)
    {
        try {
            Voice_Shopping_For_Woocommerce_Plugin::wcva_get_api_key_from_license_key(trim($option_value), true);
        } catch (\Exception $ex) {
            // Do nothing for now
        }
    }

    /**
     * Method as callback post to license key option update in DB
     *
     * @param $old_value - string : Option value before update
     * @param $new_value - string : Updated Option value
     */
    public function wcva_post_update_license_key( $old_value, $new_value)
    {
        try {
            $option_value = strip_tags(stripslashes($new_value));

            if ($old_value != trim($option_value)) {
                Voice_Shopping_For_Woocommerce_Plugin::wcva_get_api_key_from_license_key(trim($option_value), true);
            }
        } catch (\Exception $ex) {
            // Do nothing for now
        }
    }

    /**
     * Add options page
     */
    public function wcv_assistant_add_plugin_page()
    {
        // This page will be under "Settings"
        add_submenu_page(
            'options-general.php',// Parent menu as 'settings'
            'Voice Shopping For Woocommerce',
            'Voice Shopping For Woocommerce',
            'manage_options',
            'wcv-assistant-settings',// Slug for page
            array( $this, 'wcv_assistant_settings_create_page')// View 
        );
    }

    /**
     * Options/Settings page callback to create view/html of settings page
     */
    public function wcv_assistant_settings_create_page()
    {
        // For dialog subscription
        /*$this->wcv_assistant_dialog_subscription = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['subscription'], false)));
        $this->wcv_assistant_dialog_subscription = ($this->wcv_assistant_dialog_subscription == 1 
            || $this->wcv_assistant_dialog_subscription == true 
            || $this->wcv_assistant_dialog_subscription == 'on') ? true : false; */

        // For license key
        $this->wcv_assistant_license_key = strip_tags(stripslashes(get_option( self::$BASIC_CONFIG_OPTION_NAMES['license_key'], '')));
        $this->wcv_assistant_license_key = !empty($this->wcv_assistant_license_key) ? $this->wcv_assistant_license_key : '';

        if (empty($this->wcv_assistant_license_key)) { update_option('wcv_assistant_api_system_key', ''); }

        // For dialog type
        $this->wcv_assistant_dialog_type = strip_tags(stripslashes(get_option( self::$BASIC_CONFIG_OPTION_NAMES['dialog_type'], 'generic')));
        
        // For custom endpoint
        $this->wcv_assistant_custom_endpoint = strip_tags(get_option( self::$BASIC_CONFIG_OPTION_NAMES['custom_endpoint'], ''));
        $this->wcv_assistant_custom_endpoint = !empty($this->wcv_assistant_custom_endpoint) ? trim($this->wcv_assistant_custom_endpoint) : null;

        // For type of search
        $this->wcv_assistant_type_of_search = strip_tags(stripslashes(get_option(self::$BASIC_CONFIG_OPTION_NAMES['type_of_search'], '')));

        if (empty($this->wcv_assistant_type_of_search)) { 
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['type_of_search'], 'ai');
            $this->wcv_assistant_type_of_search = 'ai';
        }

        // For disabling search field mic and forms mic
        $this->wcv_assistant_disable_search_mic = strip_tags(stripslashes(get_option(self::$BASIC_CONFIG_OPTION_NAMES['disable_search_mic'], '0')));
        $this->wcv_assistant_disable_forms_mic  = strip_tags(stripslashes(get_option(self::$BASIC_CONFIG_OPTION_NAMES['disable_forms_mic'], '0')));

        // For searchable hints
        $this->wcv_assistant_searchable_hints = strip_tags(
            stripslashes(
                get_option(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '')
            )
        );

        // if searchable hints are or left blank then always store default examples
        if (empty($this->wcv_assistant_searchable_hints)) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints'], self::DEFAULT_SEARCHABLE_HINTS);
            $this->wcv_assistant_searchable_hints = strip_tags(stripslashes(get_option(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints'], '')));
        }

        // For Google Analytics Track
        $this->wcv_assistant_google_analytics_track = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['google_analytics_track'], null)));

        // For Google Analytics Tracking id
        $this->wcv_assistant_ga_tracking_id = strip_tags(stripslashes(get_option( self::$BASIC_CONFIG_OPTION_NAMES['ga_tracking_id'], '')));
        $this->wcv_assistant_ga_tracking_id = !empty($this->wcv_assistant_ga_tracking_id) ? $this->wcv_assistant_ga_tracking_id : '';

        // For Mic listening auto timeout
        $this->wcv_assistant_mic_listening_timeout = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], null)));

        // if voice type is blank then always store voice type as male
        if (empty($this->wcv_assistant_mic_listening_timeout) || $this->wcv_assistant_mic_listening_timeout < 8) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], 8);
            $this->wcv_assistant_mic_listening_timeout = 8;
        } elseif ($this->wcv_assistant_mic_listening_timeout > 20) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout'], 20);
            $this->wcv_assistant_mic_listening_timeout = 20;
        }

        //get Consumer Key From Database
        $this->wcv_assistant_consumer_key = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['consumer_key'], '')));


        //get Consumer Secret Database
        $this->wcv_assistant_consumer_secret = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['consumer_secret'], '')));

        // Get UUID of trial license
        $this->wcv_assistant_uuid = get_option('wcv_assistant_uuid', null); 
        $this->wcv_assistant_uuid = empty($this->wcv_assistant_uuid) ? null : trim($this->wcv_assistant_uuid);

        // For voice and language
        $this->wcv_assistant_voice = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['voice'], null)));

        // if voice and language is blank then always store voice as male Us english
        if (empty($this->wcv_assistant_voice)) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US');
            $this->wcv_assistant_voice = strip_tags(stripslashes(get_option(self::$BASIC_CONFIG_OPTION_NAMES['voice'], 'male_en_US')));
        }

        // For Mic Position
        $this->wcv_assistant_floating_mic_position = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position'], 'Middle Right')));

        // For Floating button icon
        $this->wcv_assistant_floating_button_icon = strip_tags(stripslashes(get_option( 
            self::$BASIC_CONFIG_OPTION_NAMES['floating_button_icon'], 'micIcon')));

        // For Floating button background color
        $this->wcv_assistant_bot_background_color = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['bot_background_color'], '#42a5f5')));

        // For Floating button pulse color
        $this->wcv_assistant_mic_pulse_color = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['mic_pulse_color'], '#dc2626')));

        // For Floating mic response color
        $this->wcv_assistant_bot_response_color = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['bot_response_color'], '#218c5e')));

        // For Floating mic response color timeout
        $this->wcv_assistant_bot_response_timeout = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout'], 5)));

        if (empty($this->wcv_assistant_bot_response_timeout) || $this->wcv_assistant_bot_response_timeout < 5) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout'], 5);
            $this->wcv_assistant_bot_response_timeout = 5;
        } elseif ($this->wcv_assistant_bot_response_timeout > 10) {
            update_option(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout'], 10);
            $this->wcv_assistant_bot_response_timeout = 10;
        }

        // For Elementor mic
        $this->wcv_assistant_elementor_mic = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['elementor_mic'], null)));

        // For input field mic
        $this->wcv_assistant_input_field_mic = strip_tags(stripslashes(get_option(
            self::$BASIC_CONFIG_OPTION_NAMES['input_field_mic'], null)));

        $wcva_temp_intents_data = Voice_Shopping_For_Woocommerce_Plugin::get_configured_intents_from_DB();
        self::$wcv_assistant_regenerate_audio_for_intents = array_key_exists('intents_for_audio_regeneration', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents_for_audio_regeneration'] : array();

        self::$wcv_assistant_intents_with_audios = array_key_exists('intents_with_audios', $wcva_temp_intents_data) ? $wcva_temp_intents_data['intents_with_audios'] : array();

?>
        <div class="wrap">
            <div id="wcvAssistantSettingsWrapper">
                <div id="wcvAssistantSettingsHeader" class="wcv-assistant-row">
                    <div class="wcv-assistant-setting-header-column-1"><br>
                        <span id="wcvAssistantSettingsPageHeading">Voice Shopping For WooCommerce Setup |</span>
                        <span id="wcvAssistantSettingsPageSubHeading">speak2web AI Dialog</span>
                    </div>
                    <div class="wcv-assistant-setting-header-column-2">
                        <a title="Wordpress Plugin - speak2web" target="blank" href="https://speak2web.com/voice-shopping-for-woocommerce/">
                            <img id="wcvAssistantSettingsPageHeaderLogo" 
                            src="<?php echo esc_attr(dirname(plugin_dir_url(__FILE__)).'/images/speak2web_white_logo.svg')?>">
                        </a>
                    </div>
                </div>
                <div class="wcva-configuration-header"><h4 id="wcvaBasicConfigHeader"><span><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['basicConfiguration']); ?></span></h4></div>
                <form id="wcvAssistantBasicConfigForm" method="post" action="options.php" onsubmit="wcvaBasicFormSubmitHandler(this, event)">
                    <?php
                        // This prints out all hidden setting fields
                        settings_fields( 'wcv-assistant-basic-config-settings-group' );
                        do_settings_sections( 'wcv-assistant-settings' );

                        // To display errors
                        settings_errors('wcv-assistant-settings', true, true);
                    ?>
                    <div id="wcvAssistantBasicConfigSection" class='wcv-assistant-row wcv-assistant-card'>
                        <div class="wcv-assistant-setting-basic-config-column">
                            <div id='wcvaVideoHelp' class="wcv-assistant-basic-config-sub-row">
                                <span id='wcvaHashTag'> #timeforvoice</span>
                                <span class="wcv-assistant-help" title="https://speak2web.com/video"><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['other']['common']['str1']);?> <a target='blank' href='https://www.youtube.com/watch?v=QO2uu5fGMhM'><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['other']['common']['str2']);?></a> <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['other']['videoHelp']);?></span>
                            </div>

                            <div class="wcv-assistant-basic-config-sub-row">
                                <div id="wcvaVoiceAndLanguage"><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['selectLanguage']); ?>
                                    <select
                                        data-do-synthesize="false"
                                        data-synth-decider="voice"
                                        data-old-value="<?php echo esc_attr($this->wcv_assistant_voice);?>" 
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['voice']); ?>"
                                        onchange="wcvaVoiceChange(this)">
                                        <option value="male_en_US" <?php selected('male_en_US', $this->wcv_assistant_voice);?>>
                                            Male English (United States)
                                        </option>
                                        <option value="female_en_US" <?php selected('female_en_US', $this->wcv_assistant_voice);?>>
                                            Female English (United States)
                                        </option>
                                        <option value="female_en_GB" <?php selected('female_en_GB', $this->wcv_assistant_voice);?>>
                                            Female English (United Kingdom)
                                        </option>
                                        <!-- <option value="male_de_DE" <?php selected('male_de_DE', $this->wcv_assistant_voice);?>>
                                            Male German
                                        </option>
                                        <option value="female_de_DE" <?php selected('female_de_DE', $this->wcv_assistant_voice);?>>
                                            Female German
                                        </option> -->
                                    </select>
                                </div>                            
                            </div>

                            <div class="wcv-assistant-basic-config-sub-row">
                                <div class='wcv-assistant-basic-config-dialog-type-column-1'>
                                    <label for="wcvaGenericDialog">
                                        <input 
                                        id="wcvaGenericDialog"
                                        type='radio' 
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['dialog_type']); ?>" 
                                        value="generic" <?php checked('generic', $this->wcv_assistant_dialog_type);?> 
                                        onchange="toggleWcvaDialogType('generic')"
                                        ><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['dialogType']['genericDialog']); ?>

                                    </label>
                                </div>
                                <div class='wcv-assistant-basic-config-dialog-type-column-2'>
                                    <label for="wcvaCustomDialog">
                                        <input 
                                        id="wcvaCustomDialog"
                                        type='radio' 
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['dialog_type']); ?>" 
                                        value="custom" <?php checked('custom', $this->wcv_assistant_dialog_type);?> 
                                        onchange="toggleWcvaDialogType('custom')"
                                        ><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['dialogType']['customDialog']); ?>

                                    </label>
                                </div>
                            </div>

                            <?php 
                            
                            if (Voice_Shopping_For_WooCommerce_Plugin::$wcva_trial_active === true) { ?>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <div id="wcvAssistantFreeTrialInfoWrapper">
                                    <?php if (!empty($this->wcv_assistant_uuid)) { ?>
                                        <label>
                                            <span id="wcvaUuidLabel"> UUID:</span> <?php echo wp_kses_post($this->wcv_assistant_uuid);?>
                                        </label>
                                    <?php } ?>
                                    
                                    <div class="wcv-assistant-free-trial-info"><?php echo wp_kses_post(Voice_Shopping_For_WooCommerce_Plugin::$wcva_trial_notice_msg_ctx);?></div>
                                </div>
                            </div>
                            <?php } ?>

                            <div class="wcv-assistant-basic-config-sub-row">
                                <div class="wcv-assistant-basic-config-attached-label-column"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['licenseKey']); ?></div>
                                <div class="wcv-assistant-basic-config-attached-input-column">
                                    <input 
                                    type="text" 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['license_key']); ?>" 
                                    id="wcvAssistantLicenseKey" 
                                    placeholder="<?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['copyYourLicenseKey']); ?>"
                                    value="<?php echo esc_attr($this->wcv_assistant_license_key); ?>"/>
                                </div>
                            </div>
                            <div id="wcvAssistantCustomEndpointRow" class="wcv-assistant-basic-config-sub-row 
                            <?php echo wp_kses_post($this->wcv_assistant_dialog_type == 'generic' ? 'wcv-assistant-hide' : ''); ?>">
                                <div class="wcv-assistant-basic-config-attached-label-column"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['endpointURL']); ?></div>
                                <div class="wcv-assistant-basic-config-attached-input-column">
                                    <input 
                                    type="text" 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['custom_endpoint']); ?>" 
                                    id="wcvAssistantCustomEndpoint"
                                    placeholder="<?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['enterYourCustom']); ?>"
                                    value="<?php echo esc_attr($this->wcv_assistant_custom_endpoint); ?>"/>
                                </div>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <label for="wcvaNativeSearch">
                                    <input 
                                    id="wcvaNativeSearch"
                                    type='checkbox' 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['type_of_search']); ?>" 
                                    value="native" <?php checked('native', $this->wcv_assistant_type_of_search);?> 
                                    > <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['nativeSearch']); ?>
                                </label>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <label for="wcvaDisableSearchMic">
                                    <input 
                                    id="wcvaDisableSearchMic"
                                    type='checkbox' 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['disable_search_mic']); ?>" 
                                    value="1" <?php checked('1', $this->wcv_assistant_disable_search_mic);?>
                                    > <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['disableSearchMic']); ?>
                                </label>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <label for="wcvaDisableFormMic">
                                    <input 
                                    id="wcvaDisableFormMic"
                                    type='checkbox' 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['disable_forms_mic']); ?>" 
                                    value="1" <?php checked('1', $this->wcv_assistant_disable_forms_mic);?>
                                    > <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['disableFormsMic']); ?>
                                </label>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <span class="wcva-autotimeout-label"></span>
                                <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['autoTimeoutDuration']); ?>
                                <input 
                                    type='number' 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout']); ?>" 
                                    min="8"
                                    max="20"
                                    step="1"
                                    onKeyup="wcvaResetTimeoutDefaultValue(this, event)"
                                    onKeydown="wcvaValidateTimeoutValue(this, event)"
                                    value="<?php echo esc_attr($this->wcv_assistant_mic_listening_timeout); ?>"/> 
                            </div>
                            
                            <div class="wcv-assistant-basic-config-sub-row">
                                <div class="wcva-dotted-border">
                                    <div class="wcv-assistant-basic-config-attached-label-column"><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['counsumerKey']); ?></div>
                                    <div class="wcv-assistant-basic-config-attached-input-column">
                                        <input 
                                        type="text" 
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['consumer_key']); ?>" 
                                        id="wcvAssistantConsumerKey" 
                                        placeholder="<?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['copyYourConsumerKey']); ?>"
                                        value="<?php echo esc_attr($this->wcv_assistant_consumer_key )?>" />
                                    </div>
                                    <div class="wcv-assistant-basic-config-sub-row"></div>
                                    <div class="wcv-assistant-basic-config-attached-label-column"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['counsumerSecret']); ?></div>
                                    <div class="wcv-assistant-basic-config-attached-input-column">
                                        <input 
                                        type="text" 
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['consumer_secret']); ?>" 
                                        id="wcvAssistantConsumerSecret" 
                                        placeholder="<?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['copyYourConsumerSecret']); ?>"
                                        value="<?php echo esc_attr($this->wcv_assistant_consumer_secret) ?>" />
                                    </div>
                                </div>
                            </div>

                            <div class="wcv-assistant-basic-config-sub-row"> 
                                <div class="wcva-dotted-border">
                                    <b> Google Analytics</b><hr>
                                    <label for="wcvaGoogleAnalytics">
                                        <input 
                                        id="wcvaGoogleAnalytics"
                                        type='checkbox' 
                                        onchange="wcvaToggleGaTrackingIdField(this)"
                                        name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['google_analytics_track']); ?>" 
                                        value="yes" <?php checked('yes', $this->wcv_assistant_google_analytics_track);?> 
                                        > <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['googleAnalytics']); ?> 
                                    </label>
                                        <br><br>
                                        <span><span class="wcva-important">*</span> <i>
                                            <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['gaInfo']['general']); ?>
                                            <br><br>
                                            <span class="wcva-important">*</span>
                                            <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['gaInfo']['location']); ?>:</i>
                                            <br>
                                            'Real-Time > Events' section or 'Behaviour > Events > Overview' section.
                                        </span>
                                    <br>
                                    <div id="wcvaGaTrackingIdWrapper" class="<?php echo esc_attr($this->wcv_assistant_google_analytics_track) !== 'yes' ? 'wcva-hide-element' : ''?>">
                                        Google Analytics Tracking ID (eg: UA-XXXXXXXX):<br>
                                        <input 
                                            oninput="wcvaGaIdChange(this)"
                                            data-error="0"
                                            type="text" 
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['ga_tracking_id']); ?>" 
                                            id="wcvaGaTrackingId" 
                                            placeholder="Please enter your tracking ID" 
                                            value="<?php echo esc_attr($this->wcv_assistant_ga_tracking_id); ?>"/>
                                        <br><span id='wcvaGaIdError'><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['gaErrorMessage']); ?></span>
                                    </div>
                                </div>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <div class='wcva-dotted-border'>
                                    <label for="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints']); ?>">
                                        <b><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['userSearchableHints']); ?></b>
                                    </label><hr>
                                    <span>
                                        <span class="wcva-important">*</span><i>
                                        <span><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['pleaseEnter']); ?> ' <b class='wcva-url-info-denoter'>;</b> ' <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['semicolonSeparated']); ?> <b class='wcva-url-info-denoter'>' ; ' </b> <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['NoteSearchableHints']['semicolonWillBe']); ?></span></i>
                                    </span>
                                    <br><br>
                                    <textarea 
                                    name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints']); ?>" 
                                    placeholder="<?php esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['enterSeparated']); ?>"
                                    /><?php echo wp_kses_post($this->wcv_assistant_searchable_hints); ?></textarea>
                                </div>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <div class="wcva-dotted-border">
                                    <div>
                                        <b><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingMicOptions']); ?></b>
                                        <hr>
                                        <label for="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position']); ?>">
                                            <div style="display: inline-block; width: 16.5%;">
                                                <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['selectFloatingMicPosition']); ?>:
                                            </div>
                                            <select id="wcvaFloatingMicPosition" name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position']); ?>">
                                                <option value="Middle Right" <?php selected('Middle Right', $this->wcv_assistant_floating_mic_position);?>>Middle Right</option>
                                                <option value="Middle Left" <?php selected('Middle Left', $this->wcv_assistant_floating_mic_position);?>>Middle Left</option>
                                                <option value="Top Right" <?php selected('Top Right', $this->wcv_assistant_floating_mic_position);?>>Top Right</option>
                                                <option value="Top Left" <?php selected('Top Left', $this->wcv_assistant_floating_mic_position);?>>Top Left</option>
                                                <option value="Bottom Right" <?php selected('Bottom Right', $this->wcv_assistant_floating_mic_position);?>>Bottom Right</option>
                                                <option value="Bottom Left" <?php selected('Bottom Left', $this->wcv_assistant_floating_mic_position);?>>Bottom Left</option>
                                            </select>
                                        </label>
                                    </div><br>
                                    <div id="FloatingMicApperance">
                                        <b><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingButtonAnimation']);?></b><hr>
                                        <label for="wcvaBackgroundColor">
                                            <div class="wcva-floating-mic-label">
                                                <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingMicBackgroundColor']);?>:
                                            </div>
                                            <input
                                            type="color"
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['bot_background_color']); ?>"
                                            id="wcvaBackgroundColor"
                                            value="<?php echo esc_attr($this->wcv_assistant_bot_background_color);?>"
                                            >
                                        </label><br>
                                        <label for="wcvaPulseColor">
                                            <div class="wcva-floating-mic-label">
                                                <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingMicPulseColor']);?>:
                                            </div>
                                            <input
                                            type="color"
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['mic_pulse_color']); ?>"
                                            id="wcvaPulseColor"
                                            value="<?php echo esc_attr($this->wcv_assistant_mic_pulse_color);?>"
                                            >
                                        </label><br>
                                        <label for="wcvaMicResponseColor">
                                            <div class="wcva-floating-mic-label">
                                                <?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingMicResponseColor']);?>:
                                            </div>
                                            <input
                                            type="color"
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_color']); ?>"
                                            id="wcvaMicResponseColor"
                                            value="<?php echo esc_attr($this->wcv_assistant_bot_response_color);?>"
                                            >
                                        </label><br>
                                        <label for="wcvaBotResponseTimeout">
                                            <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['botResponseTimeout']); ?>
                                            <input
                                                type='number'
                                                id='wcvaBotResponseTimeout'
                                                name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout']); ?>"
                                                min="5"
                                                max="10"
                                                step="1"
                                                onKeyup="wcvaResetTimeoutDefaultValue(this, event)"
                                                onKeydown="wcvaValidateTimeoutValue(this, event)"
                                                value="<?php echo esc_attr($this->wcv_assistant_bot_response_timeout); ?>"
                                                >
                                        </label>
                                    </div><br>
                                    <div id="wcvaFloatingButtonIcon">
                                        <b><?php echo esc_attr(self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['floatingButtonIconLabel']);?>:</b><hr>
                                        <label for="wcvaMicIcon">
                                            <input 
                                            type="radio" 
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['floating_button_icon']); ?>"
                                            id="wcvaMicIcon"
                                            value="micIcon" 
                                            <?php checked('micIcon', $this->wcv_assistant_floating_button_icon);?>
                                            >
                                            <img src="<?php echo esc_attr(dirname(plugin_dir_url(__FILE__)).'/images/wcva-floating-mic-icon.png')?>">
                                        </label>
                                        <label for="wcvaRobotIcon">
                                            <input 
                                            type="radio" 
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['floating_button_icon']); ?>" 
                                            id="wcvaRobotIcon"
                                            value="robotIcon" 
                                            <?php checked('robotIcon', $this->wcv_assistant_floating_button_icon);?>>
                                            <img src="<?php echo esc_attr(dirname(plugin_dir_url(__FILE__)).'/images/wcva-floating-robot-icon.png')?>">
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class = "wcv-assistant-basic-config-sub-row">
                                <div class = "wcva-dotted-border">
                                    <strong>Elementor Settings</strong>
                                    <hr>
                                    <div>
                                    <label for="wcvaElementorMic">
                                            <input
                                            id = "wcvaElementorMic"
                                            type="checkbox" 
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['elementor_mic']); ?>" 
                                            value="yes" <?php checked('yes', $this->wcv_assistant_elementor_mic);?>
                                            > Enable Elementor
                                        </label>
                                        </div>
                                </div>
                            </div>
                            <div class = "wcv-assistant-basic-config-sub-row">
                                <div class = "wcva-dotted-border">
                                    <strong>Voice Mic Options</strong><hr>
                                    <div>
                                    <label for="wcvaInputFieldMic">
                                            <input
                                            id = "wcvaInputFieldMic"
                                            type="checkbox"
                                            name="<?php echo esc_attr(self::$BASIC_CONFIG_OPTION_NAMES['input_field_mic']); ?>"
                                            value="yes" <?php checked('yes', $this->wcv_assistant_input_field_mic);?>
                                            > Enable Voice mic on all input fields
                                        </label>
                                       <br><span>&#x2139;</span>To enable STT mic, type "{allow_stt}" inside placeholder of selected input field.
                                    </div>
                                </div>
                            </div>
                            <div class="wcv-assistant-basic-config-sub-row">
                                <?php 
                                    $other_attributes = array( 'id' => 'wcvAssistantBasicConfigSettingsSave' );
                                    submit_button( self::$WCVA_LANGUAGE_LIBRARY['basicConfig']['saveSettings'], 'primary', 'wcv-assistant-basic-config-settings-save', false, $other_attributes);
                                ?>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- Dialog Configuration Section -->
                <div
                    id="wcvAssistantDialogConfigFormSection" 
                    class="<?php echo esc_attr($this->wcv_assistant_dialog_type == 'custom' ? 'wcv-assistant-hide' : ''); ?>"
                    data-intents-with-audios=<?php echo esc_attr(json_encode(self::$wcv_assistant_intents_with_audios));?>
                    data-intents-for-audio-regeneration=<?php echo esc_attr(json_encode(self::$wcv_assistant_regenerate_audio_for_intents));?>
                    >
                    <div class="wcva-configuration-header" id="wcvAssistantDialogConfigSectionTitle" colspan="2">
                        <h4><span><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['dialogConfiguration']); ?></span></h4>
                        <span class='wcva-url-info-denoter'><b>*</b></span>
                        <span class="wcva-dialog-accessibility-info"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['eachCheckbox']); ?></span>
                    </div>
                    <div class='wcv-assistant-row'>
                        <?php
                            $wcva_default_intents_meta_data_length = count(self::$WCVA_DEFAULT_INTENTS_META_DATA);
                            $wcva_default_audio_response = array('path' => NULL, 'voice' => NULL);
                            
                            for ($index = 0; $index < $wcva_default_intents_meta_data_length; $index++) {
                                $intent = self::$WCVA_DEFAULT_INTENTS_META_DATA[$index];
                                $intent_data = get_option($intent[WCVA_INTENT_OPTION_NAME_KEY], array());
                                $intent_data = is_array($intent_data) ? $intent_data : array();

                                $dialog_url = array_key_exists('url', $intent_data) ? $intent_data['url'] : '';
                                $dialog_url = trim(strip_tags(stripslashes($dialog_url)));
                                $dialog_response = array_key_exists('response', $intent_data) ? $intent_data['response'] : '';
                                $dialog_response = trim(strip_tags(stripslashes($dialog_response)));
                                $dialog_enabled  = array_key_exists('enabled', $intent_data) ? $intent_data['enabled'] : 'disabled';
                                $dialog_enabled  = trim(strip_tags(stripslashes($dialog_enabled)));

                                // For audio response
                                $wcva_audio_response = array_key_exists('intent_audio_response', $intent_data) && is_array($intent_data['intent_audio_response']) 
                                ? $intent_data['intent_audio_response'] : $wcva_default_audio_response;

                                $wcva_audio_response['path']  = trim($wcva_audio_response['path']);

                                $wcva_audio_file_url = !empty($wcva_audio_response['path']) ? self::$WCVA_PLUGIN['ABS_URL'].trim($wcva_audio_response['path']) : null;

                                $wcva_audio_response['path']  = trim($wcva_audio_response['path']);

                                $wcva_audio_file_path = !empty($wcva_audio_response['path']) ? self::$WCVA_PLUGIN['ABS_PATH'].trim($wcva_audio_response['path']) : null;
                                $wcva_audio_reponse_fisle_name = !empty($wcva_audio_file_url) ? $intent[WCVA_INTENT_KEY].'.mp3' : 'No file';

                                if (!empty($wcva_audio_file_path) && !file_exists($wcva_audio_file_path)) {
                                    $wcva_audio_file_path = null;
                                    $wcva_audio_file_url = null;
                                    $wcva_audio_reponse_file_name = 'No file';
                                }

                                $temp_index = $index;
                                $cell_class = 'wcv-assistant-dialog-config-table-even-cell';

                                if (($temp_index%2) == 0 ) {
                                    $cell_class = 'wcv-assistant-dialog-config-table-odd-cell';
                                    echo wp_kses_post("</div><div class='wcv-assistant-row'>");
                                }

                                // Intent input names
                                $wcva_intent_response_name    = $intent[WCVA_INTENT_OPTION_NAME_KEY].'[response]';
                                $wcva_intent_url_name         = $intent[WCVA_INTENT_OPTION_NAME_KEY].'[url]';
                                $wcva_intent_save_button_name = 'wcv-assistant-dialog-config-settings-save-'.$intent[WCVA_INTENT_KEY];
                                $wcva_response_name           = str_replace(']', '', str_replace('[', '_', $wcva_intent_response_name));
                                $wcva_url_name                = str_replace(']', '', str_replace('[', '_', $wcva_intent_url_name));
                        ?>  
                        <div class="wcv-assistant-dialog-conf-column <?php echo esc_attr($cell_class); ?>">
                            <form
                                method="post"
                                action="options.php"
                                data-intent-option-key="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]);?>"
                                onsubmit="wcvaDialogFormSubmitHandler(this, event)"
                                data-current-voice="<?php echo esc_attr($this->wcv_assistant_voice);?>"
                                >
                                <?php
                                // This prints out all hidden setting fields
                                settings_fields( 'wcv-assistant-dialog-config-settings-'.$intent[WCVA_INTENT_KEY].'-group' );
                                do_settings_sections( 'wcv-assistant-settings' );

                                // To display errors
                                settings_errors('wcv-assistant-settings', true, true);
                                ?>
                                <table>
                                    <tr>
                                        <td colspan="2">
                                            <div class="wcv-assistant-basic-config-section-title wcva-dialog-config-dialog-header">
                                                <label for="wcvaIntentAccessibility<?php echo esc_attr($index); ?>"> 
                                                    <input 
                                                        title="<?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['uncheckingThisBox']); ?>"
                                                        class="wcva-intent-accessibility-checkbox" 
                                                        id="wcvaIntentAccessibility<?php echo esc_attr($index); ?>" 
                                                        type="checkbox"
                                                        data-old-value="<?php echo esc_attr($dialog_enabled);?>"
                                                        value="enabled"
                                                        data-response-name="textarea[data-response-name=<?php echo esc_attr($wcva_response_name); ?>]"
                                                        data-url-name="input[data-url-name=<?php echo esc_attr($wcva_url_name); ?>]"
                                                        data-save-button-name="input[name=<?php echo esc_attr($wcva_intent_save_button_name); ?>]"
                                                        onchange="toggleIntentAccessiblity(this)"
                                                        name="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]); ?>[enabled]"
                                                        <?php checked('enabled', $dialog_enabled);?>
                                                        >
                                                    <?php echo wp_kses_post($index + 1 .'. '. $intent[WCVA_INTENT_LABEL_KEY]); ?>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="wcv-assistant-card">
                                        <td colspan="2" class="wcv-assistant-dialog-config-sub-table-cell">
                                            <textarea
                                            maxlength="1000"
                                            data-old-value="<?php echo esc_attr($dialog_response); ?>"
                                            name="<?php echo esc_attr($wcva_intent_response_name); ?>" 
                                            data-response-name="<?php echo esc_attr($wcva_response_name); ?>"
                                            placeholder="<?php echo esc_attr(WCVA_INTENT_RESPONSE_PLACEHOLDER_TEXT); ?>"
                                            <?php echo wp_kses_post(($dialog_enabled != 'enabled') ? ' readonly' : ''); ?>
                                            /><?php echo wp_kses_post($dialog_response); ?></textarea>
                                            <input
                                                type="hidden"
                                                name="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]); ?>[intent_name]"
                                                value="<?php echo esc_attr($intent[WCVA_INTENT_KEY]); ?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]); ?>[intent_audio_response][path]"
                                                value="<?php echo esc_attr($wcva_audio_response['path']);?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]); ?>[intent_audio_response][voice]"
                                                value="<?php echo esc_attr($wcva_audio_response['voice']);?>"
                                                >
                                            <input
                                                type="hidden"
                                                name="<?php echo esc_attr($intent[WCVA_INTENT_OPTION_NAME_KEY]); ?>[delete_audio_response]"
                                                value="0"
                                                >
                                        </td>
                                    </tr>
                                    <tr class="wcv-assistant-card <?php echo esc_attr(empty($wcva_audio_file_url) ? 'wcva-response-audio-unavailable-row' : 'wcva-response-audio-row');?>">
                                        <td colspan="2" class="wcv-assistant-dialog-config-sub-table-cell <?php echo esc_attr(empty($wcva_audio_file_url) ? 'wcva-hide-element' : '');?>">
                                            <div class="wcva-audio-wrapper wcva-audio-control-wrapper">
                                                <audio src="<?php echo esc_attr($wcva_audio_file_url);?>" controls preload="auto">
                                                    Your browser does not support the audio tag.
                                                </audio>
                                            </div>
                                            <div class="wcva-audio-wrapper wcva-audio-file-name-wrapper">
                                                <button
                                                    disabled
                                                    type="button"
                                                    class="button button-secondary"
                                                    style="background-color: transparent !important; background: transparent !important; border: 0 !important;"
                                                    >
                                                
                                                </button>
                                            </div>
                                        </td>
                                        <td
                                            colspan="2"
                                            class="wcv-assistant-dialog-config-sub-table-cell <?php echo esc_attr(empty($wcva_audio_file_url)) ? '' : 'wcva-hide-element';?>">
                                            <div class="wcva-audio-response-unavailable-wrapper">
                                                <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['audioUnavailableText']);?>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="wcv-assistant-card">
                                        <td colspan="2" class="wcv-assistant-dialog-config-sub-table-cell wcva-url-info">
                                            <span class='wcva-url-info-denoter'><b>*</b></span> 
                                            '<b><i><?php echo wp_kses_post($intent[WCVA_INTENT_URL_PLACEHOLDER_KEY]);?></i></b>'
                                            <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['isPreconfigured']); ?>
                                            <i>'<?php echo wp_kses_post($intent[WCVA_INTENT_LABEL_KEY]); ?>'</i> <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['dialog']); ?></i> <?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['urlInfo']['ifYouWantTo']); ?>
                                        </td>
                                    </tr>
                                    <tr class="wcv-assistant-card">
                                        <td colspan="2" class="wcv-assistant-attached-input-cell">
                                            <div class="wcv-assistant-basic-config-attached-label-column">
                                                <?php echo wp_kses_post(self::INTENT_URL_LABEL_TEXT); ?>
                                            </div>
                                            <div class="wcv-assistant-basic-config-attached-input-column">
                                                <input 
                                                type="text" 
                                                name="<?php echo esc_attr($wcva_intent_url_name); ?>"
                                                data-url-name="<?php echo esc_attr($wcva_url_name); ?>"
                                                placeholder="<?php echo esc_attr($intent[WCVA_INTENT_URL_PLACEHOLDER_KEY]); ?>" 
                                                value="<?php echo esc_attr(($dialog_url != '') ? $dialog_url : $intent[WCVA_INTENT_URL_PLACEHOLDER_KEY]); ?>"
                                                <?php echo esc_attr(($dialog_enabled != 'enabled') ? ' readonly' : ''); ?>
                                                required
                                                />
                                            </div>
                                            
                                        </td>
                                    </tr>
                                    <tr class="wcv-assistant-card">
                                        <td colspan="2" class="wcv-assistant-dialog-config-sub-table-cell">
                                            <?php 
                                            $other_attrib = $dialog_enabled != 'enabled' ? array('disabled' => true, 'data-name' => 'wcv-assistant-intent-submit') : array('data-name' => 'wcv-assistant-intent-submit');
                                            submit_button( 
                                                self::$WCVA_LANGUAGE_LIBRARY['dialogConfig']['dialogSaveButton'].$intent[WCVA_INTENT_LABEL_KEY].' Dialog', 
                                                'primary', 
                                                $wcva_intent_save_button_name, 
                                                false,
                                                $other_attrib
                                            );
                                            ?>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <?php
                            }
                        ?>
                    </div>
                </div><!-- End of Dialog Configuration Section -->
            </div>
        </div>
        <!-- Loading Popup when text to speech Conversion-->
        <div class="wcva-loader-modal" id="wcvaLoaderModal" >
            <div id="wcvaLoaderModalContent">
                <b id="wcvaSynthesizingProcessHeader"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['synthesizingHeader']);?>
                    <br>
                    <img id="wcvaLoaderModalSpinner" src="<?php echo esc_attr(dirname(plugin_dir_url(__FILE__)).'/images/wcva-process-spinner.gif')?>"/>
                    <!--  ## Do not remove code we might need it if better approach found then cookies -->
                    <span id="wcvaTotalSynthResponseSection" style="display:none">
                        <span class="wcva-synthesizing-dialog-indicator" id="wcvaCurrentDialog"></span> out of
                        <span class="wcva-synthesizing-dialog-indicator" id="wcvaTotalSynthesizableDialogs"></span> dialogs
                    </span>
                </b>
                <br>
                <span id="wcvaSynthesizingMessage"><?php echo wp_kses_post(self::$WCVA_LANGUAGE_LIBRARY['other']['synthesizingMessage']);?></span>
            </div> 
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function wcv_assistant_page_init()
    {
        //register settings for feilds of 'Basic Configuration' section
        //register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['subscription']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['license_key']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['dialog_type']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['custom_endpoint']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['type_of_search']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['disable_search_mic']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['disable_forms_mic']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['searchable_hints']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['google_analytics_track']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['ga_tracking_id']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['mic_listening_timeout']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['voice']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['floating_mic_position']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['floating_button_icon']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['bot_background_color']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['mic_pulse_color']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['bot_response_color']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['bot_response_timeout']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['consumer_key']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['consumer_secret']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['elementor_mic']);
        register_setting('wcv-assistant-basic-config-settings-group', self::$BASIC_CONFIG_OPTION_NAMES['input_field_mic']);
        register_setting('wcv-assistant-basic-config-settings-productSearch-group', 'wcva_product_search');
        //register settings for fields of 'Dialog Configuration section'
        foreach (self::$WCVA_DEFAULT_INTENTS_META_DATA as $index => $intent) {
            register_setting(
                'wcv-assistant-dialog-config-settings-'.$intent[WCVA_INTENT_KEY].'-group', 
                $intent[WCVA_INTENT_OPTION_NAME_KEY]
            );
        }
    }
}

// check user capabilities and hook into 'init' to initialize 'Voice Shopping For WooCommerce' settings object
add_action('init', 'initialize_wcv_assistant_settings_object');

/**
 * Initialize 'Voice Shopping For WooCommerce' settings object when 'pluggable' files are loaded from '/wp-includes/pluggable'
 * Which contains 'current_user_can' function.
 */
function initialize_wcv_assistant_settings_object(){
    if ( !current_user_can( 'manage_options' ) ) return;  

    $voice_shopping_for_woocommerce_settings_page = new voice_shopping_for_woocommerce_settings_page();
}
