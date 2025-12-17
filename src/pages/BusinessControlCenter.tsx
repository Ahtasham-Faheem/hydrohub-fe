import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTheme } from "../contexts/ThemeContext";
import Isolation from "../assets/ControlIcons/isolation.svg";

// Map card titles to their corresponding routes
const cardToRouteMap: { [key: string]: string } = {
  "System User": "users",
  "Shift Management": "/shift-management",
  "Start of the Day": "/start-of-day",
  "Close of the Day": "/close-of-day",
  "Customer Management": "customer-management",
  "Customer Profiles": "customer-profiles",
  "Customer Orders": "/customer-orders",
  "Customer Payments": "/customer-payments",
  "Customer Ranking": "/customer-ranking",
  "Customer Categories": "/customer-categories",
  Conversations: "/message-center/chat",
  "Email / Communication Logs": "/message-center/email",
  "Customer Insights": "/customer-insights",
  "Reviews & Ratings": "/reviews-ratings",
  "Alerts & Follow-ups": "/alerts-followups",
  "Manage Reviews": "manage-reviews",
  "Orders Management": "/orders-management",
  "Payments & Receipts": "/payments-receipts",
  "Accounts Overview": "/accounts-overview",
  "Expenses Management": "/expenses-management",
  "Invoices & Billing": "/invoices-billing",
  "Catalog Management": "catalogue",
  "System Setting": "/system-settings",
  "Sales Summary": "/sales-summary",
  Scheduler: "/scheduler",
  "POS Dashboard": "/pos-dashboard",
  "Parked Receipts": "/parked-receipts",
  "Claims & FOC": "/claims-foc",
  "Returns & Refunds": "/returns-refunds",
  "Delivery Tracker": "/delivery-tracker",
  "Fleet Management": "/fleet-management",
  "Inventory / Stock Control": "/inventory-stock",
  "Route Planning": "/route-planning",
  "Logistics Management": "/logistics-management",
};

interface BusinessControlCenterProps {
  onHideHeader?: () => void;
}

export default function BusinessControlCenter({
  onHideHeader,
}: BusinessControlCenterProps) {
  const [modules, setModules] = useState(initialModules);
  const [isDraggable, setIsDraggable] = useState(true);
  const { colors } = useTheme();

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

  const handleIsolationClick = () => {
    onHideHeader?.();
  };

  return (
    <div style={{ backgroundColor: colors.background.primary }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Business Control Center
          </h1>
          <p className="text-semibold" style={{ color: colors.text.primary }}>Dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-1">
            <img
              onClick={handleIsolationClick}
              src={Isolation}
              className="p-1 rounded shadow-md cursor-pointer transition-shadow"
              style={{
                backgroundColor: colors.background.card,
                boxShadow: colors.shadow.sm,
              }}
              alt="Isolation Mode"
            />
          </div>

          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              checked={isDraggable}
              onChange={(e) => setIsDraggable(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-8 h-4 rounded-full peer transition-colors"
              style={{
                backgroundColor: isDraggable
                  ? colors.primary[600]
                  : colors.border.secondary,
              }}
            ></div>
            <div
              className="absolute left-[-2px] top-0.5 w-3 h-3 rounded-full transition-transform"
              style={{
                backgroundColor: colors.background.card,
                transform: isDraggable ? "translateX(20px)" : "translateX(0)",
              }}
            ></div>
          </label>
          <span
            className="text-sm mr-10"
            style={{ color: colors.text.secondary }}
          >
            Enable Drag and Drop
          </span>
        </div>
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
  const navigate = useNavigate();
  const { colors } = useTheme();
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only navigate if not dragging and not clicking the drag handle
    if (
      !isDraggable ||
      (isDraggable && !(e.target as Element).closest("button"))
    ) {
      const route = cardToRouteMap[title];
      if (route) {
        navigate(`/dashboard/${route}`);
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={handleClick}
        className="w-full h-28 rounded-lg border flex flex-col items-center justify-center p-3 transition-all relative cursor-pointer"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
          boxShadow: isDragging ? colors.shadow.xl : colors.shadow.sm,
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = colors.shadow.md;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = colors.shadow.sm;
          }
        }}
      >
        <div className="text-4xl mb-1" style={{ color }}>
          {icon}
        </div>
        <p
          className="text-xs font-medium text-center leading-tight line-clamp-2"
          style={{ color: colors.text.primary }}
        >
          {title}
        </p>

        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 cursor-grab active:cursor-grabbing"
            style={{ color: colors.text.tertiary }}
          >
            <GripVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
