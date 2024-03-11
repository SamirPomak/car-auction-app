export type Auction = {
  make: string;
  model: string;
  year: number;
  engine: string;
  mileage: number;
  transmission: string;
  color: string;
  price: number;
  images: string[];
  bids: Bid[];
  author: {
    id: 'string';
    name: 'string';
  };
};

export type Bid = {
  bid: number;
  buyer: {
    name: string | null;
    id: string;
    avatar: string | null;
  };
};
