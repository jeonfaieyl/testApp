import { Ionicons } from '@expo/vector-icons';
// import { Button } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, } from 'react-native-safe-area-context';
import LogOutScreen from './log_out';

type BusinessUnit = {
    CODE: string;
    DESCRIPTION: string;
};

export default function ItemList () {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [data, setData] = useState<BusinessUnit[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const getItemList = async() => {
        try{
            const response = await fetch('http://192.168.99.230:8082/phpwebsite1/database_connection/database.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            if (!json.data) {
                throw new Error('Data format error: Missing "data" field');
            }
            setData(json.data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('Failed to fech item list: ', error);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const filteredData = data.filter (item =>
        item.CODE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const ITEM_HEIGHT = 15;

    useEffect(() => {
        getItemList();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.topContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                            name='search-outline'
                            size={20}
                            style={styles.inputIcon}
                            color='#666'
                            />
                            <TextInput
                            style={styles.textInput}
                            placeholder='Search by code or description...'
                            placeholderTextColor='#999'
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            />
                        </View>
                        <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => setModalVisible(true)}>
                            <Ionicons
                            name='log-out-outline'
                            size={20}
                            color='white'
                            style={styles.inputIcon}
                            />
                            <Modal
                            animationType='fade'
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.centeredView}>
                                    <LogOutScreen />
                                </View>
                            </Modal>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listContainer}>
                        {isLoading ? (
                            <ActivityIndicator size='large' color='#0000ff' style={styles.activityIndicator}/>
                        ) : error ? (
                            <Text style={styles.itemText}>{error}</Text>
                        ) : (
                        <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.CODE}
                        renderItem={({ item }) => (
                            <Text
                            style={styles.itemText}
                            >
                                {item.CODE} - {item.DESCRIPTION}
                            </Text>
                        )}
                        getItemLayout={(data, index) => (
                            {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                        )}
                        />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 10,
    },
    formContainer: {
        padding: 10,
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    inputWrapper: {
        padding: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a1a1a',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        height: 50,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        height: '100%',
    },
    inputIcon: {
        padding: 5,
    },
    listContainer: {
        flex: 1,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#f8f9fa',
    },
    itemText: {
        fontSize: 12,
        height: 15,
    },
    activityIndicator: {
        alignItems: 'center',
    },
    topContainer: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        padding: 5,
    },
    logoutButton: {
        padding: 5,
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
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim the background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});