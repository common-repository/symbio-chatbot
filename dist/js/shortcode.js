jQuery(document).ready(function($) {

    tinymce.create('tinymce.plugins.symbio_plugin', {
        init : function(ed, url) {
            if (typeof dropdown_options !== 'undefined' && dropdown_options !== undefined && dropdown_options.length > 0) {
                ed.addButton( 'symbio_button', {
                    type: 'listbox',
                    text: 'Chatbot trees',
                    icon: false,
                    onselect: function(e) {
                        content =  '[symbio_chatbot tree="' + e.target.value() + '" name="' + e.target.text() + '"]';
                        tinymce.execCommand('mceInsertContent', false, content);
                    },
                    values: dropdown_options
                });
            }
        }
    });

    tinymce.PluginManager.add('symbio_button', tinymce.plugins.symbio_plugin);
});