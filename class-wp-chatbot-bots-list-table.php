<?php
if (!defined('ABSPATH')) {
	exit;
}

class SybmioChatbot_Bots_List_Table extends WP_List_Table {
    private $data;

    function __construct($data = []){
        global $status, $page;
        $this->data = json_decode(json_encode($data), true);
        parent::__construct( array(
            'singular'  => __( 'bot', 'botslisttable' ),     //singular name of the listed records
            'plural'    => __( 'bots', 'botslisttable' ),   //plural name of the listed records
            'ajax'      => false        //does this table support ajax?
        ) );
        add_action( 'admin_head', array( &$this, 'admin_header' ) );
    }

    function set_data($data) {
        $this->data = json_decode(json_encode($data), true);
    }

    function admin_header() {
        $page = ( isset($_GET['page'] ) ) ? esc_attr( $_GET['page'] ) : false;
        if( 'my_list_test' != $page )
            return;
        echo '<style type="text/css">';
        echo '.wp-list-table .column-id { width: 5%; }';
        echo '.wp-list-table .column-name { width: 20%; }';
        echo '</style>';
    }

    function no_items() {
        _e( 'No bots found.' );
    }

    function column_default( $item, $column_name ) {
        switch( $column_name ) {
            case 'id':
            case 'name':
                return $item[ $column_name ];
            default:
                return print_r( $item, true ) ;
        }
    }

    function get_sortable_columns() {
        $sortable_columns = array(
            'id'  => array('id',false),
            'name' => array('name',false)
        );
        return $sortable_columns;
    }

    function get_columns(){
        $columns = array(
            'cb'        => '<input type="checkbox" />',
            'id'        => __( 'ID', 'treeslisttable' ),
            'name'      => __( 'Name', 'treeslisttable' )
        );
        return $columns;
    }

    function usort_reorder( $a, $b ) {
        // If no sort, default to title
        $orderby = ( ! empty( $_GET['orderby'] ) ) ? sanitize_text_field($_GET['orderby']) : 'id';
        // If no order, default to asc
        $order = ( ! empty($_GET['order'] ) ) ? sanitize_text_field($_GET['order']) : 'asc';
        // Determine sort order
        $result = strcmp( $a[$orderby], $b[$orderby] );
        // Send final sort direction to usort
        return ( $order === 'asc' ) ? $result : -$result;
    }

    function get_bulk_actions() {
        $actions = array(
            'delete'    => 'Delete'
        );
        return $actions;
    }

    function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="bot[]" value="%s" />', $item['id']
        );
    }

    function column_name($item) {
        $actions = array(
            'edit'      => sprintf("<a href='" . admin_url('options-general.php?page=sc-bot&bot=%s&action=edit') . "'>Edit</a>", $item['id']),
        );

        return sprintf('%1$s %2$s', $item['name'], $this->row_actions($actions) );
    }

    function prepare_items() {
        $columns  = $this->get_columns();
        $hidden   = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array( $columns, $hidden, $sortable );
        usort( $this->data, array( &$this, 'usort_reorder' ) );
        $search = ( isset( $_REQUEST['s'] ) ) ? $_REQUEST['s'] : '';

        if ($search) {
            $data = array_filter($this->data, function($item) use ($search) {
               return strpos($item['name'], $search) !== false;
            });
        } else {
            $data = $this->data;
        }
        $per_page = 10;
        $current_page = $this->get_pagenum();
        $total_items = count( $this->data);
        // only ncessary because we have sample data
        $found_data = array_slice( $data,( $current_page-1 )* $per_page, $per_page );

        $this->set_pagination_args( array(
            'total_items' => $total_items,                  //WE have to calculate the total number of items
            'per_page'    => $per_page                     //WE have to determine how many items to show on a page
        ) );
        $this->items = $found_data;
    }

    function delete_items($data) {
        global $wpdb;
        $bot_table = $wpdb->prefix . 'symbio_chatbot_bot';
        $wpdb->query("DELETE FROM $bot_table WHERE id IN ($data)");
    }
}
