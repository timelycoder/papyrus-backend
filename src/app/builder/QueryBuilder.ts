import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  search(searchableFields: string[]) {
    let searchTerm = (this.query?.searchTerm as string) || ''
    searchTerm = searchTerm.trim().replace(/\s+/g, ' ')
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      })
    }

    return this
  }

  
  filter() {
    const queryObj: Record<string, any> = { ...this.query } 
    const excludeFields = [
      'searchTerm',
      'sortBy',
      'sortOrder',
      'minPrice',
      'maxPrice',
      'page',
      'limit',
    ]
    excludeFields.forEach((el) => delete queryObj[el])

    if (queryObj.filter) {
      queryObj.author = queryObj.filter
      delete queryObj.filter
    }

    const minPrice = this.query?.minPrice
    const maxPrice = this.query?.maxPrice

    if (minPrice || maxPrice) {
      queryObj['price'] = queryObj['price'] || {}
      if (minPrice) {
        queryObj['price'] = { ...queryObj['price'], $gte: minPrice }
      }
      if (maxPrice) {
        queryObj['price'] = { ...queryObj['price'], $lte: maxPrice }
      }
    }

    if (Object.keys(queryObj).length > 0) {
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)
    }

    return this
  }

  sort() {
    const sortBy = (this.query?.sortBy as string) || 'createdAt'
    const sortOrder = (this.query?.sortOrder as string) === 'asc' ? 1 : -1
    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder })
    return this
  }

  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)

    return this
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const total = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 6
    const totalPage = Math.ceil(total / limit)

    return {
      page,
      limit,
      total,
      totalPage,
    }
  }
}

export default QueryBuilder
