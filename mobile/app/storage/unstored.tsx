import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from 'react'
import { Picker } from "@react-native-picker/picker"



export default function UnstoredItems() {

    const [loading, setLoading] = useState(false)
    const [unstored, setUnstored] = useState<Item[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null)
    const [selectedRoom, setSelectedRoom] = useState<string>("")
    const [selectedLocation, setSelectedLocation] = useState<string>("")

    interface Item {
        id: string
        line_code: string
        deliv_id: string
        product_description: string
        quantity: number
        unit_price: number
        total_price: string
    }


    useEffect(() => {
        fetchNotStored()
    }, [])

    const fetchNotStored = async () => {
        try {
            setLoading(true)

            const response = await fetch(`https://expoqrbackend.onrender.com/storage/unstored`)
            const data = await response.json()

            setUnstored(data)
        } catch (error) {
            console.error("Error fetching unstored items", error)
        } finally {
            setLoading(false)
        }
    }

    const setLocation = async (itemId : string, room : string, location : string) => {
        try {
            const response = await fetch(
                `https://expoqrbackend.onrender.com/delivery_items/${itemId}/storage`,
                {
                    method: "PUT",
                    headers: { "Content-Type": 
                        "application/json"
                    },
                    body: JSON.stringify({ room_number: room, storage_location: location})
                }
            )
            if(!response.ok){
                throw new Error("Failed to update location")
            }
            const updatedItem = await response.json()

            alert("Location set!")

        } catch (error) {
            alert("Could not update locations. Please try again later.")
            console.error("Error updating location", error)
        } 
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchNotStored()
        setRefreshing(false)
    }

    const toggleExpanded = (id: string) => {

        if(expandedDelivery === id) {
            setExpandedDelivery(null)

            setSelectedLocation("")
            setSelectedRoom("")
        }
        else {
            setSelectedLocation("")
            setSelectedRoom("")
            setExpandedDelivery(id)
        }


    }

    if(loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Unstored Items</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.loadingText}>Loading items...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Unstored Items</Text>
                <TouchableOpacity >
                    <Ionicons name="refresh" size={24} onPress={onRefresh} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >

                {unstored.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={24} color="#9ca3af" />
                        <Text style={styles.emptyTitle}>No Unstored Items Found</Text>
                        <Text style={styles.emptySubtitle}>Unstored delivery items will be appear here</Text>
                    </View>
                ) : (
                    unstored.map((item) => (

                        <View key={item.id} style={styles.itemCard}>
                            <TouchableOpacity style={styles.itemHeader} onPress={() => toggleExpanded(item.id)}>
                                <View style={styles.itemMainInfo} >
                                    <View style={styles.itemTitleRow}>
                                        <Text style={styles.itemId}>#{item.id}</Text>
                                    </View>
                                    <Text style={styles.supplierName}>{item.line_code}</Text>
                                    <Text style={styles.supplierName}>{item.product_description}</Text>
                                    <Text style={styles.deliveryDate}>Delivery: #{item.deliv_id}</Text>
                                    
                                </View>
                                <View style={styles.itemStats}>
                                    <Text style={styles.itemTotal}>R{item.total_price}</Text>
                                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>

                                    <Ionicons name={expandedDelivery === item.id ? "chevron-up" : "chevron-down"} 
                                        size={20}
                                        color={"#6b7280"}
                                    />
                                </View>
                            </TouchableOpacity>

                            {expandedDelivery === item.id && (
                                <View style={styles.expandedView}>
                                    <View style={styles.comboView}> 
                                        <Text style={styles.locationText}>Room:</Text>
                                        <Picker 
                                            selectedValue={selectedRoom}
                                            onValueChange={(itemValue) => setSelectedRoom(itemValue)}
                                            style={{ height: 40, width: 150, borderWidth: 5, borderBlockColor: "#000000ff"}}
                                        >
                                            <Picker.Item label="Select room..." value="" />
                                            <Picker.Item label="ROOM1" value="ROOM1" />
                                            <Picker.Item label="ROOM2" value="ROOM2" />
                                            <Picker.Item label="ROOM3" value="ROOM3" />
                                        </Picker>
                                        <Text style={styles.locationText}>Location:</Text>
                                        <Picker
                                            selectedValue={selectedLocation}
                                            onValueChange={(loc) => setSelectedLocation(loc)}
                                            style={{ height: 40, width: 150}}
                                        >
                                            <Picker.Item label="Select locations..." value="" />
                                            <Picker.Item label="SHELF1" value="SHELF1" />
                                            <Picker.Item label="SHELF2" value="SHELF2" />
                                            <Picker.Item label="SHELF3" value="SHELF3" />
                                        </Picker>
                                    </View>
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity style={styles.setLocationButton} onPress={() => setLocation(item.id, selectedRoom, selectedLocation)} >
                                            <Text style={{ color: "#FFFFFF"}}>Set Item Location</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                )}
                
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
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 20,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb"
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827"
    },
    backArrow: {
        padding: 8
    },
    placeholder: {
        width: 40
    },
    refreshButton: {
        padding: 8
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6b7280"
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
        marginBottom: 8
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center"
    },
    itemCard: {
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
        elevation: 3
    },
    itemHeader: {
        flexDirection: "row",
        padding: 16,
        alignItems: "center"
    },
    itemMainInfo: {
        flex: 1,
    },
    itemTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    itemId: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginRight: 8,
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
    itemStats: {
        alignItems: "flex-end"
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: "600",
        color: "#059669",
        marginBottom: 2,
    },
    itemQuantity: {
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 4,
    },
    expandedView: {
        marginHorizontal: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    locationText: {
        fontSize: 16,
        fontWeight: '500'
    },
    comboView: {
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 20
    },
    buttonView: {
        paddingBottom: 20,
        paddingHorizontal: 40,
        flex: 1,
    },
    setLocationButton: {
        backgroundColor: "#2563eb",
        
        height: 40,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12
    },
    
    bottomPadding: {
        height: 32, 
    }

    
    
    
})