import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

const backend = import.meta.env.VITE_BACKEND_BASE_URL;

const Popover = ({ trigger, content }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 bg-white dark:bg-primaryBg p-4 rounded-lg shadow-lg border border-gray-200 top-full mt-2 "
        >
          {content}
        </div>
      )}
    </div>
  );
};

function Logout() {
  const handleClick = async () => {
    try {
      const response = await fetch(`${backend}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <span onClick={handleClick} className="cursor-pointer">
      Logout
    </span>
  );
}

const AccountPopover = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${backend}/api/check-auth`, {
          credentials: "include",
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  return isLoggedIn ? (
    <Popover
      trigger={"Account"}
      content={
        <div className="flex flex-col gap-3">
          <Link to="/settings">Settings</Link>
          <Logout />
        </div>
      }
    />
  ) : (
    <Link to="/login">Login</Link>
  );
};

export default AccountPopover;
