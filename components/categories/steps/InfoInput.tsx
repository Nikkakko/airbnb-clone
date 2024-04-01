import * as React from "react";
import { useFormContext } from "react-hook-form";

interface InfoInputProps {}

const InfoInput: React.FC<InfoInputProps> = ({}) => {
  const { control } = useFormContext();
  return <div>InfoInput</div>;
};

export default InfoInput;
