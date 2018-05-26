import React, { Component } from 'react';
import { Button, Divider, Progress, Icon, Tooltip } from 'antd';
import DimSelect from './DimsSelect';
import styles from './RecuceDims.less';
import { TDim, TSelectedDims } from '../../models/data';

interface IRecuceDimsProps {
  dims: Array<TDim>;
  percent: number;
  dispatch: Function;
  analysisStage: number;
  selectedDims: TSelectedDims;
}
export default class RecuceDims extends Component<IRecuceDimsProps> {
  static defaultProps: IRecuceDimsProps = {
    dims: [],
    percent: 0,
    dispatch: () => {},
    analysisStage: 0,
    selectedDims: [],
  };
  state = { checked: false };
  selectDims = (checked, id) => {
    if (checked) {
      this.props.dispatch({ type: 'data/addReductionSelectedDims', payload: id });
    } else {
      this.props.dispatch({ type: 'data/removeReductionSelectedDims', payload: id });
    }
  };

  resetSelection = () => {
    console.log('重置维度');
    this.props.dispatch({ type: 'data/handleReductionSelectedDims', payload: [] });
  };
  confirmSelection = () => {
    console.log('发送数据进行KMO计算');
    console.log('将选择维度保存为降维需要的数据');
    if (this.props.analysisStage === 4) {
      this.props.dispatch({ type: 'stage/addAnalysisStageCount' });
      this.props.dispatch({ type: 'stage/addActivePanelList', payload: '5' });
      this.props.dispatch({ type: 'stage/removeActivePanelList', payload: '4' });
    }
  };
  render() {
    const { percent, dims, selectedDims } = this.props;
    const percentValue = Math.floor(percent * 100);

    const status = (function(percentValue) {
      if (percentValue <= 50) {
        return 'exception';
      } else if (percentValue >= 80) {
        return 'success';
      } else return null;
    })(percentValue);

    return (
      <div className={styles.container}>
        <p>点击选择参与降维的维度</p>
        <DimSelect selectedDims={selectedDims} dims={dims} handleSelect={this.selectDims} />
        <div>
          <Button
            disabled={selectedDims.length === 0}
            onClick={this.resetSelection}
            style={{ marginRight: 16 }}
          >
            重置
          </Button>
          <Button type="primary" ghost onClick={this.confirmSelection}>
            确认
          </Button>
        </div>
        {percent ? (
          <div className={styles.down}>
            <div className={styles.text}>
              <div>有效性百分比</div>
              <Tooltip
                title={
                  <div>
                    采用 KMO 算法 <br />小于 50% 不适合因子分析 <br />大于 80% 适合因子分析<br />50%-80%
                    勉强合适
                  </div>
                }
              >
                <Icon type="exclamation-circle-o" className={styles.info} />
              </Tooltip>
            </div>
            <div className={styles.bar}>
              <Progress
                className={percentValue > 50 && percentValue <= 70 ? styles.yellow : null}
                percent={percentValue}
                status={status}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
