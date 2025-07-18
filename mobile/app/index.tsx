import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ActivityIndicator } from "react-native";
import { Link, router, Stack, Redirect } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { auth } from "@/config/firebase";
import { useEffect,useState } from "react";




export default function Home() {



  const [permission, requestPermission] = useCameraPermissions()
  const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if(!user) {
        router.replace("/(auth)/signin")
      } else {
        setCheckingAuth(false)
      }
    })
    return unsubscribe
  }, [])

  

  const handlePermission = async () => {

    if(!permission?.granted) {
      const { granted } = await requestPermission()

      if(!granted) {
        return
      }
      
    }

    router.push("/scanner")

  }

  const isPermissionGranted = Boolean(permission?.granted)

  if(checkingAuth) {
    return(
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1f7aa4" />
      </View>
      
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Image source={require("../assets/images/SurgicomLogo.png")} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 20 }}>
        
        
          <Pressable onPress={handlePermission} >
            <Text style={[
              styles.buttonStyle,
              //{opacity: !isPermissionGranted ? 0.5 : 1},
              
            ]}>
              Scan Code
            </Text>
          </Pressable>
        
        <Link href={"/(auth)/signin"} asChild>
            <Pressable>
              <Text style={styles.buttonStyle} >
                Sign In Page
              </Text>
            </Pressable>
        </Link>
        <Link href={"/(auth)/signup"} asChild>
            <Pressable>
              <Text style={styles.buttonStyle} >
                Sign Up Page
              </Text>
            </Pressable>
        </Link>
        <Link href={"/(auth)/forgotpassword"} asChild>
            <Pressable>
              <Text style={styles.buttonStyle} >
                Forgot Password Page
              </Text>
            </Pressable>
        </Link>
        <Link href={"deliveries/product-scanned"} asChild>
            <Pressable>
              <Text style={styles.buttonStyle} >
                Product Scanned Page
              </Text>
            </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fffefe",
    justifyContent: "space-around",
    paddingVertical: 0
  },
  title: {
    color: "black",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#1f7aa4ff",
    fontSize: 20,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  }
});
