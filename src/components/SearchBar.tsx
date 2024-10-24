import { useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

interface SearchBarProps<T> {
  items: T[];
  onFilter: (filteredItems: T[]) => void;
  filterFunction: (item: T, searchTerm: string) => boolean;
  placeholder?: string;
}

function SearchBar<T>({
  items,
  onFilter,
  filterFunction,
  placeholder = "Search...",
}: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (items && items.length > 0) {
      const filteredItems = items.filter((item) =>
        filterFunction(item, searchTerm)
      );
      onFilter(filteredItems);
    } else {
      onFilter([]);
    }
  }, [searchTerm, items, filterFunction, onFilter]);

  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
        Clear
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
