import React from 'react';

function AboutMe() {
    return (
        <section className="about-me">
            <h2>About Me</h2>
            <p>
                Я начинающий Frontend-разработчик. Изучаю JavaScript, React, асинхронность и современные веб-технологии.
            </p>
            <h3>Мои навыки:</h3>
            <ul>
                <li>JavaScript (ES6+, Async/Await, Closures)</li>
                <li>React (JSX, Components, State)</li>
                <li>HTML5 & CSS3</li>
                <li>Git & GitHub</li>
            </ul>
        </section>
    );
}

export default AboutMe;