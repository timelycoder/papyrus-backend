export type TProduct = {
  name: string
  image?: string
  brand: string
  price: number
  category:
    | 'Writing Instruments'
    | 'Paper Products'
    | 'Art Supplies'
    | 'Educational'
  description: string
  quantity: number
  inStock: boolean
  isDeleted: boolean
}
