import React, { useState } from 'react';
import S from './style';
import deleteIcon from '@public/icons/delete-icon-red.svg';
import draggableIcon from '@public/icons/draggable.svg';
import { EpicType } from '@/types/epic';
import EpicEditModal from '../EpicEditModal';
import { Modal } from '@/lib/design';
import { deleteEpicById } from '@/lib/api/epic';
import { useSocketSend } from '@/lib/hooks';
import { useEpicDispatch } from '@/lib/hooks/useContextHooks';

interface EpicEntryItemProps {
  activated: boolean;
  onDragStart?: React.DragEventHandler;
  onDragOver: React.DragEventHandler;
  onDragEnter: React.DragEventHandler;
  onDragLeave?: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  epicData: EpicType;
}

const EpicEntryItem = (props: EpicEntryItemProps) => {
  const [showDraggable, setShowDraggable] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [value, setValue] = useState(props.epicData.name);
  const emitDeleteEpic = useSocketSend('DELETE_EPIC');
  const dispatchEpic = useEpicDispatch();

  const handleChange = (ev: React.ChangeEvent) => {
    setValue((ev.target as HTMLInputElement).value);
  };

  const handleDelete = () => {
    deleteEpicById(props.epicData.id);
    emitDeleteEpic(props.epicData.id);
    dispatchEpic({
      type: 'REMOVE_EPIC',
      id: props.epicData.id,
    });
  };

  return (
    <>
      <S.Container
        draggable="true"
        {...props}
        onMouseOver={() => setShowDraggable(true)}
        onMouseOut={() => setShowDraggable(false)}
      >
        <S.DeleteIcon
          src={deleteIcon}
          alt="deleteicon"
          showDelete={showDraggable}
          onClick={() => setShowDeleteModal(true)}
        />
        <S.DragIndicator src={draggableIcon} alt="draggableicon" showDraggable={showDraggable} />
        <div onClick={() => setShowEditModal(true)}>{props.epicData.name}</div>
      </S.Container>
      <Modal
        shouldConfirm
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onClickOk={handleDelete}
      >
        <S.DeleteConfirm>에픽을 삭제하시겠습니까?</S.DeleteConfirm>
      </Modal>
      <EpicEditModal
        showEditModal={showEditModal}
        setShowModal={setShowEditModal}
        epicData={props.epicData}
        value={value}
        handleChange={handleChange}
      />
    </>
  );
};

export default EpicEntryItem;
