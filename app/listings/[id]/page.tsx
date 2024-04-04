import * as React from "react";

interface ListingDetailProps {
  params: {
    id: string;
  };
}

const ListingDetail: React.FC<ListingDetailProps> = ({ params: { id } }) => {
  console.log(id);
  return <div>ListingDetail</div>;
};

export default ListingDetail;
