"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

const Modal = ({
    children,
    isOpen: isOpenProp,
    onClose: onCloseProp,
}: ModalProps) => {
    const router = useRouter();

    const handleClose = useCallback(() => {
        if (onCloseProp) {
            onCloseProp();
        } else {
            router.back();
        }
    }, [onCloseProp, router]);

    const isOpen = isOpenProp ?? true;
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleClose]);

    useEffect(() => {
        if (!isOpen) return;

        const body = document.body;
        const html = document.documentElement;

        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;

        const scrollbarWidth = window.innerWidth - html.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            const currentPadding =
                parseFloat(getComputedStyle(body).paddingRight) || 0;
            body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
        }

        const blockedNodes = Array.from(
            document.querySelectorAll<HTMLElement>("header, main, footer")
        );
        blockedNodes.forEach((el) => {
            el.setAttribute("aria-hidden", "true");
            el.setAttribute("inert", "");
        });

        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPaddingRight;
            blockedNodes.forEach((el) => {
                el.removeAttribute("aria-hidden");
                el.removeAttribute("inert");
            });
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (
            dialogRef.current &&
            !dialogRef.current.contains(e.target as Node)
        ) {
            handleClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className={css.backdrop} onClick={handleBackdropClick}>
            <div
                ref={dialogRef}
                className={css.modal}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;