"use client";
import "./globals.css";
import store from "./store.js";
import { Provider, useSelector } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { selectUser } from "./features/userSlice";
import { usePathname } from "next/navigation";

function MyApp({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isUserLoaded = user !== null;

  return (
    <Provider store={store}>
      <RootLayout children={children} isUserLoaded={isUserLoaded} user={user} />
    </Provider>
  );
}

function RootLayout({ children, isUserLoaded, user }) {
  const [mounted, setMounted] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const isAuthenticated = useSelector(selectUser);
  const currentPath = usePathname();

  useEffect(() => {
    setMounted(true);
    if (isUserLoaded && isAuthenticated) {
      setShowNavbar(true);
    }
  }, [isUserLoaded, isAuthenticated, currentPath, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowNavbar(false);
    }
    if (isAuthenticated) {
      setShowNavbar(true);
    }
  }, [currentPath, isAuthenticated, user]);

  return (
    <html>
      <head />
      <body style={{ paddingLeft: showNavbar ? '14rem' : '0' }}>
        {mounted && showNavbar && <Navbar />}
        {mounted && children}
      </body>
    </html>
  );
}

export default MyApp;
