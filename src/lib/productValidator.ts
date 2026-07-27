/**
 * Product Link Validation & Automatic Replacement Utility
 */

export interface ProductItem {
  id: string;
  brand: string;
  brand_id?: string;
  title?: string;
  name?: string;
  app?: string;
  category?: string;
  category_type?: string;
  type?: string;
  discount?: string;
  discountRate?: number;
  originalPrice?: number;
  discountPrice?: number;
  couponCode?: string;
  linkNote?: string;
  imageUrl?: string;
  image?: string;
  affiliate_link?: string;
  purchaseUrl?: string;
  buyUrl?: string;
  productUrl?: string;
  affiliateUrl?: string;
  url?: string;
  link?: string;
  isSoldOut?: boolean;
  soldOut?: boolean;
  status?: string;
  minOrder?: string;
  validity?: string;
  region?: string;
  card_discount?: string;
  createdAt?: number;
  isReplaced?: boolean;
  replacementReason?: string;
}

// Known main marketplace root domain patterns that DO NOT point to a specific product
const MAIN_PAGE_URL_PATTERNS = [
  /^https?:\/\/(www\.|m\.)?baemin\.com\/?$/i,
  /^https?:\/\/(www\.|m\.)?baemin\.com\/?\?.*$/i,
  /^https?:\/\/(www\.)?coupang\.com\/?$/i,
  /^https?:\/\/eats\.coupang\.com\/?$/i,
  /^https?:\/\/(www\.|m\.)?yogiyo\.co\.kr\/?$/i,
  /^https?:\/\/(www\.)?ddangyo\.com\/?$/i,
  /^https?:\/\/(www\.)?kurly\.com\/?$/i,
  /^https?:\/\/(www\.)?woodongs\.com\/?$/i,
  /^https?:\/\/(www\.)?11st\.co\.kr\/?$/i,
  /^https?:\/\/(www\.)?gmarket\.co\.kr\/?$/i,
  /^https?:\/\/(www\.)?auction\.co\.kr\/?$/i,
  /^https?:\/\/(www\.)?wemakeprice\.com\/?$/i,
  /^https?:\/\/(www\.)?mychef\.kr\/?$/i,
  /^https?:\/\/(www\.)?doeat\.io\/?$/i,
  /^https?:\/\/(www\.)?specialdelivery\.or\.kr\/?$/i,
  /^https?:\/\/(www\.)?daaguro\.com\/?$/i,
  /^https?:\/\/(www\.)?mukkebi\.com\/?$/i,
  /^https?:\/\/(www\.)?dongbaektong\.com\/?$/i,
];

/**
 * Checks whether a given URL is a valid, specific product detail URL
 * and NOT a generic main marketplace domain page or empty link.
 */
export function isValidProductUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed === '/' || !trimmed.startsWith('http')) {
    return false;
  }

  // Check if it matches any main marketplace homepage pattern
  for (const pattern of MAIN_PAGE_URL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }

  // Must have a specific path or product identifier parameter
  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();

    // If pathname is just "/" or empty and no query params, it's a main page
    if ((pathname === '/' || pathname === '') && !search) {
      return false;
    }

    // Known product path signatures
    const hasProductPath =
      pathname.includes('/vp/products/') ||
      pathname.includes('/goods/') ||
      pathname.includes('/product/') ||
      pathname.includes('/products/') ||
      pathname.includes('proddetail') ||
      pathname.includes('goods_view') ||
      pathname.includes('/item/') ||
      pathname.includes('/search') ||
      pathname.includes('search.tmall') ||
      pathname.includes('browse.gmarket') ||
      search.includes('prdcd=') ||
      search.includes('goodsno=') ||
      search.includes('kwd=') ||
      search.includes('keyword=') ||
      search.includes('query=') ||
      search.includes('q=');

    return hasProductPath;
  } catch {
    return false;
  }
}

/**
 * Gets the actual purchase URL from a product item
 */
export function getProductPurchaseUrl(item: ProductItem | null | undefined): string | null {
  if (!item) return null;
  const candidate =
    item.purchaseUrl ||
    item.productUrl ||
    item.buyUrl ||
    item.affiliateUrl ||
    item.affiliate_link ||
    item.url ||
    item.link;

  if (isValidProductUrl(candidate)) {
    return candidate!.trim();
  }

  return null;
}

/**
 * Verifies if a product item is active, in stock, and has a valid specific product detail URL.
 */
export function isProductActiveAndValid(item: ProductItem | null | undefined): boolean {
  if (!item) return false;
  if (
    item.isSoldOut === true ||
    item.soldOut === true ||
    item.status === 'sold_out' ||
    item.status === 'expired' ||
    item.status === 'deleted'
  ) {
    return false;
  }
  const rawUrl =
    item.purchaseUrl ||
    item.productUrl ||
    item.buyUrl ||
    item.affiliateUrl ||
    item.affiliate_link ||
    item.url ||
    item.link;

  return isValidProductUrl(rawUrl);
}

/**
 * Searches an available pool of products for an active alternative product
 * matching same brand or category.
 */
export function findActiveReplacementProduct(
  targetItem: ProductItem,
  availablePool: ProductItem[]
): ProductItem | null {
  if (!availablePool || availablePool.length === 0) return null;

  const targetBrand = (targetItem.brand || targetItem.brand_id || targetItem.name || '').toLowerCase().trim();
  const targetCategory = (targetItem.category || targetItem.category_type || targetItem.type || '').toLowerCase().trim();
  const targetApp = (targetItem.app || '').toLowerCase().trim();

  // Filter pool to only active & valid items
  const activePool = availablePool.filter((item) => isProductActiveAndValid(item) && item.id !== targetItem.id);

  if (activePool.length === 0) return null;

  // 1. Same Brand & Same Category
  if (targetBrand && targetCategory) {
    const brandCatMatch = activePool.find((item) => {
      const b = (item.brand || item.brand_id || '').toLowerCase();
      const c = (item.category || item.category_type || item.type || '').toLowerCase();
      return (b.includes(targetBrand) || targetBrand.includes(b)) && c === targetCategory;
    });
    if (brandCatMatch) return brandCatMatch;
  }

  // 2. Same Brand
  if (targetBrand) {
    const brandMatch = activePool.find((item) => {
      const b = (item.brand || item.brand_id || '').toLowerCase();
      return b.includes(targetBrand) || targetBrand.includes(b);
    });
    if (brandMatch) return brandMatch;
  }

  // 3. Same Category
  if (targetCategory) {
    const catMatch = activePool.find((item) => {
      const c = (item.category || item.category_type || item.type || '').toLowerCase();
      return c === targetCategory || c.includes(targetCategory) || targetCategory.includes(c);
    });
    if (catMatch) return catMatch;
  }

  // 4. Same App
  if (targetApp) {
    const appMatch = activePool.find((item) => (item.app || '').toLowerCase() === targetApp);
    if (appMatch) return appMatch;
  }

  // 5. Any active item in pool
  return activePool[0] || null;
}

/**
 * Replaces fields of an invalid/sold-out product with an active replacement product's details.
 */
export function createReplacedProductData(originalItem: ProductItem, activeReplacement: ProductItem): ProductItem {
  const replacementUrl = getProductPurchaseUrl(activeReplacement) || '';

  return {
    ...originalItem,
    brand: activeReplacement.brand || originalItem.brand,
    title: activeReplacement.title || activeReplacement.name || activeReplacement.brand || originalItem.title,
    name: activeReplacement.name || activeReplacement.title || activeReplacement.brand || originalItem.name,
    imageUrl: activeReplacement.imageUrl || activeReplacement.image || originalItem.imageUrl,
    image: activeReplacement.image || activeReplacement.imageUrl || originalItem.image,
    originalPrice: activeReplacement.originalPrice ?? originalItem.originalPrice,
    discountPrice: activeReplacement.discountPrice ?? originalItem.discountPrice,
    discountRate: activeReplacement.discountRate ?? originalItem.discountRate,
    discount: activeReplacement.discount || originalItem.discount,
    couponCode: activeReplacement.couponCode || originalItem.couponCode || '',
    linkNote: activeReplacement.linkNote || originalItem.linkNote || '',
    purchaseUrl: replacementUrl,
    affiliate_link: replacementUrl,
    productUrl: replacementUrl,
    buyUrl: replacementUrl,
    url: replacementUrl,
    link: replacementUrl,
    category: activeReplacement.category || originalItem.category,
    category_type: activeReplacement.category_type || originalItem.category_type,
    minOrder: activeReplacement.minOrder || originalItem.minOrder,
    validity: activeReplacement.validity || originalItem.validity,
    card_discount: activeReplacement.card_discount || originalItem.card_discount,
    app: activeReplacement.app || originalItem.app,
    isSoldOut: false,
    soldOut: false,
    isReplaced: true,
    replacementReason: '원래 상품 품절/링크 만료로 인한 최신 동일 브랜드 특가 자동 대체',
  };
}
