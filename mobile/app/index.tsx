"use client"

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { router, Stack } from "expo-router"
import { useCameraPermissions } from "expo-camera"
import { auth } from "@/config/firebase"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/(auth)/signin")
      } else {
        setCheckingAuth(false)
      }
    })
    return unsubscribe
  }, [])

  const handlePermission = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission()
      if (!granted) {
        return
      }
    }
    router.push("/scanner")
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.replace("/(auth)/signin")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (checkingAuth) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={require("../assets/images/SurgicomLogo.png")} style={styles.logo} />
          <Text style={styles.title}>Surgicom Nettworx</Text>
          <Text style={styles.subtitle}>Healthcare Professional Network</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          {/* Primary Action - QR Scanner */}
          <TouchableOpacity style={styles.primaryAction} onPress={handlePermission}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="qr-code-outline" size={32} color="#ffffff" />
            </View>
            <Text style={styles.primaryActionTitle}>Scan QR Code</Text>
            <Text style={styles.primaryActionSubtitle}>Scan product codes for delivery tracking</Text>
          </TouchableOpacity>

          {/* Secondary Actions Grid */}
          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push("/deliveries/recent-deliveries")}>
              <View style={styles.secondaryIconContainer}>
                <Ionicons name="time-outline" size={24} color="#2563eb" />
              </View>
              <Text style={styles.secondaryActionTitle}>Recent Deliveries</Text>
              <Text style={styles.secondaryActionSubtitle}>View delivery history</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.secondaryActionsGrid}>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push("/storage/unstored")}>
            <View style={styles.secondaryIconContainer}>
              <Ionicons name="cube-outline" size={24} color="#2563eb" />
            </View>
            <Text style={styles.secondaryActionTitle}>Unstored Items</Text>
            <Text style={styles.secondaryActionSubtitle}>View and store items</Text>
          </TouchableOpacity>
        </View>
        </View>

        

        {/* Quick Stats 
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>R2,450</Text>
              <Text style={styles.statLabel}>Value</Text>
            </View>
          </View>
        </View>

        */}

        {/* Settings & Profile */}
        <View style={styles.bottomActions}>
          

          <TouchableOpacity style={styles.bottomAction} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={[styles.bottomActionText, { color: "#ef4444" }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    marginTop: 40,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  actionsContainer: {
    marginBottom: 5,
  },
  primaryAction: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  primaryActionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: "#bfdbfe",
    textAlign: "center",
  },
  secondaryActionsGrid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  secondaryAction: {
    backgroundColor: "#f7efefff",
    borderRadius: 12,
    padding: 16,
    width: 340,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center"
  },
  secondaryIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  statsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  bottomActions: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  bottomActionText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
})
