declare type Address = string;
declare type ChainName = string;
declare type ChainId = number | string;
declare type DomainId = number;
declare type HexAddress = `0x${string}`;

declare module '*.yaml' {
  const data: any;
  export default data;
}

