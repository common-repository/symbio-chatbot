<?php
    if (!defined('ABSPATH')) {
        exit;
    }
    include(SYMBIO_CHATBOT_FOLDER.'/class-wp-chatbot-trees-list-table.php');
    global $wpdb;
    $tree_table = $wpdb->prefix . 'symbio_chatbot_tree';
    $post_table = $wpdb->prefix . 'posts';
    $bot_table = $wpdb->prefix . 'symbio_chatbot_bot';
    $table = new SybmioChatbot_Trees_List_Table();
    if ($table->current_action() === 'delete' && isset($_POST['tree'])) {
        $table->delete_items(implode(',', sanitize_text_field($_POST['tree'])));
    }
    $bots = $wpdb->get_results("SELECT id FROM $bot_table");
    $trees = $wpdb->get_results("SELECT t.id, t.name, p.post_title AS article, p.ID as article_id, b.id AS bot_id, b.name AS bot, t.system_tree AS system_tree FROM $tree_table t LEFT JOIN $post_table p ON t.article_id = p.ID JOIN $bot_table b ON t.bot_id = b.id");
    $table->set_data($trees);

?>

<div class="wrap">
        <div class="col">
            <ul class="tabs">
                <li><a href="<?php echo admin_url('options-general.php?page=sc-bots-list'); ?>">Chatbots</a></li>
                <li><a class="active" href="#">Trees</a></li>
            </ul>
        </div>
    <section class="chatbot-table">
        <h2>SYMBIO chatbot - trees <?php if (!empty($bots)):?><a href="<?php echo admin_url('options-general.php?page=sc-tree&action=create'); ?>" class="page-title-action">Add New</a> <?php endif;?></h2>
        <table>
            <?php
            $table->prepare_items();
            ?>
            <form method="post">
                <input type="hidden" name="page" value="symbio-chatbot-settings">
                <?php
                $table->search_box('search', 'search_id');
                $table->display();
                echo '</form></div>';
            ?>
        </table>
    </section>
</div>
