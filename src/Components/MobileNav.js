import { NavLink } from "react-router-dom";
import { useState } from "react";
import onClickOutside from "react-onclickoutside";
import mobileNavimg from "../Images/nav.svg";

export const MobileNav = ({ logoutUser, items, multiSelect = false }) => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  MobileNav.handleClickOutside = () => setOpen(false);

  function handleOnClick(item) {
    if (!selection.some((current) => current.id === item.id)) {
      if (!multiSelect) {
        setSelection([item]);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (current) => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);
    }
  }
  function isItemInSelection(item) {
    if (selection.some((current) => current.id === item.id)) {
      return true;
    }
    return false;
  }
  return (
    <>
      <div id="dropdown">
        <div className="mobilenav mobile dd-wrapper">
          <div
            className="menuBar"
            onKeyPress={() => toggle(!open)}
            onClick={() => toggle(!open)}
          >
            <img src={mobileNavimg} alt="Mobile Navbar" />
          </div>
          {open && (
            <transition name="slide-fade">
              <ul className="dd-list">
                {items.map((item) => (
                  <li className="switch" key={item.id}>
                    {console.log(item)}
                    <NavLink
                      style={({ isActive }) => ({
                        color: isActive ? "#fff" : "#002D62",
                      })}
                      to={item.directory}
                      onClick={item.directory === "/" ? logoutUser : ""}
                      type="submit"
                    >
                      {item.value}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </transition>
          )}
        </div>
      </div>
    </>
  );
};

const clickOutsideConfig = {
  handleClickOutside: () => MobileNav.handleClickOutside,
};

export default onClickOutside(MobileNav, clickOutsideConfig);
