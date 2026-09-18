import React from "react"
import {
  WashingMachine,
  Utensils,
  Refrigerator,
  Tv,
  Smartphone,
  Package,
} from "lucide-react"

export const CategoryIcon = React.memo(function CategoryIcon({
  category,
  className = "w-4 h-4",
  size,
}: {
  category: string
  className?: string
  size?: number
}) {
  switch (category) {
    case "Lave-linge":
      return <WashingMachine className={className} size={size} />
    case "Lave-vaisselle":
      return <Utensils className={className} size={size} />
    case "Réfrigérateur":
      return <Refrigerator className={className} size={size} />
    case "TV & Écrans":
      return <Tv className={className} size={size} />
    case "Smartphone":
      return <Smartphone className={className} size={size} />
    default:
      return <Package className={className} size={size} />
  }
})
