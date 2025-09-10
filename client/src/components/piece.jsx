import { useDraggable } from "@dnd-kit/core";

function Piece({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-8 h-8 bg-amber-300 rounded-full"
    />
  );
}

export default Piece;
