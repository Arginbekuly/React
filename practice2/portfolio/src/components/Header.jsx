import React from 'react';

function Header() {
    return (
        <header className="header">
            <img
                src="/img.jpg"
                alt="Avatar"
                className="avatar"
            />
            <h1>Привет, я Kydyrali</h1>
            <p>Frontend / React Developer</p>
        </header>
    );
}

export default Header;