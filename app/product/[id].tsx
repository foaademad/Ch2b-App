import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '../../src/store/api/cartApi';
import { getProductById } from "../../src/store/api/productApi";
import { AppDispatch, RootState } from "../../src/store/store";
import Toast from "react-native-toast-message";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentProduct, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const userId = useSelector((state: RootState) => state.auth.authModel?.result?.userId);
  const token = useSelector((state: RootState) => state.auth.authModel?.result?.token);
  console.log("userId", userId);
  console.log("token", token);

  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [activeTab, setActiveTab] = useState("specs");
  const [singleQuantity, setSingleQuantity] = useState(0);

  useEffect(() => {
    if (id) dispatch(getProductById(id as string));
    
  }, [id]);

  console.log("Current product state:", currentProduct);

  const product = currentProduct?.product;
  const vendor = currentProduct?.vendor;
  const vendorItems = currentProduct?.vendorItems;

  // Helper: Convert featuredValues array to object for easy access
  function getFeaturedMap(featuredValues: any[] = []) {
    return featuredValues.reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {} as Record<string, string>);
  }
  const featured = getFeaturedMap(vendor?.featuredValues);

  const generalInfo = product?.attributes || [
    { label: "Brand", value: "RELANDER/" },
    { label: "Model", value: "RB-G91" },
    { label: "Goods number", value: "RB-G91J4125" },
    { label: "Listing time", value: "2021.9" },
    { label: "Brand area", value: "Domestically produced" },
    { label: "Supply category", value: "Spot goods" },
    { label: "Product Positioning", value: "Notebook game book" },
    { label: "CPU type", value: "Ce Yang M" },
    { label: "Hard drive capacity", value: "512" },
    { label: "Screen size", value: "15.6 inches" },
    { label: "Graphics card", value: "Performance graphics card" },
    { label: "Wireless network card", value: "Have" },
    { label: "Resolution", value: "1920*1200" },
    { label: "Operating system", value: "ANDROID" },
    { label: "Battery life", value: "3 hours" },
  ];

  // Example reviews data (replace with currentProduct.reviews if available)
  const reviews = currentProduct?.reviews?.content || [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#36c7f6" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (!product || (!product.id && !product.title)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No product data available</Text>
      </View>
    );
  }
  // Related products (flatten all relatedGroups)
  const relatedProducts = product.relatedGroups?.flatMap((g) => g.items) || [];
  // Products from the same vendor (excluding this product)
  const vendorProducts = (vendorItems?.content || []).filter(
    (p) => p.id !== product.id
  );

  const updateQuantity = (id: string, delta: number, max: number) => {
    setQuantities((q) => {
      const newQty = Math.max(0, Math.min((q[id] || 0) + delta, max));
      return { ...q, [id]: newQty };
    });
  };

  const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0) + singleQuantity;
  const totalPrice =
    (product.configuredItems?.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      const price = item.price?.convertedPriceList?.internal?.price || 0;
      return sum + qty * price;
    }, 0) || 0) + (singleQuantity * (product.price?.convertedPriceList?.internal?.price || 0));

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Product Images */}
      <ScrollView
        horizontal
        pagingEnabled
        style={styles.imageSlider}
        showsHorizontalScrollIndicator={false}
      >
        {product.pictures?.length ? (
          product.pictures.map((pic, idx) => (
            <Image
              key={`pic-${idx}-${pic.url || 'no-url'}`}
              source={{ uri: pic.url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ))
        ) : (
          <Image
            source={{ uri: product.mainPictureUrl }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        )}
      </ScrollView>
      {/* Product Info */}
      <View style={styles.card}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
          {product.price?.convertedPriceList?.internal?.sign}{" "}
          {product.price?.convertedPriceList?.internal?.price}
        </Text>
        <Text style={styles.usdPrice}>
          $
          {product.price?.convertedPriceList?.displayedMoneys?.[0]?.price ??
            "-"}{" "}
          USD
        </Text>

        {product.videos?.[0]?.url ? <View style={styles.videoContainer}>
          {product.videos?.[0]?.url ? (
            <Video
              source={{ uri: product.videos[0].url }}
              style={{
                width: "100%",
                height: 220,
                marginBottom: 10,
                borderRadius: 10,
              }}
              controls
              paused={true}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.desc]}>No video available</Text>
          )}
        </View>: <Text style={[styles.desc]}>No video available</Text>}  
        <Text style={styles.label}>
          Brand: <Text style={styles.value}>{product.brandName}</Text>
        </Text>
        <Text style={styles.label}>
          Weight:{" "}
          <Text style={styles.value}>
            {product.physicalParameters?.weight ?? "-"}
          </Text>
        </Text>
        <Text style={styles.label}>
          Height:{" "}
          <Text style={styles.value}>
            {product.physicalParameters?.height ?? "-"}
          </Text>
        </Text>
        <Text style={styles.label}>
          Width:{" "}
          <Text style={styles.value}>
            {product.physicalParameters?.width ?? "-"}
          </Text>
        </Text>
        <Text style={styles.label}>
          Available Quantity:{" "}
          <Text style={styles.value}>{product.masterQuantity - singleQuantity}</Text>
        </Text>
        
        

        {/* Configured Items Cards */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {product.configuredItems?.map((item, configIdx) => (
            <View key={`config-${item.id}-${configIdx}`} style={styles.configCard}>
              <Image
                source={{
                  uri: product.pictures?.[0]?.url || product.mainPictureUrl,
                }}
                style={{
                  width: 70,
                  height: 70,
                  marginBottom: 8,
                  borderRadius: 8,
                  backgroundColor: "#f4f4f4",
                }}
                resizeMode="contain"
              />
              {item.configurators?.map((c, i) => (
                <Text
                  key={`${c.pid}-${c.vid}-${i}`}
                  style={{ fontSize: 13, color: "#222", fontWeight: "bold" }}
                >
                  {c.pid}: <Text style={{ fontWeight: "normal" }}>{c.vid}</Text>
                </Text>
              ))}
              <Text
                style={{
                  color: "#36c7f6",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginVertical: 4,
                }}
              >
                {item.price?.convertedPriceList?.internal?.sign}{" "}
                {item.price?.convertedPriceList?.internal?.price}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(item.id, -1, Number(item.quantity))
                  }
                >
                  <Text style={{ fontSize: 18, color: "#36c7f6" }}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
                  {quantities[item.id] || 0}
                </Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(item.id, 1, Number(item.quantity))
                  }
                >
                  <Text style={{ fontSize: 18, color: "#36c7f6" }}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, color: "#888" }}>
                Stock: {item.quantity}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#36c7f6", fontWeight: "bold" }}
              >
                Total: {item.price?.convertedPriceList?.internal?.sign}{" "}
                {(
                  (quantities[item.id] || 0) *
                  (item.price?.convertedPriceList?.internal?.price || 0)
                ).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        

        
        {/* Cart Summary and Add to Cart Button */}
        <View style={styles.cartSummary}>
          {/* If there are no configuredItems, add a card for the product itself */}
          {(!product.configuredItems || product.configuredItems.length === 0) && (
            <View style={styles.configCard}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setSingleQuantity(q => Math.max(0, q - 1))}
                >
                  <Text style={{ fontSize: 18, color: "#36c7f6" }}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
                  {singleQuantity}
                </Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setSingleQuantity(q => Math.min(product.masterQuantity - q, q + 1))}
                >
                  <Text style={{ fontSize: 18, color: "#36c7f6" }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.addToCartBtn,
                  { backgroundColor: singleQuantity > 0 ? '#36c7f6' : '#ccc' },
                ]}
                disabled={singleQuantity === 0}
                onPress={async () => {
                  if (userId && singleQuantity > 0) {
                    const cartItem = {
                      productId: product.id,
                      name: product.name,
                      title: product.title,
                      image: product.mainPictureUrl?.slice(0, 1000),
                      LinkUrl: product.mainPictureUrl?.slice(0, 1000),
                      Quntity: singleQuantity,
                      price: product.price?.convertedPriceList?.internal?.price,
                      totalPrice: (product.price?.convertedPriceList?.internal?.price || 0) * singleQuantity,
                    };
                    console.log('cartItem:', cartItem);
                    try {
                      await dispatch(addToCart(userId, cartItem));
                    } catch (error: any) {
                      Toast.show({
                        type: "error",
                        text1: error.message
                      });
                      console.error(error);
                    }
                  }
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Total Quantity:{" "}
            <Text style={{ color: "#36c7f6" }}>{totalQuantity}</Text>
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#36c7f6" }}>
            Total Price: SAR {totalPrice.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              { backgroundColor: totalQuantity > 0 ? "#36c7f6" : "#ccc" },
            ]}
            disabled={totalQuantity === 0}
            onPress={async () => {
              
                if (userId && totalQuantity > 0) {
                  product.configuredItems?.forEach(async (item) => {
                    const qty = quantities[item.id] || 0;
                    if (qty > 0) {
                      const cartItem = {
                        productId: product.id,
                        name: product.name,
                        title: `${product.title} (${item.configurators?.map(c => `${c.pid}: ${c.vid}`).join(", ")})`,
                        image: product.mainPictureUrl?.slice(0, 1000),
                        LinkUrl: product.mainPictureUrl?.slice(0, 1000),
                        Quntity: qty,
                        price: item.price?.convertedPriceList?.internal?.price,
                        totalPrice: qty * (item.price?.convertedPriceList?.internal?.price || 0),
                      };
                      console.log('cartItem:', cartItem);
                      try {
                        await dispatch(addToCart(userId, cartItem));
                      } catch (error: any) {
                        Toast.show({
                          type: "error",
                          text1: error.message
                        });
                        console.error(error);
                      }
                    }
                  });
                }
              
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>


      </View>
      {/* Vendor Info */}
      <View style={styles.vendorCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            source={{
              uri:
                featured.shopLogo ||
                vendor?.displayPictureUrl ||
                vendor?.pictureUrl,
            }}
            style={styles.vendorImageLarge}
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.vendorName}>
              {vendor?.displayName || vendor?.name || "-"}
            </Text>
            <Text style={styles.vendorShopName}>{vendor?.shopName || "-"}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text style={styles.vendorScore}>
                Level: {vendor?.credit?.level ?? "-"}
              </Text>
              <Text style={styles.vendorScore}>
                {" "}
                | Score: {vendor?.credit?.score ?? "-"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Shop Logo:</Text>
          {featured.shopLogo ? (
            <Image
              source={{ uri: featured.shopLogo }}
              style={styles.vendorLogo}
            />
          ) : vendor?.pictureUrl ? (
            <Image
              source={{ uri: vendor.pictureUrl }}
              style={styles.vendorLogo}
            />
          ) : (
            <Text style={styles.vendorInfoValue}>-</Text>
          )}
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Shop URL:</Text>
          {featured.shopUrl ? (
            <Text
              style={[
                styles.vendorInfoValue,
                { color: "#36c7f6", textDecorationLine: "underline" },
              ]}
              onPress={() => Linking.openURL(featured.shopUrl)}
            >
              {featured.shopUrl}
            </Text>
          ) : (
            <Text style={styles.vendorInfoValue}>-</Text>
          )}
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Stars:</Text>
          <Text style={styles.vendorInfoValue}>{featured.stars ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Years:</Text>
          <Text style={styles.vendorInfoValue}>{featured.years ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Sales (30d):</Text>
          <Text style={styles.vendorInfoValue}>
            {featured.salesVolume30d ?? "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>DSR Score:</Text>
          <Text style={styles.vendorInfoValue}>{featured.dsrScore ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>FW Score:</Text>
          <Text style={styles.vendorInfoValue}>{featured.fwScore ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Level Ratio:</Text>
          <Text style={styles.vendorInfoValue}>
            {featured.levelRatio ?? "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Grade Code:</Text>
          <Text style={styles.vendorInfoValue}>
            {featured.gradeCode ?? "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>User ID:</Text>
          <Text style={styles.vendorInfoValue}>{featured.userId ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Shop ID:</Text>
          <Text style={styles.vendorInfoValue}>{featured.shopId ?? "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Email:</Text>
          <Text style={styles.vendorInfoValue}>{vendor?.email || "-"}</Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Location:</Text>
          <Text style={styles.vendorInfoValue}>
            {vendor?.location?.state || "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Delivery Score:</Text>
          <Text style={styles.vendorInfoValue}>
            {vendor?.scores?.deliveryScore ?? "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Item Score:</Text>
          <Text style={styles.vendorInfoValue}>
            {vendor?.scores?.itemScore ?? "-"}
          </Text>
        </View>
        <View style={styles.vendorInfoRow}>
          <Text style={styles.vendorInfoLabel}>Service Score:</Text>
          <Text style={styles.vendorInfoValue}>
            {vendor?.scores?.serviceScore ?? "-"}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab("specs")}
          style={[styles.tabBtn, activeTab === "specs" && styles.activeTabBtn]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "specs" && styles.activeTabText,
            ]}
          >
            Specifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("desc")}
          style={[styles.tabBtn, activeTab === "desc" && styles.activeTabBtn]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "desc" && styles.activeTabText,
            ]}
          >
            Description
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("reviews")}
          style={[
            styles.tabBtn,
            activeTab === "reviews" && styles.activeTabBtn,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reviews" && styles.activeTabText,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "specs" && (
        <View style={styles.specsCard}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.specsTable}>
            {generalInfo.map((item: any, idx: any) => (
              <View key={`${item.label}-${idx}`} style={styles.specsRow}>
                <Text style={styles.specsLabel}>{item.label}</Text>
                <Text style={styles.specsValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {activeTab === "desc" && (
        <View style={styles.specsCard}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.desc}>
            {product?.title || "No description available."}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10}}
          >
            {(product?.pictures || []).map((pic, idx) => (
              <Image
                key={`desc-pic-${idx}-${pic.url || 'no-url'}`}
                source={{ uri: pic.url }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: "#f4f4f4",
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}
      {activeTab === "reviews" && (
        <View style={styles.specsCard}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          {Array.isArray(reviews) && reviews?.length > 0 ? (
            reviews?.map((review: any, idx: any) => (
              <View key={`${review.userNick}-${review.createdDate}-${idx}`} style={styles.reviewCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.reviewUser}>{review.userNick}</Text>
                  <Text style={styles.reviewLevel}>
                    {review.featuredValues?.find(
                      (f: any) => f.name === "raterLevel"
                    )?.value || ""}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdDate).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewRating}>
                  {"★".repeat(review.rating)}
                </Text>
                <Text style={styles.reviewContent}>{review.content}</Text>
                {review.images && review.images.length > 0 && (
                  <ScrollView horizontal style={{ marginTop: 6 }}>
                    {review.images.map((img: any, i: any) => (
                      <Image
                        key={`review-img-${i}-${img || 'no-url'}`}
                        source={{ uri: img }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          marginRight: 8,
                          backgroundColor: "#f4f4f4",
                        }}
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.desc}>No reviews available.</Text>
          )}
        </View>
      )}

      {/* Products from the same vendor */}
      {vendorProducts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Products from Same Vendor</Text>
          <FlatList
            data={vendorProducts}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.relatedCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image
                  source={{ uri: item.mainPictureUrl }}
                  style={styles.relatedImage}
                />
                <Text style={styles.relatedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.relatedPrice}>
                  {item.price?.convertedPriceList?.internal?.sign}{" "}
                  {item.price?.convertedPriceList?.internal?.price}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Related Products</Text>
          <FlatList
            data={relatedProducts}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.relatedCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image
                  source={{ uri: item.image?.url || product.mainPictureUrl }}
                  style={styles.relatedImage}
                />
                <Text style={styles.relatedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.relatedPrice}>
                  {item.price?.convertedPriceList?.internal?.sign}{" "}
                  {item.price?.convertedPriceList?.internal?.price}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafd" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  error: { color: "red", fontSize: 18 },
  imageSlider: { height: 260, backgroundColor: "#fff" },
  mainImage: {
    width: 340,
    height: 260,
    borderRadius: 12,
    margin: 8,
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a2340",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: "#36c7f6",
    fontWeight: "bold",
    marginBottom: 2,
  },
  usdPrice: { fontSize: 14, color: "#888", marginBottom: 8 },
  label: { fontSize: 15, color: "#444", marginTop: 4 },
  value: { color: "#1a2340", fontWeight: "bold" },
  desc: { fontSize: 15, color: "#333", marginBottom: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a2340",
    marginBottom: 10,
  },
  vendorCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 16,
    margin: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  vendorImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e3e3e3",
  },
  vendorName: { fontSize: 18, fontWeight: "bold", color: "#1a2340" },
  vendorShopName: {
    fontSize: 15,
    color: "#36c7f6",
    fontWeight: "600",
    marginTop: 2,
  },
  vendorScore: { fontSize: 13, color: "#888", marginRight: 6 },
  vendorInfoRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  vendorInfoLabel: { fontSize: 14, color: "#444", width: 110 },
  vendorInfoValue: { fontSize: 14, color: "#1a2340", fontWeight: "500" },
  vendorLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginLeft: 6,
    backgroundColor: "#f4f4f4",
  },
  relatedCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: "#f8fafd",
    borderRadius: 10,
    alignItems: "center",
    padding: 8,
  },
  relatedImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
  },
  relatedTitle: {
    fontSize: 13,
    color: "#222",
    marginTop: 4,
    marginBottom: 2,
    textAlign: "center",
  },
  relatedPrice: { fontSize: 13, color: "#36c7f6", fontWeight: "bold" },
   videoContainer: {
    width: "100%",
    height: 220,
    marginBottom: 10,
    borderRadius: 10,
  },
  configCard: {
    width: "100%",

    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",

  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eaf7fc",
    alignItems: "center",
    justifyContent: "center",
  },
  cartSummary: {
    backgroundColor: "#f8fbff",
    borderRadius: 12,
    margin: 12,
    padding: 16,
    alignItems: "center",
  },
  addToCartBtn: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#36c7f6",
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#36c7f6",
    marginLeft: 10,
  },
  specsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: "#f7fafd",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabBtn: {
    borderBottomColor: "#36c7f6",
    backgroundColor: "#f8fbff",
  },
  tabText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#36c7f6",
    fontWeight: "bold",
  },
  specsTable: {
    marginTop: 10,
  },
  specsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  specsLabel: {
    color: "#888",
    fontSize: 15,
    width: "50%",
  },
  specsValue: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
    width: "50%",
    textAlign: "right",
  },
  reviewCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewUser: {
    fontWeight: "bold",
    color: "#1a2340",
    marginRight: 8,
  },
  reviewLevel: {
    color: "#36c7f6",
    fontSize: 12,
    marginRight: 8,
  },
  reviewDate: {
    color: "#888",
    fontSize: 12,
  },
  reviewRating: {
    color: "#FFD700",
    fontSize: 16,
    marginVertical: 2,
  },
  reviewContent: {
    color: "#222",
    fontSize: 15,
    marginTop: 4,
  },
});
