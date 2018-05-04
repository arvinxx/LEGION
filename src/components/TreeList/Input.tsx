import React, { Component } from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import { connect } from 'dva';

import styles from './Input.less';
const { TextArea } = Input;
interface InputCellProps {
  _id: string;
  text: string;
  dispatch: any;
}

export default class InputCell extends Component<InputCellProps> {
  state = {
    tempText: '',
    isFocus: false,
  };

  /**
   * 获取得到 TextChange 函数 并根据 id 修改内容
   */
  onChange = (e, id) => {
    const text = e.target.value;
    console.log(text);
    this.props.dispatch({
      type: 'interview/changeRecordText',
      payload: { id, newText: e.target.value },
    });
  };

  /**
   * 按下键后的处理行为
   */
  onKeyDown = (e) => {
    const { onTabChange, _id, onDelete, onDirectionChange } = this.props;

    const { keyCode, shiftKey } = e;
    // console.log(`${id} onKeyDown`,e, target, key, keyCode, shiftKey, ctrlKey, altKey)
    if (keyCode === 9 && shiftKey) {
      // console.log("shift +  Tab clicked!")
      if (onTabChange) {
        onTabChange(_id, true);
        e.preventDefault();
      }
    }
    if (keyCode === 9 && !shiftKey) {
      // console.log("Tab clicked!")
      if (onTabChange) {
        onTabChange(_id, false);
        e.preventDefault();
      }
    }
    if (keyCode === 8 && _.isEmpty(this.props.text)) {
      // console.log("Backspace clicked");
      if (onDelete) {
        onDelete(_id);
        e.preventDefault();
      }
    }
    if (keyCode >= 37 && keyCode <= 40 && onDirectionChange) {
      const temp = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
      };
      onDirectionChange(_id, temp[keyCode.toString()]);
    }
  };

  // onBlur = (e) => {
  //   console.log(e);
  // };
  onFocus = (e) => {
    console.log(e);
  };
  // onPressEnter = (e) => {
  //   console.log(e);
  // };

  render() {
    const { text, _id } = this.props;
    return (
      <div className={styles.item}>
        <TextArea
          key={'textArea' + _id}
          ref="input" //eslint-disable-line
          className={styles.input}
          value={text}
          onChange={(e) => this.onChange(e, _id)}
          //onKeyDown={this.onKeyDown}
          // autoFocus={id === focusId}
          autosize
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onPressEnter={this.onPressEnter}
        />
      </div>
    );
  }
}
