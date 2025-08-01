import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

export default function LogInScreen () {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({username: '', password: ''});
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Hardcoded credentials
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'admin';

    const showAlert = (title: string, message: string, onPress?: () => void) => {
        if (Platform.OS === 'web') {
            // For web, use browser's native alert or custom message
            const userConfirmed = window.confirm(`${title}: ${message}`)
            if (userConfirmed && onPress) {
                onPress();
            }
        } else { // For mobile, use React Native alert
            Alert.alert(title, message, [
                {
                    text: 'OK',
                    onPress: onPress
                }
            ]);
        }
    };

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least three characters';
        }
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 3) {
            newErrors.password = 'Password must be at least three characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleLogin = async (): Promise<void> => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setLoginError('');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Check credentials
            if (checkCredentials(formData.username, formData.username)) {
                // Success - navigate directly using router
                router.push('/components/item_list');
            } else { // Show error message (web-compatible)
                if (Platform.OS === 'web') {
                    setLoginError('Invalid username or password. Please check your credentials and try again.');
                } else {
                    showAlert(
                        'Login Failed',
                        'Invalid username or password. Please check your credentials and try again.'
                    );
                }
            }
        } catch (error) { // Handle network or other errors
            if (Platform.OS === 'web') {
                setLoginError('Login failed due to a network error. Please check your connection and try again.');
            } else {
                showAlert(
                    'Error',
                    'Login failed due to a network error. Please check your connection and try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const checkCredentials = (username: string, password: string): boolean => {
        return username === VALID_USERNAME && password === VALID_PASSWORD;
    };

    // Handle input change
    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
        // Clear login error when user starts typing
        if (loginError) {
            setLoginError('');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    return(
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps='handled'
            >
                <View style={styles.formContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to TestApp!</Text>
                        <Text style={styles.subtitle}>Log in the credentials</Text>
                    </View>

                    {/* Login Error Message for Web*/}
                    {loginError && Platform.OS === 'web' && (
                        <View style={styles.alertContainer}>
                            <Ionicons name='warning' size={20} color='#ff4444'/>
                            <Text style={styles.alertText}>{loginError}</Text>
                        </View>
                    )}

                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                            name='person-outline'
                            size={20}
                            color='#666'
                            style={styles.inputIcon}
                            />
                            <TextInput
                            style={styles.textInput}
                            placeholder="Enter your username"
                            placeholderTextColor='#999'
                            value={formData.username}
                            onChangeText={(text) => handleInputChange('username', text)}
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={!isLoading}
                            />
                        </View>
                        {errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                            name='lock-closed-outline'
                            size={20}
                            color='#666'
                            style={styles.inputIcon}
                            />
                            <TextInput
                            style={styles.textInput}
                            placeholder='Enter your password'
                            placeholderTextColor='#999'
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry={!showPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={!isLoading}
                            />
                            <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.eyeIcon}
                            disabled={isLoading}
                            >
                                <Ionicons
                                name={showPassword? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color='#666'
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                    style={[
                        styles.loginButton,
                        isLoading && styles.loginButtonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    >
                        {isLoading? (
                            <ActivityIndicator color='#fff' size='small'/>
                        ): (
                            <Text style={styles.loginButtonText}>Log In!</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flex: 1,
        backgroundColor: '#0066cc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                padding: 0,
            },
            android: {
                padding: 0,
            },
            default: {
                padding: 0,
            },
        })
    },
    formContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: 400,
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
    },
    alertContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff5f5ff',
        borderColor: '#ff4444',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15
    },
    alertText: {
        color: '#ff4444',
        fontSize: 15,
        marginLeft: 10,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        paddingHorizontal:15,
        height: 50,
    },
    label: {
        fontSize: 15,
        fontWeight: 600,
        color: '#1a1a1a',
        marginBottom: 10,
    },
    inputIcon: {
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        fontSize: 15,
        color: '#ff4444',
        marginTop: 8,
        marginLeft: 4,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    loginButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    }
});