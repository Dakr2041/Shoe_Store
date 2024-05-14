import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from "react-native-gesture-handler";
import { API_URL } from "../../Api";
import ProductItem from "../ProductItem";
import SearchProductItem from "./SearchProductItem";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');


    useEffect(() => {
        searchProducts(searchInput);
    }, []);

    const searchProducts = async (searchData) => {
        setIsSearchLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchData: searchData }),
            });
            const data = await response.json();
            if (data.status === 200) {



                if (data.data === null) {
                    // setSearchResults(products);

                } else {
                    setSearchResults(data.data);
                }

            } else {
                console.error('Error searching products:', response.statusText);
            }
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsSearchLoading(false);
        }
    };

    const handleSearchTextChange = (text) => {
        searchProducts(text);
        setSearchInput(text);
    };

    const handleSearchPress = () => {
        if (searchInput.trim() !== '') {
            navigation.navigate('SearchResult', { results: searchResults, searchInput: searchInput });
        } else {
            alert('Please enter a search term');
        }
    };



    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };
    return (
        <View>
            <LinearGradient style={{
                borderRadius: 15,
                paddingTop: 20,
                elevation: 5, // Add shadow for Android
                shadowColor: '#000', // Add shadow for iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            }} colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                    marginTop: 40,
                    paddingStart: 5,
                }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ margin: 10 }}>
                        <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.searchView}>
                        <Icon name='search' size={20}></Icon>

                        <TextInput
                            placeholder="Search"
                            style={{ marginLeft: 10, width: '100%' }}
                            onChangeText={handleSearchTextChange}
                            onSubmitEditing={handleSearchPress}
                            autoFocus={true}
                        ></TextInput>

                    </View>
                </View>

            </LinearGradient>

            {isSearchLoading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <SearchProductItem product={item} onPress={() => handleProductPress(item)} />
                    )}
                />
            )}


        </View>
    )
}

const styles = StyleSheet.create({
    searchView: {
        flex: 1,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#ebecf0',
        paddingVertical: 9,
        paddingEnd: 9,
        padding: 20,
        marginEnd: 20,
        flexDirection: 'row',
        alignItems: 'center',
        spaceBetween: 'center',
        elevation: 5, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    searchItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})

export default SearchScreen;