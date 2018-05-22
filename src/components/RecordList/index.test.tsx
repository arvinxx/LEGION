import React from 'react';
import { shallow } from 'enzyme';
import App, { IRecordListProps } from './index';
import Plain from 'slate-plain-serializer';
import { spy } from 'sinon';
import tagGroups from '../../../mock/tagGroups';

const setup = () => {
  const dispatch = spy();

  const props: IRecordListProps = {
    records: Plain.deserialize('12345'),
    tagGroups: tagGroups,
  };
  const wrapper = shallow(<App {...props} dispatch={dispatch} />);
  return {
    props,
    wrapper,
    dispatch,
  };
};
const { wrapper, props, dispatch } = setup();
afterEach(() => {
  dispatch.resetHistory();
});

describe('RecordList 正常渲染样式', () => {
  it('RecordList Component should be render', () => {
    expect(wrapper.find('Editor').length).toEqual(1);
    // expect(wrapper).toMatchSnapshot();
  });
});

// describe('新建条目', () => {
//   describe('按回车新建条目', () => {});
// });
