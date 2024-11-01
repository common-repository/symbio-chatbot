<?php
    if (!defined('ABSPATH')) {
        exit;
    }
    global $wpdb;
    $post_table = $wpdb->prefix . 'posts';
    $bot_table = $wpdb->prefix . 'symbio_chatbot_bot';
    $articles = $wpdb->get_results("SELECT post_title AS label, ID AS value FROM $post_table WHERE post_type = 'post'");
    $bots = $wpdb->get_results("SELECT name AS label, id AS value FROM $bot_table ORDER BY id ASC");
    $table = $wpdb->prefix . 'symbio_chatbot_tree';
    $tree = null;
    $tree_id = isset($_GET['tree']) ? intval($_GET['tree']) : '';
    $action = sanitize_text_field($_GET['action']) == 'edit' ? 'edit' : 'create';
    if ($tree_id) {
        $tree = $wpdb->get_row("SELECT * FROM $table WHERE id = $tree_id");
    }
?>

<div class="wrap">
    <a href="<?php echo admin_url('options-general.php?page=sc-trees-list'); ?>" class="page-title-action">Back to the list</a>
    <div class="tree-form">
        <h1 class="tree-heading"><?php if ($tree):?>Edit tree with "id" <?php echo $tree_id; ?><?php else: ?> Create your new tree<?php endif; ?></h1>
        <form method="post" action="<?php echo sprintf(admin_url('options-general.php?page=sc-tree-save&action=%s&tree_id=%s'), $action, $tree_id);?>">
            <div class="tree-row">
                <label class="tree-form-label <?php if (isset($_GET['error']) && sanitize_text_field($_GET['error'])):?>chatbot-form-err<?php endif;?>" for="name">
                    <span class="tree-label-field">Name:</span>
                    <input type="text" name="name" size="40px" <?php if ($tree): ?>value="<?php echo $tree->name; ?>"<?php endif;?>>
                </label>
            </div>
            <div class="tree-row">
                <label class="tree-form-label" for="bot">
                    <span class="tree-label-field">Bot:</span>
                    <select name="bot" id="bot_id">
                        <?php foreach ($bots as $bot): ?>
                            <option <?php if ($tree && $bot->value == $tree->bot_id):?>selected <?php endif; ?> value="<?php echo $bot->value ?>"><?php echo $bot->label; ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>
            </div>
            <?php if (!$tree || ($tree && !$tree->system_tree)): ?>
                <div class="tree-row">
                    <label class="tree-form-label" for="article">
                        <span class="tree-label-field">Article:</span>
                        <select name="article" id="article_id">
                            <?php foreach ($articles as $article): ?>
                                <option <?php if ($tree && $article->value == $tree->article_id):?>selected <?php endif; ?> value="<?php echo $article->value ?>"><?php echo $article->label; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </label>
                </div>
            <?php endif; ?>
            <div class="tree-row">
                <input type="submit" class="button button-primary button-large">
            </div>
        </form>
        <?php if (sanitize_text_field($_GET['action']) == 'edit'): ?>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
            <h1 class="tree-heading">Create your tree structure</h1>
            <div id="app"></div>
            <script>
                window.chatbotConfig = {
                    fetchNodesUrl: "<?php echo rest_url('symbio-chatbot/v1/tree-nodes/');?>",
                    handleNodeUrl: "<?php echo rest_url('symbio-chatbot/v1/nodes/');?>",
                    treeId: <?php echo $tree_id ?>,
                    isSystemTree: <?php echo $tree->system_tree ?>,
                }
            </script>
            <script src="<?php echo plugins_url( 'dist/js/main.js', __FILE__ );?>"></script>
        <?php endif; ?>
    </div>
</div>
