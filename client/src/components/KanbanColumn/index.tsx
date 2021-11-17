import React, { useState, useRef } from 'react';
import Styled from '@/components/KanbanColumn/style';
import { StoryType } from '@/types/story';
import { useStoryState, useStoryDispatch } from '@/lib/hooks/useContextHooks';
import { KanbanItem, KanbanAddBtn } from '@/components';

interface KanbanProps {
  projectId?: number;
}

type CopyList = [StoryType];

const KanbanColumn = ({ projectId }: KanbanProps) => {
  const storyList = useStoryState();
  const dispatchStory = useStoryDispatch();
  const draggingItem = useRef<number | null>(0);
  const dragoverItem = useRef<number | null>(0);

  const handleDragStart = (e: React.SyntheticEvent<HTMLElement>, position: number) => {
    draggingItem.current = position;
  };

  const handleDragEnter = (e: React.SyntheticEvent<HTMLElement>, position: number) => {
    dragoverItem.current = position;
    const listCopy = [...storyList] as CopyList;

    const draggingItemContent = listCopy[draggingItem.current as number];
    // debugger;
    listCopy.splice(draggingItem.current as number, 1);
    listCopy.splice(dragoverItem.current as number, 0, draggingItemContent);

    draggingItem.current = dragoverItem.current;
    dragoverItem.current = null;
    dispatchStory({ type: 'LOAD_STORY', stories: listCopy });
  };

  return (
    <Styled.Column>
      <h4>To do</h4>
      {storyList?.map((story, index) => (
        <KanbanItem
          key={story.id}
          index={index}
          story={story}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
        />
      ))}
      <KanbanAddBtn projectId={projectId} />
    </Styled.Column>
  );
};

export default KanbanColumn;
