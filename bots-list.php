<?php
    if (!defined('ABSPATH')) {
        exit;
    }
    include(SYMBIO_CHATBOT_FOLDER.'/class-wp-chatbot-bots-list-table.php');
    global $wpdb;
    $bot_table = $wpdb->prefix . 'symbio_chatbot_bot';
    $table = new SybmioChatbot_Bots_List_Table();
    if ($table->current_action() === 'delete' && isset($_POST['bot'])) {
        $table->delete_items(implode(',', sanitize_text_field($_POST['bot'])));
    }
    $bots = $wpdb->get_results("SELECT b.id, b.name FROM $bot_table b ORDER BY b.id ASC");
    $table->set_data($bots);

?>
<div class="wrap">
        <div class="col">
            <ul class="tabs">
                <li><a class="active" href="#">Chatbots</a></li>
                <li><a href="<?php echo admin_url('options-general.php?page=sc-trees-list'); ?>">Trees</a></li>
            </ul>
        </div>
        <section class="chatbot-table">
            <h2>SYMBIO chatbot - chatbots <a href="<?php echo admin_url('options-general.php?page=sc-bot&action=create'); ?>" class="page-title-action">Add New</a> </h2>
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
