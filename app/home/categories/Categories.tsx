import { useRouter } from "expo-router";
import { ChevronDown, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Shadows } from '../../../constants/Shadows';
import { useLanguage } from "../../../src/context/LanguageContext";
import { getCategoriesApi } from "../../../src/store/api/categoryApi";
import { getallProductByCategoryId } from "../../../src/store/api/productApi";
import { AppDispatch, RootState } from "../../../src/store/store";
import { CategoryDto } from "../../../src/store/utility/interfaces/categoryInterface";

// عنصر الفئة في الشريط الأفقي
const CategoryItem = ({
  item,
  isSelected,
  onPress,
}: {
  item: CategoryDto;
  isSelected: boolean;
  onPress: (id: string) => void;
}) => {
  const { t } = useTranslation();

  // دالة لتقصير الاسم
  const getShortName = (name: string) => {
    return name.length > 10 ? name.slice(0, 10) + '...' : name;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(item.categoryId || item.id || 'all')}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 8,
        borderBottomWidth: isSelected ? 2 : 0,
        borderBottomColor: "#36c7f6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 120, // 🔧 نحدد العرض ليتوافق مع ITEM_WIDTH
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-Medium",
          color: isSelected ? "#36c7f6" : "#666",
          textAlign: "center",
        }}
      >
        {getShortName(t(item.nameEn))}
      </Text>
    </TouchableOpacity>
  );
};

// عنصر الفئة داخل المودال
const ModalCategoryItem = ({
  item,
  onPress,
  isSelected,
}: {
  item: CategoryDto;
  onPress: (id: string) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => onPress(item.categoryId || item.id || 'all')}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        backgroundColor: isSelected ? "#36c7f6" : "transparent",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins-Medium",
          color: isSelected ? "#eee" : "#333",
        }}
      >
        {t(item.nameEn)}
      </Text>
    </TouchableOpacity>
  );
};

const ITEM_WIDTH = 130; // ✅ العرض المناسب لكل عنصر

const Categories = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories, loading } = useSelector((state: RootState) => state.category);

  const subCategories: CategoryDto[] = categories
    .filter((cat) => cat.parentId === null)
    .flatMap((cat) => cat.children || []);

  const allCategory = { categoryId: 'all', id: 'all', nameEn: 'All' } as CategoryDto;
  const categoriesWithAll = [allCategory, ...subCategories];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    dispatch(getCategoriesApi());
  }, [dispatch]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setModalVisible(false);

    const selected = categoriesWithAll.find(
      (cat) => (cat.categoryId || cat.id) === categoryId
    );

    // إذا كانت الفئة "الكل" لا تذهب لأي تفاصيل
    if (categoryId === "all") return;

    // جلب المنتجات الخاصة بالفئة
    dispatch(
      getallProductByCategoryId(
        categoryId,
        1,
        10,
        false,
        selected?.name,
        selected?.nameEn
      ) as any
    );

    // الانتقال لصفحة تفاصيل الكاتيجوري
    router.push("/category-products");

    // تحريك الشريط الأفقي للفئة المختارة
    const index = categoriesWithAll.findIndex((cat) => (cat.categoryId || cat.id) === categoryId);
    setTimeout(() => {
      if (flatListRef.current && index >= 0) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, 300);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderCategoryItem = ({ item }: { item: CategoryDto }) => (
    <CategoryItem
      item={item}
      isSelected={selectedCategory === (item.categoryId || item.id)}
      onPress={handleCategoryPress}
    />
  );

  return (
    <View>
      {/* ✅ الشريط الأفقي للفئات + See All */}
      <View
        style={{
          flexDirection: language === "ar" ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: language === "ar" ? "row-reverse" : "row",
            flex: 1,
          }}
        >
          <FlatList
            ref={flatListRef}
            data={categoriesWithAll}
            keyExtractor={(item, index) => item.categoryId || item.id || `category-${index}`}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: language === "ar" ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
            onScrollToIndexFailed={({ index, averageItemLength }) => {
              flatListRef.current?.scrollToOffset({
                offset: averageItemLength * index,
                animated: true,
              });
            }}
          />
        </View>
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            flexDirection: language === "ar" ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              fontFamily: "Poppins-Medium",
              marginRight: language === "ar" ? 2 : 0,
              marginLeft: language === "ar" ? 0 : 2,
            }}
          >
            {t("See All")}
          </Text>
          <ChevronDown size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* ✅ فاصل رمادي */}
      <View
        style={{
          height: 1,
          backgroundColor: "#eee",
        }}
      />

      {/* ✅ مودال عرض الفئات */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={toggleModal}
        >
          <Pressable
            style={{
              width: windowWidth * 0.85,
              maxHeight: 400,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              ...Shadows.medium,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-SemiBold",
                  color: "#333",
                }}
              >
                {t("Categories")}
              </Text>
              <TouchableOpacity onPress={toggleModal}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {categoriesWithAll.map((category, index) => (
                <ModalCategoryItem
                  key={category.categoryId || category.id || `modal-category-${index}`}
                  item={category}
                  isSelected={selectedCategory === (category.categoryId || category.id)}
                  onPress={handleCategoryPress}
                />
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Categories;
