export interface PopulatedRewardRequest {
  _id: any;
  event: { _id: any; title: string };
  reward: { _id: any; type: string; amount: number };
  createdBy?: { _id: any; name: string; email: string };
  updatedBy?: { _id: any; name: string; email: string };
  deletedBy?: { _id: any; name: string; email: string };
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  user: string;
}
