import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductItem from "../ProductItem";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";



const SearchResultScreen = ({ navigation, route }) => {
    const { results, searchInput } = route.params;
    console.log("results", results);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('lowToHigh');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        // TODO: Sort the results based on the selected order
    };

    const handlePriceRangeChange = (field, value) => {
        setPriceRange(prevState => ({ ...prevState, [field]: value }));
        // TODO: Filter the results based on the selected price range
    };

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

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        } else if (!results.length) {
            return <Text>No products found.</Text>;
        } else {
            const rows = [];
            for (let i = 0; i < results.length; i += 2) {
                const rowProducts = [];
                for (let j = i; j < i + 2 && j < results.length; j++) {
                    rowProducts.push(
                        <View key={results[j].id} >
                            <ProductItem product={results[j]} onPress={() => handleProductPress(results[j])} />
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
                paddingTop: 20
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

            {/* <View style={styles.filterContainer}>

                <View style={styles.priceRange}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            placeholder="Min"
                            value={priceRange.min}
                            onChangeText={(text) => handlePriceRangeChange('min', text)}
                            style={{ width: 80 }}
                        />
                        <Icon name='minus' size={10} />
                        <TextInput
                            placeholder="Max"
                            value={priceRange.max}
                            onChangeText={(text) => handlePriceRangeChange('max', text)}
                            style={{ width: 80, marginStart: 10 }}
                        />
                    </View>
                </View>

                <View style={styles.dropdownPicker}>
                    <Picker
                        selectedValue={sortOrder}
                        onValueChange={handleSortOrderChange}
                        style={{ width: 150 }}
                    >
                        <Picker.Item label="Low to High" value="lowToHigh" />
                        <Picker.Item label="High to Low" value="highToLow" />
                    </Picker>
                </View>
            </View> */}

            <ScrollView style={styles}>
                {renderContent()}
            </ScrollView>
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
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
    },
    dropdownPicker: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    priceRange: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        padding: 10,
    },
})

export default SearchResultScreen;