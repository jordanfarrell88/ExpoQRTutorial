"use client"

import { auth } from "@/config/firebase"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { LinearGradient } from 'expo-linear-gradient'

interface DeliveryItem {
  line_code: string
  product_description: string
  quantity: number
  unit_price: number
  total_price: string
}

interface Delivery {
  deliv_id: string
  user_id: string
  supplier: string
  subtotal: number
  total: number
  vat_amount: number
  quantity: number
  delivered_at: string
  items: DeliveryItem[]
}

export default function RecentDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null)
  

  // Mock data for demonstration - replace with your API call
  

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
        setLoading(true)

        //const userId= auth.currentUser?.uid
        const userId = "jordan123"
        const response = await fetch(`https://expoqrbackend.onrender.com/deliveries/recent`)
        const data = await response.json()

        setDeliveries(data)
    } catch (error) {
        console.error("Error fetching deliveries", error)
        
        
    } finally {
        setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDeliveries()
    setRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      
    })
  }

  const toggleExpanded = (deliveryId: string) => {
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId)
  }

  const handleDelete = (delivId: string) => {
    Alert.alert("Delete Delivery", "Are you sure you want to delete this delivery?",
            [{
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: async () => {
                    try {
                        const res = await fetch(`https://expoqrbackend.onrender.com/deliveries/${delivId}`, {
                            method: "DELETE",
                        })
                        if(!res.ok) throw new Error("Failed to delete delivery")
                            
                        setDeliveries((prev) => prev.filter((d) => d.deliv_id !== delivId))
                        setExpandedDelivery(null)

                        Alert.alert("Product deleted?")
                    } catch (error) {
                        console.error("Could not delete delivery", error)
                        Alert.alert("Error: Could not delete delivery", "Please try again later")
                    }
                }
            }]
        ) 
  }

  const handlePrint = async (delivery: Delivery) => {
    
    const html = `
    <html>
      <body>
        <h1>Invoice: #${delivery.deliv_id}</h1>
        <h2><strong>Supplier:</strong> ${delivery.supplier}</h2>
        <p><strong>Date:</strong> ${new Date(delivery.delivered_at).toLocaleDateString()}</p>
        <hr />
        <table border="1" cellpadding="5" cellspacing="0" width="100%">
          <tr>
            <th>Line Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
          ${delivery.items.map((item: { line_code: any; product_description: any; quantity: number; unit_price: number }) => `
            <tr>
              <td>${item.line_code}</td>
              <td>${item.product_description}</td>
              <td>${item.quantity}</td>
              <td>R${item.unit_price}</td>
              <td>R${(item.unit_price * item.quantity)}</td>
            </tr>
          `).join('')}
        </table>
        <hr />
        <p><strong>Subtotal:</strong> R${delivery.subtotal}</p>
        <p><strong>VAT (15%):</strong> R${delivery.vat_amount}</p>
        <p><strong>Total:</strong> R${delivery.total}</p>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({ html })

    if(await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share Invoice'})
    } else {
      alert("Sharing not available on this device")
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recent Deliveries</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading deliveries...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Deliveries</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, position: 'relative', marginTop: 10 }} >

        <LinearGradient 
          colors= {['rgba(248, 250, 252, 1)', 'transparent',]}
          style={styles.topFade}
          start= {{ x: 0, y: 0}}
          end= {{ x: 0, y: 1}}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Summary Stats 
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Delivery Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{deliveries.length}</Text>
                <Text style={styles.statLabel}>Total Deliveries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{deliveries.reduce((sum, delivery) => sum + delivery.quantity, 0)}</Text>
                <Text style={styles.statLabel}>Items Delivered</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  R{deliveries.reduce((sum, delivery) => sum + delivery.total, 0).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Total Value</Text>
              </View>
            </View>
          </View>

          */}

          {/* Deliveries List */}
          {deliveries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No Deliveries Found</Text>
              <Text style={styles.emptySubtitle}>Your recent deliveries will appear here</Text>
            </View>
          ) : (
            deliveries.map((delivery) => (
              <View key={delivery.deliv_id} style={styles.deliveryCard}>
                <TouchableOpacity style={styles.deliveryHeader} onPress={() => toggleExpanded(delivery.deliv_id)}>
                  <View style={styles.deliveryMainInfo}>
                    <View style={styles.deliveryTitleRow}>
                      <Text style={styles.deliveryId}>#{delivery.deliv_id}</Text>
                      
                    </View>
                    <Text style={styles.supplierName}>{delivery.supplier}</Text>
                    <Text style={styles.deliveryDate}>{formatDate(delivery.delivered_at)}</Text>
                  </View>
                  <View style={styles.deliveryStats}>
                    <Text style={styles.deliveryTotal}>R{delivery.total}</Text>
                    <Text style={styles.deliveryQuantity}>{delivery.quantity} items</Text>
                    
                    <Ionicons
                      name={expandedDelivery === delivery.deliv_id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                </TouchableOpacity>

                {expandedDelivery === delivery.deliv_id && (
                  <View style={styles.deliveryDetails}>
                    <View style={styles.detailsHeader}>
                      <Text style={styles.detailsTitle}>Delivery Items</Text>
                      <TouchableOpacity style={{ paddingLeft: 220}} onPress={() => handlePrint(delivery)} >
                        <Ionicons style={styles.deleteIcon} name="document-outline" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(delivery.deliv_id)}>
                          <Ionicons style={styles.deleteIcon} name="trash" />
                      </TouchableOpacity>
                    </View>

                    {delivery.items.map((item, index) => (
                      <View key={`${item.line_code}-${index}`} style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemCode}>{item.line_code}</Text>
                          <Text style={styles.itemDescription}>{item.product_description}</Text>
                        </View>
                        <View style={styles.itemStats}>
                          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                          <Text style={styles.itemPrice}>R{(item.unit_price * item.quantity)}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.deliveryTotals}>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text style={styles.totalValue}>R{delivery.subtotal}</Text>
                      </View>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>VAT (15%):</Text>
                        <Text style={styles.totalValue}>R{delivery.vat_amount}</Text>
                      </View>
                      <View style={[styles.totalRow, styles.finalTotal]}>
                        <Text style={styles.finalTotalLabel}>Total:</Text>
                        <Text style={styles.finalTotalValue}>R{delivery.total}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>

        <LinearGradient 
          colors={['transparent', 'rgba(248, 250, 252, 1)']}
          style={styles.bottomFade}
          start= {{ x: 0, y: 0}}
          end={{ x: 0, y: 1}}
        />
      </View>
        <View style={styles.buttonView}>
        <TouchableOpacity style={styles.newOrderButton} onPress={() => router.push("/scanner")}>
            <Text style={styles.orderButtonText}>Scan new delivery</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomFade: {
    position: 'absolute', 
    left: 0,
    right: 0,
    bottom: 0,
    height: 60
  },
  topFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -10,
    height: 30,
    zIndex: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
    paddingTop: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 0,
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
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  deliveryCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  deliveryMainInfo: {
    flex: 1,
  },
  deliveryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  supplierName: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
    marginBottom: 2,
  },
  deliveryDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  deliveryStats: {
    alignItems: "flex-end",
  },
  deliveryTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 2,
  },
  deliveryQuantity: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  deliveryDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 16,
    paddingTop: 12,
  },
  detailsHeader: {
    marginBottom: 12,
    flexDirection: "row"
  },
  deleteButton: {
    paddingLeft: 25,
  },
  deleteIcon: {
    
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemCode: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    color: "#374151",
  },
  itemStats: {
    alignItems: "flex-end",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  deliveryTotals: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 14,
    color: "#374151",
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  finalTotalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  bottomPadding: {
    height: 32,
  },
  newOrderButton: {
    backgroundColor: "#2563eb",
    height: 70,
    width: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonView: {
    marginBottom: 20,
    marginHorizontal: 33,
    height: 100,
    width: 300,
    justifyContent: "center",
    alignItems: 'center'
  },
  orderButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    
  }
})
