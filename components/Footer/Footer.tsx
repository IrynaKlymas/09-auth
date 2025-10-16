import css from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <p>
                    © {new Date().getFullYear()} NoteHub. All rights reserved.
                </p>
                <div className={css.wrap}>
                    <p>Developer: Klimas Iryna</p>
                    <p>
                        Contact us:{" "}
                        <a href="mailto:klimasir@gmail.com">
                            klimasir@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;