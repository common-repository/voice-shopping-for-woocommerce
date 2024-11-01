<?php

class Wcva_Admin_Notices {
    /**
     * Method to generate string of HTML for displaying activation denial notice.
     *
     * @param { $plugin_url - String  } Plugin directory URL
     *
     * @returns HTML as string
     */
    public static function wcva_denied_activation_notice($plugin_url){
        $wcva_check_img = '<img src="'.$plugin_url.'/images/wcva_check.svg" alt="" style="vertical-align:middle;width:55px; height: 18px;"/>';
        $wcva_uncheck_img = '<img src="'.$plugin_url.'/images/wcva_uncheck.svg" alt="" style="vertical-align:middle;width:40px; height: 15px;"/>';

        return '
        <style>
            body{
                max-width: 65%;
            }
            #wcvaDeniedActivationNoticeContainer{
                border: 1px dotted black !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
                padding-bottom: 20px !important;
            }
            #wcvaDeniedActivationNoticeWrapper table {
                font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                border-collapse: collapse !important;
                width: 100% !important;
                color: #444 !important;
            }
            #wcvaDeniedActivationNoticeWrapper table tr th, #wcvaDeniedActivationNoticeWrapper table tr td{
                border: 1px solid #dddddd !important;
                text-align: left !important;
                padding: 8px !important;
                font-size: 13px !important;
                text-align: center !important;
            }
            #wcvaDeniedActivationNoticeWrapper table tr td {
                font-size: 12px !important;
            }
            #wcvaErrorNotice{
                font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                color: #444 !important;
                margin-top: -30px !important;
                font-size: 12px !important;
            }
            #wcvaErrorNotice ul li {
                margin-bottom: 6px !important;
                font-size: 12px !important;
            }
            .wcva-notice-plugin-name-underline{ text-decoration: underline;}
            #wcvaNoticeFeaturesTable .wcva-notice-feature { text-align: left !important; }
            .wcva-notice-table-header{
                background-color: black !important;
                color: white !important;
            }
            .wcva-denied-activation-notice-wrapper {
                overflow-x: auto !important;
                margin-top: -10px !important;
            }
            .wcva-notice_plugins {
                padding: 5px !important;
                padding-left: 10px !important;
                margin-right: 5px !important;
                padding-right: 10px !important;
                border: 1px solid !important;
                color: white !important;
            }
            .wcva-notice-rich-plugin { background-color: #389C11 !important; }
            .wcva-notice-average-plugin{ background-color: #2970ff !important; }
            .wcva-notice-basic-plugin { background-color: #ff704d !important; }
            .wcva-notice-alert {
                padding: 15px !important;
                margin-bottom: 20px !important;
                border: 1px solid transparent !important;
                border-radius: 4px !important;
                color: #a94442 !important;
                background-color: #f2dede !important;
                border-color: #ebccd1 !important;
                margin-top: -25px !important;
                font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                font-size: 13px !important;
            }
            #wcvaHeaderLogo{
                margin-left: -7px;
                vertical-align:middle;
                width:150px;
                height: 55px;
                border-right: 1px solid #000000;
                padding-right:5px;
                margin-right: 5px;
            }
        </style>
        <div id="wcvaDeniedActivationNoticeContainer">
            <div class="wcva-notice-info">
                <p>
                    <img id="wcvaHeaderLogo" src="'.$plugin_url.'/images/speak2web_logo.png" alt="Speak2Web"/> <i>Voice For The Web </i> &#127760;
                </p>
                <br/>
                <div class="wcva-notice-alert">
                    <i><b>Voice Shopping For WooCommerce</b> plugin can not be activated as you are already using higher and feature rich plugin than the one you tried to activate.</i>
                </div>
                <br/>
                <div id="wcvaErrorNotice">
                    <h4><span class="wcva-notice_plugins wcva-notice-rich-plugin">Rich </span>Voice Shopping For WooCommerce</h4>
                    <ul>
                        <li>Adds Voice Shopping to WooCommerce. Allows visitors to engage into an intelligent voice shopping assistant. Visitors can shop using the voice interface on the web page, both on desktop and mobile.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Voice Forms</span> Plugin.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Voice Search For WooCommerce</span> Plugin.</li>
                        <li>Posses all the featurs of  <span class="wcva-notice-plugin-name-underline">Universal Voice Search </span>Plugin.</li>
                    </ul>
                    <h4><span class="wcva-notice_plugins wcva-notice-rich-plugin">Rich </span>Voice Dialog Navigation</h4>
                    <ul>
                        <li>Allows visitors to engage into an intelligent dialog with the web page. Visitor can ask questions, get answers and use voice to navigate the web page, both on desktop and mobile.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Voice Forms</span> Plugin.</li>
                        <li>Posses all the featurs of  <span class="wcva-notice-plugin-name-underline">Universal Voice Search </span>Plugin.</li>
                    </ul>
                    <h4><span class="wcva-notice_plugins wcva-notice-average-plugin">Average </span>Dynamic Voice Command</h4>
                    <ul>
                        <li>Allows visitore to engage into a dynamic configured dialog with the webpage. Visitor can ask question, if the dialog was configured, users get answers and use voice to navigate the web page, both on desktop and mobile. </li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Voice Forms </span>Plugin.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Universal Voice Search </span>Plugin.</li>
                    </ul>
                    <h4><span class="wcva-notice_plugins wcva-notice-average-plugin">Average </span>Voice Forms</h4>
                    <ul>
                        <li>A middle level plugin with ability to add voice to forms and surveys.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Universal Voice Search </span>Plugin.</li>
                    </ul>
                    <h4><span class="wcva-notice_plugins wcva-notice-basic-plugin">Basic </span>Voice Search For WooCommerce</h4>
                    <ul>
                        <li>Ability to perform Voice to Text Transcription and Search WooCommerce Product using Voice.</li>
                        <li>Posses all the features of <span class="wcva-notice-plugin-name-underline">Universal Voice Search </span>Plugin.</li>
                    </ul>
                    <h4><span class="wcva-notice_plugins wcva-notice-basic-plugin">Basic </span>Universal Voice Search </h4>
                    <ul>
                        <li>Ability to perform Voice to Text Transcription.</li>
                    </ul>
                </div>
            </div>

            <br/>

            <div class="wcva-denied-activation-notice-wrapper" id="wcvaDeniedActivationNoticeWrapper" >
                <table id="wcvaNoticeFeaturesTable">
                    <tr class="wcva-notice-table-header">
                        <th rowspan="2" class="wcva-notice-align-weight">Features</th>
                        <th colspan="6" >Plugins</th>
                    </tr>

                    <tr class="wcva-notice-table-header">
                        <th class="wcva-notice-rich-plugin">Voice Shopping For WooCommerce</th>
                        <th class="wcva-notice-rich-plugin">Voice Dialog Navigation</th>
                        <th class="wcva-notice-average-plugin">Dynamic Voice Command</th>
                        <th class="wcva-notice-average-plugin">Voice Forms</th>
                        <th class="wcva-notice-basic-plugin">Voice Search For WooCommerce</th>
                        <th class="wcva-notice-basic-plugin">Uninversal Voice Search</th>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Voice to Text</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Native Search </td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Multi Lanugauge Support </td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Voice Forms</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Chat Bot</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">AI Search</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Search Widget </td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Crafting Your Dialog</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Voice Selection</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Navigation Control</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Google Analytics Log</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Search Hints Configuration</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>
                    
                    <tr>
                        <td class="wcva-notice-feature">ChatBot Customization</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Search WooCommerce Product</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>

                    <tr>
                        <td class="wcva-notice-feature">Add to cart via Voice</td>
                        <td>'.$wcva_check_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                        <td>'.$wcva_uncheck_img.'</td>
                    </tr>
                </table>
            </div>
            <br/>
            <div><a href = "'.admin_url("plugins.php").'">Back</a></div>
        </div> ';
    }
}
