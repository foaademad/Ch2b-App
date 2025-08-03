import { useRouter } from "expo-router";
import { ChevronDown, X } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  
  const { language, isRTL } = useLanguage();

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
        marginRight: isRTL ? 0 : 8,
        marginLeft: isRTL ? 8 : 0,
        borderBottomWidth: isSelected ? 2 : 0,
        borderBottomColor: "#36c7f6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 120, // 🔧 نحدد العرض ليتوافق مع ITEM_WIDTH
        minWidth: 100, // إضافة عرض أدنى
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-Medium",
          color: isSelected ? "#36c7f6" : "#666",
          textAlign: "center",
          textAlignVertical: "center",
        }}
      >
        {getShortName(language === 'ar' ? item.nameAr || item.nameEn : item.nameEn)}
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

  const { language, isRTL } = useLanguage();

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
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {language === 'ar' ? item.nameAr || item.nameEn : item.nameEn}
      </Text>
    </TouchableOpacity>
  );
};

const ITEM_WIDTH = 130; // ✅ العرض المناسب لكل عنصر

const Categories = () => {
  const { t } = useTranslation();
  const {  isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useSelector((state: RootState) => state.category);
  const currentCategory = useSelector((state: RootState) => state.product.currentCategory);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const subCategories: CategoryDto[] = categories
    .filter((cat) => cat.parentId === null)
    .flatMap((cat) => cat.children || []);

  const allCategory = useMemo(() => ({ categoryId: 'all', id: 'all', nameEn: 'All', nameAr: 'الكل' }) as CategoryDto, []);
  const categoriesWithAll = useMemo(() => [allCategory, ...subCategories], [subCategories, allCategory]);

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

    // إذا كانت فئة تجريبية، لا ترسل طلب API
    if (categoryId.startsWith('demo')) {
      console.log('Demo category selected:', selected?.nameEn);
      return;
    }

    setPendingCategory(categoryId);
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

    // تحريك الشريط الأفقي للفئة المختارة - فوري بدون تأخير
    const index = categoriesWithAll.findIndex((cat) => (cat.categoryId || cat.id) === categoryId);
    if (flatListRef.current && index >= 0) {
      const offset = index * ITEM_WIDTH;
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: true,
      });
    }
  };

  // راقب التغيير في selectedCategory لتحديث موقع الشريط
  useEffect(() => {
    if (selectedCategory && flatListRef.current) {
      const index = categoriesWithAll.findIndex((cat) => (cat.categoryId || cat.id) === selectedCategory);
      if (index >= 0) {
        const offset = index * ITEM_WIDTH;
        flatListRef.current.scrollToOffset({
          offset: offset,
          animated: true,
        });
      }
    }
  }, [selectedCategory, categoriesWithAll.length,categoriesWithAll,flatListRef]);

  // راقب التغيير في currentCategory
  useEffect(() => {
    if (pendingCategory && currentCategory?.categoryId === pendingCategory) {
      router.push("/category-products");
      setPendingCategory(null);
    }
  }, [currentCategory, pendingCategory, router, dispatch]);

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
    <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* ✅ الشريط الأفقي للفئات + See All */}
      <View
        style={{
          flexDirection: isRTL ? "row" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          minHeight: 60, // إضافة ارتفاع أدنى لضمان العرض
        }}
      >
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            flex: 1,
            minHeight: 50, // إضافة ارتفاع أدنى للـ FlatList
          }}
        >
          <FlatList
            ref={flatListRef}
            key={isRTL ? 'rtl' : 'ltr'} // إضافة key لتحديث FlatList عند تغيير الاتجاه
            data={isRTL ? [...categoriesWithAll].reverse() : categoriesWithAll}
            keyExtractor={(item, index) => item.categoryId || item.id || `category-${index}`}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16} // تحسين أداء التمرير
            decelerationRate="fast" // تسريع إيقاف التمرير
            snapToInterval={ITEM_WIDTH} // التصاق أفضل بالعناصر
            contentContainerStyle={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "flex-start", // تغيير من center إلى flex-start
              paddingHorizontal: 8, // إضافة padding إضافي
            }}
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
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            paddingHorizontal: 8, // إضافة padding
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              fontFamily: "Poppins-Medium",
              marginRight: isRTL ? 2 : 0,
              marginLeft: isRTL ? 0 : 2,
            }}
          >
            {t("categories.see_all")}
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
                flexDirection: isRTL ? "row-reverse" : "row",
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
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {t("categories.title")}
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
