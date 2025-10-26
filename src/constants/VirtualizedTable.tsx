// src/components/common/VirtualizedTable.tsx
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

interface VirtualizedTableProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (props: ListChildComponentProps<T>) => JSX.Element
}

export function VirtualizedTable<T>({
  items,
  height,
  itemHeight,
  renderItem,
}: VirtualizedTableProps<T>) {
  return (
    <List<T>
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={items}
    >
      {renderItem}
    </List>
  )
}
