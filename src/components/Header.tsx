import type { NextPage } from "next";
import Image from 'next/image';
import Link from 'next/link';
import ChatButton from '../../public/chat-button.svg';
import CreateButton from '../../public/create-room.svg';
import MenuHamburger from '../../public/menu-hamburger.svg';

export const Header: NextPage = () => {
    return (
        <header id="nav">
            <div className="nav--list">
                <button id="members__button">
                    <MenuHamburger />
                </button>
                <Link href="/">
                    <a>
                        <h3 id="logo">
                            <Image src="/logo.png" alt="Site Logo" width={42} height={42} />
                            <span>Mumble</span>
                        </h3>
                    </a>
                </Link>
            </div>
            <div id="nav__links">
                <button id="chat__button">
                    <ChatButton />
                </button>
                <Link href="/">
                    <a className="nav__link" id="create__room__btn">
                        Create Room
                        <CreateButton />
                    </a>
                </Link>
            </div>
        </header>
    );
};

