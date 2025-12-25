import { createSlice } from "@reduxjs/toolkit";

const initialProducts = [
  // Men's Shirts
  {
    id: 1,
    name: "Classic Blue Oxford Shirt",
    price: 89.99,
    rating: 4.5,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Shirts",
    color: "Blue",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "White Linen Business Shirt",
    price: 95.99,
    rating: 4.8,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Shirts",
    color: "White",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Green Casual Button Down",
    price: 75.99,
    rating: 4.2,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Shirts",
    color: "Green",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Navy Blue Formal Shirt",
    price: 110.99,
    rating: 4.7,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Shirts",
    color: "Blue",
    sizes: ["XS", "S", "M", "L", "XL"],
  },

  // Men's T-Shirts
  {
    id: 5,
    name: "Black Essential Crew Neck",
    price: 29.99,
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "Men",
    productType: "T-Shirts",
    color: "Black",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    name: "White Basic V-Neck Tee",
    price: 24.99,
    rating: 4.4,
    reviews: 287,
    image:
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=500&fit=crop",
    category: "Men",
    productType: "T-Shirts",
    color: "White",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "Gray Vintage Graphic Tee",
    price: 34.99,
    rating: 4.3,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
    category: "Men",
    productType: "T-Shirts",
    color: "Gray",
    sizes: ["M", "L", "XL"],
  },
  {
    id: 8,
    name: "Red Athletic Performance Tee",
    price: 39.99,
    rating: 4.5,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop",
    category: "Men",
    productType: "T-Shirts",
    color: "Red",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },

  // Men's Pants
  {
    id: 9,
    name: "Navy Chino Slim Fit",
    price: 79.99,
    rating: 4.6,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Pants",
    color: "Blue",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: 10,
    name: "Khaki Classic Trousers",
    price: 85.99,
    rating: 4.4,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Pants",
    color: "Yellow",
    sizes: ["30", "32", "34", "36", "38"],
  },
  {
    id: 11,
    name: "Black Formal Dress Pants",
    price: 120.99,
    rating: 4.8,
    reviews: 298,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Pants",
    color: "Black",
    sizes: ["28", "30", "32", "34"],
  },

  // Men's Jeans
  {
    id: 12,
    name: "Classic Blue Denim Jeans",
    price: 99.99,
    rating: 4.7,
    reviews: 456,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jeans",
    color: "Blue",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: 13,
    name: "Black Slim Fit Jeans",
    price: 89.99,
    rating: 4.5,
    reviews: 389,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jeans",
    color: "Black",
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: 14,
    name: "Light Wash Relaxed Jeans",
    price: 79.99,
    rating: 4.3,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jeans",
    color: "Blue",
    sizes: ["28", "30", "32", "34", "36", "38"],
  },

  // Men's Jackets
  {
    id: 15,
    name: "Black Leather Biker Jacket",
    price: 299.99,
    rating: 4.9,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jackets",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 16,
    name: "Navy Blue Bomber Jacket",
    price: 159.99,
    rating: 4.6,
    reviews: 245,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jackets",
    color: "Blue",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 17,
    name: "Brown Suede Casual Jacket",
    price: 189.99,
    rating: 4.5,
    reviews: 134,
    image:
      "https://images.unsplash.com/photo-1544923246-77307dd628b5?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jackets",
    color: "Orange",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 18,
    name: "Green Military Field Jacket",
    price: 175.99,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1608234807905-4466023792f5?w=400&h=500&fit=crop",
    category: "Men",
    productType: "Jackets",
    color: "Green",
    sizes: ["M", "L", "XL"],
  },

  // Women's Dresses
  {
    id: 19,
    name: "Red Elegant Evening Dress",
    price: 189.99,
    rating: 4.8,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Dresses",
    color: "Red",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 20,
    name: "Black Cocktail Mini Dress",
    price: 145.99,
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Dresses",
    color: "Black",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 21,
    name: "White Summer Maxi Dress",
    price: 125.99,
    rating: 4.5,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Dresses",
    color: "White",
    sizes: ["S", "M", "L"],
  },
  {
    id: 22,
    name: "Blue Floral Print Dress",
    price: 99.99,
    rating: 4.4,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Dresses",
    color: "Blue",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 23,
    name: "Pink Casual Day Dress",
    price: 79.99,
    rating: 4.3,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Dresses",
    color: "Purple",
    sizes: ["S", "M", "L"],
  },

  // Women's Shirts
  {
    id: 24,
    name: "White Silk Blouse",
    price: 129.99,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Shirts",
    color: "White",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 25,
    name: "Blue Chambray Button Up",
    price: 89.99,
    rating: 4.5,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Shirts",
    color: "Blue",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 26,
    name: "Black Satin Blouse",
    price: 109.99,
    rating: 4.6,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Shirts",
    color: "Black",
    sizes: ["XS", "S", "M", "L"],
  },

  // Women's T-Shirts
  {
    id: 27,
    name: "Pink Crop Top Tee",
    price: 34.99,
    rating: 4.4,
    reviews: 289,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
    category: "Women",
    productType: "T-Shirts",
    color: "Purple",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 28,
    name: "White Essential Crew Tee",
    price: 29.99,
    rating: 4.5,
    reviews: 345,
    image:
      "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&h=500&fit=crop",
    category: "Women",
    productType: "T-Shirts",
    color: "White",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 29,
    name: "Black Oversized Graphic Tee",
    price: 44.99,
    rating: 4.3,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=500&fit=crop",
    category: "Women",
    productType: "T-Shirts",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
  },

  // Women's Pants
  {
    id: 30,
    name: "Black High Waist Trousers",
    price: 95.99,
    rating: 4.6,
    reviews: 278,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Pants",
    color: "Black",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 31,
    name: "White Wide Leg Pants",
    price: 89.99,
    rating: 4.5,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Pants",
    color: "White",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 32,
    name: "Navy Slim Fit Dress Pants",
    price: 105.99,
    rating: 4.7,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Pants",
    color: "Blue",
    sizes: ["XS", "S", "M", "L"],
  },

  // Women's Jeans
  {
    id: 33,
    name: "Blue High Rise Skinny Jeans",
    price: 89.99,
    rating: 4.6,
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jeans",
    color: "Blue",
    sizes: ["24", "26", "28", "30", "32"],
  },
  {
    id: 34,
    name: "Black Ripped Boyfriend Jeans",
    price: 79.99,
    rating: 4.4,
    reviews: 356,
    image:
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jeans",
    color: "Black",
    sizes: ["26", "28", "30", "32"],
  },
  {
    id: 35,
    name: "Light Wash Mom Jeans",
    price: 85.99,
    rating: 4.5,
    reviews: 289,
    image:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jeans",
    color: "Blue",
    sizes: ["24", "26", "28", "30", "32", "34"],
  },

  // Women's Jackets
  {
    id: 36,
    name: "Pink Blazer Jacket",
    price: 175.99,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jackets",
    color: "Purple",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 37,
    name: "Black Leather Moto Jacket",
    price: 245.99,
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jackets",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 38,
    name: "Beige Trench Coat",
    price: 199.99,
    rating: 4.6,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1544923246-77307dd628b5?w=400&h=500&fit=crop",
    category: "Women",
    productType: "Jackets",
    color: "Yellow",
    sizes: ["XS", "S", "M", "L", "XL"],
  },

  // Kids' T-Shirts
  {
    id: 39,
    name: "Blue Dinosaur Print Tee",
    price: 19.99,
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "T-Shirts",
    color: "Blue",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
  },
  {
    id: 40,
    name: "Pink Unicorn Graphic Tee",
    price: 18.99,
    rating: 4.7,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "T-Shirts",
    color: "Purple",
    sizes: ["3-4Y", "5-6Y", "7-8Y"],
  },
  {
    id: 41,
    name: "Red Striped Cotton Tee",
    price: 16.99,
    rating: 4.5,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "T-Shirts",
    color: "Red",
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
  },

  // Kids' Pants
  {
    id: 42,
    name: "Blue Cargo Pants",
    price: 34.99,
    rating: 4.6,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Pants",
    color: "Blue",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
  },
  {
    id: 43,
    name: "Black Jogger Pants",
    price: 29.99,
    rating: 4.5,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Pants",
    color: "Black",
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
  },

  // Kids' Jeans
  {
    id: 44,
    name: "Blue Denim Kids Jeans",
    price: 39.99,
    rating: 4.7,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Jeans",
    color: "Blue",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
  },
  {
    id: 45,
    name: "Black Stretch Kids Jeans",
    price: 35.99,
    rating: 4.4,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Jeans",
    color: "Black",
    sizes: ["5-6Y", "7-8Y", "9-10Y"],
  },

  // Kids' Jackets
  {
    id: 46,
    name: "Yellow Raincoat Jacket",
    price: 49.99,
    rating: 4.8,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Jackets",
    color: "Yellow",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
  },
  {
    id: 47,
    name: "Blue Denim Jacket",
    price: 54.99,
    rating: 4.6,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
    category: "Kids",
    productType: "Jackets",
    color: "Blue",
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
  },

  // Accessories
  {
    id: 48,
    name: "Black Leather Belt",
    price: 45.99,
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 49,
    name: "Brown Leather Wallet",
    price: 59.99,
    rating: 4.7,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Orange",
    sizes: ["One Size"],
  },
  {
    id: 50,
    name: "Silver Watch Classic",
    price: 199.99,
    rating: 4.8,
    reviews: 456,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Gray",
    sizes: ["One Size"],
  },
  {
    id: 51,
    name: "Black Sunglasses Aviator",
    price: 89.99,
    rating: 4.5,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Black",
    sizes: ["One Size"],
  },
  {
    id: 52,
    name: "Blue Baseball Cap",
    price: 29.99,
    rating: 4.4,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Blue",
    sizes: ["One Size"],
  },
  {
    id: 53,
    name: "Red Silk Scarf",
    price: 65.99,
    rating: 4.6,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Red",
    sizes: ["One Size"],
  },
  {
    id: 54,
    name: "White Canvas Tote Bag",
    price: 49.99,
    rating: 4.5,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "White",
    sizes: ["One Size"],
  },
  {
    id: 55,
    name: "Black Leather Backpack",
    price: 129.99,
    rating: 4.7,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    category: "Accessories",
    productType: "Accessories",
    color: "Black",
    sizes: ["One Size"],
  },
];

const ProductsSlice = createSlice({
  name: "Products",
  initialState: {
    allProducts: initialProducts,
    filteredProducts: initialProducts,
    filters: {
      priceRange: [0, 500],
      ratings: [],
      categories: [],
      productTypes: [],
      colors: [],
      sizes: [],
      searchQuery: "",
      sortBy: "featured",
    },
    categories: ["Men", "Women", "Kids", "Accessories"],
    productTypes: [
      "Shirts",
      "T-Shirts",
      "Pants",
      "Jeans",
      "Jackets",
      "Dresses",
      "Accessories",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Blue", value: "#0066FF" },
      { name: "Red", value: "#FF0000" },
      { name: "Green", value: "#00AA00" },
      { name: "Yellow", value: "#FFCC00" },
      { name: "Purple", value: "#9933FF" },
      { name: "Orange", value: "#FF6600" },
      { name: "Gray", value: "#808080" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  reducers: {
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;

      if (filterType === "priceRange") {
        state.filters.priceRange = value;
      } else if (filterType === "sortBy") {
        state.filters.sortBy = value;
      } else if (filterType === "searchQuery") {
        state.filters.searchQuery = value;
      } else {
        // Toggle selection for array filters
        const filterArray = state.filters[filterType];
        if (filterArray.includes(value)) {
          state.filters[filterType] = filterArray.filter(
            (item) => item !== value
          );
        } else {
          state.filters[filterType].push(value);
        }
      }

      // Apply filters
      let filtered = [...state.allProducts];

      // Price filter
      filtered = filtered.filter(
        (product) =>
          product.price >= state.filters.priceRange[0] &&
          product.price <= state.filters.priceRange[1]
      );

      // Rating filter
      if (state.filters.ratings.length > 0) {
        const minRating = Math.min(...state.filters.ratings);
        filtered = filtered.filter((product) => product.rating >= minRating);
      }

      // Category filter
      if (state.filters.categories.length > 0) {
        filtered = filtered.filter((product) =>
          state.filters.categories.includes(product.category)
        );
      }

      // Product Type filter
      if (state.filters.productTypes.length > 0) {
        filtered = filtered.filter((product) =>
          state.filters.productTypes.includes(product.productType)
        );
      }

      // Color filter
      if (state.filters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          state.filters.colors.includes(product.color)
        );
      }

      // Size filter
      if (state.filters.sizes.length > 0) {
        filtered = filtered.filter((product) =>
          product.sizes.some((size) => state.filters.sizes.includes(size))
        );
      }

      // Search query
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.productType.toLowerCase().includes(query)
        );
      }

      // Sort
      switch (state.filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => b.id - a.id);
          break;
        default:
          // featured - keep original order
          break;
      }

      state.filteredProducts = filtered;
    },

    clearFilters: (state) => {
      state.filters = {
        priceRange: [0, 500],
        ratings: [],
        categories: [],
        productTypes: [],
        colors: [],
        sizes: [],
        searchQuery: "",
        sortBy: "featured",
      };
      state.filteredProducts = state.allProducts;
    },

    applySort: (state, action) => {
      state.filters.sortBy = action.payload;
      let filtered = [...state.filteredProducts];

      switch (action.payload) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => b.id - a.id);
          break;
        default:
          break;
      }

      state.filteredProducts = filtered;
    },
  },
});

export const { setFilter, clearFilters, applySort } = ProductsSlice.actions;
export default ProductsSlice.reducer;
