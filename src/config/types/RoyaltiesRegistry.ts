/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type PartStruct = { account: string; value: BigNumberish };

export type PartStructOutput = [string, BigNumber] & {
  account: string;
  value: BigNumber;
};

export interface RoyaltiesRegistryInterface extends utils.Interface {
  functions: {
    "getRoyalties(address,uint256)": FunctionFragment;
    "initialize()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "royaltiesByToken(address)": FunctionFragment;
    "royaltiesByTokenAndTokenId(bytes32)": FunctionFragment;
    "royaltiesProviders(address)": FunctionFragment;
    "setProviderByToken(address,address)": FunctionFragment;
    "setRoyaltiesByToken(address,(address,uint256)[])": FunctionFragment;
    "setRoyaltiesByTokenAndTokenId(address,uint256,(address,uint256)[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getRoyalties",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "royaltiesByToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "royaltiesByTokenAndTokenId",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "royaltiesProviders",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setProviderByToken",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoyaltiesByToken",
    values: [string, PartStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoyaltiesByTokenAndTokenId",
    values: [string, BigNumberish, PartStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "getRoyalties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltiesByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltiesByTokenAndTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltiesProviders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProviderByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRoyaltiesByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRoyaltiesByTokenAndTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "RoyaltiesSetForContract(address,tuple[])": EventFragment;
    "RoyaltiesSetForToken(address,uint256,tuple[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoyaltiesSetForContract"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoyaltiesSetForToken"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type RoyaltiesSetForContractEvent = TypedEvent<
  [string, PartStructOutput[]],
  { token: string; royalties: PartStructOutput[] }
>;

export type RoyaltiesSetForContractEventFilter =
  TypedEventFilter<RoyaltiesSetForContractEvent>;

export type RoyaltiesSetForTokenEvent = TypedEvent<
  [string, BigNumber, PartStructOutput[]],
  { token: string; tokenId: BigNumber; royalties: PartStructOutput[] }
>;

export type RoyaltiesSetForTokenEventFilter =
  TypedEventFilter<RoyaltiesSetForTokenEvent>;

export interface RoyaltiesRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RoyaltiesRegistryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getRoyalties(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[PartStructOutput[]]>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    royaltiesByToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean] & { initialized: boolean }>;

    royaltiesByTokenAndTokenId(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean] & { initialized: boolean }>;

    royaltiesProviders(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setProviderByToken(
      token: string,
      provider: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRoyaltiesByToken(
      token: string,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRoyaltiesByTokenAndTokenId(
      token: string,
      tokenId: BigNumberish,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getRoyalties(
    token: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<PartStructOutput[]>;

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  royaltiesByToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  royaltiesByTokenAndTokenId(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  royaltiesProviders(arg0: string, overrides?: CallOverrides): Promise<string>;

  setProviderByToken(
    token: string,
    provider: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRoyaltiesByToken(
    token: string,
    royalties: PartStruct[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRoyaltiesByTokenAndTokenId(
    token: string,
    tokenId: BigNumberish,
    royalties: PartStruct[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getRoyalties(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PartStructOutput[]>;

    initialize(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    royaltiesByToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    royaltiesByTokenAndTokenId(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    royaltiesProviders(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    setProviderByToken(
      token: string,
      provider: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setRoyaltiesByToken(
      token: string,
      royalties: PartStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setRoyaltiesByTokenAndTokenId(
      token: string,
      tokenId: BigNumberish,
      royalties: PartStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "RoyaltiesSetForContract(address,tuple[])"(
      token?: string | null,
      royalties?: null
    ): RoyaltiesSetForContractEventFilter;
    RoyaltiesSetForContract(
      token?: string | null,
      royalties?: null
    ): RoyaltiesSetForContractEventFilter;

    "RoyaltiesSetForToken(address,uint256,tuple[])"(
      token?: string | null,
      tokenId?: BigNumberish | null,
      royalties?: null
    ): RoyaltiesSetForTokenEventFilter;
    RoyaltiesSetForToken(
      token?: string | null,
      tokenId?: BigNumberish | null,
      royalties?: null
    ): RoyaltiesSetForTokenEventFilter;
  };

  estimateGas: {
    getRoyalties(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    royaltiesByToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    royaltiesByTokenAndTokenId(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    royaltiesProviders(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setProviderByToken(
      token: string,
      provider: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRoyaltiesByToken(
      token: string,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRoyaltiesByTokenAndTokenId(
      token: string,
      tokenId: BigNumberish,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getRoyalties(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    royaltiesByToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    royaltiesByTokenAndTokenId(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    royaltiesProviders(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setProviderByToken(
      token: string,
      provider: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRoyaltiesByToken(
      token: string,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRoyaltiesByTokenAndTokenId(
      token: string,
      tokenId: BigNumberish,
      royalties: PartStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
