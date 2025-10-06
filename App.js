// App.js
import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";

const App = () => {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  const courses = ["Starters", "Mains", "Dessert"];

  const addMenuItem = () => {
    if (!dishName || !description || !price) {
      alert("Please fill in all fields.");
      return;
    }

    const newItem = {
      id: Math.random().toString(),
      name: dishName,
      description,
      course,
      price: parseFloat(price),
    };

    setMenuItems([...menuItems, newItem]);
    setDishName("");
    setDescription("");
    setPrice("");
    setCourse("Starters");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Christoffel's Menu</Text>

      {/* Add Menu Item Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          value={dishName}
          onChangeText={setDishName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Course Selector */}
        <View style={styles.courseContainer}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.courseButton, course === c && styles.courseSelected]}
              onPress={() => setCourse(c)}
            >
              <Text style={styles.courseText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <Text style={styles.subTitle}>
        Total Items: {menuItems.length}
      </Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>{item.name} ({item.course})</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
            <Text style={styles.menuPrice}>R{item.price.toFixed(2)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  courseContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  courseButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  courseSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  courseText: {
    color: "#000",
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  menuCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#fdfdfd",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
  },
  menuPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
  },
});