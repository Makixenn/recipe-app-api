import { View, Text, Alert, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useState } from 'react';
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

const VerifyEmail = ({email, onBack}) => {
  const {isLoaded, signUp, setActive} = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false)

  const handleVerification = async() => {
    if(!isLoaded) return;

    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({code})

      if(signUpAttempt.status === "complete"){
        await setActive({session:signUpAttempt.createdSessionId})
      }else {
        Alert.alert("Error", "Verification failed. Please try again."); 
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }

    }catch (err) {
       Alert.alert("Error", err.error?.[0]?. message || "Verification failed");
       console.error(JSON.stringify(err, null, 2))

    }finally {
      setLoading(false);
    }
  }
  
  return (
    <View style = {authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" :"height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle = {authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source = {require("../../assets/images/i3.png")}
              style = {authStyles.image}
              contentFit='contain'
            />
          </View>
          {/* Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.title}>We&apos;ve sent a verification code to {email}</Text>

          <View style={authStyles.formContainer}>
            {/*  Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />

              {/* Verify Button */}
              <TouchableOpacity
                style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                onPress={handleVerification}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Verifiying..." : "Verify Email"}
                </Text>
              </TouchableOpacity>
              
              {/* Back to Sign Up */}
              <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                
                <Text style={authStyles.linkText}>
                  <Text style={authStyles.link}>Back to Sign Up</Text>
                </Text>

              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
        
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;