<?php
/**
 * Plugin Name: Voice Shopping For WooCommerce
 * Description: Adds Voice Shopping to WooCommerce. Allows visitors to engage into an intelligent voice shopping assistant. Visitors can shop using the voice interface on the web page, both on desktop and mobile.
 * Version:     2.0.0
 * Author:      speak2web
 * Author URI:  https://speak2web.com/
 * Text Domain: voice-shopping-for-woocommerce
 * Domain Path: /languages
 * WC requires at least: 4.0
 * WC tested up to: 5.7.2
 */

/**
 * Copyright (c) 2019 speak2web
 *
 * Voice Shopping For WooCommerce is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * Voice Shopping For WooCommerce is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Voice Shopping For WooCommerce; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

defined( 'WPINC' ) or die;

include_once( dirname( __FILE__ ) . '/lib/requirements-check.php' );

$voice_shopping_for_woocommerce_requirements_check = new Voice_Shopping_For_Woocommerce_Requirements_Check( array(
    'title' => 'Voice Shopping For Woocommerce',
    'php'   => '7.2',
    'wp'    => '4.0',
    'file'  => __FILE__,
));

if ( $voice_shopping_for_woocommerce_requirements_check->passes() ) {

    $wcva_client_info = array(
        'chrome' => false,
        'firefox' => false,
        'edge' => false,
        'ie' => false,
        'macSafari' => false,
        'iosSafari' => false,
        'opera' => false
    );

    // Chrome
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'chrome') !== false) {
        $wcva_client_info['chrome'] = true;
    }

    // Firefox
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'firefox') !== false) {
        $wcva_client_info['firefox'] = true;
    }

    // Edge
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'edge') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'edg') !== false) {
        $wcva_client_info['edge'] = true;
    }

    // IE
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'msie') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'trident') !== false) {
        $wcva_client_info['ie'] = true;
    }

    // Mac Safari
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'macintosh') !== false && stripos($_SERVER['HTTP_USER_AGENT'], 'chrome') === false && stripos($_SERVER['HTTP_USER_AGENT'], 'safari') !== false) {
        $wcva_client_info['macSafari'] = true;
    }

    // iOS
    if((stripos($_SERVER['HTTP_USER_AGENT'], 'iphone') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'ipad') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'ipod') !== false) && stripos($_SERVER['HTTP_USER_AGENT'], 'safari') !== false) {
        $wcva_client_info['iosSafari'] = true;
    }

    // Opera
    if(stripos($_SERVER['HTTP_USER_AGENT'], 'opera') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'opr') !== false) {
        $wcva_client_info['opera'] = true;
    }

    if ($wcva_client_info['chrome'] === true && ($wcva_client_info['opera'] === true || $wcva_client_info['edge'] === true)) {
        $wcva_client_info['chrome'] = false;
    }

    define('WCVA_CLIENT', $wcva_client_info);


    // To get all active plugins.
    $wcva_all_active_plugins = (array) null;
    
    // Get voice from DB and load local translation library
    $wcva_voice = get_option( 'wcv_assistant_voice', 'male_en_US' );
    $wcva_voice = empty($wcva_voice) ? 'male_en_US' : trim($wcva_voice);
    $wcva_language_file_name = ($wcva_voice === 'male_de_DE' || $wcva_voice === 'female_de_DE') ? 'wcva_de_DE' : 'wcva_en_EN';
    include_once( dirname( __FILE__ ) . '/classes/plugin-languages/'.$wcva_language_file_name.'.php');

    try {
        switch ($wcva_voice) {
            case 'male_de_DE':
            case 'female_de_DE':
                define('WCVA_LANGUAGE_LIBRARY', serialize(wcva_de_DE::$WCVA_LANGUAGE_LIB));
                break;
            default:
                define('WCVA_LANGUAGE_LIBRARY', serialize(wcva_en_EN::$WCVA_LANGUAGE_LIB));
        }
    } catch (\Exception $e) {
        // Do nothing for now
    }

    define('WCVA_PLUGIN',  serialize(array(
        'ABS_PATH' => plugin_dir_path(__FILE__),
        'ABS_URL' => plugin_dir_url(__FILE__),
        'BASE_NAME' => plugin_basename( __FILE__ ),
        'INTENT_AUDIO_DIR_NAME' => 'generic_dialog_response/',
        'CUSTOM_DIALOG_AUDIO_DIR_NAME' => 'custom_dialog_response/',
        'CUSTOM_DIALOG_SLOTS_LIMIT' => 200,
    )));

    // Pull in the plugin classes and initialize
    include_once( dirname( __FILE__ ) . '/lib/wp-stack-plugin.php' );
    include_once( dirname( __FILE__ ) . '/classes/plugin.php' );
    include_once( dirname( __FILE__ ) . '/classes/settings-page.php' );
    include_once( dirname( __FILE__ ) . '/classes/wcva-admin-notice.php' );
    include_once( dirname( __FILE__ ) . '/classes/languages/languages.php');


    Voice_Shopping_For_Woocommerce_Plugin::start( __FILE__ );

    class Wcva_Elementor_widget {

        private static $instance = null;


        public static function instance() {
            if ( is_null( self::$instance ) ) {
                self::$instance = new self();
            }

            return self::$instance;
        }


        private function include_widgets_files() {
            require_once( __DIR__ . '/widgets/oembed-widget.php' );
        }

        public function register_widgets() {
            // It's now safe to include Widgets files.
            $this->include_widgets_files();

            // Register the plugin widget classes.
            \Elementor\Plugin::instance()->widgets_manager->register( new \Wcva_Elementor_Floating_Mic_Widget() );
        }

        public function register_categories($elements_manager){
            // creating speak2web category
            $elements_manager->add_category(
                'speak2web',
                [
                    'title' => __('Speak2web', 'myWidget'),
                    'icon'  => 'fa fa-plug'
                ]
            );
        }

        public function __construct() {
            // Register the widgets.
            add_action( 'elementor/widgets/register', array( $this, 'register_widgets' ) );
            add_action( 'elementor/elements/categories_registered', array( $this, 'register_categories' ) );

        }
    }
    Wcva_Elementor_widget::instance();
    

    // Hook into plugin activation
    register_activation_hook(__FILE__, function() {
        // To burst cache for JS and CSS files
        voice_shopping_for_woocommerce_settings_page::wcva_settings_modified_timestamp('set');
        
        // Obtain trial license
        Voice_Shopping_For_Woocommerce_Plugin::wcva_get_trial_license();

        // Get access keys from DB before generating audio responses as access keys will not be available from here.
        Voice_Shopping_For_Woocommerce_Plugin::wcva_get_access_keys_from_db();

        // Get active plugins
        $wcva_all_active_plugins = get_option('active_plugins');

        // Get lower and heigher version active plugin's paths
        $vdn_path = wcva_get_active_plugin_path('voice-dialog-navigation', $wcva_all_active_plugins);
        $dvc_path = wcva_get_active_plugin_path('dynamic-voice-command', $wcva_all_active_plugins);
        $vf_path = wcva_get_active_plugin_path('voice-forms', $wcva_all_active_plugins);
        $vswc_path = wcva_get_active_plugin_path('voice-search-for-woocommerce', $wcva_all_active_plugins);
        $uvs_path = wcva_get_active_plugin_path('universal-voice-search', $wcva_all_active_plugins);

        // Deactivate 'Voice Dialog Navigation' plugin
        if (!empty($vdn_path) && is_plugin_active($vdn_path)) {
            deactivate_plugins($vdn_path);
        }
        
        // Deactivate 'Dynamic Voice Command' plugin
        if (!empty($dvc_path) && is_plugin_active($dvc_path)) {
            deactivate_plugins($dvc_path);
        }

        // Deactivate 'Voice Forms' plugin
        if (!empty($vf_path) && is_plugin_active($vf_path)) {
            deactivate_plugins($vf_path);
        }

        // Deactivate 'Voice Search For WooCommerce' plugin
        if (!empty($vswc_path) && is_plugin_active($vswc_path)) {
            deactivate_plugins($vswc_path);
        }

        // Deactivate 'Universal Voice Search' Plugin
        if (!empty($uvs_path) && is_plugin_active($uvs_path)) {
            deactivate_plugins($uvs_path);
        }

        $wcva_plugin_url = plugin_dir_url(__FILE__);
    });

    /**
     * Function to get path of active plugin
     *
     * @param $wcva_plugin_file_name  String  Name of the plugin file (Without extension)
     * @param $wcva_active_plugins  Array  Array of active plugins path
     *
     * @return $wcva_active_plugin_path  String  Path of active plugin otherwise NULL
     *
     */
    function wcva_get_active_plugin_path($wcva_plugin_file_name = "", $wcva_active_plugins = array()) {
        $wcva_active_plugin_path = null;

        try {
            if (!!$wcva_active_plugins && !!$wcva_plugin_file_name) {
                $wcva_plugin_file_name = trim($wcva_plugin_file_name);

                foreach ($wcva_active_plugins as $key => $active_plugin) {
                    $plugin_name_pos = stripos($active_plugin, $wcva_plugin_file_name.".php");

                    if ($plugin_name_pos !== false) {
                        $wcva_active_plugin_path = $active_plugin;
                        break;
                    }
                }
            }
        } catch(\Exception $ex) {
            $wcva_active_plugin_path = null;
        }
        
        return $wcva_active_plugin_path;
    }
}

unset( $voice_shopping_for_woocommerce_requirements_check );
