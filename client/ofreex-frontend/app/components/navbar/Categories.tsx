'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { SafeCategory, SafeSeller, SafeUser } from "@/app/types";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBox from "../CategoryBox";
import Container from '../Container';
import getCategories from '@/app/actions/getCategories';


//export const categories = [
// {
//   label: 'Cars',
//   icon: TbBeach,
//   description: '',
// },
// {
//   label: 'Moterbikes',
//   icon: GiWindmill,
//   description: '',
// },
// {
//   label: 'Mobile Phones',
//   icon: MdOutlineVilla,
//   description: ''
// },
// {
//   label: 'Scooters',
//   icon: TbMountain,
//   description: ''
// },
// {
//   label: 'Accessories',
//   icon: TbPool,
//   description: ''
// },
// {
//   label: 'Teacher',
//   icon: GiIsland,
//   description: ''
// },
// {
//   label: 'Cook',
//   icon: GiBoatFishing,
//   description: ''
// },
// {
//   label: 'Fridges',
//   icon: FaSkiing,
//   description: ''
// },
// {
//   label: 'Houses for sale',
//   icon: GiCastle,
//   description: ''
// },
// {
//   label: 'Pets',
//   icon: GiCaveEntrance,
//   description: ''
// },
// {
//   label: 'Books',
//   icon: GiForestCamp,
//   description: ''
// },
// {
//   label: 'Gym and Fitness',
//   icon: BsSnow,
//   description: ''
// },
// {
//   label: 'Dogs',
//   icon: GiCactus,
//   description: ''
// },
// {
//   label: 'ACs',
//   icon: GiBarn,
//   description: ''
// },
// {
//   label: 'Washing Machines',
//   icon: IoDiamond,
//   description: ''
// }
//]
export let categories: SafeCategory[] | null = [];
interface CategoryProps {
  categoriesProps: SafeCategory[] | null;
}

const Categories: React.FC<CategoryProps> = ({ categoriesProps }) => {
  categories = categoriesProps;
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          md:pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {categories ? categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon || null}
            selected={category === item.label}
          />
        )) : null}
      </div>
    </Container>
  );
}

export default Categories;