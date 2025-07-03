export interface Nft {
  Id: string;
  CreatorId: number,
  OwnerId: number,
  Link: string;
  Description: string;
  Name: string;
}

export interface NftDTO {
  Id: string;
  Description: string;
  Name: string;
  CreatorName: string;
  OwnerName: string;
  CreatedAt: Date;
  Link: string;
}

export interface CreateNftDTO {
  Name: string;
  Link: string;
  Description: string;
}

export interface TransferNftDTO {
  NftId: string;
  NewOwnerId: number;
}
