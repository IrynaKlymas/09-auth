"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TagsMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); 
    const tags = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={css.menuContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={css.menuButton}>
                Notes ▾
            </button>
            {}
            {isOpen && (
                <ul className={css.menuList}>
                    {tags.map((tag) => (
                        <li key={tag} className={css.menuItem}>
                            <Link
                                href={`/notes/filter/${tag}`}
                                className={css.menuLink}
                                onClick={() => setIsOpen(false)} 
                            >
                                {tag === "All" ? "All notes" : tag}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagsMenu;