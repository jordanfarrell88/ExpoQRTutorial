import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ProductScan() {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
                {/*Header */}

                <View style={styles.header} >
                    <TouchableOpacity style={styles.backArrow} >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Product Delivery</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Product Details Card */}
                <View style={styles.productCard} >
                    <View style={styles.productHeader}>
                        <Image source={{ uri: "/placeholder.svg?height=80&width=80"}} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>Surgical Scalpel Set</Text>
                            <Text style={styles.productCategory}>Surgical Instruments</Text>
                            <Text style={styles.productSupplier}>by MedTech Solutions</Text>
                            <Text style={styles.productPrice}>$45.99 per unit</Text>
                                 
                        </View>
                    </View>

                    <Text style={styles.productDescription}>
            Premium stainless steel surgical scalpels with disposable blades for precision medical procedures
                    </Text>

                    {/* Specifications */}
                    <View style={styles.specificationsContainer}>
                        <Text style={styles.specificationsTitle}>Specifications:</Text>
                        <View style={styles.specificationItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.specificationText}>Material: Stainless Steel</Text>
                        </View>
                        <View style={styles.specificationItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.specificationText}>Blade Size: #10, #11, #15</Text>
                        </View>
                        <View style={styles.specificationItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.specificationText}>Sterile Packaging</Text>
                        </View>
                        <View style={styles.specificationItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.specificationText}>Single Use Blades</Text>
                        </View>
                    </View>
                    </View>

                    {/* Quantity Selection */}
                    <View style={styles.quantityCard}>
                    <Text style={styles.sectionTitle}>Delivery Quantity</Text>
                    <Text style={styles.sectionSubtitle}>How many items are you receiving?</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="remove" size={24} color="#374151" />
                        </TouchableOpacity>

                        <TextInput style={styles.quantityInput} value="1" keyboardType="numeric" textAlign="center" maxLength={4} />

                        <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="add" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.totalText}>Total Value: $45.99</Text>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.notesCard}>
                    <Text style={styles.sectionTitle}>Delivery Notes</Text>
                    <Text style={styles.sectionSubtitle}>Add any additional information (optional)</Text>

                    <TextInput
                        style={styles.notesInput}
                        placeholder="e.g., Condition of items, special handling notes..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    </View>
                
                <TouchableOpacity style={styles.confirmButton}>
                    <Ionicons name="checkmark-circle" size={54} color="#FFFFFF"/>
                    <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backArrow: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  productCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
    marginBottom: 2,
  },
  productSupplier: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  productDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  specificationsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  specificationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  specificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  specificationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  quantityCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  quantityInput: {
    width: 80,
    height: 48,
    borderWidth: 2,
    borderColor: "#2563eb",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    textAlign: "center",
  },
  notesCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
    minHeight: 100,
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomPadding: {
    height: 32,
  },
})
