import React from "react";
import MediaQuery from "react-responsive";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

export const Navbar = () => {
  return (
    <>
      <MediaQuery maxWidth={999}>
        <MobileNav />
      </MediaQuery>
      <MediaQuery minWidth={1000}>
        <DesktopNav />
      </MediaQuery>
    </>
  );
};
