

import { CartItemDto } from "./cartInterface";

    export interface ProfileDto {
        user: UserDto;
        orders: OrderDto[];
        favoriteItems: FavoriteItemDto[];
        favoriteSallers: FavoriteSallerDto[];
    }
    
    export interface UserDto {
        password: string;
        confirmPassword: string;
        isComanyOrShop: boolean;
        commercialRegister: string;
        location: string;
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        isComapny: boolean;
        isMarketer: boolean;
        createdAt: string;
        updatedAt: string;
        cartItems: CartItemDto[];
        }

    export interface OrderDto {
        id: number;
        userId: string;
        orderNumber: string;
        orderDate: string;
        totalAmount: number;
        status: string;
        paymentMethod: string;
        shippingAddress: string;
        orderItems: OrderItemDto[];
    }

    export interface OrderItemDto {
        id: number;
        orderId: number;
        productId: string;
        quantity: number;
        price: number;
    }

    export interface FavoriteItemDto {
        id: number;
        name: string;
        title: string;
        image: string;
        price: number;
        productId: string;
        vendorName: string;
        vendorId: string;
        categoryId: string;
        vendorRating: number;
        brandName: string;
    }

    export interface FavoriteSallerDto {
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