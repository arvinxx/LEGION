import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import router from 'umi/router';
import { getBaseUrl } from '../../utils';
import { TDim } from '../../models/data';

interface IValidationProps {
  dispatch: Function;
  analysisStage: number;
  tabStage: string;
  pathname: string;
}
export default class Validation extends Component<IValidationProps> {
  static defaultProps: IValidationProps = {
    analysisStage: 0,
    dispatch: () => {},
    pathname: '',
    tabStage: '1',
  };

  showCharts = () => {
    this.props.dispatch({ type: 'stage/showCharts', payload: true });
  };
  finish = () => {
    // 解锁下一条面板
    if (this.props.analysisStage === 3) {
      this.props.dispatch({ type: 'stage/addAnalysisStageCount' });
      this.props.dispatch({ type: 'stage/addActivePanelList', payload: '4' });
      this.props.dispatch({ type: 'stage/removeActivePanelList', payload: '3' });
    }
    // 完成Tab切换
    this.props.dispatch({ type: 'stage/changeTabStage', payload: '2' });

    // 完成路由跳转
    router.push(`${getBaseUrl(this.props.pathname)}/reduction`);
  };
  render() {
    return (
      <div>
        <div>
          {/*<Icon type="plus-circle-o" />*/}
          <p>点击生成图表按钮获得可视化结果，点击跳转进入下一环节</p>
        </div>
        <div>
          <Button onClick={this.showCharts}>生成图表</Button>
          <Button type="primary" onClick={this.finish}>
            跳转
          </Button>
        </div>
      </div>
    );
  }
}
