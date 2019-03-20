import execa = require('execa')
export interface IDependency {
  name: string
  type: DependencyType
}
declare type DependencyType = keyof DependencyTypes
interface DependencyTypes {
  dependency: InstallationInstruction
  devDependency: InstallationInstruction
}
declare type InstallationInstruction = {
  yarn: string
  npm: string
}
export declare const dependencyTypes: DependencyType[]
export declare const instructions: DependencyTypes
/**
 *
 * Returns the next dependency type in the chain.
 *
 * @param dependency
 */
export declare function getNextDependencyType(
  type: DependencyType,
): DependencyType | undefined
/**
 *
 * Installation function for Yarn and NPM.
 *
 * @param deps
 * @param type
 */
export declare function install(
  deps: IDependency[],
  type: IDependency['type'],
): Promise<execa.ExecaReturns | null>
export {}
//# sourceMappingURL=installer.d.ts.map
