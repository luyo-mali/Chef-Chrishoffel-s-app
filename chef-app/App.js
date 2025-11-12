
import React, { useState, createContext, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//  GLOBAL CONTEXT (Global Variables)
const MenuContext = createContext();

//  Provider to store ALL menu items globally
const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
};

// function using loops to calculate averages
const calculateAverages = (items) => {
  let starters = items.filter(i => i.course === "Starters");
  let mains = items.filter(i => i.course === "Mains");
  let desserts = items.filter(i => i.course === "Dessert");

  //  for loop - starters
  let starterTotal = 0;
  for (let i = 0; i < starters.length; i++) {
    starterTotal += starters[i].price;
  }

  // while loop - mains
  let mainsTotal = 0;
  let x = 0;
  while (x < mains.length) {
    mainsTotal += mains[x].price;
    x++;
  }

  // for-in loop - desserts
  let dessertTotal = 0;
  for (let i in desserts) {
    dessertTotal += desserts[i].price;
  }

  return {
    starters: starters.length ? (starterTotal / starters.length).toFixed(2) : "0.00",
    mains: mains.length ? (mainsTotal / mains.length).toFixed(2) : "0.00",
    desserts: desserts.length ? (dessertTotal / desserts.length).toFixed(2) : "0.00"
  };
};

//////////////////////////////////////////////////////////////////
//  HOME SCREEN — Displays Menu + Averages
//////////////////////////////////////////////////////////////////
function HomeScreen({ navigation }) {
  const { menuItems } = useContext(MenuContext);
  const averages = calculateAverages(menuItems);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Christoffel's Menu</Text>

      <Text style={styles.stats}>Total Items: {menuItems.length}</Text>
      <Text style={styles.stats}>Avg Starters Price: R{averages.starters}</Text>
      <Text style={styles.stats}>Avg Mains Price: R{averages.mains}</Text>
      <Text style={styles.stats}>Avg Desserts Price: R{averages.desserts}</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>
              {item.name} ({item.course})
            </Text>
            <Text>{item.description}</Text>
            <Text>R{item.price}</Text>
          </View>
        )}
      />

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddMenu")}
      >
        <Text style={styles.buttonText}>Add Menu Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Filter")}
      >
        <Text style={styles.buttonText}>Filter Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////////////////////////////////////////////////////
//  ADD MENU SCREEN — Add + Remove Items
//////////////////////////////////////////////////////////////////
function AddMenuScreen() {
  const { menuItems, setMenuItems } = useContext(MenuContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");

  const addItem = () => {
    if (!name || !description || !price) {
      alert("Please complete all fields");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      course,
      price: parseFloat(price)
    };

    setMenuItems([...menuItems, newItem]);

    setName("");
    setDescription("");
    setPrice("");
  };

  const removeItem = (id) => {
    setMenuItems(menuItems.filter((i) => i.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Menu Item</Text>

      <TextInput placeholder="Dish Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      {/* Course Selector */}
      <View style={styles.courseRow}>
        {["Starters", "Mains", "Dessert"].map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCourse(c)}
            style={[styles.courseButton, course === c && styles.courseSelected]}
          >
            <Text>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      {/* List of existing items with Remove button */}
      <FlatList
        data={menuItems}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Text style={{ color: "#fff" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

//////////////////////////////////////////////////////////////////
//  FILTER SCREEN — Filter by Course
//////////////////////////////////////////////////////////////////
function FilterScreen() {
  const { menuItems } = useContext(MenuContext);
  const [selected, setSelected] = useState("Starters");

  const filtered = menuItems.filter((i) => i.course === selected);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Menu</Text>

      {/* Buttons to choose category */}
      <View style={styles.courseRow}>
        {["Starters", "Mains", "Dessert"].map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelected(c)}
            style={[styles.courseButton, selected === c && styles.courseSelected]}
          >
            <Text>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtered items */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <Text>{item.name} - R{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

//////////////////////////////////////////////////////////////////
// APP NAVIGATION
//////////////////////////////////////////////////////////////////
const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddMenu" component={AddMenuScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

/////////////////////////////////////////////////////////////////STYLES
//////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  stats: { fontSize: 16, marginVertical: 4 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 8 },
  menuCard: { padding: 12, borderWidth: 1, marginVertical: 5, borderRadius: 8 },
  menuTitle: { fontSize: 16, fontWeight: "bold" },
  button: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8, marginVertical: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  courseRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  courseButton: { padding: 10, borderWidth: 1, borderRadius: 8 },
  courseSelected: { backgroundColor: "lightgreen" },
  addButton: { backgroundColor: "green", padding: 12, borderRadius: 8, marginVertical: 10 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  removeButton: { backgroundColor: "red", padding: 8, borderRadius: 6 }
});
