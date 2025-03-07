'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFilter, TodoSort, Priority } from '@/types/todo';
import {
  getTodos,
  saveTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  filterTodos,
  sortTodos,
} from '@/lib/todo-storage';
import { TodoItem } from '@/components/todo-item';
import { TodoDialog } from '@/components/todo-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [sort, setSort] = useState<TodoSort>({
    option: 'created',
    direction: 'asc',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAddTodo = (todo: Partial<Todo>) => {
    const newTodo = createTodo(
      todo.title!,
      todo.description,
      todo.categoryId,
      todo.priority!,
      todo.dueDate
    );
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    const updatedTodos = updateTodo(todos, updatedTodo);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = deleteTodo(todos, id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const handleToggleComplete = (id: string) => {
    const updatedTodos = toggleTodoComplete(todos, id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const filteredTodos = filterTodos(todos, filter);
  const sortedTodos = sortTodos(filteredTodos, sort);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TODOアプリ</h1>
        <Button onClick={() => setIsDialogOpen(true)}>新しいタスク</Button>
      </header>

      <section className="mb-4">
        <Input
          placeholder="検索..."
          value={filter.searchQuery || ''}
          onChange={(e) =>
            setFilter({ ...filter, searchQuery: e.target.value })
          }
        />
        <Select
          value={filter.priority || ''}
          onValueChange={(value: Priority) =>
            setFilter({ ...filter, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="優先度を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section>
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onEdit={(todo) => {
              setEditingTodo(todo);
              setIsDialogOpen(true);
            }}
            onDelete={handleDeleteTodo}
          />
        ))}
      </section>

      <TodoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(todo) => {
          if (editingTodo) {
            handleUpdateTodo({
              ...editingTodo,
              ...todo,
            });
          } else {
            handleAddTodo(todo);
          }
          setEditingTodo(null);
        }}
        initialTodo={editingTodo || undefined}
      />
    </div>
  );
}
