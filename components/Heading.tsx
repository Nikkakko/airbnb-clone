import * as React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-2 pb-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-neutral-500">{subtitle}</p>
    </div>
  );
};

export default Heading;
