# Shadow Properties Migration Guide

## Problem
React Native Web is showing deprecation warnings for `shadow*` style props. These should be replaced with `boxShadow` for web compatibility.

## Solution
I've created a cross-platform shadow utility in `constants/Shadows.ts` that automatically uses `boxShadow` on web and native shadow properties on iOS/Android.

## Migration Steps

### 1. Import the Shadows utility
Add this import to files that use shadow properties:
```typescript
import { Shadows } from '../constants/Shadows';
```

### 2. Replace shadow properties with predefined shadows

#### Common replacements:
- `shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4` → `...Shadows.medium`
- `shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2` → `...Shadows.small`
- `shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8` → `...Shadows.large`
- `shadowColor: '#36c7f6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8` → `...Shadows.primary`

#### Available shadow styles:
- `Shadows.small` - Light shadow for small elements
- `Shadows.medium` - Standard shadow for cards
- `Shadows.large` - Heavy shadow for modals/overlays
- `Shadows.primary` - Blue shadow for primary elements
- `Shadows.card` - Card-specific shadow
- `Shadows.light` - Very light shadow
- `Shadows.lighter` - Extra light shadow
- `Shadows.veryLight` - Minimal shadow
- `Shadows.primaryLight` - Light blue shadow
- `Shadows.primaryMedium` - Medium blue shadow
- `Shadows.button` - Button shadow
- `Shadows.icon` - Icon shadow

### 3. Files that still need updating:

#### High Priority:
- `app/product/[id].tsx` - Multiple shadow properties
- `app/category-products.tsx` - Primary and standard shadows
- `app/(tabs)/index.tsx` - Dynamic shadows and primary shadows
- `app/(tabs)/categories.tsx` - Multiple shadow types
- `app/(tabs)/whishList.tsx` - Card shadows
- `app/(tabs)/cart.tsx` - Card shadows

#### Medium Priority:
- `app/payment-methods.tsx`
- `app/orders.tsx`
- `app/addresses.tsx`
- `app/+not-found.tsx`

### 4. Example Migration

#### Before:
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
```

#### After:
```typescript
import { Shadows } from '../constants/Shadows';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Shadows.medium,
  },
});
```

### 5. Custom Shadows
For custom shadow configurations, use the `createShadow` function:
```typescript
import { createShadow } from '../constants/Shadows';

const customShadow = createShadow({
  shadowColor: '#ff0000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 3
});
```

## Benefits
- ✅ Eliminates deprecation warnings
- ✅ Cross-platform compatibility (web, iOS, Android)
- ✅ Consistent shadow styling across the app
- ✅ Better performance on web
- ✅ Easier maintenance

## Testing
After migration, test on:
- Web browser (should use `boxShadow`)
- iOS simulator (should use native shadows)
- Android emulator (should use elevation) 