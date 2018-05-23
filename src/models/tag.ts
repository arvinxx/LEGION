import { findIndexById, generateId, reorder } from '../utils';
import { concat } from 'lodash';
import { queryDocument } from '../services/api';
import { DvaModel } from '../../typings/dva';
import update from 'immutability-helper';

export type TTag = {
  id: string;
  text: string;
  refText: string;
  groupId: string;
};

export type TTagGroup = {
  text: string;
  id: string;
  tags: Array<TTag>;
};
export type TSelectedTags = string[];

export type TTagModel = {
  tagVisible: boolean;
  selectedTags: TSelectedTags;
  tagGroups: Array<TTagGroup>;
  exportDisplay: string;
};
export interface ITagModel extends DvaModel {
  state: TTagModel;
}
const tag: ITagModel = {
  namespace: 'tag',
  state: {
    tagVisible: true,
    tagGroups: [{ text: '未分组', id: generateId(), tags: [] }],
    selectedTags: [],
    exportDisplay: '1',
  },
  reducers: {
    querryTagGroups(state, { payload: tagGroups }) {
      return { ...state, tagGroups };
    },

    addTag(state, { payload }) {
      const { text } = payload;
      return {
        ...state,
        tagGroups: update(state.tagGroups, {
          0: {
            tags: {
              $push: [
                {
                  text,
                  refText: text,
                  id: generateId(),
                },
              ],
            },
          },
        }),
      };
    },
    changeTagText(state, { payload }) {
      const { id, newText } = payload;
      return {
        ...state,
        tagGroups: state.tagGroups.map((tagGroup: TTagGroup) => ({
          ...tagGroup,
          tags: tagGroup.tags.map((tag) => ({ ...tag, text: tag.id === id ? newText : tag.text })),
        })),
      };
    },
    deleteTag(state, { payload: id }) {
      const newTagGroups = concat(
        state.tagGroups.map((tagGroup: TTagGroup) => ({
          ...tagGroup,
          tags: tagGroup.tags.filter((tag) => tag.id !== id),
        }))
      );
      return {
        ...state,
        tagGroups: newTagGroups,
      };
    },

    addTagGroup(state, { payload: text }) {
      if (text === '') {
        return state;
      } else
        return { ...state, tagGroups: [...state.tagGroups, { text, tags: [], id: generateId() }] };
    },
    changeTagGroupText(state, { payload }) {
      const { id, newText } = payload;
      if (findIndexById(state.tagGroups, id) !== 0) {
        return {
          ...state,
          tagGroups: state.tagGroups.map((tagGroup) => ({
            ...tagGroup,
            text: tagGroup.id === id ? newText : tagGroup.text,
          })),
        };
      } else return state;
    },
    deleteTagGroup(state, { payload: id }) {
      if (findIndexById(state.tagGroups, id) !== 0) {
        return {
          ...state,
          tagGroups: state.tagGroups.filter((tagGroup) => tagGroup.id !== id),
        };
      } else return state;
    },

    addTagToNewGroup(state, action) {
      const { tagGroups, selectedTags } = state;
      let tags: Array<TTag> = [];
      selectedTags.map((id) => {
        tags = tags.concat(tagGroups[0].tags.filter((tag) => tag.id === id));
        tagGroups[0].tags = tagGroups[0].tags.filter((tag) => {
          return tag.id !== id;
        });
      });
      return {
        ...state,
        tagGroups: [...tagGroups, { text: '未命名', id: generateId(), tags }],
        selectedTags: [],
      };
    },

    changeSelectedTags(state, { payload }) {
      const { id, checked } = payload;
      const selectedTags = checked
        ? [...state.selectedTags, id]
        : state.selectedTags.filter((t) => t !== id);
      return { ...state, selectedTags };
    },

    handleExportDisplay(state, { payload: exportDisplay }) {
      return { ...state, exportDisplay };
    },

    handleTagIndexDrag(
      state,
      {
        payload,
      }: {
        payload: {
          start: { dragIndex: number; dragId: string };
          end: { dropIndex: number; dropId: string };
        };
      }
    ) {
      const tagGroups: Array<TTagGroup> = state.tagGroups;
      const { start, end } = payload;
      const { dragId, dragIndex } = start;
      const { dropId, dropIndex } = end;

      const isInTagsGroup = (id, tags: Array<TTag>) => tags.some((tag: TTag) => tag.id === id);
      let isSameGroup = false;
      // 判断是否属于同一组
      tagGroups.forEach((tagGroup: TTagGroup) => {
        const { tags } = tagGroup;
        if (isInTagsGroup(dragId, tags) && isInTagsGroup(dropId, tags)) {
          const newTags = reorder(tags, dragIndex, dropIndex);
          isSameGroup = true;
          tagGroup.tags = newTags;
          return { ...state, tagGroups };
        }
      });
      //不是同一组的情况下，将加入那一组
      if (!isSameGroup) {
        let removed: TTag;
        tagGroups.forEach((tagGroup: TTagGroup) => {
          const { tags } = tagGroup;
          if (isInTagsGroup(dragId, tags)) {
            [removed] = tags.splice(dragIndex, 1);
            tagGroup.tags = concat(tags);
            return { ...state, tagGroups };
          }
        });
        tagGroups.forEach((tagGroup: TTagGroup) => {
          const { tags } = tagGroup;
          if (isInTagsGroup(dropId, tags)) {
            tags.splice(dropIndex, 0, removed);
            tagGroup.tags = concat(tags);
            return { ...state, tagGroups };
          }
        });
      }
      const newTagGroups = concat(tagGroups);
      return { ...state, tagGroups: newTagGroups };
    },
  },
};
export default tag;
