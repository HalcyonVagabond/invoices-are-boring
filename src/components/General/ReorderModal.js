import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ReorderModal = ({ items, onReorder, itemType }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        onReorder(result.source.index, result.destination.index);
    };

    if (!modalOpen) return <button onClick={() => setModalOpen(true)} className="py-2 px-4 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors mb-2">Reorder {itemType}</button>;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reorder {itemType}</h3>
                    <div className="mt-2">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="itemsDroppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
                                        {items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-2 mb-2 bg-gray-100 border rounded flex justify-center items-center text-center ${snapshot.isDragging ? 'shadow-lg bg-gray-300' : ''}`}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
                <div className="items-center px-4 py-3">
                    <button id="ok-btn" onClick={() => setModalOpen(false)} className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600">Done</button>
                </div>
            </div>
        </div>
    );
};

export default ReorderModal;