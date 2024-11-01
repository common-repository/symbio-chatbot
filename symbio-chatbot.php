<?php
/*
Plugin Name: SYMBIO chatbot
Plugin URI:  https://developer.wordpress.org/plugins/the-basics/
Description: Basic WordPress Plugin Header Comment
Version:     20170607
Author:      SYMBIO Digital s.r.o.
Author URI:  https://symbio.agency/
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: wporg
Domain Path: /languages
*/
define( 'SYMBIO_CHATBOT_PATH', __FILE__ );
define( 'SYMBIO_CHATBOT_FOLDER', untrailingslashit( dirname( SYMBIO_CHATBOT_PATH ) ) );

require_once SYMBIO_CHATBOT_FOLDER.'/class-symbio-chatbot.php';

function Symbio_Chatbot() {
    $instance = Symbio_Chatbot::instance( __FILE__);
    return $instance;
}

Symbio_Chatbot();

?>