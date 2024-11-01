<?php
if (!defined('ABSPATH')) {
    exit;
}
require_once('class-tinymce-shortcode-dropdown.php');

class Symbio_Chatbot
{
    private static $_instance = null;
    private $tree_table;
    private $node_table;
    private $bot_table;
    private $bot_row_table;
    private $db;
    public $file;
    private $tinymce_handler;


    public function __construct($file = '')
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->file = $file;
        $this->tinymce_handler = new SymbioChatbot_TinyMCE_Shortcode_Dropdown($file);

        $this->tree_table = $this->db->prefix . 'symbio_chatbot_tree';
        $this->node_table = $this->db->prefix . 'symbio_chatbot_node';
        $this->bot_table = $this->db->prefix . 'symbio_chatbot_bot';
        $this->bot_row_table = $this->db->prefix . 'symbio_chatbot_bot_row';

        // Setup database
        register_activation_hook($this->file, array($this, 'install'));

        add_action('admin_menu', [$this, 'setup_menu']);

        // Init plugin
//        add_action('plugins_loaded', [$this, 'init_plugin']);

        // Register rest routes
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Load frontend JS & CSS
        add_action('wp_head', [$this, 'enqueue_styles']);
        add_action('wp_footer', [$this, 'frontend_javascript']);

        // Load admin JS & CSS
        add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);
        add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);

        // TinyMCE plugin for dropdown with chatbot shortcodes
        add_action('admin_init', [$this->tinymce_handler, 'init']);
        add_action('admin_footer', [$this->tinymce_handler, 'get_dropdown_options']);
    }

    public static function instance($file = '')
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($file);
        }
        return self::$_instance;
    }

    public function setup_menu()
    {
        add_options_page('SYMBIO Chatbot Options', 'SYMBIO chatbot', 'manage_options', 'sc-bots-list', [$this, 'bots_list']);
	    add_submenu_page(null, 'SYMBIO chatbot - tree', null, 'manage_options', 'sc-tree', [$this, 'tree_detail']);
	    add_submenu_page(null, 'SYMBIO chatbot - bot', null, 'manage_options', 'sc-bot', [$this, 'bot_detail']);
	    add_submenu_page(null, null, null, 'manage_options', 'sc-tree-save', [$this, 'save_tree']);
	    add_submenu_page(null, null, null, 'manage_options', 'sc-bot-save', [$this, 'save_bot']);
	    add_submenu_page(null, 'SYMBIO chatbot - trees', null, 'manage_options', 'sc-trees-list', [$this, 'trees_list']);
	    add_shortcode('symbio_chatbot', [$this, 'shortcode_handler']);
    }

    public function register_rest_routes()
    {
        require_once(SYMBIO_CHATBOT_FOLDER . '/class-chatbot-rest-nodes-controller.php');
        $nodesController = new SymbioChatbot_Rest_Nodes_Controller();
        $nodesController->register_routes();
    }

    public function enqueue_styles()
    {
        wp_register_style('symbio-chatbot-stylesheet', plugins_url('dist/css/style.css', $this->file));
        wp_enqueue_style('symbio-chatbot-stylesheet');
    }

    public function admin_enqueue_scripts()
    {
        wp_register_script('jscolor-sc-admin', plugins_url('dist/js/jscolor.min.js', $this->file));
        wp_enqueue_script('jscolor-sc-admin');
    }

    public function frontend_javascript()
    {
        echo '<script>window.sessionStorage.setItem("greetings", "0");</script><script type="text/javascript" src="' . plugins_url('dist/js/bot.js', $this->file) . '?v=8"></script>';
    }

    public function bots_list()
    {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        include(SYMBIO_CHATBOT_FOLDER . '/bots-list.php');
    }

    public function trees_list()
    {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        include(SYMBIO_CHATBOT_FOLDER . '/trees-list.php');
    }

    public function init_plugin()
    {
//        add_submenu_page(null, 'SYMBIO chatbot - tree', null, 'manage_options', 'sc-tree', [$this, 'tree_detail']);
//        add_submenu_page(null, 'SYMBIO chatbot - bot', null, 'manage_options', 'sc-bot', [$this, 'bot_detail']);
//        add_submenu_page(null, null, null, 'manage_options', 'sc-tree-save', [$this, 'save_tree']);
//        add_submenu_page(null, null, null, 'manage_options', 'sc-bot-save', [$this, 'save_bot']);
//        add_submenu_page(null, 'SYMBIO chatbot - trees', null, 'manage_options', 'sc-trees-list', [$this, 'trees_list']);
//        add_shortcode('symbio_chatbot', [$this, 'shortcode_handler']);
    }

    public function bot_detail()
    {
        include(SYMBIO_CHATBOT_FOLDER . '/bot.php');
    }

    public function tree_detail()
    {
        include(SYMBIO_CHATBOT_FOLDER . '/tree.php');
    }

    public function save_tree()
    {
        $name = sanitize_text_field($_POST['name']);
        if (!strlen($name)) {
            return wp_redirect(admin_url('options-general.php?page=sc-tree&action=create&error=1'));
        }

        $article = intval($_POST['article']);
        $bot = intval($_POST['bot']);
        $date = date('Y-m-d H:i:s');
        $tree_id = '';

        if (sanitize_text_field($_GET['action']) == 'create') {
            $this->db->insert($this->tree_table, ['name' => $name, 'article_id' => $article, 'bot_id' => $bot, 'created_at' => $date, 'updated_at' => $date]);
            $tree_id = $this->db->insert_id;
            $this->db->insert($this->node_table, ['parent' => null, 'user_content' => '', 'user_action' => 'scroll', 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Hello I am SYMBIO chatbot, what's your name ?", 'bot_action' => 'text']);
        } else {
            $this->db->update($this->tree_table, ['name' => $name, 'article_id' => $article, 'bot_id' => $bot, 'updated_at' => $date], ['id' => intval($_GET['tree_id'])]);
        }
        $id = isset($_GET['tree_id']) && intval($_GET['tree_id']) ? intval($_GET['tree_id']) : $tree_id;

        wp_redirect(sprintf(admin_url('options-general.php?page=sc-tree&tree=%s&action=edit'), $id));
    }

    public function save_bot()
    {
        if (!function_exists('wp_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
        }

        $name = sanitize_text_field($_POST['name']);
        if (!strlen($name)) {
            return wp_redirect(admin_url('options-general.php?page=sc-bot&action=create&error=1'));
        }
        $placeholder = sanitize_text_field($_POST['placeholder']);
        $bot_id = '';
        $data = [
            'name' => $name,
            'placeholder' => $placeholder,
            'bot_bubble_bg' => sanitize_text_field($_POST['bot_bubble_bg']),
            'bot_bubble_fg' => sanitize_text_field($_POST['bot_bubble_fg']),
            'usr_bubble_bg' => sanitize_text_field($_POST['usr_bubble_bg']),
            'usr_bubble_fg' => sanitize_text_field($_POST['usr_bubble_fg']),
            'pos_choice_bg' => sanitize_text_field($_POST['pos_choice_bg']),
            'pos_choice_fg' => sanitize_text_field($_POST['pos_choice_fg']),
            'pos_choice_bc' => sanitize_text_field($_POST['pos_choice_bc']),
            'neg_choice_bg' => sanitize_text_field($_POST['neg_choice_bg']),
            'neg_choice_fg' => sanitize_text_field($_POST['neg_choice_fg']),
            'neg_choice_bc' => sanitize_text_field($_POST['neg_choice_bc'])
        ];

        $uploadedfile = $_FILES['image'];
        if ($uploadedfile) {
            $upload_overrides = array('test_form' => false);
            $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

            if ($movefile && !isset($movefile['error'])) {
                $data['path'] = substr($movefile['url'], strlen(wp_upload_dir()['baseurl']));
            } else {
                echo $movefile['error'];
            }
        }

        if (sanitize_text_field($_GET['action']) == 'create') {
            if (!isset($data['path'])) {
                return wp_redirect(admin_url('options-general.php?page=sc-bot&action=create&error=2'));
            }
            $this->db->insert($this->bot_table, $data);
            $bot_id = $this->db->insert_id;
            $date = date('Y-m-d H:i:s');

            //system tree - greetings - new user
            $this->db->insert($this->tree_table, ['name' => 'Greetings tree - new user - BOT ' . $bot_id, 'bot_id' => $bot_id, 'created_at' => $date, 'updated_at' => $date, 'system_tree' => true]);
            $tree_id = $this->db->insert_id;
            $this->db->insert($this->node_table, ['user_content' => '', 'user_action' => 'scroll', 'parent' => null, 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Hello I am SYMBIO chatbot, what's your name ?", 'bot_action' => 'text']);
            $this->db->insert($this->node_table, ['user_content' => '', 'user_action' => 'text', 'parent' => $node_id, 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Nice to virtually meet you, [:name] !", 'bot_action' => 'variable']);

            //system tree - greetings - existing user
            $this->db->insert($this->tree_table, ['name' => 'Greetings tree - existing user - BOT ' . $bot_id, 'bot_id' => $bot_id, 'created_at' => $date, 'updated_at' => $date, 'system_tree' => true]);
            $tree_id = $this->db->insert_id;
            $this->db->insert($this->node_table, ['user_content' => '', 'user_action' => 'scroll', 'parent' => null, 'tree_id' => $tree_id]);
            $node_id = $parent_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "This is still [:name], right?", 'bot_action' => 'variable']);
            $this->db->insert($this->node_table, ['user_content' => 'Yeah, it\'s me', 'user_action' => 'positive-option', 'parent' => $parent_id, 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Nice, I glad to see you again!", 'bot_action' => 'text']);
            $this->db->insert($this->node_table, ['user_content' => 'Nope, this is someone else', 'user_action' => 'negative-option', 'parent' => $parent_id, 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Great, a new visitor! What's your name?", 'bot_action' => 'text']);
            $this->db->insert($this->node_table, ['user_content' => '', 'user_action' => 'text', 'parent' => $node_id, 'tree_id' => $tree_id]);
            $node_id = $this->db->insert_id;
            $this->db->insert($this->bot_row_table, ['node_id' => $node_id, 'bot_content' => "Nice to virtually meet you, [:name] !", 'bot_action' => 'variable']);

        } else {
            $this->db->update($this->bot_table, $data, ['id' => intval($_GET['bot_id'])]);
        }

        $id = isset($_GET['bot_id']) && intval($_GET['bot_id']) ? intval($_GET['bot_id']) : $bot_id;
        wp_redirect(sprintf(admin_url('options-general.php?page=sc-bot&bot=%s&action=edit'), $id));
    }

    public function shortcode_handler($attrs)
    {
        $tree_id = $attrs['tree'];
        $nodes = $this->db->get_results("SELECT * FROM $this->node_table WHERE tree_id=$tree_id ORDER BY parent,id ASC");
        $base_path = wp_upload_dir()['baseurl'];
        $bot = $this->db->get_row("SELECT b.id, b.name, b.placeholder, CONCAT('$base_path', b.path) AS avatar, b.bot_bubble_bg, b.bot_bubble_fg, b.usr_bubble_bg, b.usr_bubble_fg, b.pos_choice_bg, b.pos_choice_fg, b.pos_choice_bc, b.neg_choice_bg, b.neg_choice_fg, b.neg_choice_bc FROM $this->tree_table t JOIN $this->bot_table b ON t.bot_id = b.id WHERE t.id = $tree_id");

        if ($bot) {
            $system_trees = $this->db->get_results("SELECT * FROM $this->tree_table WHERE system_tree = '1' AND bot_id = $bot->id ORDER BY id ASC");
            foreach ($system_trees as $s_tree) {
                $system_nodes = $this->db->get_results("SELECT * FROM $this->node_table WHERE tree_id=$s_tree->id ORDER BY parent,id ASC");
                foreach ($system_nodes as $s_node) {
                    $s_node->bot_collection = $this->db->get_results("SELECT * FROM $this->bot_row_table WHERE node_id = $s_node->id ORDER BY id");
                    $s_node->children = [];
                }
                $s_nodes = $this->buildTree($system_nodes);
                set_transient('sc_tree_' . $s_tree->id, $s_nodes);
                foreach ($s_nodes[0]->children as $child) {
                    unset($child->children);
                }
                $bot->system_trees[] = $s_nodes[0];
            }
            foreach ($nodes as $node) {
                $bot_rows = $this->db->get_results("SELECT * FROM $this->bot_row_table WHERE node_id = $node->id ORDER BY id");
                $node->bot_collection = $bot_rows;
                $node->children = [];
            }

            $nodes = $this->buildTree($nodes);
            wp_cache_set('sc_tree_' . $tree_id, $nodes);
            foreach ($nodes[0]->children as $child) {
                unset($child->children);
            }
            $tree = $nodes[0];
            if ($tree) {
                return "<script type='text/javascript'>document.write('<div id=\"app" . $attrs['tree'] . "\" class=\"chatbot-container\"></div>'); document.addEventListener(\"DOMContentLoaded\", function() { initChatbot('#app" . $attrs['tree'] . "', " . json_encode($tree) . ", " . json_encode($bot) . ", '" . plugins_url('dist', __FILE__) . "', '" . rest_url('symbio-chatbot/v1/tree-nodes/') . "'); });</script>";
            }
        }
    }

    public function buildTree(array $elements, $parentId = 0)
    {
        $branch = [];

        foreach ($elements as $element) {
            if ($element->parent == $parentId) {
                $children = $this->buildTree($elements, $element->id);
                if ($children) {
                    $element->children = $children;
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    public function install()
    {
        $charset_collate = $this->db->get_charset_collate();
        $post_table = $this->db->prefix . 'posts';
        $sql = "
            CREATE TABLE $this->bot_table (
              id INT NOT NULL AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL DEFAULT '',
              placeholder VARCHAR(255),
              path VARCHAR(255),
              bot_bubble_bg VARCHAR(20),
              bot_bubble_fg VARCHAR(20),
              usr_bubble_bg VARCHAR(20),
              usr_bubble_fg VARCHAR(20),
              pos_choice_bg VARCHAR(20),
              pos_choice_fg VARCHAR(20),
              pos_choice_bc VARCHAR(20),
              neg_choice_bg VARCHAR(20),
              neg_choice_fg VARCHAR(20),
              neg_choice_bc VARCHAR(20),
              PRIMARY KEY (id)
            ) $charset_collate;
            CREATE TABLE $this->tree_table (
              id INT NOT NULL AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL,
              article_id BIGINT(20) UNSIGNED,
              bot_id INT NOT NULL,
              created_at DATETIME NOT NULL,
              updated_at DATETIME NOT NULL,
              system_tree TINYINT(4) NOT NULL,
              PRIMARY KEY (id)
            ) $charset_collate;
            CREATE TABLE $this->node_table (
              id INT NOT NULL AUTO_INCREMENT,
              parent INT DEFAULT NULL,
              user_content VARCHAR(500) NOT NULL DEFAULT '',
              user_action  VARCHAR(20) NOT NULL DEFAULT '',
              tree_id INT NOT NULL,
              PRIMARY KEY (id)
            )  $charset_collate;
            
            CREATE TABLE $this->bot_row_table (
              id INT NOT NULL AUTO_INCREMENT,
              node_id INT NOT NULL,
              bot_content VARCHAR(500) NOT NULL DEFAULT '',
              bot_action VARCHAR (50) NOT NULL DEFAULT '',
              PRIMARY KEY (id)
            ) $charset_collate;
        ";

        $alter = "
            ALTER TABLE $this->tree_table
            ADD KEY article_id_idx (article_id),
            ADD KEY bot_idx (bot_id),
            ADD CONSTRAINT article_id_fk FOREIGN KEY (article_id) REFERENCES $post_table (ID) ON DELETE CASCADE ON UPDATE CASCADE,
            ADD CONSTRAINT bot_id_fk FOREIGN KEY (bot_id) REFERENCES $this->bot_table (id) ON DELETE CASCADE ON UPDATE CASCADE;";

        $alter2 = "
            ALTER TABLE $this->node_table ADD KEY tree_idx (tree_id),
            ADD KEY parent_idx (parent),
            ADD CONSTRAINT parent_id_fk FOREIGN KEY (parent) REFERENCES $this->node_table (id) ON DELETE CASCADE ON UPDATE CASCADE,
            ADD CONSTRAINT tree_id_fk FOREIGN KEY (tree_id) REFERENCES $this->tree_table (id) ON DELETE CASCADE ON UPDATE CASCADE;";

        $alter3 = "
            ALTER TABLE $this->bot_row_table
            ADD KEY node_idx (`node_id`),  
            ADD CONSTRAINT node_id_fk
            FOREIGN KEY (`node_id`) REFERENCES $this->bot_row_table (`id`) ON DELETE CASCADE ON UPDATE CASCADE;";


        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        global $wpdb;
        $wpdb->query($alter);
        $wpdb->query($alter2);
        $wpdb->query($alter3);
    }
}
