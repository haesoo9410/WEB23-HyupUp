import React, { useState } from 'react';
import Styled from '@/components/KanbanColumn/style';
import { KanbanItem, KanbanAddBtn } from '@/components';
import { StatusType, KanbanType } from '@/types/story';
import { useStoryDispatch } from '@/lib/hooks/useContextHooks';

const KanbanColumn = ({
  category,
  storyList,
  draggingRef,
  dragOverRef,
  categoryRef,
}: KanbanType) => {
  const [isTopEnter, setTopEnter] = useState(false);
  const dispatchStory = useStoryDispatch();
  const handleDragStart = (
    e: React.DragEvent<HTMLElement>,
    order: number,
    category: StatusType,
  ) => {
    draggingRef.current = order;
    categoryRef.current = category;
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLElement>,
    order: number,
    category: StatusType,
  ) => {
    dragOverRef.current = order;
  };

  const handleDragDrop = (
    e: React.DragEvent<HTMLElement>,
    order?: number,
    category?: StatusType,
  ) => {
    // 동일한 칼럼 내의 제일 상단에 Item 을 놓을 때
    if (isTopEnter) {
      const toBeChangeItem = storyList.find((v) => v.order === draggingRef.current);
      if (!toBeChangeItem) return;
      const firstnSecondItem = storyList
        .sort((a, b) => Number(a.order) - Number(b.order))
        .slice(0, 2);
      const averageOrder = firstnSecondItem.length > 1 ? Number(firstnSecondItem[1].order) / 2 : 1;
      dispatchStory({
        type: 'UPDATE_STORY',
        story: { ...toBeChangeItem, order: 0 },
      });
      dispatchStory({
        type: 'UPDATE_STORY',
        story: { ...firstnSecondItem[0], order: averageOrder },
      });
      setTopEnter((isTopEnter) => !isTopEnter);
      draggingRef.current = null;
      dragOverRef.current = null;
      return;
    }

    // 동일한 컬럼 내의 Item 의 사이에 위치
    if (!isTopEnter) {
      const toBeChangeItem = storyList.find((v) => v.order === draggingRef.current);
      const dragOverOrderList = storyList
        .map((v) => Number(v.order))
        .filter((v) => v >= Number(dragOverRef.current))
        .slice(0, 2);
      const orderSum = dragOverOrderList.reduce((prev, cur) => prev + cur, 0);
      const avgOrderSum = dragOverOrderList.length > 1 ? orderSum / 2 : orderSum + 1;

      if (!toBeChangeItem) return;
      dispatchStory({ type: 'UPDATE_STORY', story: { ...toBeChangeItem, order: avgOrderSum } });
      draggingRef.current = null;
      dragOverRef.current = null;
    }

    // 동일 칼럼의 맨 아래 부분에 위치할 때
    // 다른 칼럼 내에 Item 이 위치
  };

  return (
    <Styled.Column
    // onDragEnter={() => setTopEnter((isTopEnter) => !isTopEnter)}
    // onDragLeave={() => setTopEnter(false)}
    // onDrop={() => handleDragDrop}
    >
      <Styled.KanBanColumnTitle
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setTopEnter((isTopEnter) => !isTopEnter)}
        onDragLeave={() => setTopEnter(false)}
        onDrop={(e) => {
          handleDragDrop(e, 1, 'TODO');
        }}
        isTopEnter={isTopEnter}
      >
        {category}
      </Styled.KanBanColumnTitle>
      {storyList?.map((story) => (
        <KanbanItem
          key={story.id}
          story={story}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDragDrop={handleDragDrop}
        />
      ))}
      {category === 'TODO' && <KanbanAddBtn />}
    </Styled.Column>
  );
};

export default KanbanColumn;
