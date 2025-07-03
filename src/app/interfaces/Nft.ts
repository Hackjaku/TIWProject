export interface Nft {
  Id: string;
  CreatorId: number,
  OwnerId: number,
  Link: string;
  Description: string;
  Name: string;
}

export interface NftDTO {
  Name: string;
  CreatorName: string;
  OwnerName: string;
  CreatedAt: Date;
  Link: string;
}
