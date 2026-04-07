import { Search, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Discovery() {
  const featuredProducts = [
    {
      id: 1,
      title: "LEICA M11",
      category: "Premium Camera",
      price: "199.000.000",
      image: "https://images.unsplash.com/photo-1725779318629-eda3e096eb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwYWVzdGhldGljJTIwZGFya3xlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "NEW",
    },
    {
      id: 2,
      title: "HASSELBLAD X2D",
      category: "Medium Format",
      price: "175.000.000",
      image: "https://images.unsplash.com/photo-1511140973288-19bf21d7e771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGVxdWlwbWVudCUyMG1pbmltYWwlMjBibGFjayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc1MDE1MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "HOT",
    },
    {
      id: 3,
      title: "SONY α1",
      category: "Mirrorless",
      price: "145.000.000",
      image: "https://images.unsplash.com/photo-1585548601784-e319505354bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FtZXJhJTIwZ2VhciUyMGx1eHVyeXxlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const categories = [
    { name: "Cameras", count: 124 },
    { name: "Lenses", count: 286 },
    { name: "Lighting", count: 97 },
    { name: "Accessories", count: 342 },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-1 tracking-tight">DISCOVERY</h1>
            <p className="text-sm text-gray-400">Explore premium equipment</p>
          </div>
          <button className="w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-gray-800">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search equipment..."
            className="pl-11 pr-4 py-6 bg-[#0a0a0a] border-gray-800 rounded-2xl text-white placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              className="px-5 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-full whitespace-nowrap hover:border-[#FF8C42] transition-colors"
            >
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-gray-500 ml-2">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-3xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs tracking-widest mb-2 opacity-90">SPECIAL OFFER</div>
            <h2 className="text-2xl mb-2 tracking-tight">Summer Sale</h2>
            <p className="text-sm opacity-90 mb-4">Up to 30% off on selected items</p>
            <button className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-900 transition-colors">
              Shop Now
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/10 to-transparent"></div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-6 pb-8">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl tracking-tight">Featured</h2>
          <button className="text-sm text-[#FF8C42]">See all</button>
        </div>

        <div className="space-y-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/equipment/${product.id}`}
              className="block bg-[#0a0a0a] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="relative aspect-[4/3]">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-[#FF8C42] text-black text-xs px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </div>
                )}
                <button className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="text-xs text-gray-500 mb-1 tracking-wide uppercase">
                  {product.category}
                </div>
                <h3 className="text-xl mb-3 tracking-tight">{product.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl text-[#FF8C42]">₫{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rental Section */}
      <div className="px-6 pb-8">
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg mb-1 tracking-tight">Rental Service</h3>
              <p className="text-xs text-gray-400">Try before you buy</p>
            </div>
            <div className="text-3xl">📷</div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Rent professional equipment starting from ₫500,000/day
          </p>
          <button className="w-full py-3 bg-white text-black rounded-full text-sm hover:bg-gray-100 transition-colors">
            Browse Rentals
          </button>
        </div>
      </div>
    </div>
  );
}
