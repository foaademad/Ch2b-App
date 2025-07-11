export interface WishlistItemDto {
    id: number;
    name: string;
    title: string;
    image: string;
    price: number;
    productId: string;
    vendorName: string;
    vendorId: string;
    totalPrice: number;
    createAt: Date;
    updateAt: Date;
    categoryId: string;
    vendorRating: number;
    brandName: string;
  }
  
  export interface WishlistSallierDto {
    id: number;
    name: string;
    providerType: string;
    displayName: string;
    shopName: string;
    displayPictureUrl: string;
    deliveryScore: number;
    itemScore: number;
    vendorId: string;
    serviceScore: number;
    stars: number;
    numberOfYear: number;
    favoriteId: string;
  }
  
  export interface FavoriteDto {
    id: string;
    createdAt: Date;
    userId: string;
    favoriteItems: WishlistItemDto[];
    favoriteSallers: WishlistSallierDto[];
  }
  