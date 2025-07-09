export interface ProductBaseDto {
    name: string;
    price: PriceDto;
    id: string;
    title: string;
    isTitleManuallyTranslated: boolean;
    originalTitle: string;
    
  }
  
  export interface PictureDto {
    url: string;
    small: VolumePictureDto;
    medium: VolumePictureDto;
    large: VolumePictureDto;
    isMain: boolean;
  }
  
  export interface VolumePictureDto {
    url: string;
    width?: number | null;
    height?: number | null;
  }
  
  export interface Location {
    state: string;
  }
  
  export interface FeaturedValue {
    name: string;
    value: string;
  }
  
  export interface PhysicalParameters {
    weight: number;
    height?: number | null;
    width?: number | null;
  }
  
  export interface Videos {
    url: string;
    previewUrl: string;
  }
  
  export interface AttributeProduct {
    pid: string;
    vid: string;
    propertyName: string;
    value: string;
    originalPropertyName: string;
    originalValue: string;
    isConfigurator: boolean;
    imageUrl?: string | null;
  }
  
  export interface RelatedGroup {
    type: string;
    dispalyName: string;
    originalName: string;
    items: ProductDtoRelated[];
  }
  
  export interface ProductDtoRelated extends ProductBaseDto {
    image: PictureDto;
  }
  
  export interface ConfiguredItems {
    id: string;
    quantity: string;
    configurators: ConfiguratorItem[];
    price: PriceDto;
  }
  
  export interface ConfiguratorItem {
    pid: string;
    vid: string;
  }
  
  export interface PriceDto {
    originalPrice: number;
    marginPrice: number;
    originalCurrencyCode: string;
    convertedPriceList: ConvertedPriceListDto;
    convertedPrice: string;
    convertedPriceWithoutSign: string;
    currencySign: string;
    currencyName: string;
    isDeliverable: boolean;
    deliveryPrice: DeliveryPriceDto;
    oneItemDeliveryPrice: DeliveryPriceDto;
    priceWithoutDelivery: PriceWithoutDeliveryDto;
    oneItemPriceWithoutDelivery: PriceWithoutDeliveryDto;
  }
  
  export interface DeliveryPriceDto {
    originalPrice: number;
    marginPrice: number;
    originalCurrencyCode: string;
    convertedPriceList: ConvertedPriceListDto;
  }
  
  export interface ConvertedPriceListDto {
    internal: InternalPriceDto;
    displayedMoneys: InternalPriceDto[];
  }
  
  export interface InternalPriceDto {
    price: number;
    sign: string;
    code: string;
  }
  
  export interface PriceWithoutDeliveryDto {
    originalPrice: number;
    marginPrice: number;
    originalCurrencyCode: string;
    convertedPriceList: ConvertedPriceListDto;
  }
  
  export interface ProductDto extends ProductBaseDto {
    errorCode: string;
    hasError: boolean;
    providerType: string;
    updatedTime: Date;
    createdTime: Date;
    categoryId: string;
    subCategoryId: string;
    externalCategoryId: string;
    vendorId: string;
    vendorName: string;
    vendorDisplayName: string;
    vendorScore: number;
    description: string;
    brandId: string;
    brandName: string;
    taobaoItemUrl: string;
    externalItemUrl: string;
    mainPictureUrl: string;
    stuffStatus: string;
    volume: number;
    masterQuantity: number;
    pictures: PictureDto[];
    location: Location;
    featuredValues: FeaturedValue[];
    isSellAllowed: boolean;
    physicalParameters: PhysicalParameters;
    isFiltered: boolean;
    videos: Videos[];
    attributes: AttributeProduct[];
    relatedGroups: RelatedGroup[];
    configuredItems: ConfiguredItems[];
  }
  
  export interface VendorDto {
    id: string;
    providerType: string;
    updatedTime: Date;
    name: string;
    displayName: string;
    shopName: string;
    email: string;
    pictureUrl: string;
    displayPictureUrl: string;
    location: Location;
    credit: CreditDto;
    scores: ScoresDto;
    featuredValues: FeaturedValue[];
    shopId: string;
    years: number;
    stars: number;
    shopUrl: string;
    vendorTypeImageUrl: string;
    tradeLevel: string;
    encrypted_vendor_id: string;
  }
  
  export interface CreditDto {
    level: number;
    score: number;
    totalFeedbacks: number;
    positiveFeedbacks: number;
  }
  
  export interface ScoresDto {
    deliveryScore: number;
    itemScore: number;
    serviceScore: number;
  }
  
  export interface VendorItemDto {
    content: ProductDto[];
    totalCount: number;
  }
  
  export interface ProductDetailsDto {
    product: ProductDto;
    vendor: VendorDto;
    vendorItems: VendorItemDto;
    reviews: ProviderReviews;
  }
  
  export interface ProviderReviews {
    content: ReviewDto[];
  }
  
  export interface ReviewDto {
    externalId: string;
    itemId: string;
    configurationId: string;
    content: string;
    createdDate: Date;
    userNick: string;
    rating: number;
    images: string[];
    featuredValues: FeaturedValue[];
  }
  
  // New interface for the API response structure
  export interface ProductsHomeResponse {
    message: string;
    isSuccess: boolean;
    statusCode: number;
    result: {
        productsBest: ProductDto[];
        productsNew: ProductDto[];
    };
  }
  
export interface CategoryDto {
    categoryId: string;
    name: string;
    parentId: string | null;
    children: CategoryDto[];
    products: ProductDto[];
    subCategories: CategoryDto[];
    nameEn: string;
    nameAr: string;
    imageUrl: string;
    isActive: boolean;
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    isTitleManuallyTranslated: boolean;
    originalTitle: string;
    hasMore?: boolean;
    currentPage?: number;
  }
  
// New interface for the category products API response
export interface CategoryProductsResponse {
  message: string;
  isSuccess: boolean;
  statusCode: number;
  result: {
    category: CategoryDto;
    products: ProductDto[];
    totalCount: number;
    page: number;
    pageSize: number;
  };
}
  