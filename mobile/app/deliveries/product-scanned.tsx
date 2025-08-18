import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Stack, useLocalSearchParams, router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDelivery } from "../context/DeliveryContext";
import { UserInfo, User } from "firebase/auth";
import { auth } from "@/config/firebase";

export default function ProductScan() {

   interface Product {
    line_code: string;
    line_description: string;
    unit_price: number;
    supplier: string;
    nappi_code?: string;
    image_url?: string;
  }

  const [quantity, setQuantity] = React.useState(0)
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [product, setProduct] = React.useState<Product | null>(null)
  
  const { line_code } = useLocalSearchParams()
  
  if(quantity == 0 && !isDisabled) {
    setIsDisabled(true)
  } else if(quantity > 0 && isDisabled){
    setIsDisabled(false)
  }

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://expoqrbackend.onrender.com/products/${line_code}`)

        const data = await response.json()

        console.log("Product fetched:", data)
        setProduct(data)
      } catch (error) {
        console.error("Failed to fetch product", error)
      }
    }
    if(line_code) {
      fetchProduct()
    }
  }, [line_code])
  
    const { addItem, items, clearItems } = useDelivery()

    const handleAddToDelivery = () => {
      if (!product || quantity <= 0) return

      const deliveryItem = {
        line_code: product.line_code,
        product_description: product.line_description,
        quantity,
        unit_price: product.unit_price,
        supplier: product.supplier,
        stored: false
      }

      addItem(deliveryItem)
      alert("Item added to delivery")

      setQuantity(0)
    }

    const handleNewScan = () => {

      router.push("/scanner")
    }

    const handleConfirmDelivery = async () => {
      if(items.length === 0) {
        alert("No items in delivery")
        return
      }

      const supplier = items[0].supplier
      const user_id = auth.currentUser?.uid
      const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
      const vat_amount = +(subtotal * 0.15).toFixed(2)
      const total = +(subtotal + vat_amount).toFixed(2)
      const quantity = items.reduce((sum, item) => sum + item.quantity, 0)
      const stored = false

      try {
        const deliveryRes = await fetch("https://expoqrbackend.onrender.com/deliveries", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            user_id,
            supplier,
            subtotal,
            total,
            vat_amount,
            quantity
          })
        })

        const { deliv_id } = await deliveryRes.json()

        for(let item of items) {
          await fetch("https://expoqrbackend.onrender.com/delivery_items", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ ...item, deliv_id})
          })
        }

        clearItems()
        alert("Delivery submitted")
        router.replace("/")
      } catch (error) {
        console.error(error)
        alert("Failed to confirm delivery")
      }
    }
  
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
                {/*Header */}

                <View style={styles.header} >
                    <TouchableOpacity style={styles.backArrow} onPress={() => router.replace("/")}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Product Delivery</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Product Details Card */}
                <View style={styles.productCard} >
                    
                    {product ? (
                      <View style={styles.productHeader}>
                        <Image source={{ uri: product.image_url}} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.line_description}</Text>
                            <Text style={styles.productCategory}>{product.line_code}</Text>
                            <Text style={styles.productSupplier}>{product.supplier}</Text>
                            <Text style={styles.productPrice}>R{product.unit_price}</Text>
                            
                        </View>
                    </View>
                    ): (
                      <Text>Loading product...</Text>
                    )}


                    </View>

                    {/* Quantity Selection */}
                    <View style={styles.quantityCard}>
                    <Text style={styles.sectionTitle}>Delivery Quantity</Text>
                    <Text style={styles.sectionSubtitle}>How many items are you receiving?</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                          style={styles.quantityButton} 
                            onPress={() => setQuantity(Math.max(0, quantity - 1))} 
                            disabled={isDisabled}
                            >
                        <Ionicons name="remove" size={24} color="#374151" />
                        </TouchableOpacity>

                        <TextInput style={styles.quantityInput} value={quantity.toString()} keyboardType="numeric" textAlign="center" maxLength={4} />

                        <TouchableOpacity style={styles.quantityButton} onPress={() =>setQuantity(quantity + 1)}>
                        <Ionicons name="add" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {product && <Text style={styles.totalText}>Total Value: R{product?.unit_price *  quantity}</Text>}
                    </View>

                

                  
                    <View style={styles.quantityCard}>
                    <Text style={styles.sectionTitle}>Delivery Items</Text>
                    <ScrollView style={styles.scrollViewItems}>
                      <View >
                        {items.length === 0 ? 
                        <View style={{ justifyContent: "center", alignItems: "center"}}>
                          <Text style={styles.noItemsText}>No delivery Items yet</Text>
                        </View>
                          : (
                            items.map((item, idx) => (
                              <View key={item.line_code + idx} style={styles.itemsText}> 
                                <Text style={{paddingEnd: 80}}>{item.line_code}</Text>
                                <Text>{item.quantity}</Text>
                                <Text>R{item.quantity * item.unit_price}</Text>
                              </View>
                            ))
                          ) 
                        }
                      </View>
                    </ScrollView>
                  </View>
                  
                
                <View style={{ justifyContent: "center", alignItems: "center", gap: 10,flexDirection: "row"}}>
                  <TouchableOpacity style={styles.bottomButton} onPress={handleAddToDelivery}>
                    <AntDesign name="pluscircle" size={25} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Add to Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bottomButton} onPress={handleNewScan}>
                    <AntDesign name="pluscircle" size={25} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Scan New Item</Text>
                  </TouchableOpacity>
                  
                </View>
                <View style={styles.confirmView}>
                  <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDelivery}>
                      <Ionicons name="checkmark-circle" size={25} color="#FFFFFF"/>
                      <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
                  </TouchableOpacity>
                </View>

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
    marginBottom: 20,
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
    marginBottom: 30,
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
  noItemsText: {
    fontSize: 21,
    fontStyle: "italic",
    marginTop: 30,
    marginBottom: 20
  },
  itemsText: {
    gap: 70,
    flexDirection: "row",
    marginTop: 10

  },
  bottomButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 8,
    borderRadius: 12,
    paddingVertical: 8,
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
    height:70,
    width: 170
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 8,
    borderRadius: 12,
    paddingVertical: 8,
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
    height:70,
    width: 364
  },
  confirmView: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  itemsCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 20,
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
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
    
  },
  bottomPadding: {
    height: 32,
  },
  scrollViewItems: {
    height: 115,
    
  }
})
