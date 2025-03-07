'use client';

import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-4 mb-2 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          className="h-5 w-5"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-medium ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                priorityColors[todo.priority]
              }`}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p
              className={`mt-1 text-sm text-gray-600 ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {todo.dueDate && <span>期限: {formatDate(todo.dueDate)}</span>}
            <span>作成: {formatDate(todo.createdAt)}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(todo)}>
              <Pencil className="h-4 w-4 mr-2" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(todo.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
