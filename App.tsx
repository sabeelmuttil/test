import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {images} from './assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProductItem {
  productName: String;
  productID: String;
  category: String;
  buyingPrice: String;
  quantity: String;
  unit: String;
  expiryDate: String;
  thresholdValue: String;
  image: ImagePickerResponse | null;
  imageUri: String | null;
}

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState('');
  const [category, setCategory] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');
  const [image, setImage] = useState<ImagePickerResponse | null>(null);
  const [imageUri, setImageUri] = useState<String | null>(null);

  const [products, setProducts] = useState<ProductItem[]>([
    // {
    //   productName: 'ddsds',
    //   productID: '123',
    //   category: 'sss',
    //   buyingPrice: '123',
    //   quantity: '12',
    //   unit: '12',
    //   expiryDate: '12',
    //   thresholdValue: '22',
    //   image: {
    //     assets: [
    //       {
    //         originalPath:
    //           '/sdcard/.transforms/synthetic/picker/0/com.android.providers.media.photopicker/media/1000000018.jpg',
    //         type: 'image/jpeg',
    //         height: 415,
    //         width: 739,
    //         fileName: '1000000018.jpg',
    //         fileSize: 25818,
    //         uri: 'file:///data/user/0/com.test/cache/rn_image_picker_lib_temp_4a027024-90e3-4af0-98c7-f0f1728c6ce9.jpg',
    //       },
    //     ],
    //   },
    //   imageUri:
    //     'file:///data/user/0/com.test/cache/rn_image_picker_lib_temp_4a027024-90e3-4af0-98c7-f0f1728c6ce9.jpg',
    // },
    // {
    //   productName: 'ddsds',
    //   productID: '123',
    //   category: 'sss',
    //   buyingPrice: '123',
    //   quantity: '12',
    //   unit: '12',
    //   expiryDate: '12',
    //   thresholdValue: '22',
    //   image: {
    //     assets: [
    //       {
    //         originalPath:
    //           '/sdcard/.transforms/synthetic/picker/0/com.android.providers.media.photopicker/media/1000000018.jpg',
    //         type: 'image/jpeg',
    //         height: 415,
    //         width: 739,
    //         fileName: '1000000018.jpg',
    //         fileSize: 25818,
    //         uri: 'file:///data/user/0/com.test/cache/rn_image_picker_lib_temp_4a027024-90e3-4af0-98c7-f0f1728c6ce9.jpg',
    //       },
    //     ],
    //   },
    //   imageUri:
    //     'file:///data/user/0/com.test/cache/rn_image_picker_lib_temp_4a027024-90e3-4af0-98c7-f0f1728c6ce9.jpg',
    // },
  ]);

  useEffect(() => {
    (async () => {
      // Retrieve products from AsyncStorage on app start
      await AsyncStorage.getItem('products')
        .then(storedProducts => {
          if (storedProducts) {
            console.log('data: ', storedProducts);
            console.log('data: ', JSON.parse(storedProducts));
            setProducts(JSON.parse(storedProducts));
          }
        })
        .catch(error => console.log('Error retrieving products:', error));
    })();
  }, []);

  const showModal = () => {
    clearData();
    setModalVisible(true);
  };

  const clearData = () => {
    setProductName('');
    setProductID('');
    setCategory('');
    setBuyingPrice('');
    setQuantity('');
    setUnit('');
    setExpiryDate('');
    setThresholdValue('');
    setImage(null);
    setImageUri('');
    setModalVisible(false);
  };

  const hideModal = () => {
    clearData();
    setModalVisible(false);
  };

  const checkFormIsValid = () => {
    if (
      productName === '' ||
      productID === '' ||
      category === '' ||
      buyingPrice === '' ||
      quantity === '' ||
      unit === '' ||
      expiryDate === '' ||
      thresholdValue === '' ||
      imageUri === '' ||
      image === null
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleDiscard = () => {
    hideModal();
  };

  const pickImageFromGallery = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
        // Add other options as needed
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('Image picker error: ', response.errorMessage);
        } else {
          setImage(response);
          setImageUri(response.assets?.[0]?.uri || null);
        }
      },
    );
  };

  const handleAddProduct = async () => {
    if (checkFormIsValid()) {
      let product: ProductItem = {
        productName: productName,
        productID: productID,
        category: category,
        buyingPrice: buyingPrice,
        quantity: quantity,
        unit: unit,
        expiryDate: expiryDate,
        thresholdValue: thresholdValue,
        image: image,
        imageUri: imageUri,
      };
      // Add product to state
      setProducts([...products, product]);
      console.log('data: ', JSON.stringify(product));

      // Save updated products to AsyncStorage
      try {
        await AsyncStorage.setItem('products', JSON.stringify(products));
        Alert.alert('Success', 'Product added successfully', [
          {text: 'OK', onPress: () => {}},
        ]);
        hideModal();
      } catch (error) {
        Alert.alert('Error', error?.toString(), [
          {text: 'OK', onPress: () => {}},
        ]);
        console.error('Error saving products:', error);
      }
    } else {
      Alert.alert('Error', 'Please fill all the fields', [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  };

  const removeItem = async (productId: number) => {
    const updatedProduct = await products.filter(
      (item, index) => index !== productId,
    );
    setProducts(updatedProduct);
    await AsyncStorage.setItem('products', JSON.stringify(updatedProduct));
  };

  return (
    <View style={styles.container}>
      {products.length > 0 ? (
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
            <Button title="Add Product" onPress={showModal} />
          </View>
          <FlatList
            data={products}
            style={{}}
            contentContainerStyle={{
              padding: 15,
            }}
            renderItem={({item, index}) => (
              <View style={styles.cartItemContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View key={index} style={{width: 100, alignSelf: 'center'}}>
                    <Image
                      source={
                        item.imageUri ? {uri: item.imageUri} : images.avatar
                      }
                      style={styles.image}
                    />
                  </View>
                  <View>
                    <Text style={styles.cartItemName}>{item.productName}</Text>
                    <Text style={styles.cartItemPrice}>
                      ${item.buyingPrice}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(index)}>
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
          }}>
          <Button title="Add Product" onPress={showModal} />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalTitle}>New Product</Text>
            <TouchableOpacity
              onPress={pickImageFromGallery}
              activeOpacity={0.6}
              style={{
                alignItems: 'center',
                width: 100,
                alignSelf: 'center',
                marginBottom: 15,
              }}>
              <Image
                style={styles.avatarImage}
                source={imageUri ? {uri: imageUri} : images.avatar}
                resizeMode="cover"
              />
              <View style={styles.addButton}>
                <Image style={styles.addButtonIcon} source={images.addButton} />
              </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Name</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Product Name"
                onChangeText={text => setProductName(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product ID</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Product ID"
                onChangeText={text => setProductID(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Category"
                onChangeText={text => setCategory(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Buying Price</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Buying Price"
                onChangeText={text => setBuyingPrice(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Quantity"
                onChangeText={text => setQuantity(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Unit</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Unit"
                onChangeText={text => setUnit(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Expiry Date"
                onChangeText={text => setExpiryDate(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Threshold Value</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Threshold Value"
                onChangeText={text => setThresholdValue(text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Discard" onPress={handleDiscard} />
              <Button title="Add Product" onPress={handleAddProduct} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#000',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarImage: {
    height: 100,
    width: 100,
    overflow: 'hidden',
    borderColor: '#ffffff',
    borderWidth: 4,
    borderRadius: 100 / 2,
  },
  addButton: {
    height: 30,
    width: 30,
    backgroundColor: '#f2f2fC',
    borderRadius: 50,
    position: 'absolute',
    right: 35,
    bottom: -8,
  },
  addButtonIcon: {
    height: 30,
    width: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    flex: 1,
    marginRight: 10,
  },
  inputField: {
    flex: 2,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  browseImageContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  browseImageText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
