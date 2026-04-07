import { ArrowLeft, Heart, Share2, Star, Shield, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function EquipmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const equipment = {
    id: Number(id),
    title: "LEICA M11",
    category: "Premium Camera",
    price: "199.000.000",
    rating: 4.9,
    reviews: 128,
    sold: 23,
    image: "https://images.unsplash.com/photo-1725779318629-eda3e096eb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwYWVzdGhldGljJTIwZGFya3xlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Brand New",
    seller: {
      name: "Premium Camera Store",
      rating: 4.9,
      verified: true,
    },
    description:
      "The Leica M11 is a state-of-the-art digital rangefinder camera featuring a 60MP full-frame sensor, exceptional build quality, and legendary Leica optics. This camera represents the pinnacle of precision engineering and photographic excellence.",
    specs: [
      { label: "Sensor", value: "60MP Full-Frame BSI-CMOS" },
      { label: "ISO Range", value: "64-50000" },
      { label: "Video", value: "5K 30fps" },
      { label: "Storage", value: "256GB Internal + SD" },
    ],
    includes: [
      "Leica M11 Camera Body",
      "Rechargeable Battery",
      "Battery Charger",
      "USB-C Cable",
      "Camera Strap",
      "Original Box & Documentation",
    ],
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-24">
      {/* Image Header */}
      <div className="relative">
        <div className="aspect-square bg-black">
          <ImageWithFallback
            src={equipment.image}
            alt={equipment.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-[#FF8C42] text-black text-xs px-3 py-1.5 rounded-full font-medium">
            {equipment.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Title & Price */}
        <div>
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
            {equipment.category}
          </div>
          <h1 className="text-3xl mb-4 tracking-tight">{equipment.title}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl text-[#FF8C42]">₫{equipment.price}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400 gap-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-[#FF8C42] fill-[#FF8C42]" />
              {equipment.rating} ({equipment.reviews})
            </div>
            <div>Sold: {equipment.sold}</div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Seller</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF8C42] flex items-center justify-center text-black">
                {equipment.seller.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{equipment.seller.name}</span>
                  {equipment.seller.verified && (
                    <CheckCircle className="w-4 h-4 text-[#FF8C42]" />
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-3 h-3 mr-1 text-[#FF8C42] fill-[#FF8C42]" />
                  {equipment.seller.rating}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-xl text-sm hover:bg-gray-800 transition-colors">
              Visit Store
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Description</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{equipment.description}</p>
        </div>

        {/* Specifications */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Specifications</h3>
          <div className="space-y-3">
            {equipment.specs.map((spec, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <span className="text-sm text-gray-500">{spec.label}</span>
                <span className="text-sm text-gray-300">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">What's Included</h3>
          <div className="space-y-2">
            {equipment.includes.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FF8C42] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10 border border-[#FF8C42]/20 rounded-3xl p-5 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#FF8C42]" />
          <div className="flex-1">
            <h4 className="text-sm mb-1">Buyer Protection</h4>
            <p className="text-xs text-gray-400">
              100% money-back guarantee if product doesn't match description
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-[#0a0a0a] border-t border-gray-800 px-6 py-4 flex gap-3">
        <button className="flex-1 py-4 bg-gray-900 border border-gray-800 text-white rounded-2xl hover:bg-gray-800 transition-colors">
          Contact Seller
        </button>
        <button className="flex-1 py-4 bg-[#FF8C42] text-black rounded-2xl hover:bg-[#FF7A2F] transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
}