export type ColorItem = { name: string; hex: string; image: string };

export type Product = {
  name: string;
  nameItemInStorage: string;
  description: string;
  price: string;
  category: string;
  colors: ColorItem[];
  sizes?: {number:string; dimensions:string}[];
};

export const productsData: Record<string, Product> = {
  product1: {
    name: "عباية مخمل شتوي ",
    nameItemInStorage:"عباية مخمل ابو خط القديم",
    description:
      "عباية مخمل شتوي ثقيل، ناعمة وراقية، تعطيك إحساس بالدفء مع إطلالة أنيقة تناسب الشتاء والمناسبات اليومية.",
    price: "15.00 د.أ",
    category: "قسم العبايات الشتوية",
    colors: [
      { name: "زيتي", hex: "#949A84", image: "/products/product_1/1.png" },
      { name: "كحلي", hex: "#34364B", image: "/products/product_1/2.png" },
      { name: "زهري", hex: "#B47169", image: "/products/product_1/3.png" },
      { name: "أسود", hex: "#000000", image: "/products/product_1/4.jpg" },
      { name: "تركواز", hex: "#5788A8", image: "/products/product_1/5.jpg" },
    ],
    sizes:[{
      number:"1",
      dimensions:"بيلبس من وزن 60 كيلو الى وزن 80"
    },
    {
      number:"2",
      dimensions:"بيلبس من وزن 80 كيلو الى وزن 100"
    },
    {
      number:"3",
      dimensions:"بيلبس من وزن 100 كيلو الى وزن 120"
    }
  ]
  },

  product3: {
    name: "عباية مخمل شتوي فاخر ",
    nameItemInStorage:"عباية مخمل ابو الحط الجديد",
    description:
      "نوفر ضمان ما بعد البيع لراحتك، مع خدمة توصيل سريعة إلى جميع المحافظات، لتصلك العباية بكل أمان وسهولة.",
    price: "15.00 د.أ",
    category: "قسم العبايات الشتوية",
    colors: [
      { name: "كحلي", hex: "#13253F", image: "/products/product_3/1oneline.jpg" },
      { name: "أسود", hex: "#000000", image: "/products/product_3/2oneline.jpg" },
      { name: "زيتي", hex: "#949A84", image: "/products/product_3/3oneline.jpg" },
    ],
        sizes:[{
      number:"1",
      dimensions:"بيلبس من وزن 60 كيلو الى وزن 80"
    },
    {
      number:"2",
      dimensions:"بيلبس من وزن 80 كيلو الى وزن 100"
    },
    {
      number:"3",
      dimensions:"بيلبس من وزن 100 كيلو الى وزن 120"
    }
  ]
    
  },
    product4: {
    name: "عباية مخمل شتوي فاخر",
    nameItemInStorage:"عباية مخمل التطريز من فوق ",
    description:
      "نوفر ضمان ما بعد البيع لراحتك، مع خدمة توصيل سريعة إلى جميع المحافظات، لتصلك العباية بكل أمان وسهولة.",
    price: "15.00 د.أ",
    category: "قسم العبايات الشتوية",
    colors: [
      { name: "موفي", hex: "#2F1D3A", image: "/products/product_4/3.png" },
      { name: "سكري", hex: "#F8F0EB", image: "/products/product_4/4.png" },
      { name: "أسود", hex: "#000000", image: "/products/product_4/5.png" },
      { name: "كحلي", hex: "#1D2951", image: "/products/product_4/2.png" },
      { name: "تركواز", hex: "#004C74", image: "/products/product_4/1.png" },
    ],
        sizes:[{
      number:"1",
      dimensions:"بيلبس من وزن 60 كيلو الى وزن 80"
    },
    {
      number:"2",
      dimensions:"بيلبس من وزن 80 كيلو الى وزن 100"
    },
    {
      number:"3",
      dimensions:"بيلبس من وزن 100 كيلو الى وزن 120"
    }
  ]
  },
    product5: {
    name: "مطرزات شتوي فاخر",
    nameItemInStorage:"مطرزات شتوي فاخر جيب",
    description:
      "نوفر ضمان ما بعد البيع لراحتك، مع خدمة توصيل سريعة إلى جميع المحافظات، لتصلك العباية بكل أمان وسهولة.",
    price: "21.99 د.أ",
    category: "قسم العبايات الشتوية",
    colors: [
      { name: "الوان مخلطة", hex: "#F54025", image: "/products/product_5/1.png" },
      { name: "الوان مخلطة", hex: "#FA36A1", image: "/products/product_5/2.png" },
      { name: "أبيض", hex: "#E9E9F8", image: "/products/product_5/3.png" },
      { name: "زيتي", hex: "#7E8021", image: "/products/product_5/4.png" },
      { name: "أسود", hex: "#000000", image: "/products/product_5/5.png" },
    ],
        sizes:[{
      number:"1",
      dimensions:"بيلبس من وزن 60 كيلو الى وزن 80"
    },
    {
      number:"2",
      dimensions:"بيلبس من وزن 80 كيلو الى وزن 100"
    },
    {
      number:"3",
      dimensions:"بيلبس من وزن 100 كيلو الى وزن 120"
    }
  ]
    },
    product6: {
    name: "عباية مخمل شتوي فاخر جيب",
    nameItemInStorage:"عباية مخمل شتوي جيب",
    description:
      "نوفر ضمان ما بعد البيع لراحتك، مع خدمة توصيل سريعة إلى جميع المحافظات، لتصلك العباية بكل أمان وسهولة.",
    price: "15 د.أ",
    category: "قسم العبايات الشتوية",
    colors: [
      { name: "أسود", hex: "#000000", image: "/products/product_6/1.jpg" },
      { name: "كحلي", hex: "#434966", image: "/products/product_6/2.jpg" },
      { name: "تركواز", hex: "#103A4A", image: "/products/product_6/3.jpg" },
      { name: "توتي", hex: "#4A3149", image: "/products/product_6/4.jpg" },
    ],
        sizes:[{
      number:"1",
      dimensions:"بيلبس من وزن 60 كيلو الى وزن 80"
    },
    {
      number:"2",
      dimensions:"بيلبس من وزن 80 كيلو الى وزن 100"
    },
    {
      number:"3",
      dimensions:"بيلبس من وزن 100 كيلو الى وزن 120"
    }
  ]
},
  product2: {
    name: "فستان صوف  شتوي فاخرة تصميم ",
    nameItemInStorage:"فستان صوف تايغر",
    description:
      "مصنوعة من صوف تريكو عالي الجودة، تمنحك راحة تامة أثناء اللبس، مع قصّة مريحة تناسب مختلف الأذواق.",
    price: "17.00 د.أ",
    category: "قسم فساتين الصوف الشتوية",
    colors: [
      { name: "بيج", hex: "#DABFAC", image: "/products/product_2/1.png" },
      { name: "رمادي", hex: "#656569", image: "/products/product_2/2.png" },
      { name: "بيج غامق", hex: "#7B5750", image: "/products/product_2/3.png" },
    ],
  },
}
