export interface CartItemDto {
    id?: number;
    productId?: string;
    title?: string;
    image?: string;
    totalPrice?: number;
    totalPriceWithSAR?: number;
    discount?: number;
    quntity?: number;
    price?: number;
    physicalParameters?: string;
    attributeItems?: AttributeItemDto[];
    cartId?: string;
    physicalParametersJson?: PhysicalParameters;
    linkUrl?: string;
  }
  
  export interface AttributeItemDto {
    id: number;
    configId?: string;
    quntity?: number;
    attributesJson?: string;
    priceWithSAR?: number;
    price?: number;
    cartItemId?: number;
    configurators?: { [key: string]: AttributeDetail }[];
  }
  
  export interface AttributeDetail {
    pid: string;
    value: string;
  }
  
  export interface PhysicalParameters {
    width?: number;
    height?: number;
    weight?: number;
    length?: number;
  }
  
  
  