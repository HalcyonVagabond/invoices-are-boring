import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ReorderModal = ({ items, onReorder, itemType }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        onReorder(result.source.index, result.destination.index);
    };

    if (!modalOpen) return <button onClick={() => setModalOpen(true)} className="py-2 px-4 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500 hover:text-white transition-colors mb-2 text-sm font-medium">Reorder {itemType}</button>;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border border-slate-600 w-96 shadow-2xl rounded-xl bg-slate-800">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-semibold text-slate-200">Reorder {itemType}</h3>
                    <p className="text-xs text-slate-400 mt-1">Drag items to reorder them</p>
                    <div className="mt-4">
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
                                                        className={`p-3 mb-2 bg-slate-700 border border-slate-600 rounded-lg flex justify-center items-center text-center text-slate-200 cursor-grab ${snapshot.isDragging ? 'shadow-lg bg-slate-600 border-blue-500' : 'hover:bg-slate-600'}`}
                                                    >
                                                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                                        </svg>
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
                <div className="flex justify-center px-4 py-3 mt-2">
                    <button id="ok-btn" onClick={() => setModalOpen(false)} className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors">Done</button>
                </div>
            </div>
        </div>
    );
};

export default ReorderModal;