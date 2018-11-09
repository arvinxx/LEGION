import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';

import { DispatchProp } from 'react-redux';
import { PersonaEditor, DimensionList } from './components';

import styles from './edit.less';
import { IPersonaState } from '@/models/persona';
import { TQuesData } from '@/models/data';

const { TabPane } = Tabs;
interface IEditProps {
  persona: IPersonaState;
  clusterResult: TQuesData;
}
interface IEditDefaultProps {}
@connect(({ persona, data }) => ({
  persona,
  clusterResult: data.userModels,
}))
export default class Edit extends Component<IEditProps & IEditDefaultProps & DispatchProp> {
  changePersonaIndex = (key) => {
    this.props.dispatch({
      type: 'persona/handleDisplayIndex',
      payload: key,
    });
    this.props.dispatch({
      type: 'persona/handleDisplayDimGroups',
    });
  };
  render() {
    const { persona, dispatch, clusterResult } = this.props;
    const {
      dimVisible,
      expandedDims,
      personaData,
      personaDisplayDimGroups,
      displayIndex,
      showText,
    } = persona;
    if (personaData.length === 0) {
      return <div>no persona data</div>;
    }
    const { checkedDims, dimGroups, basicInfo } = personaData[Number(displayIndex)];
    return (
      <Fragment>
        <div className={styles.left}>
          <Tabs
            type="card"
            className={styles.tabs}
            activeKey={displayIndex}
            onChange={(key) => this.changePersonaIndex(key)}
          >
            {clusterResult.map((cluster, index) => <TabPane tab={cluster.typeName} key={index} />)}
          </Tabs>
          <div className={styles.editor}>
            <PersonaEditor
              personaDimGroups={personaDisplayDimGroups}
              clusterResult={clusterResult}
              dispatch={dispatch}
              persona={basicInfo}
              showText={showText}
              index={Number(displayIndex)}
            />
          </div>
        </div>
        {dimVisible ? (
          <div className={styles.right}>
            <DimensionList
              index={Number(displayIndex)}
              checkedDims={checkedDims}
              expandedDims={expandedDims}
              dispatch={dispatch}
              personaDimGroups={dimGroups}
            />
          </div>
        ) : null}
      </Fragment>
    );
  }
}
