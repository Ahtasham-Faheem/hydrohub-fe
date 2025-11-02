import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const initialModules = [
  { id: "1", title: "System User", color: "#22c55e", icon: "🧑‍💻" },
  { id: "2", title: "Shift Management", color: "#ef4444", icon: "👥" },
  { id: "3", title: "Catalogue", color: "#f97316", icon: "📄" },
  { id: "4", title: "Payment Channel", color: "#3b82f6", icon: "💳" },
  { id: "5", title: "Customers", color: "#16a34a", icon: "🧍" },
  { id: "6", title: "Start of the Day", color: "#ef4444", icon: "⏰" },
  { id: "7", title: "Close of the Day", color: "#16a34a", icon: "📅" },
  { id: "8", title: "Customer Management", color: "#2563eb", icon: "👨‍💼" },
  { id: "9", title: "Customer Profiles", color: "#f97316", icon: "👤" },
  { id: "10", title: "Customer Orders", color: "#ef4444", icon: "📋" },
  { id: "11", title: "Customer Payments", color: "#10b981", icon: "💵" },
  { id: "12", title: "Customer Ranking", color: "#3b82f6", icon: "📊" },
  { id: "13", title: "Customer Categories", color: "#fb923c", icon: "📁" },
  { id: "14", title: "Conversations", color: "#2563eb", icon: "💬" },
  { id: "15", title: "Email / Communication Logs", color: "#22c55e", icon: "✉️" },
  { id: "16", title: "Customer Insights", color: "#f59e0b", icon: "💡" },
  { id: "17", title: "Reviews & Ratings", color: "#ea580c", icon: "⭐" },
  { id: "18", title: "Alerts & Follow-ups", color: "#3b82f6", icon: "🔔" },
  { id: "19", title: "Manage Reviews", color: "#16a34a", icon: "💬" },
  { id: "20", title: "Payments & Receipts", color: "#ef4444", icon: "💰" },
];

export default function BusinessControlCenter() {
  const [modules, setModules] = useState(initialModules);
  const [isDraggable, setIsDraggable] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Business Control Center
        </h1>

        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-700">Enable Drag and Drop</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={isDraggable}
              onChange={(e) => setIsDraggable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>

      {/* Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={modules} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-8 gap-4">
            {modules.map((module) => (
              <SortableCard
                key={module.id}
                id={module.id}
                title={module.title}
                icon={module.icon}
                color={module.color}
                isDraggable={isDraggable}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableCard({
  id,
  title,
  icon,
  color,
  isDraggable,
}: {
  id: string;
  title: string;
  icon: string;
  color: string;
  isDraggable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`w-full h-28 rounded-lg border border-gray-200 bg-white
        flex flex-col items-center justify-center p-3
        transition-shadow relative ${
          isDragging ? "shadow-xl" : "shadow-sm hover:shadow-md"
        }`}
      >
        <div className="text-4xl mb-1" style={{ color }}>
          {icon}
        </div>
        <p className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2">
          {title}
        </p>

        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 text-gray-400 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
