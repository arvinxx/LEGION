import { queryDocument, saveDocument } from '../services/interview';
import { concat } from 'lodash';
import { findIndexById, generateId } from '../utils';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';

export type TRecord = {
  id: string;
  text: string;
  rawData: Value;
};
export type TTag = {
  id: string;
  text: string;
  refText: string;
  refId: string;
  groupId: string;
};
export type TTagGroup = {
  text: string;
  id: string;
  tagId: Array<string>;
};
export default {
  namespace: 'interview',
  state: {
    title: '',
    records: [],
    recordFocusId: '',
    id: '',
    dimensions: [],
    tags: [],
    tagGroups: [
      {
        text: '',
        id: '',
        tagId: [],
      },
    ],
    selectedValues: [],
    uploadVisible: true,
    tagVisible: true,
  },
  effects: {
    *fetchDocument(action, { call, put }) {
      const response = yield call(queryDocument);
      yield put({
        type: 'querryDocument',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *saveDocument({ payload }, { call }) {
      // console.log(this.state);
      yield call(saveDocument, payload);
    },
  },
  reducers: {
    changeUploadVisible(state, action) {
      return {
        ...state,
        uploadVisible: !state.uploadVisible,
      };
    },
    changeTagVisible(state, action) {
      return {
        ...state,
        tagVisible: !state.tagVisible,
      };
    },
    changeTitle(state, { payload: title }) {
      return { ...state, title };
    },

    querryDocument(state, { payload: documents }) {
      let { title, records, id, dimensions, selectedValues, tags } = documents[0];

      dimensions.map((dimension) => {
        let { id, values } = dimension;
        id = id === '' ? generateId() : id;
        values.map((value) => {
          let { id } = value;
          id = id === '' ? generateId() : id;
          value.editable = false;
          value.id = id;
          delete value._id;
        });
        delete dimension._id;
        dimension.values = values;
        dimension.id = id;
        dimension.inputVisible = false;
      });
      if (records.length > 0) {
        records.map((record) => {
          let id = record.id;
          id = id === '' ? generateId() : id;
          record.id = id;
          delete record._id;
        });
      } else {
        records = [
          {
            id: generateId(),
            text: '',
            rawData: Value.fromJSON(Plain.deserialize('')),
          },
        ];
      }
      if (tags.length > 0) {
        tags.map((tag) => {
          let id = tag.id;
          id = id === '' ? generateId() : id;
          tag.id = id;
          delete tag._id;
        });
      }

      if (title === undefined) {
        title = '';
      }
      if (!Array.isArray(selectedValues)) {
        selectedValues = [];
      }
      if (id === '') {
        id = generateId();
      }
      return {
        ...state,
        records,
        title,
        id,
        tags,
        dimensions,
        selectedValues,
        recordFocusId: records[0].id,
      };
    },

    addRecord(state, { payload: id }) {
      const records: Array<TRecord> = concat(state.records);
      const index = findIndexById(records, id);
      records.splice(index + 1, 0, {
        text: '',
        id: generateId(),
        rawData: Value.fromJSON(Plain.deserialize('')),
      });
      return {
        ...state,
        records,
        recordFocusId: records[index + 1].id,
      };
    },
    changeRecordText(state, { payload }) {
      const { id, newText } = payload;
      const records: Array<TRecord> = concat(state.records);
      const index = findIndexById(records, id);
      records[index].text = newText;
      return {
        ...state,
        records,
      };
    },
    deleteRecord(state, { payload: id }) {
      const oldRecords: Array<TRecord> = state.records;

      // 数组中只有一个元素的情况下，直接返回原先状态，不删除
      if (oldRecords.length === 1) {
        return state;
      } else {
        const index = findIndexById(oldRecords, id);
        const focusIndex = index === 0 ? 0 : index - 1; // 判断是否是数组第一个元素
        const records = oldRecords.filter((record: TRecord) => record.id !== id);
        const recordFocusId = records[focusIndex].id;
        return {
          ...state,
          records,
          recordFocusId,
        };
      }
    },
    changeRecordRawData(state, { payload }) {
      const { id, rawData } = payload;
      const records: Array<TRecord> = concat(state.records);
      const index = findIndexById(records, id);
      records[index].rawData = rawData;
      return {
        ...state,
      };
    },
    changeRecordFocusId(state, { payload: id }) {
      return {
        ...state,
        recordFocusId: id,
      };
    },
    moveUpRecordFocusId(state, { payload: id }) {
      const records = state.records;
      let index = findIndexById(records, id);
      index = index === 0 ? 0 : index - 1;
      return {
        ...state,
        recordFocusId: records[index].id,
      };
    },
    moveDownRecordFocusId(state, { payload: id }) {
      const records = state.records;
      let index = findIndexById(records, id);
      index = index + 1 === records.length ? index : index + 1;
      return {
        ...state,
        recordFocusId: records[index].id,
      };
    },

    addDimensionKey(state, { payload: newDimension }) {
      if (newDimension === '') {
        return state;
      } else
        return {
          ...state,
          dimensions: [...state.dimensions, { key: newDimension, values: [], id: generateId() }],
        };
    },
    deleteDimensionKey(state, { payload: id }) {
      return {
        ...state,
        dimensions: state.dimensions.filter((dimension) => dimension.id !== id),
      };
    },
    changeDimensionKey(state, { payload }) {
      const { id, newKey } = payload;
      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      dimensions[index].key = newKey;
      return {
        ...state,
        dimensions,
      };
    },

    addDimensionValue(state, { payload }) {
      const { id, newValue } = payload;
      const dimensions = state.dimensions;
      //不加入空值标签
      if (newValue !== '') {
        const index = findIndexById(dimensions, id);
        dimensions[index].values.push({ text: newValue, id: generateId() });
        return { ...state, dimensions };
      } else return state;
    },
    deleteDimensionValue(state, { payload }) {
      const { id, vid } = payload;
      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      // 直接使用 oldValues.filter((value) => value !== deleteValue) 无法改变数组内容
      const oldValues = dimensions[index].values;
      dimensions[index].values = oldValues.filter((v) => v.id !== vid);
      return {
        ...state,
        dimensions: dimensions,
      };
    },
    changeDimensionValue(state, { payload }) {
      const { id, vid, newValue } = payload;
      const dimensions = state.dimensions;
      // dimensions
      //   .findIndex((i) => i.id === id)
      //   .values.findIndex((i) => i.id === vid).text = newValue;
      const index = findIndexById(dimensions, id);
      const newValues = dimensions[index].values;
      const vIndex = findIndexById(newValues, vid);
      newValues[vIndex].text = newValue;
      dimensions[index].values = newValues;
      return {
        ...state,
        dimensions,
      };
    },

    showValueInput(state, { payload: id }) {
      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      dimensions[index].inputVisible = true;
      return {
        ...state,
        dimensions,
      };
    },
    hideValueInput(state, { payload: id }) {
      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      dimensions[index].inputVisible = false;
      return {
        ...state,
        dimensions,
      };
    },
    showValueEdit(state, { payload }) {
      const { id, vid } = payload;
      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      const newValues = dimensions[index].values;
      const vIndex = findIndexById(newValues, vid);
      newValues[vIndex].editable = true;
      dimensions[index].values = newValues;
      return {
        ...state,
        dimensions,
      };
    },
    hideValueEdit(state, { payload }) {
      const { id, vid } = payload;

      const dimensions = state.dimensions;
      const index = findIndexById(dimensions, id);
      const newValues = dimensions[index].values;
      const vIndex = findIndexById(newValues, vid);
      newValues[vIndex].editable = false;
      dimensions[index].values = newValues;
      return {
        ...state,
        dimensions,
      };
    },

    changeSelectedValues(state, { payload: selectedValues }) {
      return { ...state, selectedValues };
    },

    addTag(state, { payload: text }) {
      return {
        ...state,
        tags: [...state.tags, { text, id: generateId() }],
      };
    },
    changeTagText(state, { payload }) {
      const { id, newText } = payload;
      const tags: Array<TTag> = concat(state.tags);
      const index = findIndexById(tags, id);
      tags[index].text = newText;
      return {
        ...state,
        tags,
      };
    },
    deleteTag(state, { payload: id }) {
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== id),
      };
    },
  },
};
