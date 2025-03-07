'use client';

import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (todo: Partial<Todo>) => void;
  initialTodo?: Todo;
}

export function TodoDialog({
  open,
  onOpenChange,
  onSubmit,
  initialTodo,
}: TodoDialogProps) {
  const [title, setTitle] = useState(initialTodo?.title ?? '');
  const [description, setDescription] = useState(
    initialTodo?.description ?? ''
  );
  const [priority, setPriority] = useState<Priority>(
    initialTodo?.priority ?? 'medium'
  );
  const [dueDate, setDueDate] = useState(
    initialTodo?.dueDate
      ? new Date(initialTodo.dueDate).toISOString().split('T')[0]
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialTodo,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialTodo ? 'タスクを編集' : '新しいタスク'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの詳細を入力（任意）"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">優先度</Label>
            <Select
              value={priority}
              onValueChange={(value: Priority) => setPriority(value)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">期限</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">{initialTodo ? '更新' : '作成'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
