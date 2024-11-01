<?php
if (!defined('ABSPATH')) {
	exit;
}
global $wpdb;
$table      = $wpdb->prefix . 'symbio_chatbot_bot';
$tree_table = $wpdb->prefix . 'symbio_chatbot_tree';
$bot        = null;
$bot_id     = isset( $_GET['bot'] ) ? intval($_GET['bot']) : '';
$action     = sanitize_text_field($_GET['action']) == 'edit' ? 'edit' : 'create';
if ( $bot_id ) {
	$bot = $wpdb->get_row( "SELECT * FROM $table WHERE id = $bot_id" );
}
$system_trees = $bot_id ? $wpdb->get_results( "SELECT id, name FROM $tree_table WHERE system_tree = '1' AND bot_id = $bot_id" ) : [];
?>

<div class="wrap">
    <a href="<?php echo admin_url( 'options-general.php?page=sc-bots-list' ); ?>" class="page-title-action">Back to the
        list</a>
    <div class="tree-form">
        <h1 class="tree-heading"><?php if ( $bot ): ?>Edit bot with "id" <?php echo $bot_id; ?><?php else: ?> Create your new bot<?php endif; ?></h1>
        <form method="post"
              action="<?php echo sprintf( admin_url( 'options-general.php?page=sc-bot-save&action=%s&bot_id=%s' ), $action, $bot_id ); ?>"
              enctype="multipart/form-data">
            <div class="tree-row">
                <label class="tree-form-label <?php if ( isset( $_GET['error'] ) && intval($_GET['error']) == 1 ): ?>chatbot-form-err<?php endif; ?>"
                       for="name">
                    <span class="tree-label-field">Name:</span>
                    <input type="text" name="name" size="40px"
					       <?php if ( $bot ): ?>value="<?php echo $bot->name; ?>"<?php endif; ?>>
                </label>
            </div>
            <div class="tree-row">
                <label class="tree-form-label" for="placeholder">
                    <span class="tree-label-field">Name Input Placeholder:</span>
                    <input type="text" name="placeholder" size="40px"
					       <?php if ( $bot ): ?>value="<?php echo $bot->placeholder; ?>"<?php endif; ?>>
                </label>
            </div>
            <div class="tree-row">
                <label class="tree-form-label <?php if ( isset( $_GET['error'] ) && intval($_GET['error']) == 2 ): ?>chatbot-form-err<?php endif; ?>"
                       for="image">
                    <span class="tree-label-field">Image:</span>
					<?php if ( $bot ): ?>
                        <img src="<?php echo wp_upload_dir()['baseurl'] . $bot->path ?>" width="100px" height="100px"/>
					<?php endif; ?>
                    <input type='file' name='image'>
                </label>
            </div>
            <div class="tree-row-multiple-col">
                <label class="tree-form-label-multiple" for="bot_bubble_bg">
                    <span class="tree-label-field">Bot bubble background:</span>
                    <input class="jscolor" name="bot_bubble_bg"
                           value="<?php echo $bot ? $bot->bot_bubble_bg : '333'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="bot_bubble_fg">
                    <span class="tree-label-field">Bot bubble foreground:</span>
                    <input class="jscolor" name="bot_bubble_fg"
                           value="<?php echo $bot ? $bot->bot_bubble_fg : 'fff'; ?>">
                </label>
            </div>
            <div class="tree-row-multiple-col">
                <label class="tree-form-label-multiple" for="usr_bubble_bg">
                    <span class="tree-label-field">User bubble background:</span>
                    <input class="jscolor" name="usr_bubble_bg"
                           value="<?php echo $bot ? $bot->usr_bubble_bg : 'ff6600'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="usr_bubble_fg">
                    <span class="tree-label-field">User bubble foreground:</span>
                    <input class="jscolor" name="usr_bubble_fg"
                           value="<?php echo $bot ? $bot->usr_bubble_fg : 'fff'; ?>">
                </label>
            </div>
            <div class="tree-row-multiple-col">
                <label class="tree-form-label-multiple" for="pos_choice_bg">
                    <span class="tree-label-field">Positive User Choice - background:</span>
                    <input class="jscolor" name="pos_choice_bg"
                           value="<?php echo $bot ? $bot->pos_choice_bg : 'ff6600'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="pos_choice_fg">
                    <span class="tree-label-field">Positive User Choice - foreground:</span>
                    <input class="jscolor" name="pos_choice_fg"
                           value="<?php echo $bot ? $bot->pos_choice_fg : 'fff'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="pos_choice_bc">
                    <span class="tree-label-field">Positive User Choice - border:</span>
                    <input class="jscolor" name="pos_choice_bc"
                           value="<?php echo $bot ? $bot->pos_choice_bc : 'ff6600'; ?>">
                </label>
            </div>
            <div class="tree-row-multiple-col">
                <label class="tree-form-label-multiple" for="neg_choice_bg">
                    <span class="tree-label-field">Negative User Choice - background:</span>
                    <input class="jscolor" name="neg_choice_bg"
                           value="<?php echo $bot ? $bot->neg_choice_bg : 'f4f4f4'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="neg_choice_fg">
                    <span class="tree-label-field">Negative User Choice - foreground:</span>
                    <input class="jscolor" name="neg_choice_fg"
                           value="<?php echo $bot ? $bot->neg_choice_fg : '333'; ?>">
                </label>
                <label class="tree-form-label-multiple" for="neg_choice_bc">
                    <span class="tree-label-field">Negative User Choice - border:</span>
                    <input class="jscolor" name="neg_choice_bc"
                           value="<?php echo $bot ? $bot->neg_choice_bc : '333'; ?>">
                </label>
            </div>
            <div class="tree-row">
                <input type="submit" class="button button-primary button-large">
            </div>
            <h1 class="tree-heading">System trees</h1>
			<?php foreach ( $system_trees as $tree ): ?>
                <div class="tree-row">
                    <a href="<?php echo admin_url( 'options-general.php?page=sc-tree&tree=' . $tree->id . '&action=edit' ) ?>"><?php echo $tree->name; ?></a>
                </div>
			<?php endforeach; ?>
        </form>
    </div>
</div>
