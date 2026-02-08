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

export default function Head() {
    return (
        <>
            <link rel="preconnect" href="https://api.emailjs.com"/>
            <link rel="dns-prefetch" href="https://api.emailjs.com"/>
            <link rel="me" href="https://github.com/5061756c2e56/"/>
            <link rel="me" href="https://www.linkedin.com/in/paul-viandier-648837397/"/>

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
