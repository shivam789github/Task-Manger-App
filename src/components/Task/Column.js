// Column.js
import React from 'react';
import TaskCard from './TaskCard'; // Component for individual tasks
import { useDrop } from 'react-dnd';

const Column = ({ title, tasks, columnId, moveTask,refreshTasks ,handleEditTask,handleViewTask}) => {
  // Drop area for tasks
  const [, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      moveTask(item.id, item.columnId, columnId); // Move task to new column
    },
  });

  return (
    <div ref={dropRef} className="w-1/3 h-1/3 p-4 bg-white shadow-md m-2 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 bg-blue-600 rounded-md text-white p-2">{title}</h2>
      <div className="space-y-4">
        {tasks?.map((task) => (
          <TaskCard key={task._id} task={task} columnId={columnId} refreshTasks={refreshTasks} onEdit={handleEditTask} onView={handleViewTask}/>
        ))}
      </div>
    </div>
  );
};

export default Column;
