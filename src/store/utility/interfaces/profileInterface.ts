// "result": {
//         "user": {
//             "password": null,
//             "confirmPassword": null,
//             "isComanyOrShop": false,
//             "commercialRegister": null,
//             "location": null,
//             "id": "914dcf08-3a73-481a-a656-71577b29f653",
//             "email": "sdasdafA@gmail.com",
//             "fullName": "safasdf",
//             "phoneNumber": "+2001056589874",
//             "isComapny": false,
//             "isMarketer": false,
//             "createdAt": "2025-07-10T00:35:58.487946",
//             "updatedAt": "2025-07-14T08:16:32.4602178Z"
//         },
//         "orders": [],
//         "favoriteItems": [
//             {
//                 "id": 36,
//                 "name": "الكمبيوتر المحمول الخفيف المحمول ، 6 بوصات ، نسخة تجارية ، بالجملة",
//                 "title": "الكمبيوتر المحمول الخفيف المحمول ، 6 بوصات ، نسخة تجارية ، بالجملة",
//                 "image": "https://cbu01.alicdn.com/img/ibank/O1CN011AvA8q2DmDQaM12Y0_!!2219835008651-0-cib.jpg",
//                 "price": 443.78,
//                 "productId": "abb-939795844760",
//                 "vendorName": "深圳市伯特科技有限公司",
//                 "vendorId": "abb-b2b-2219835008651956e1",
//                 "categoryId": "abb-702",
//                 "vendorRating": 12,
//                 "brandName": "AiWO"
//             }
//         ],
//         "favoriteSallers": [
//             {
//                 "id": 1002,
//                 "name": "封鞠工贸6",
//                 "providerType": "Alibaba1688",
//                 "displayName": "封鞠工贸6",
//                 "shopName": "桐乡市洲泉封鞠建材商行（个体工商户）",
//                 "displayPictureUrl": "https://cbu01.alicdn.com/img/ibank/2020/428/378/22185873824_536529798.jpg",
//                 "deliveryScore": 0.0,
//                 "itemScore": 0.0,
//                 "vendorId": "abb-b2b-221900312960443f26",
//                 "serviceScore": 0.0,
//                 "stars": 0.0,
//                 "numberOfYear": 0.0,
//                 "favoriteId": null
//             }
//         ]
//     }

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