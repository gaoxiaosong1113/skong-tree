/* eslint no-console:0 */
import 'rc-tree/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import cssAnimation from 'css-animation';

const STYLE = `
.collapse {
  overflow: hidden;
  display: block;
}

.collapse-active {
  transition: height 0.3s ease-out;
}
`;

function animate(node, show, done) {
  let height = node.offsetHeight;
  return cssAnimation(node, 'collapse', {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      done();
    },
  });
}

const animation = {
  enter(node, done) {
    return animate(node, true, done);
  },
  leave(node, done) {
    return animate(node, false, done);
  },
  appear(node, done) {
    return animate(node, true, done);
  }
};
class Demo extends React.Component {
  init(e, treeNode) {
    console.log(treeNode)
    console.log(e.target.value)
  }
  render() {
    return (
      <div >
        <h2>expanded</h2>
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
        <Tree
          defaultExpandAll={false}
          defaultExpandedKeys={['p1']}
          openAnimation={animation}
          inits={this.init}
        >
          <TreeNode title="parent 1" inits={this.init} key="p1">
            <TreeNode key="p10" inits={this.init} title="leaf" />
            <TreeNode title="parent 1-1" inits={this.init} key="p11">
              <TreeNode title="parent 2-1" inits={this.init} key="p21">
                <TreeNode title="leaf" inits={this.init} />
                <TreeNode title="leaf" inits={this.init} />
              </TreeNode>
              <TreeNode key="p22" title="leaf" inits={this.init} />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
