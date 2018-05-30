import Mock from 'mockjs';
import photo1 from '../assets/photos/1.jpg';

export const dimGroups = [
  {
    text: '基本信息',
    key: 'basicInfo',
    dims: [],
  },
  {
    text: '动机',
    key: 'motivations',
    dims: [],
  },
  {
    text: '目标',
    key: 'goals',
    dims: [],
  },
  {
    text: '痛点',
    key: 'frustrations',
    dims: [],
  },
  {
    text: '行为变量',
    key: 'behavior',
    dims: [],
  },
  {
    text: '态度',
    key: 'attitude',
    dims: [],
  },
  {
    text: '设备偏好',
    key: 'device',
    dims: [],
  },
  {
    text: '相关决策者',
    key: 'influencers',
    dims: [],
  },
  {
    text: '技能',
    key: 'skill',
    dims: [],
  },
  {
    text: '活动',
    key: 'activities',
    dims: [],
  },
];

export const basicInfo = {
  percent: Mock.mock({
    data: '@natural(1,40)',
  }).data,
  keywords: '',
  name: Mock.mock({ data: '@cname' }).data,
  bios: '',
  career: Mock.mock({
    'data|1': ['医生', '设计师', '制图员', '摄影师', '建筑师', '工业工程师', '画家'],
  }).data,
  photo: {
    text: 'photo1',
    value: photo1,
  },
};
