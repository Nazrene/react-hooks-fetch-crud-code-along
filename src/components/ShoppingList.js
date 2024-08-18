import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((items) => setItems(items))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
  }

  function handleAddToCart(item) {
    const updatedItem = { ...item, isInCart: !item.isInCart };
    fetch(`http://localhost:4000/items/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((r) => r.json())
      .then((updatedItem) => {
        setItems(items.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
      })
      .catch((error) => console.error("Error updating item:", error));
  }

  function handleDeleteItem(id) {
    fetch(`http://localhost:4000/items/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setItems(items.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;


