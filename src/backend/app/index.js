import React from 'react';
import { render } from 'react-dom';

import _globalStyles from '_utils/global-styles';
import Tree from 'containers/Tree/Tree';

render(<Tree
        treeId={window.chatbotConfig.treeId}
        handleNodeUrl={window.chatbotConfig.handleNodeUrl}
        fetchNodesUrl={window.chatbotConfig.fetchNodesUrl}
        isSystemTree={window.chatbotConfig.isSystemTree}
        />, document.getElementById('app'));
