import { EpicType } from './epic';

export type StatusType = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type StoryType = {
  name?: string;
  status?: StoryStatusType;
  id?: number;
  order?: number;
  projectId?: number | null;
  epicId?: number | null;
};

export type dragRefObjectType = React.MutableRefObject<number | null>;
export type dragCategoryType = React.MutableRefObject<StatusType>;

export interface KanbanType {
  category: StatusType;
  dragRef: dragRefObjectType;
  dragOverRef: dragRefObjectType;
  dragCategory: dragCategoryType;
  dragOverCategory: dragCategoryType;
}

export interface KanbanTestType {
  category: StatusType;
  dragRef: SpyInstance<MutableRefObject<unknown>, []>;
  dragOverRef: SpyInstance<MutableRefObject<unknown>, []>;
  dragCategory: SpyInstance<MutableRefObject<unknown>, []>;
  dragOverCategory: SpyInstance<MutableRefObject<unknown>, []>;
}
//TODO Extends 를 통한 상속
export interface KanbanItemType {
  story: StoryType;
  epic: EpicType | undefined;
  dragRef: dragRefObjectType;
  dragOverRef: dragRefObjectType;
  dragCategory: dragCategoryType;
  dragOverCategory: dragCategoryType;
  handleDragDrop(category: StatusType): void;
}
