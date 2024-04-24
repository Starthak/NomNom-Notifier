import { SafeCategory, SafeSeller, SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

interface NavbarProps {
  currentUser?: SafeUser | null;
  currentSeller?: SafeSeller | null;
  categories: SafeCategory[] | null;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentSeller,
  categories
}) => {
  return (
    <div className="w-full  z-10 shadow-sm">
      <div
        className="
          md:py-4 
          border-b-[1px]
        "
      >
        <Container>
          <div
            className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
          >
            {/* Nom Nom Notifier */}
            <Logo />
            {/* <Search /> */}
            <UserMenu currentUser={currentUser} currentSeller={currentSeller} />
          </div>
        </Container>
      </div>
      <Categories categoriesProps={categories} />
    </div>
  );
}


export default Navbar;