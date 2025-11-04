import { useState } from "react";
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
import { initialModules } from "../utils/utils";
import Isolation from "../assets/ControlIcons/isolation.svg";

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
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Business Control Center
        </h1>

        <label className="flex items-center gap-2">
          <div className="mr-1">
            <img src={Isolation} className="bg-white p-2 rounded hover:shadow-md" alt="Isolation Mode" />
          </div>

          <div className="relative cursor-pointer">
            <input
              type="checkbox"
              checked={isDraggable}
              onChange={(e) => setIsDraggable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
          <span className="text-sm text-gray-700">Enable Drag and Drop</span>
        </label>
      </div>

      {/* Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={modules} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-8 gap-4 font-medium">
            {modules.map((module) => (
              <SortableCard
                key={module.id}
                id={module.id}
                title={module.title}
                icon={<img src={module.icon} height={20} className="mb-2" />}
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
  icon: any;
  color: string;
  isDraggable: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

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
        <p className="text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">
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
