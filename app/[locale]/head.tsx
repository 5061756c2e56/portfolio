/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import { isChristmasMode } from '@/lib/christmas';

export default function Head() {
    return (
        <>
            <link rel="preconnect" href="https://api.emailjs.com"/>
            <link rel="dns-prefetch" href="https://api.emailjs.com"/>
            <link rel="me" href="https://github.com/5061756c2e56/"/>
            <link rel="me" href="https://www.linkedin.com/in/paul-viandier-648837397/"/>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              try {
                var d = document.documentElement;
                var s = d.style;
                s.backgroundColor = '#fafafa';
                s.colorScheme = 'light';
                var storedTheme = localStorage.getItem('theme');
                var theme = storedTheme || 'light';
                var effectiveTheme = theme;

                if (theme === 'system') {
                  effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }

                d.classList.add(effectiveTheme);

                if (effectiveTheme === 'dark') {
                  s.backgroundColor = '#000000';
                  s.color = '#ededed';
                  s.colorScheme = 'dark';
                } else {
                  s.backgroundColor = '#fafafa';
                  s.color = '#262626';
                  s.colorScheme = 'light';
                }

                window.__CHRISTMAS_MODE__ = ${isChristmasMode() ? 'true' : 'false'};
                window.__THEME_READY__ = true;
              } catch (e) {
                document.documentElement.classList.add('light');
                document.documentElement.style.backgroundColor = '#fafafa';
                document.documentElement.style.color = '#262626';
                window.__CHRISTMAS_MODE__ = false;
              }
            })();
          `
                }}
            />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
            html {
              background-color: #fafafa;
              color-scheme: light;
            }
            html:not(.dark):not(.light) {
              background-color: #fafafa !important;
              color: #262626 !important;
            }
            html:not(.dark):not(.light) body {
              background-color: #fafafa !important;
              color: #262626 !important;
              opacity: 0;
            }
            html.dark, html.dark body {
              background-color: #000000 !important;
              color: #ededed !important;
            }
            html.light, html.light body {
              background-color: #fafafa !important;
              color: #262626 !important;
            }
            body {
              transition: opacity 0.15s ease-out;
            }
            html.dark body, html.light body {
              opacity: 1;
            }
          `
                }}
            />
        </>
    );
}
