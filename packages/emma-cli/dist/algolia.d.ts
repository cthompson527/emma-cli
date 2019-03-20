import React from 'react'
import algoliasearch from 'algoliasearch'
export interface IPackage {
  objectID: string
  name: string
  version: string
  description: string
  repository?: IPackageRepository
  owner: IPackageOwner
  humanDownloadsLast30Days: string
}
export interface IPackageRepository {
  url: string
}
export interface IPackageOwner {
  name: string
  email?: string
  avatar: string
  link: string
}
/**
 *
 * Performs a search for the specified query and returns information
 * displayed in the UI.
 *
 * @param query
 * @param limit
 */
export declare const search: (
  query: string,
  page?: number,
) => Promise<algoliasearch.Response<IPackage>>
export declare type WithSearchContext<X> = X & {
  hits: IPackage[]
}
export declare const SearchContext: React.Context<IPackage[]>
//# sourceMappingURL=algolia.d.ts.map
