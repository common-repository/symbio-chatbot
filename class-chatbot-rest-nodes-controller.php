<?php
if (!defined('ABSPATH')) {
	exit;
}

class SymbioChatbot_Rest_Nodes_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        global $wpdb;
        $this->namespace     = '/symbio-chatbot/v1';
        $this->resource_name = 'nodes';
        $this->tree_resource_name = 'tree-nodes';
        $this->node_table = $wpdb->prefix . 'symbio_chatbot_node';
        $this->bot_table = $wpdb->prefix . 'symbio_chatbot_bot_row';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->tree_resource_name .'/(?P<id>[\d]+)', [
            [
                'methods'   => 'GET',
                'callback'  => [ $this, 'get_items' ]
            ]
        ]);

        register_rest_route($this->namespace, '/' . $this->tree_resource_name .'/(?P<id>[\d]+)/(?P<node_id>[\d]+)', [
            [
                'methods'   => 'GET',
                'callback'  => [ $this, 'get_item' ]
            ]
        ]);

        register_rest_route( $this->namespace, '/' . $this->resource_name, [
            [
                'methods'   => 'POST',
                'callback'  => [ $this, 'create_item' ]
            ]
        ]);


        register_rest_route($this->namespace, '/' . $this->resource_name .'/(?P<id>[\d]+)', [
            [
                'methods'   => 'POST',
                'callback'  => [ $this, 'update_item' ]
            ],
            [
                'methods'   => 'DELETE',
                'callback'  => [ $this, 'delete_item' ]
            ]
        ]);
    }

    /**
     * Check permissions.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items_permissions_check( $request ) {
        /*        if ( ! current_user_can( 'read' ) ) {
                    return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
                }*/
        return true;
    }

    /**
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items( $request ) {
        global $wpdb;
        $tree_id = $request->get_param('id');
        $nodes = $wpdb->get_results("SELECT * FROM $this->node_table WHERE tree_id=$tree_id ORDER BY parent,id ASC");
        foreach ($nodes as $node) {
            $bot_rows = $wpdb->get_results("SELECT * FROM $this->bot_table WHERE node_id = $node->id ORDER BY id");
            $node->bot_collection = $bot_rows;
            $node->children = [];
        }

        return rest_ensure_response( $this->buildTree($nodes, null)[0] );
    }

    public function get_item( $request ) {
        global $wpdb;
        $tree_id = intval($request['id']);
        $id = intval($request['node_id']);
        $nodes = [];
        $tree = get_transient('sc_tree_' . $tree_id) ? get_transient('sc_tree_' . $tree_id) : null;

        if ($tree) {
            $nodes = $this->find_node($tree[0], $id);
        }

        if (!$nodes) {
            $node = $wpdb->get_row("SELECT * FROM $this->node_table WHERE id=$id");
            $bot_rows = $wpdb->get_results("SELECT * FROM $this->bot_table WHERE node_id = $node->id ORDER BY id");
            $node->bot_collection = $bot_rows;
            $node->children = [];
            $nodes = $wpdb->get_results("SELECT * FROM $this->node_table WHERE parent=$id ORDER BY parent,id ASC");
            $nodes[] = $node;
            $nodes = $this->buildTree($nodes, $node->parent)[0];
        }

        if ( empty( $nodes ) ) {
            return rest_ensure_response( array() );
        } else {
            return rest_ensure_response( $nodes );
        }
    }

    public function create_item( $request ) {
        global $wpdb;
        $node = json_decode($request->get_body());
        $wpdb->insert($this->node_table, ['user_content' => $node->user_content, 'user_action' => $node->user_action, 'parent' => $node->parent, 'tree_id' => $node->tree_id]);
        $nid = $wpdb->insert_id;
        $ids = [];
        foreach ($node->bot_collection as $item) {
            $wpdb->insert($this->bot_table, ['bot_content' => $item->bot_content, 'bot_action' => $item->bot_action, 'node_id' => $nid]);
            $ids[] = $wpdb->insert_id;
        }
        $this->delete_cache($node->tree_id);

        return rest_ensure_response( ['nid' => $nid, 'bots' => $ids] );
    }

    public function update_item( $request ) {
        global $wpdb;
        $node = json_decode($request->get_body());
        $wpdb->update($this->node_table, ['user_content' => $node->user_content, 'user_action' => $node->user_action], ['id' => $node->id]);
        $ids = [];

        foreach ($node->bot_collection as $item) {
            if ($item->id) {
                $wpdb->update($this->bot_table, ['bot_content' => $item->bot_content, 'bot_action' => $item->bot_action], ['id' => $item->id]);
                $ids[] = $item->id;
            } else {
                $wpdb->insert($this->bot_table, ['bot_content' => $item->bot_content, 'bot_action' => $item->bot_action, 'node_id' => $node->id]);
                $ids[] = $wpdb->insert_id;
            }
        }

        $bots_q = $wpdb->get_results("SELECT id FROM $this->bot_table WHERE node_id = $node->id");
        $db_bots = [];
        foreach ($bots_q as $b) {
            $db_bots[] = $b->id;
        }

        $diff = array_diff($db_bots, $ids);
        if ($diff) {
            $diff = implode(',', $diff);
            $wpdb->query("DELETE FROM $this->bot_table WHERE id IN ($diff)");
        }

        $this->delete_cache($node->tree_id);

        return rest_ensure_response( ['bots' => $ids] );
    }

    public function delete_item( $request ) {
        global $wpdb;
        $id = $request->get_param('id');
        $parent_node = $wpdb->get_row("SELECT parent, tree_id FROM $this->node_table WHERE id=$id");
        $parent = $parent_node->parent;
        $wpdb->update($this->node_table, ['parent' => $parent], ['parent' => $id]);
        $wpdb->delete($this->node_table, ['id' => $id]);

        $this->delete_cache($parent_node->tree_id);
    }

    function buildTree(array $elements, $parentId = 0) {
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

    function find_node($tree, $id)
    {
        if ($tree->id == $id) {
            foreach ($tree->children as $child) {
                unset($child->children);
            }
            return $tree;
        }
        foreach ($tree->children as $node) {
            $found = $this->find_node($node, $id);
            if ($found) {
                foreach ($found->children as $child) {
                    unset($child->children);
                }
                return $found;
            }
        }
    }

    public function delete_cache($tree_id) {
        delete_transient('sc_tree_' . $tree_id);
    }


    // Sets up the proper HTTP status code for authorization.
    public function authorization_status_code() {
        $status = 401;

        if ( is_user_logged_in() ) {
            $status = 403;
        }

        return $status;
    }
}