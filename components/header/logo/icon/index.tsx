import React from "react";
import Image from "next/image";

export default function Icon(props: { size: number }) {
  const { size } = props;

  return <Image src="/icon.png" width={size} height={size} alt="ロゴ" />;
}
