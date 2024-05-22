import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, Platform, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/context/AuthContext';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from './graphql/mutations'; // Ensure this path is correct and points to your GraphQL mutations file
import Lottie from 'lottie-react-native';
import { View, AlertCircleIcon, Image, Text, HStack, Divider, Box,
   Button, FormControl, FormControlLabel,  FormControlError,
    FormControlErrorIcon, FormControlErrorText, FormControlHelper
    , FormControlHelperText, FormControlLabelText, Input, InputField,
     ButtonText, ButtonIcon, AddIcon,
     SafeAreaView, KeyboardAvoidingView,  
     VStack} from '@gluestack-ui/themed';

     const screenHeight = Dimensions.get('window').height;
     const signupBtnMarginTop = -screenHeight + screenHeight * 0.999;

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [signIn, { data, loading: mutationLoading, error: mutationError }] = useMutation(SIGN_IN);

  useEffect(() => {
    if (mutationError) {
      console.error('Sign In Error:', mutationError.message); // Log the entire error message
      Alert.alert('Sign In Error', mutationError.message);
    }
  }, [mutationError]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await signIn({ variables: { email, password } });
      if (response.data.signIn.token && response.data.signIn.user) {
        await AsyncStorage.setItem('userToken', response.data.signIn.token);
        authContext.setCurrentUser(response.data.signIn.user);
        navigation.navigate('(tabs)');
      } else {
        throw new Error('Sign-in failed, no token or user ID received.');
      }
    } catch (error) {
      console.error('Error during sign in:', error); // Log the entire error trace
      Alert.alert('Error', error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || mutationLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
     
    <Lottie 
    source={require("./animations/see_no_evil.json")}
    loop={true}
    autoPlay={true}
    style={styles.animationContainer}
    />
  
  

  <Text style={styles.title}>Sign In to SprinTelex</Text>
  <Box h="50%" w="90%" >
  <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "height" : "height"}
  style={{ flex: 1, zIndex: 999 }}
>
<FormControl
size="md"
isDisabled={false}
isInvalid={false}
isReadOnly={false}
isRequired={false}
>
<VStack space="md">
      
      <Input>
        <InputField 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        type="text" 
        style={styles.input}

        />
      </Input>
    

<Input>
  <InputField
   type="password"
   placeholder="Password"
   secureTextEntry
   value={password}
   onChangeText={setPassword}
   style={styles.input}
   />
</Input>

<FormControlError>
  <FormControlErrorIcon as={AlertCircleIcon} />
  <FormControlErrorText>
    At least 6 characters are required.
  </FormControlErrorText>
</FormControlError>

<Button
onPress={handleSignIn}
size="md"
variant="solid"
action="primary"
isDisabled={false}
isFocusVisible={false}
style={styles.loginBtn}
>
<ButtonText style={{fontFamily: 'InstagramSansBold'}}>Log In </ButtonText>
</Button>
<HStack space="sm"  alignItems="center">
  <Divider bg="$trueGray300" w={'45%'} />
  <Text size="xs" color="$trueGray300">
    Or
  </Text>
  <Divider bg="$trueGray300" w={'45%'} />

</HStack>

<Button
size="md"
variant="outline"
action="secondary"
isDisabled={false}
isFocusVisible={false}
>
<ButtonIcon as={AddIcon} />
<ButtonText style={{fontFamily: 'InstagramSansBold'}}>Continue With Apple </ButtonText>

</Button>
<View style={{ marginTop: signupBtnMarginTop }}>
<Button
size="md"
variant="solid"
action="positive"
isDisabled={false}
isFocusVisible={false}
mt={160}
style={styles.signupBtn}
onPress={() => navigation.navigate('SignupScreen')}
>
<ButtonText style={{fontFamily: 'InstagramSansBold'}}>Sign Up</ButtonText>

</Button>
</View>
</VStack>
</FormControl>
</KeyboardAvoidingView>
 
</Box>

</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    width: 140,
    marginTop: 20,
  },
  loginBtn: {
    backgroundColor: '#007AFF',
    

  },
  signupBtn: {
    backgroundColor: '#4BB34B',
    position: 'relative',
    bottom: 0, // Move the button to the bottom of its container
    marginBottom: 20, // Add some margin to separate it from the other content
  },  
  
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'InstagramSansBold'
  },
  input: {
    fontFamily: 'InstagramSans'

  },
});

export default SigninScreen;