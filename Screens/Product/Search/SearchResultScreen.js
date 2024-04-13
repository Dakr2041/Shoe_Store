import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductItem from "../ProductItem";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";



const SearchResultScreen = ({ navigation, route }) => {
    const { results, searchInput } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('lowToHigh');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [items, setItems] = useState([
        { label: 'Low to High', value: 'lowToHigh', icon: () => <Icon name="arrow-up" size={18} color="#f7c458" /> },
        { label: 'High to Low', value: 'highToLow', icon: () => <Icon name="arrow-down" size={18} color="#f7c458" /> },

    ]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSearchResults(results);
        handleSortOrderChange(sortOrder);
    }, []);

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        let sortedResults = [...results]; // Create a copy of the results array

        if (order === 'lowToHigh') {
            sortedResults.sort((a, b) => a.price - b.price);
        } else if (order === 'highToLow') {
            sortedResults.sort((a, b) => b.price - a.price);
        }

        setSearchResults(sortedResults);
    };

    const handlePriceRangeChange = (field, value) => {
        setPriceRange(prevState => ({ ...prevState, [field]: value }));
        // TODO: Filter the results based on the selected price range
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        } else if (!searchResults.length) {
            return <Text>No products found.</Text>;
        } else {
            const rows = [];
            for (let i = 0; i < searchResults.length; i += 2) {
                const rowProducts = [];
                for (let j = i; j < i + 2 && j < searchResults.length; j++) {
                    rowProducts.push(
                        <View key={searchResults[j].id} >
                            <ProductItem product={searchResults[j]} onPress={() => handleProductPress(searchResults[j])} />
                        </View>
                    );
                }
                rows.push(
                    <View key={i} style={styles.row}>
                        {rowProducts}
                    </View>
                );
            }
            return <View>{rows}</View>;
        }
    };

    const handleSearchPress = () => {
        navigation.navigate('Search');
    };

    return (
        <View style={styles.container}>
            <LinearGradient style={{
                borderRadius: 15,
                paddingTop: 20,
                elevation: 5, // Add shadow for Android
                shadowColor: '#000', // Add shadow for iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            }}
                colors={['#f7c458', '#fea239']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <TouchableOpacity onPress={handleSearchPress}>
                    <View style={styles.searchView}>
                        <Icon name='search' size={20} ></Icon>
                        <Text style={{ opacity: 0.5, marginStart: 15 }}>{searchInput}</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
            

            <View style={styles.filterContainer}>

                <Text style={{ fontSize: 16, fontWeight: 'bold', alignItems: 'flex-end' }}>Sort by price:</Text>
                <DropDownPicker
                    items={items}
                    setItems={setItems}
                    open={open}
                    setOpen={setOpen}
                    value={sortOrder}
                    setValue={setSortOrder}
                    containerStyle={{ height: 40, width: 150, zIndex: 1000 }}
                    style={styles.dropdownPicker}
                    dropDownContainerStyle={{ backgroundColor: '#fafafa', borderWidth: 0 }}
                    onSelectItem={(item) => handleSortOrderChange(item.value)}
                />

            </View>

            <View style={styles.list}>
                <ScrollView >
                    {renderContent()}
                </ScrollView>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    searchView: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#ebecf0',
        paddingVertical: 9,
        paddingEnd: 9,
        padding: 20,
        marginTop: 45,
        marginHorizontal: 20,
        marginBottom: 20,
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
    },

    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'flex-end',
        width: '100%',
    },
    dropdownPicker: {
        width: '100%',
        borderWidth: 0,
        elevation: 5, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    priceRange: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        padding: 10,
    },
    list: {
        flex: 1,
        justifyContent: 'flex-end',
    },
})

export default SearchResultScreen;