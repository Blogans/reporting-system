import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";

interface Item {
  _id: string;
}

interface ItemListAndAddProps<T extends Item> {
  parentId: string;
  items: T[];
  onItemAdded: () => void;
  onDeleteItem: (itemId: string) => void;
  fetchItems: () => Promise<T[]>;
  addItemToParent: (parentId: string, itemId: string) => Promise<void>;
  itemType: string;
  parentType: string;
  getItemName: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  canDelete: boolean;
  canAdd: boolean;
}

function ItemListAndAdd<T extends Item>({
  parentId,
  items,
  onItemAdded,
  onDeleteItem,
  fetchItems,
  addItemToParent,
  itemType,
  parentType,
  getItemName,
  renderItem,
  canDelete,
  canAdd,
}: ItemListAndAddProps<T>) {
  const [availableItems, setAvailableItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      const data = await fetchItems();
      setAvailableItems(data);
    } catch (err) {
      console.error(`Error fetching ${itemType}s:`, err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await addItemToParent(parentId, selectedItem);
      onItemAdded();
      setSelectedItem("");
    } catch (error) {
      console.error(`Error adding ${itemType} to ${parentType}:`, error);
    }
  };

  return (
    <>
      <ListGroup className="mb-3">
        {items.map((item) => (
          <ListGroup.Item
            key={item._id}
            className="d-flex justify-content-between align-items-center"
          >
            {renderItem(item)}
            {canDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteItem(item._id)}
              >
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {canAdd && (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Add a new {itemType}:</Form.Label>
            <Form.Control
              as="select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Select a {itemType}</option>
              {availableItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {getItemName(item)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button type="submit" disabled={!selectedItem} className="mt-2">
            Add {itemType}
          </Button>
        </Form>
      )}
    </>
  );
}

export default ItemListAndAdd;
