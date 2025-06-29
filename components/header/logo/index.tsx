import React from "react";
import NextLink from "next/link";
import { Link, Stack } from "@mui/material";
import Icon from "@/components/header/logo/icon/index.tsx";
import Text from "@/components/header/logo/text/index.tsx";

export default function Logo() {
  return (
    <Stack direction="row">
      <Link href="/" underline="none" component={NextLink}>
        <Icon size={32} />
      </Link>
      <Link href="/" underline="none" component={NextLink} pl={1.5}>
        <Text />
      </Link>
    </Stack>
  );
}
