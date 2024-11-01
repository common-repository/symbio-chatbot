<?php
if (!defined('ABSPATH')) {
	exit;
}

class SymbioChatbot_TinyMCE_Shortcode_Dropdown {
    public $file;

    public function __construct ( $file = '')
    {
        $this->file = $file;
    }

    public function init()
    {
        //Abort early if the user will never see TinyMCE
        if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') && get_user_option('rich_editing') == 'true') {
            return;
        }

        //Add a callback to register our tinymce plugin
        add_filter('mce_external_plugins', [$this, 'register_tinymce_plugin']);

        // Add a callback to add our button to the TinyMCE toolbar
        add_filter('mce_buttons', [$this, 'add_tinymce_button']);
    }

    public function register_tinymce_plugin()
    {
        $plugin_array['symbio_button'] =  plugins_url('dist/js/shortcode.js?v=2', $this->file );
        return $plugin_array;
    }

    public function add_tinymce_button($buttons)
    {
        //Add the button ID to the $button array
        $buttons[] = "symbio_button";
        return $buttons;
    }

    public function get_dropdown_options()
    {
        if (isset($_GET['post'])) {
            global $wpdb;
            $table_name = $wpdb->prefix . 'symbio_chatbot_tree';
            $post_id = intval($_GET['post']);
            $trees = $wpdb->get_results("SELECT id, name FROM $table_name WHERE article_id = $post_id AND system_tree = '0'");

            echo '<script type="text/javascript">
                var dropdown_options = [];';

            $i = 0;
            foreach ($trees as $tree) {
                echo "dropdown_options[{$i}] = {text: '{$tree->name}', value: '{$tree->id}'};";
                $i++;
            }

            echo '</script>';
        }
    }
}