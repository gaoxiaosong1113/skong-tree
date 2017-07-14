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
  state = {
    data: [
      {
        key: "0-0",
        title: "0-0",
        children: [
          {
            key: "0-0-0",
            title: "0-0-0",
            children: [
              {
                key: "0-0-0-0",
                title: "0-0-0-0"
              }
            ]
          }
        ]
      },
      {
        key: "0-1",
        title: "0-1",
        children: [
          {
            key: "0-1-0",
            title: "0-1-0",
            children: [
              {
                key: "0-1-0-0",
                title: "0-1-0-0"
              }
            ]
          },
          {
            key: "0-2-0",
            title: "0-2-0",
            children: [
              {
                key: "0-2-0-0",
                title: "0-2-0-0"
              }
            ]
          }
        ]
      }
    ]
  }
  init = (e, treeNode) => {
    console.log(treeNode)
    console.log(e.target.value)
    this.datas = this.state.data
    if (treeNode.props.eventKey) {
      this.addArr(this.datas, treeNode.props.eventKey, e.target.value, (calldata) => {
        calldata.title = e.target.value
        calldata.key = e.target.value
      })
    }
  }
  add = (e, treeNode) => {
    this.datas = this.state.data
    if (treeNode.props.eventKey) {
      this.addArr(this.datas, treeNode.props.eventKey, e.target.value, (calldata) => {
        console.log(calldata)
        let obj = {
          title: e.target.value,
          key: e.target.value
        }
        if (calldata.children == undefined) {
          calldata.children = []
        }
        calldata.children.push(obj)
      })
    }
  }

  addArr = (data, key, value, callbank) => {
    console.log(value)
    for (let i = 0; i < data.length; i++) {
      for (let s in data[i]) {
        if (key == data[i][s]) {
          callbank(data[i], data, i)
          break
        }
        if (data[i][s] instanceof Array) {
          this.addArr(data[i][s], key, value, callbank)
        }
      }
    }
    this.setState({ data: this.datas })
  }

  remove = (e, treeNode) => {
    console.log('删除')
    this.datas = this.state.data
    if (treeNode.props.eventKey) {
      this.addArr(this.datas, treeNode.props.eventKey, e.target.value, (calldata, olddata, index) => {
        olddata.splice(index, 1);
      })
    }
  }
  render() {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title} remove={this.remove} add={this.add} inits={this.init}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.key} title={item.title} remove={this.remove} add={this.add} inits={this.init} />;
    });
    return (
      <div >
        <h2>expanded</h2>
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
        <Tree
          className="draggable-tree"
          defaultEditable={true}
        >
          {loop(this.state.data)}
        </Tree>
      </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
