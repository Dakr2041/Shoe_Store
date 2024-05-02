import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, FlatList, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { formatVND } from '../Functions/FormatVND';
import moment from 'moment';
import 'moment/locale/vi';

const iconFavourite = require('../Product/favourite_icon.png');

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [StoredToken, setStoredToken] = useState(null);
  const [showCommentList, setShowCommentList] = useState(false);

  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);

  const [listTranslateY, setListTranslateY] = useState(new Animated.Value(0));


  const today = moment();


  useEffect(() => {
    const { product } = route.params;
    setProduct(product);
    setIsLoading(false);
  }, [route.params]);

  useEffect(() => {
    const fetchTOKEN = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setStoredToken(storedToken ? String(storedToken) : null);
      } catch (error) {
        console.error('Error fetching Token from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTOKEN();
  }, []);

  const fetchComments = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/getProduct/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${StoredToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Comments fetched:', data);
      setComments(data.comment);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('Failed to fetch comments');
    }
  };

  const isSaleActive = () => {
    const saleStartDate = moment(product.timeSaleStart);
    const saleEndDate = moment(product.timeSaleEnd);
    const today = moment();
    return saleStartDate.isSameOrBefore(today) && saleEndDate.isSameOrAfter(today);
  };
  const sendComment = async () => {
    try {
      console.log(product.id);
      console.log(commentContent);
      console.log(StoredToken);
      if (commentContent.trim() !== '') {
        const response = await fetch(`${API_URL}/api/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${StoredToken}`,
          },
          body: JSON.stringify({
            id: product.id,
            content: commentContent,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Comment created:', data);

        alert('Comment sent successfully');

        setCommentContent('');
      } else {
        alert('Please enter your comment');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('Failed to send comment');
    }
  };

  async function addToCart(productId, token) {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/addCart/${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Item added to cart:', data);
      alert(data.message);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddToCart = async () => {
    if (!StoredToken) {
      console.log('No token available. User needs to log in.');
      alert("Failed to add item to cart");
      return;
    }

    await addToCart(product.id, StoredToken);
  };

  const slideUp = () => {
    Animated.timing(listTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(listTranslateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = () => {
    if (!product.id) {
      return <Text>Product details not found.</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Modal visible={isLoading} animationType="none" transparent={true}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" style={styles.loadingIndicator} />
            </View>
          </Modal>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: product.imageProduct }} style={styles.productImage} />
          {product.priceSale > 0 && isSaleActive(
            <View style={styles.saleContainer}>
              <Text style={styles.priceSaleText}>-{product.priceSale}đ</Text>
            </View>
          )}
          <ScrollView style={{ backgroundColor: '#fff', borderTopStartRadius: 22, borderTopEndRadius: 22 }}>
            <View style={styles.infoContainer}>
              <View style={styles.productInfo}>
                <View style={{ flexDirection: 'row', marginBottom: 9, justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.priceSale > 0 && isSaleActive() ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ textDecorationLine: 'line-through', color: 'grey' }}>
                          {formatVND(product.price)}
                        </Text>
                        <Text style={{ marginLeft: 5, color: 'red', fontFamily: 'bold' }}>
                          {formatVND(product.price - product.priceSale)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
                    )}
                  </View>
                  <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
                    setShowCommentList(!showCommentList);
                    if (!showCommentList) {
                      slideUp();
                      fetchComments(product.id);
                    } else {
                      slideDown();
                    }
                  }}>
                    <MaterialCommunityIcons name="chat-outline" size={40} color="#333" />
                  </TouchableOpacity>

                </View>
                <Text style={{ fontStyle: 'italic', fontSize: 15, marginBottom: 12 }}>Quantity: {product.quantity} </Text>
                <Text >Description: {product.description}</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonWrapper}>
            <View style={[styles.commentContainer, showCommentList && { height: '60%' }]}>
              <TextInput
                placeholder="Enter your comment"
                style={styles.commentInput}
                value={commentContent}
                onChangeText={setCommentContent}
                editable={!showCommentList}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendComment} disabled={showCommentList}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            {!showCommentList && (
              <TouchableOpacity onPress={handleAddToCart} style={styles.buttonGR}>
                <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add to cart</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
          {showCommentList && (
            <Animated.View style={[styles.commentListContainer, { transform: [{ translateY: listTranslateY }] }]}>
              <TouchableOpacity style={styles.closeButton} onPress={() => {
                slideDown();
                setShowCommentList(false);
              }}>
                <MaterialCommunityIcons name="close" size={32} color="#fff" />
              </TouchableOpacity>
              <FlatList
                data={comments}
                renderItem={({ item }) => (
                  <View style={styles.commentContainer1}>
                    <View style={styles.commentItem}>
                      <Text style={styles.commentName}>{item.username}</Text>
                      <Text style={styles.commentContent}>{item.content}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </Animated.View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  loadingIndicator: {},
  infoContainer: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    maxHeight: 300,
    overflow: 'hidden',
    marginBottom: 5,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  saleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceSaleText: {
    color: 'white',
    fontSize: 12,
  },
  productInfo: {
    margin: 9,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 15,
    alignSelf: 'flex-start',
    color: 'black',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  iconButton: {
    padding: 5,
  },
  buttonWrapper: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonGR: {
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    width: '90%',
    shadowColor: 'red',
    marginBottom: 22,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 22,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
  },
  addButton: {
    padding: 15,
    borderRadius: 22,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#f7c458',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#DDDDDD',
    borderTopStartRadius: 22,
    borderTopEndRadius: 22,
    zIndex: 1,
  },
  commentContainer1: {
    backgroundColor: '#f0f0f0',
    marginLeft: 10,
    marginRight: 10,

    marginTop: 10,
    borderRadius: 8,
  },
  commentItem: {
    padding: 10,

    borderBottomColor: '#ccc',
  },
  commentName: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 5,
  },
  commentContent: {
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -22,
    right: 3,
    backgroundColor: 'red',
    zIndex: 2,
    borderRadius: 16,
  },
});

export default ProductDetailScreen;
