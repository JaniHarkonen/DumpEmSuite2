import React, { ReactElement, useState } from 'react';

type MenuItem = {
  title: string;
  subItems?: Array<string>;
};

type MenuConfig = Array<MenuItem>;

type MenuItemProps = {
  item: MenuItem;
  isOpen: boolean;
  onOpen: (item: MenuItem) => void;
};

export function MenuItemComponent(props: MenuItemProps): ReactElement {
  const item: MenuItem = props.item;
  const title: string = item.title.toLowerCase();
  const isOpen: boolean = props.isOpen;

  return (
    <div data-test-id={"first-level-" + title}>
      <span>{item.title}</span>
      {item.subItems !== undefined && item.subItems.length > 0 && (
        <>
          <button
            data-test-id={"button-" + title}
            onClick={() => props.onOpen(item)}
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
          
          {isOpen && (
          <ul
            key={"ul-" + title}
            data-test-id={"ul-" + title}
          >
            {item.subItems.map((sub: string) => {
              return (
                <li
                  key={title + "-" + sub.toLowerCase()}
                  data-test-id={title + "-" + sub.toLowerCase()}
                >
                  {sub}
                </li>
              );
            })}
          </ul>)}
        </>
      )}
    </div>
  );
}

export function Solution({ menuConfig }: { menuConfig: MenuConfig }): ReactElement {
  const [openMenu, setOpenMenu] = useState<MenuItem | null>(null);

  const handleMenuOpen = (item: MenuItem) => setOpenMenu(openMenu === item ? null : item);
  
  return (
    <div className="menu-wrapper">
      {menuConfig.map((item: MenuItem) => (
        <MenuItemComponent
          key={"menu-item-" + item.title.toLowerCase()}
          item={item}
          isOpen={openMenu === item}
          onOpen={handleMenuOpen}
        />
      ))}
    </div>
  );
}

export default Solution;
