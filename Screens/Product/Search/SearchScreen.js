import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from "react-native-gesture-handler";
import { API_URL } from "../../Api";
import ProductItem from "../ProductItem";
import SearchProductItem from "./SearchProductItem";

const SearchScreen = ({ navigation }) => {
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');

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

                console.log(data);

                if (data.data === null) {
                    // setSearchResults(products);
                    console.log('No products found');
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
        navigation.navigate('SearchResult',{ results: searchResults, searchInput: searchInput });
    };
    console.log(searchResults);

    return (
        <View>
            <LinearGradient style={{ borderRadius: 15, paddingTop: 20 }} colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.searchView}>
                    <Icon name='search' size={20} style={{ alignItems: 'flex-end' }}></Icon>

                    <TextInput
                        placeholder="Search for products"
                        style={{ marginLeft: 10, width: '100%' }}
                        onChangeText={handleSearchTextChange}
                        onSubmitEditing={handleSearchPress}
                        autoFocus={true}
                    ></TextInput>

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
        height: 50,
        borderRadius: 20,
        backgroundColor: '#ebecf0',
        paddingVertical: 9,
        paddingEnd: 9,
        padding: 20,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        spaceBetween: 'center',
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