export type Auction = {
  make: string;
  model: string;
  year: number;
  engine: string;
  mileage: number;
  transmission: string;
  color: string;
  price: number;
  images: { path: string; url: string }[];
  bids: Bid[];
  comments: Comment[];
  id: string | undefined;
  author: {
    id: string;
    name: string;
  };
};

export type Bid = {
  bid: number;
  author: {
    name: string | null;
    id: string;
    avatar: string | null;
  };
  timestamp: string;
};

export type Comment = {
  comment: string;
  author: {
    id: string;
    avatar: string | null;
    name: string | null;
  };
  timestamp: string;
};
