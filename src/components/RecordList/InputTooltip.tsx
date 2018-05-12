import React, { Component } from 'react';
import { Popover, Input, Popconfirm, Icon } from 'antd';
import { TTag } from 'models/interview';
import styles from './InputTooltip.less';

export default class InputTooltip extends Component {
  changeTagText = (e, id) => {
    console.log(e.target.value);
    this.props.dispatch({
      type: 'interview/changeTagText',
      payload: { id, newText: e.target.value },
    });
  };
  deleteTag = (id, editor) => {
    const { dispatch, tags } = this.props;
    dispatch({
      type: 'interview/deleteTag',
      payload: id,
    });
    if (tags.length <= 1) {
      editor.change((change) => change.removeMark(''));
      console.log('取消下划线');
    }
  };
  render() {
    const { children, attributes, editor, node, id, tags } = this.props;
    const { id } = this.props;
    const { tags } = this.state;
    console.log(node);
    return (
      <Popover
        overlayClassName={styles['tag-pop']}
        // trigger="click"
        getPopupContainer={() => document.getElementById('tooltip') || document.body}
        // visible={true}
        content={tags.map((tag: TTag) => {
          const { id: tid, refId, text } = tag;
          if (refId === id) {
            // 如果标签组属于该行
            return (
              <div key={tid + 'tag-container'} className={styles['tag-container']}>
                <div key={tid + 'input-container'} className={styles['input-container']}>
                  <Input
                    className={styles.tag}
                    onChange={(e) => this.changeTagText(e, tid)}
                    value={text}
                  />
                  <Popconfirm
                    key={'ppp'}
                    title="确认要删除吗?"
                    onConfirm={() => this.deleteTag(tid, editor)}
                    okText="是"
                    cancelText="否"
                  >
                    <Icon key={'close'} type="close" className={styles['value-delete']} />
                  </Popconfirm>
                </div>
              </div>
            );
          }
        })}
      >
        <span className={styles.underlines} {...attributes}>
          {children}
        </span>
      </Popover>
    );
  }
}
