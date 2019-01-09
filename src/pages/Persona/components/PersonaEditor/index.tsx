import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import { DispatchProp } from 'react-redux';
import { females, males } from '@/assets/photos';

import styles from './index.less';
import DraggableBlock from './DraggableBlock';
import PhotoModal from './PhotoModal';
import { MiniProgress } from '@/components';

import { IBasicInfo, TDimGroups } from '@/models/persona';
import { IQuesRecord, TQuesData } from '@/models/data';

const { TextArea } = Input;

interface IPersonaEditorProps {
  persona: IBasicInfo;
  dimGroups: TDimGroups;
  index: number;
  showText: boolean;
}

export default class PersonaEditor extends Component<IPersonaEditorProps & DispatchProp> {
  state = {
    modalVisible: false,
    imgIndex: Math.floor(Math.random() * 4),
  };
  changePhoto = (length) => {
    const { imgIndex } = this.state;
    let nextImgIndex = Math.floor(Math.random() * length);
    while (nextImgIndex === imgIndex) {
      nextImgIndex = Math.floor(Math.random() * length);
    }
    this.setState({ imgIndex: nextImgIndex });
  };
  customPhoto = () => {
    this.setState({ modalVisible: true });
  };
  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible: modalVisible });
  };
  changeBios = (e, index) => {
    this.props.dispatch({
      type: 'persona/handleBios',
      payload: { text: e.target.value, index },
    });
  };
  changeCareer = (e, index) => {
    this.props.dispatch({
      type: 'persona/handleCareer',
      payload: { text: e.target.value, index },
    });
  };
  changeName = (e, index) => {
    this.props.dispatch({
      type: 'persona/handleName',
      payload: { text: e.target.value, index },
    });
  };
  changeKeywords = (e, index) => {
    this.props.dispatch({
      type: 'persona/handleKeywords',
      payload: { text: e.target.value, index },
    });
  };
  changeItemText = (e, index, dimIndex, itemIndex) => {
    this.props.dispatch({
      type: 'persona/handleDimText',
      payload: {text: e.target.value, index, dimIndex, itemIndex},
    });
  };

  render() {
    const { dispatch, persona, dimGroups, index, showText } = this.props;
    const { modalVisible, imgIndex } = this.state;
    const { keywords, name, photo, bios, career, percent } = persona;

    // 根据性别判断采用男性图片或女性图片
    // let gender = clusterResult[index].records.find((item) => item.labelText === '性别').answer.text || '男';
    let gender = '男';
    let img = photo.value;
    const res = gender.match(/[男女]/);
    gender = res.length !== 0 ? res[0] : '';
    switch (gender) {
      case '男':
        img = males;
        break;
      case '女':
        img = females;
        break;
    }
    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles['photo-combine']}>
            <div className={styles['photo-container']}>
              <img className={styles.photo} src={img[imgIndex]} alt="用户画像" />
            </div>
            <div className={styles['toolbar-container']}>
              <div className={styles.toolbar}>
                <div className={styles.tool} onClick={() => this.changePhoto(img.length)}>
                  切换图片
                </div>
                <div className={styles.tool} onClick={this.customPhoto}>
                  自定义图片
                </div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                }}
              >
                <Input
                  style={{ width: name.length * 36 }}
                  onChange={(e) => this.changeName(e, index)}
                  value={name}
                  className={styles.name}
                />
                <Input
                  style={{ width: career.length * 16 }}
                  onChange={(e) => this.changeCareer(e, index)}
                  value={career}
                  className={styles.career}
                />
              </div>
              <div className={styles.percent}>
                <div className={styles.text}>
                  <div style={{ width: 64, marginRight: 4 }}>人群占比</div>
                  <div style={{ width: 64 }}>
                    <span className={styles.number}> {percent.toFixed(0)} </span> %
                  </div>
                </div>
                <MiniProgress
                  percent={percent}
                  color={'l(0) 0:#99f5ff 1:#a6a6ff'}
                  target={100}
                  strokeWidth={12}
                />
              </div>
            </div>
            <div className={styles.keywords}>
              <span style={{ fontSize: 36, marginRight: 24 }}>"</span>
              <Input
                style={{ maxWidth: keywords.length * 20 }}
                onChange={(e) => this.changeKeywords(e, index)}
                value={keywords}
                placeholder="请输入口头禅"
              />
              <span style={{ fontSize: 36, marginLeft: 24 }}>"</span>
            </div>
            <div className={styles.body}>
              <div className={styles.basic}>
                {dimGroups.length > 0 && dimGroups[0].text === '基本信息' ? (
                  <div style={{ marginBottom: 24 }}>
                    <div className={styles.info}> 基本信息 </div>
                    {dimGroups[0].dims.map((item, itemIndex) => (
                      <div key={item.labelKey} style={{ fontSize: 14, marginBottom: 8 }}>
                        <span> {item.labelText}</span>
                        {/*： {item.text}*/}
                        :
                        <Input
                          style={{ width: item.text.length * 17}}
                          onChange={(e) => this.changeItemText(e, this.props.index, 0, itemIndex)}
                          className={styles.itemtext}
                          value={item.text}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={styles.right}>
                {dimGroups.map(
                  (dimGroup, index) =>
                    dimGroup.text !== '基本信息' ? (
                      <DraggableBlock key={index} dispatch={dispatch} index={index}>
                        <div key={index} className={styles.behaviors}>
                          <div className={styles.info}>{dimGroup.text}</div>
                          {dimGroup.dims.map(
                            (dim, itemIndex) =>
                              showText ? (
                                <li key={dim.labelKey}>
                                  <Input
                                    style={{ width: dim.text.length * 17}}
                                    onChange={(e) => this.changeItemText(e, this.props.index, index, itemIndex)}
                                    className={styles.itemtext}
                                    value={dim.text}
                                  /></li>
                              ) : (
                                <div key={dim.labelKey}>
                                  {dim.labelText}
                                  <MiniProgress
                                    percent={dim.value * 10}
                                    color={'l(0) 0:#99f5ff 1:#a6a6ff'}
                                    target={0}
                                    strokeWidth={8}
                                  />
                                </div>
                              )
                          )}
                        </div>
                      </DraggableBlock>
                    ) : null
                )}
              </div>
            </div>
            {bios === undefined ? null : (
              <div className={styles.bios}>
                <TextArea
                  autosize
                  onChange={(e) => this.changeBios(e, index)}
                  placeholder="请在此输入画像的个人介绍"
                  value={bios}
                />
              </div>
            )}
          </div>
        </div>
        <PhotoModal modalVisible={modalVisible} setModalVisible={this.setModalVisible} />
      </Fragment>
    );
  }
}
