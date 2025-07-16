"use client"

import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image
} from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from "expo-router"
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { FirebaseError } from 'firebase/app'

export default function SignIn () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all required fields")
            return
        }
        setLoading(true)

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if(!user.emailVerified) {
                Alert.alert("Email Not Verified", "Please verify your email before signing in. Would you like us to send another email?",
                    [{
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Resend",
                        onPress: async () => {
                            try {
                                await sendEmailVerification(user)
                                Alert.alert("Success", "Email verification sent")
                            } catch (error) {
                                Alert.alert("Error", "Failed to send verification email. Please try again.")
                            }
                        }
                    }
                ]
                )
                return
            }

            console.log("Sign in successful", user.uid)

            Alert.alert("Success!", "Welcome to Surgicom Nettworx", 
                [{
                    text: "OK", onPress:() => router.push("/")
                    
                }]
            )
        } catch (error) {
            console.log("Sign in error.", error)

            let errorMessage = "Invalid email or password. Please try again."

           if(error instanceof FirebaseError) {
            
            switch (error.code) {
                 case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address."
                    break
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled. Please contact support."
                    break
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email. Please sign up first."
                    break
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password. Please try again."
                    break
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later."
                    break
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your connection and try again."
                    break
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please check your credentials."
                    break
            }
        }

            Alert.alert("Sign in Failed", errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return(
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView} >
                <ScrollView contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false} >
                    {/* header */}
                    <View style={styles.header} >
                        <View style={styles.logoContainer} >
                            
                            <Image source={require("../../assets/images/SurgicomLogo.png")} />
                        </View>
                        <Text style={styles.title}>Surgicom Networx</Text>
                        <Text style={styles.subtitle}>Healthcare Professional Network</Text>
                    </View>

                    {/*Sign in form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Welcome Back</Text>
                        <Text style={styles.formSubtitle}>Sign in to your account</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.textInput}
                                    placeholder="email@domain.com"
                                    placeholderTextColor="#9ca3af"
                                    value = {email}
                                    onChangeText = {setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                            </View>
                        </View>
                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} colors="#6b7280" 
                                style={styles.inputIcon} />
                                <TextInput 
                                    style={[styles.textInput, styles.passwordInput]}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9ca3af"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}>
                                    <Ionicons 
                                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#6b7280" 
                                    />
                                    
                                </TouchableOpacity>
                                
                            </View>
                        </View>

                        {/* Remember me and Forgot password */}

                        <View style={styles.optionsRow}>
                            <TouchableOpacity style={styles.rememberMe}>
                                <Ionicons name="checkbox-outline" size={20} color="#2563eb" />
                                <Text style={styles.rememberText}>Remember me</Text>
                            </TouchableOpacity>
                            <Link href="/(auth)/forgotpassword" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.forgotText}>Forgot password?</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                            {/* Sign In Button */}
                            <TouchableOpacity
                                style={[ styles.signInButton, loading && styles.buttonDisabled]}
                                onPress={handleSignIn}
                                disabled={loading} 
                            >
                                {loading ? <ActivityIndicator color="#ffffff" /> :
                                <Text style={styles.signInButtonText}>Sign In</Text> }
                            </TouchableOpacity>

                            {/* Sign Up Link */}
                            <View style={styles.signUpContainer}>
                                <Text style={styles.signUpText}>Don't have an account?</Text>
                                <Link href="/(auth)/signup" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.signUpLink}>Create account</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                By signing in, you agree to our 
                                <Text style={styles.footerLink}>
                                    Terms of Service
                                </Text>
                                and{" "}
                                <Text style={styles.footerLink} >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffefe",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    }, 
    header: {
        alignItems: "center",
        marginTop: 40,
        marginBottom: 40,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: "#2563eb",
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    }, 
    title : {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    }, 
    subtitle: {
        fontSize: 16,
        color: "#6b7280"
    },
    formContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#111827",
        textAlign: "center",
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#ffffff"
    },
    inputIcon: {
        marginLeft: 12,

    },
    textInput: {
        flex: 1,
        height: 48,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#111827",
    },
    passwordInput: {
        paddingRight: 48,
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        padding: 4,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    rememberMe: {
        flexDirection: "row",
        alignItems: "center",
    },
    rememberText: {
        fontSize: 14,
        color: "#6b7280",
        marginLeft: 8,
    },
    forgotText: {
        fontSize: 14,
        color: "#2563eb",
        fontWeight: "500",
    },
    signInButton: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    }, 
    signInButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    signUpText: {
        fontSize: 16,
        color: "#6b7280",
    },
    signUpLink: {
        fontSize: 16,
        color: "#2563eb",
        fontWeight: "500",
    },
    footer: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    footerText: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 18,
    },
    footerLink: {
        color: "#2563eb"
    }
})